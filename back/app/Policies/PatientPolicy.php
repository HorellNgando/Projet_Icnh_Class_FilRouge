<?php
namespace App\Policies;

use App\Models\Patient;
use App\Models\User;
use Illuminate\Auth\Access\HandlesAuthorization;

class PatientPolicy
{
    use HandlesAuthorization;

    public function viewAny(User $user)
    {
        return in_array($user->role, ['admin', 'medecin', 'infirmier', 'stagiaire', 'secretaire', 'patient']);
    }

    public function view(User $user, Patient $patient)
    {
        if ($user->role === 'admin' || $user->role === 'secretaire') {
            return true;
        }
        if ($user->role === 'medecin' || $user->role === 'infirmier') {
            return $patient->doctor_id === $user->identifier;
        }
        if ($user->role === 'stagiaire') {
            return true; // Lecture seule
        }
        if ($user->role === 'patient') {
            return $patient->email === $user->email;
        }
        return false;
    }

    public function create(User $user)
    {
        return in_array($user->role, ['admin', 'secretaire', 'infirmier']);
    }

    public function update(User $user, Patient $patient)
    {
        if ($user->role === 'admin' || $user->role === 'secretaire') {
            return true;
        }
        if ($user->role === 'medecin' || $user->role === 'infirmier') {
            return $patient->doctor_id === $user->identifier;
        }
        return false;
    }

    public function delete(User $user, Patient $patient)
    {
        return $user->role === 'admin';
    }
}