<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class UserController extends Controller
{
    /**
     * Récupère la liste des utilisateurs
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $users = User::all();
        
        return response()->json([
            'status' => 'success',
            'data' => $users
        ]);
    }

    /**
     * Récupère les informations de l'utilisateur connecté
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function getCurrentUser(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->load('preferences');
        
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Met à jour le profil de l'utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updateProfile(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'surname' => 'required|string|max:255',
            'email' => ['required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:255',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048'
        ]);

        if ($request->hasFile('photo')) {
            // Supprimer l'ancienne photo si elle existe
            if ($user->photo) {
                Storage::delete('public/' . $user->photo);
            }
            
            // Sauvegarder la nouvelle photo
            $path = $request->file('photo')->store('profile-photos', 'public');
            $validated['photo'] = $path;
        }

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Profil mis à jour avec succès',
            'data' => $user
        ]);
    }

    /**
     * Met à jour le mot de passe de l'utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePassword(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'new_password' => 'required|string|min:8|confirmed',
            'new_password_confirmation' => 'required|string'
        ]);

        $user = $request->user();

        if (!Hash::check($validated['current_password'], $user->password)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Le mot de passe actuel est incorrect'
            ], 422);
        }

        $user->update([
            'password' => Hash::make($validated['new_password'])
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Mot de passe mis à jour avec succès'
        ]);
    }

    /**
     * Met à jour les préférences de l'utilisateur
     *
     * @param Request $request
     * @return JsonResponse
     */
    public function updatePreferences(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'email_notifications' => 'boolean',
            'sms_notifications' => 'boolean',
            'language' => 'string|in:fr,en',
            'theme' => 'string|in:light,dark'
        ]);

        $user = $request->user();
        $user->preferences()->updateOrCreate(
            ['user_id' => $user->id],
            $validated
        );

        return response()->json([
            'status' => 'success',
            'message' => 'Préférences mises à jour avec succès',
            'data' => $user->preferences
        ]);
    }

    /**
     * Récupère les informations d'un utilisateur spécifique
     *
     * @param User $user
     * @return JsonResponse
     */
    public function show(User $user): JsonResponse
    {
        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Met à jour les informations d'un utilisateur
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function update(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'sometimes|required|string|max:255',
            'surname' => 'sometimes|required|string|max:255',
            'email' => ['sometimes', 'required', 'email', Rule::unique('users')->ignore($user->id)],
            'phone' => 'sometimes|nullable|string|max:20',
            'role' => ['sometimes', 'required', Rule::in(['admin', 'medecin', 'infirmier', 'secretaire', 'stagiaire', 'patient'])],
            'status' => ['sometimes', 'required', Rule::in(['active', 'inactive', 'pending'])],
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Met à jour le statut d'un utilisateur
     *
     * @param Request $request
     * @param User $user
     * @return JsonResponse
     */
    public function updateStatus(Request $request, User $user): JsonResponse
    {
        $validated = $request->validate([
            'status' => ['required', Rule::in(['active', 'inactive', 'pending', 'on_leave'])]
        ]);

        $user->update($validated);

        return response()->json([
            'status' => 'success',
            'data' => $user
        ]);
    }

    /**
     * Supprime un utilisateur
     *
     * @param User $user
     * @return JsonResponse
     */
    public function destroy(User $user): JsonResponse
    {
        $user->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Utilisateur supprimé avec succès'
        ]);
    }
} 