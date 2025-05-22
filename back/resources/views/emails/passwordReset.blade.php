<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Réinitialisation de mot de passe</title>
</head>
<body>
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #2563eb;">Réinitialisation de votre mot de passe</h2>
        
        <p>Bonjour,</p>
        
        <p>Vous avez demandé à réinitialiser votre mot de passe. Voici votre code de vérification :</p>
        
        <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0;">
            <strong style="font-size: 24px; letter-spacing: 5px;">{{ $code }}</strong>
        </div>
        
        <p style="color: #6b7280; font-size: 14px;">Ce code est valable pendant 15 minutes.</p>
        
        <p>Si vous n'avez pas demandé cette réinitialisation, veuillez ignorer cet email.</p>
        
        <p style="margin-top: 30px;">
            Cordialement,<br>
            <strong>{{ config('app.name') }}</strong>
        </p>
    </div>
</body>
</html>