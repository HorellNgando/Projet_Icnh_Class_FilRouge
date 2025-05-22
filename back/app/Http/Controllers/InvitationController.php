<?php
namespace App\Http\Controllers;

use App\Models\Invitation;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Mailjet\LaravelMailjet\Facades\Mailjet;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Hash;

class InvitationController extends Controller
{
    public function sendInvitation(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'role' => 'required|in:admin,medecin,secretaire,infirmier,stagiaire',
        ]);

        $code = Str::random(6);
        $invitation = Invitation::create([
            'email' => $request->email,
            'role' => $request->role,
            'code' => $code,
            'expires_at' => now()->addHours(24),
        ]);

        Mail::to($invitation->email)->send(new \App\Mail\InvitationMail(
            [
                'email' => $invitation->email,
                'role' => $invitation->role,
                'code' => $invitation->code,
                'nom' => 'Monsieur/Madame',
                'verif_link' => getenv('FRONTEND_URL') . '/verify-invitation',
            ]
        ));


        // $mailjet = Mailjet::getClient();
        // $body = [
        //     'Messages' => [
        //         [
        //             'From' => ['Email' => 'ngandohorell1@gmail.com', 'Name' => 'Clinique de Bali'],
        //             'To' => [['Email' => $request->email]],
        //             'Subject' => 'Invitation à rejoindre l'hôpital',
        //             'TextPart' => "Bonjour, vous êtes invité à rejoindre l'hôpital en tant que {$request->role}. Utilisez ce code : {$code}. Cliquez ici pour vérifier : http://localhost:5173/verify-invitation",
        //             'HTMLPart' => "<p>Bonjour,</p><p>Vous êtes invité à rejoindre l'hôpital en tant que {$request->role}. Utilisez ce code : <strong>{$code}</strong>.</p><p><a href='http://localhost:5173/verify-invitation'>Vérifier</a></p>",
        //         ],
        //     ],
        // ];
        // $mailjet->post(\Mailjet\Resources::$Email, ['body' => $body]);

        return response()->json(['message' => 'Invitation envoyée']);
    }

    public function verifyInvitation(Request $request)
    {
        $request->validate(['code' => 'required|string']);
        $invitation = Invitation::where('code', $request->code)->where('expires_at', '>', now())->where('used', false)->first();

        if (!$invitation) {
            return response()->json(['message' => 'Code invalide ou expiré'], 400);
        }

        return response()->json(['email' => $invitation->email, 'role' => $invitation->role]);
    }

    public function registerStaff(Request $request)
    {
        $request->validate([
            'code' => 'required|string',
            'name' => 'required|string',
            'surname' => 'required|string',
            'email' => 'required|email|unique:users',
            'phone' => 'nullable|string',
            'password' => 'required|string|confirmed|min:8',
            'photo' => 'nullable|image|mimes:jpeg,png,jpg|max:2048',
        ]);

        $invitation = Invitation::where('code', $request->code)->where('expires_at', '>', now())->where('used', false)->first();
        if (!$invitation || $invitation->email !== $request->email) {
            return response()->json(['message' => 'Invitation invalide'], 400);
        }

        $prefix = ['admin' => 'A-', 'medecin' => 'M-', 'secretaire' => 'S-', 'infirmier' => 'I-', 'stagiaire' => 'ST-'];
        $identifier = $prefix[$invitation->role] . str_pad(User::where('role', $invitation->role)->count() + 1, 3, '0', STR_PAD_LEFT);

        $photoPath = null;
        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('photos', 'public');
        }

        $user = User::create([
            'identifier' => $identifier,
            'name' => $request->name,
            'surname' => $request->surname,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $invitation->role,
            'status' => 'active',
            'photo' => $photoPath,
        ]);

        $invitation->update(['used' => true]);
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json(['user' => $user, 'token' => $token], 201);
    }
}