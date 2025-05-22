<?php

namespace App\Http\Controllers;

use App\Models\LeaveRequest;
use App\Models\User;
use App\Services\NotificationService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use App\Models\Notification;

class LeaveRequestController extends Controller
{
    protected $notificationService;

    public function __construct(NotificationService $notificationService)
    {
        $this->notificationService = $notificationService;
    }

    public function index()
    {
        $leaveRequests = LeaveRequest::with(['staff'])->get();
        return response()->json($leaveRequests);
    }

    public function myLeaves(Request $request)
    {
        $leaveRequests = LeaveRequest::where('staff_id', $request->user()->id)
            ->with(['staff'])
            ->orderBy('created_at', 'desc')
            ->get();
        return response()->json($leaveRequests);
    }

    public function store(Request $request)
    {
        try {
            // Formater les dates en Y-m-d
            $startDate = Carbon::parse($request->start_date)->format('Y-m-d');
            $endDate = Carbon::parse($request->end_date)->format('Y-m-d');

            $validator = Validator::make([
                'staff_id' => $request->staff_id,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $request->type,
                'reason' => $request->reason,
                'status' => $request->status,
                'notes' => $request->notes,
            ], [
                'staff_id' => 'required|exists:users,id',
                'start_date' => 'required|date|after_or_equal:today',
                'end_date' => 'required|date|after_or_equal:start_date',
                'type' => 'required|in:annual,sick,emergency,other',
                'reason' => 'required|string',
                'status' => 'required|in:pending,approved,rejected',
                'notes' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            // Vérifier si l'utilisateur existe
            $user = User::find($request->staff_id);
            if (!$user) {
                throw new \Exception('Utilisateur non trouvé');
            }

            // Créer la demande de congé
            $leaveRequest = new LeaveRequest();
            $leaveRequest->staff_id = $request->staff_id;
            $leaveRequest->start_date = $startDate;
            $leaveRequest->end_date = $endDate;
            $leaveRequest->type = $request->type;
            $leaveRequest->reason = $request->reason;
            $leaveRequest->status = $request->status;
            $leaveRequest->notes = $request->notes;
            $leaveRequest->save();

            // Créer la notification
            $admin = User::where('role', 'admin')->first();
            if ($admin) {
                Notification::create([
                    'staff_id' => $admin->id,
                    'title' => 'Nouvelle demande de congé',
                    'message' => "{$user->name} {$user->surname} a soumis une demande de congé",
                    'type' => 'leave_request',
                    'data' => [
                        'leave_request_id' => $leaveRequest->id,
                        'start_date' => $leaveRequest->start_date,
                        'end_date' => $leaveRequest->end_date
                    ]
                ]);
            }

            return response()->json($leaveRequest, 201);
        } catch (\Exception $e) {
            \Log::error('Erreur lors de la création de la demande de congé: ' . $e->getMessage());
            \Log::error($e->getTraceAsString());
            
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de la création de la demande de congé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show(LeaveRequest $leaveRequest)
    {
        return response()->json($leaveRequest->load('staff'));
    }

    public function update(Request $request, LeaveRequest $leaveRequest)
    {
        $validator = Validator::make($request->all(), [
            'staff_id' => 'exists:users,id',
            'start_date' => 'date',
            'end_date' => 'date|after_or_equal:start_date',
            'type' => 'in:annual,sick,emergency,other',
            'reason' => 'string',
            'status' => 'in:pending,approved,rejected',
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leaveRequest->update($request->all());
        return response()->json($leaveRequest);
    }

    public function destroy(LeaveRequest $leaveRequest)
    {
        $leaveRequest->delete();
        return response()->json(null, 204);
    }

    public function approve(Request $request, LeaveRequest $leaveRequest)
    {
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette demande de congé a déjà été traitée'
            ], 400);
        }

        try {
            // Mettre à jour la demande de congé
            $leaveRequest->update([
                'status' => 'approved',
                'approved_by' => $request->user()->id,
                'approved_at' => now()
            ]);

            // Mettre à jour le statut de l'utilisateur
            $user = $leaveRequest->staff;
            $now = now();
            $startDate = Carbon::parse($leaveRequest->start_date);
            $endDate = Carbon::parse($leaveRequest->end_date);

            // Si la date de début est dans le futur, on garde le statut actif
            // mais on enregistre les dates de congé
            if ($now->lessThan($startDate)) {
                $user->update([
                    'leave_start_date' => $startDate,
                    'leave_end_date' => $endDate
                ]);
            } else {
                // Si la date de début est passée, on met le statut en congé
                $user->update([
                    'status' => 'on_leave',
                    'leave_start_date' => $startDate,
                    'leave_end_date' => $endDate
                ]);
            }

            // Créer une notification pour l'approbation
            $this->notificationService->createLeaveRequestNotification($user, 'request_approved', [
                'leave_request_id' => $leaveRequest->id,
                'start_date' => $leaveRequest->start_date,
                'end_date' => $leaveRequest->end_date
            ]);

            return response()->json([
                'status' => 'success',
                'message' => 'Demande de congé approuvée avec succès',
                'data' => $leaveRequest->load('staff')
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'status' => 'error',
                'message' => 'Erreur lors de l\'approbation de la demande de congé',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function reject(Request $request, LeaveRequest $leaveRequest)
    {
        if ($leaveRequest->status !== 'pending') {
            return response()->json([
                'status' => 'error',
                'message' => 'Cette demande de congé a déjà été traitée'
            ], 400);
        }

        $leaveRequest->update([
            'status' => 'rejected',
            'rejected_by' => $request->user()->id,
            'rejected_at' => now(),
            'rejection_reason' => $request->rejection_reason
        ]);

        // Créer une notification pour le rejet
        $this->notificationService->createLeaveRequestNotification($leaveRequest->staff, 'request_rejected', [
            'leave_request_id' => $leaveRequest->id,
            'rejection_reason' => $request->rejection_reason
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Demande de congé rejetée',
            'data' => $leaveRequest
        ]);
    }

    // Ajouter une méthode pour vérifier et mettre à jour les statuts des congés
    public function checkAndUpdateLeaveStatus()
    {
        $now = now();
        
        // Trouver tous les utilisateurs en congé
        $usersOnLeave = User::where('status', 'on_leave')
            ->where('leave_end_date', '<', $now)
            ->get();

        foreach ($usersOnLeave as $user) {
            $user->update([
                'status' => 'active',
                'leave_start_date' => null,
                'leave_end_date' => null
            ]);

            // Créer une notification pour la fin du congé
            $this->notificationService->createLeaveRequestNotification($user, 'leave_ending', [
                'staff_id' => $user->id
            ]);
        }

        // Vérifier les congés qui commencent aujourd'hui
        $usersStartingLeave = User::where('status', 'active')
            ->where('leave_start_date', '<=', $now)
            ->where('leave_end_date', '>=', $now)
            ->get();

        foreach ($usersStartingLeave as $user) {
            $user->update(['status' => 'on_leave']);

            // Créer une notification pour le début du congé
            $this->notificationService->createLeaveRequestNotification($user, 'leave_starting', [
                'staff_id' => $user->id,
                'end_date' => $user->leave_end_date
            ]);
        }

        return response()->json([
            'status' => 'success',
            'message' => 'Statuts des congés mis à jour',
            'updated_users' => $usersOnLeave->count() + $usersStartingLeave->count()
        ]);
    }
} 