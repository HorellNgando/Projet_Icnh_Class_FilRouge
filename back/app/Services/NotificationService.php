<?php

namespace App\Services;

use App\Models\Notification;
use App\Models\User;
use Carbon\Carbon;

class NotificationService
{
    public function createLeaveRequestNotification(User $user, $type, $data = [])
    {
        $notifications = [];

        switch ($type) {
            case 'request_submitted':
                // Notification pour l'admin
                $admin = User::where('role', 'admin')->first();
                if ($admin) {
                    $notifications[] = Notification::create([
                        'staff_id' => $admin->id,
                        'title' => 'Nouvelle demande de congé',
                        'message' => "{$user->name} {$user->surname} a soumis une demande de congé",
                        'type' => 'leave_request',
                        'data' => $data
                    ]);
                }
                break;

            case 'request_approved':
                // Notification pour l'employé
                $notifications[] = Notification::create([
                    'staff_id' => $user->id,
                    'title' => 'Demande de congé approuvée',
                    'message' => "Votre demande de congé du " . Carbon::parse($data['start_date'])->format('d/m/Y') . 
                                " au " . Carbon::parse($data['end_date'])->format('d/m/Y') . " a été approuvée",
                    'type' => 'leave_request',
                    'data' => $data
                ]);
                break;

            case 'request_rejected':
                // Notification pour l'employé
                $notifications[] = Notification::create([
                    'staff_id' => $user->id,
                    'title' => 'Demande de congé rejetée',
                    'message' => "Votre demande de congé a été rejetée. Motif : " . $data['rejection_reason'],
                    'type' => 'leave_request',
                    'data' => $data
                ]);
                break;

            case 'leave_starting':
                // Notification pour l'employé
                $notifications[] = Notification::create([
                    'staff_id' => $user->id,
                    'title' => 'Début de congé',
                    'message' => "Votre congé commence aujourd'hui et se termine le " . Carbon::parse($data['end_date'])->format('d/m/Y'),
                    'type' => 'leave_request',
                    'data' => $data
                ]);
                break;

            case 'leave_ending':
                // Notification pour l'employé
                $notifications[] = Notification::create([
                    'staff_id' => $user->id,
                    'title' => 'Fin de congé',
                    'message' => "Votre congé se termine aujourd'hui. Bienvenue de retour !",
                    'type' => 'leave_request',
                    'data' => $data
                ]);
                break;
        }

        return $notifications;
    }
} 