<?php
namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Carbon\Carbon;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Password;
use Illuminate\Support\Str;
use Illuminate\Auth\Events\PasswordReset;
use App\Models\Invitation;
use Illuminate\Support\Facades\Mail;
use App\Mail\PasswordResetMail;
use Illuminate\Support\Facades\DB;



class AuthController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'password' => 'required|string|confirmed|min:8',
        ]);

        $identifier = 'P-' . str_pad(User::where('role', 'patient')->count() + 1, 3, '0', STR_PAD_LEFT);
        $user = User::create([
            'identifier' => $identifier,
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => 'patient',
            'status' => 'active',
        ]);

        $token = $user->createToken('auth_token')->plainTextToken;
        return response()->json(['user' => $user, 'token' => $token], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|string',
            'remember_me' => 'boolean',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            return response()->json(['message' => 'Identifiants invalides'], 401);
        }

        $user = Auth::user();
        if ($user->status === 'fired') {
            return response()->json(['message' => 'Votre compte a été désactivé.'], 403);
        }

        if ($user->status === 'on_leave') {
            $leave = $user->leaveRequests()->where('start_date', '<=', now())->where('end_date', '>=', now())->first();
            if ($leave) {
                return response()->json(['message' => 'Vous êtes en congé jusqu\'au ' . $leave->end_date], 403);
            }
            $user->update(['status' => 'active']);
        }

        $user->update(['last_login' => now(), 'remember_me' => $request->remember_me ?? false]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token]);
    }

    public function loginStaff(Request $request)
    {
        return $this->login($request); // Même logique, mais page différente
    }

    // public function forgotPassword(Request $request)
    // {
    //     $request->validate(['email' => 'required|email']);
    //     // TODO : Implémenter l'envoi d'un email de réinitialisation
    //     return response()->json(['message' => 'Email de réinitialisation envoyé']);
    // }


    // Forgot Password
    public function forgotPassword(Request $request)
    {
        $request->validate(['email' => 'required|email']);

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Email non trouvé'], 404);
        }

        try {
        // Générer un token et un code de vérification
        $token = Str::random(60);
        $verificationCode = rand(100000, 999999);

        // Enregistrer dans la base de données
        DB::table('password_reset_tokens')->updateOrInsert(
            ['email' => $user->email],
            [
                'token' => $token,
                'code' => $verificationCode,
                'created_at' => Carbon::now()
            ]
        );

        // Envoyer l'email
        Mail::to($user->email)->send(new PasswordResetMail($verificationCode, $token, $user->email));

        return response()->json(['message' => 'Un code de vérification a été envoyé à votre email']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Erreur lors de l\'envoi de l\'email. Veuillez réessayer plus tard.'], 500);
        }
    }

    // Verify Code
    public function verifyCode(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'code' => 'required|numeric'
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('code', $request->code)
            ->first();

        if (!$record) {
            return response()->json(['error' => 'Code invalide'], 400);
        }

        // Vérifier si le code a expiré (15 minutes)
        if (Carbon::parse($record->created_at)->addMinutes(15)->isPast()) {
            return response()->json(['error' => 'Le code a expiré'], 400);
        }

        return response()->json([
            'message' => 'Code vérifié avec succès',
            'reset_token' => $record->token
        ]);
    }

    // Reset Password
    public function resetPassword(Request $request)
    {
        $request->validate([
            'token' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed|min:8',
        ]);

        $record = DB::table('password_reset_tokens')
            ->where('email', $request->email)
            ->where('token', $request->token)
            ->first();

        if (!$record) {
            return response()->json(['error' => 'Token invalide'], 400);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user) {
            return response()->json(['error' => 'Utilisateur non trouvé'], 404);
        }

        // Mettre à jour le mot de passe
        $user->password = Hash::make($request->password);
        $user->save();

        // Supprimer le token
        DB::table('password_reset_tokens')->where('email', $request->email)->delete();

        return response()->json(['message' => 'Mot de passe réinitialisé avec succès']);
    }
}