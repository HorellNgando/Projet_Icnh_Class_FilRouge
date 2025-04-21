<?php

namespace App\Http\Controllers;

use App\Models\Utilisateur;
use App\Models\Patient;
use App\Models\ConnexionLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Carbon\Carbon;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validated = $request->validate([
            'nom' => 'required|string|max:255',
            'prenom' => 'required|string|max:255',
            'email' => 'required|email|unique:utilisateurs,email',
            'telephone' => 'required|string|max:20',
            'adresse' => 'required|string|max:100',
            'password' => 'required|string|min:6',
        ]);

        $user = Utilisateur::create([
            'id_utilisateur' => 'U' . str_pad(mt_rand(1, 999999), 6, '0', STR_PAD_LEFT),
            'nom' => $validated['nom'],
            'prenom' => $validated['prenom'],
            'email' => $validated['email'],
            'telephone' => $validated['telephone'],
            'adresse' => $validated['adresse'],
            'password' => Hash::make($validated['password']),
            'role' => 'patient',
            'status' => 'actif',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user], 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        $user = Utilisateur::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Identifiants incorrects ou non autorisés'], 401);
        }

        if ($user->status !== 'actif') {
            return response()->json(['message' => 'Votre compte a été licencié. Contactez l\'administrateur.'], 403);
        }

        $token = $user->createToken('auth_token')->plainTextToken;
        
        ConnexionLog::create([
            'id_utilisateur' => $user->id_utilisateur,
            'email' => $user->email,
            'role' => $user->role,
            'connexion_at' => Carbon::now(),
        ]);

        return response()->json(['token' => $token, 'user' => $user]);
    }

    public function adminLogin(Request $request)
    {
        return $this->login($request);
    }

    public function logout(Request $request)
    {
        $user = $request->user();

        $lastLog = ConnexionLog::where('id_utilisateur', $user->id_utilisateur)
            ->whereNull('deconnexion_at')
            ->orderBy('connexion_at', 'desc')
            ->first();

        if ($lastLog) {
            $lastLog->update([
                'deconnexion_at' => now(),
                'duree' => now()->diffInMinutes($lastLog->connexion_at) . ' minutes',
            ]);
        }

        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Déconnexion réussie']);
    }

    public function getProfile(Request $request)
    {
        return response()->json($request->user());
    }

    public function updateProfilePhoto(Request $request)
    {
        $request->validate([
            'photo' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $user = $request->user();
        if ($user->photo) {
            Storage::disk('public')->delete($user->photo);
        }

        $path = $request->file('photo')->store('photos', 'public');
        $user->update(['photo' => $path]);

        return response()->json(['message' => 'Photo de profil mise à jour', 'photo' => $path]);
    }
}