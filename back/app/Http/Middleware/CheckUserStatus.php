<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Carbon\Carbon;

class CheckUserStatus
{
    public function handle(Request $request, Closure $next)
    {
        if (Auth::check()) {
            $user = Auth::user();
            $now = Carbon::now();

            // Vérifier si l'utilisateur est en congé
            if ($user->status === 'on_leave') {
                // Si la date de fin de congé est dépassée, réactiver le compte
                if ($user->leave_end_date && $now->greaterThan($user->leave_end_date)) {
                    $user->update([
                        'status' => 'active',
                        'leave_start_date' => null,
                        'leave_end_date' => null
                    ]);
                } else {
                    // Si l'utilisateur est toujours en congé, bloquer l'accès
                    Auth::logout();
                    return response()->json([
                        'status' => 'error',
                        'message' => 'Votre compte est temporairement désactivé pendant votre congé.'
                    ], 403);
                }
            }

            // Vérifier si l'utilisateur est inactif
            if ($user->status === 'inactive') {
                Auth::logout();
                return response()->json([
                    'status' => 'error',
                    'message' => 'Votre compte est désactivé. Veuillez contacter l\'administrateur.'
                ], 403);
            }
        }

        return $next($request);
    }
} 