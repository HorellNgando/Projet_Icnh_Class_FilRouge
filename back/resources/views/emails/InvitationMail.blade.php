<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Invitation Email</title>
</head>
<body>
    Bonjour {{ $nom }}, <br/>
    Bienvenu sur la plateforme de gestion de notre hopital <br/>
    Vous avez été invité à rejoindre notre équipe en tant que <b>{{ $role }}</b>.<br/>
    Utilisez le code : <b>{{$code}}</b> à l'adresse suivante: <a href={{ $verif_link }}>{{$verif_link}}</a> pour vérifier votre compte.
</body>
</html>


{{-- Pour accepter l'invitation, veuillez cliquer sur le lien ci-dessous : --}}
{{-- <a href="{{ url('/acceptInvitation?token='.$token.'&email='.$email) }}">Accepter l'invitation</a> --}}