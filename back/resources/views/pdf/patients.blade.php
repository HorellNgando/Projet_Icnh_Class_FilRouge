<!DOCTYPE html>
<html>
<head>
    <title>Liste des Patients</title>
    <style>
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
    </style>
</head>
<body>
    <h1>Liste des Patients</h1>
    <table>
        <thead>
            <tr>
                <th>ID</th>
                <th>Nom</th>
                <th>Genre</th>
                <th>Chambre</th>
                <th>Statut</th>
            </tr>
        </thead>
        <tbody>
            @foreach ($patients as $patient)
                <tr>
                    <td>{{ $patient->identifier }}</td>
                    <td>{{ $patient->first_name }} {{ $patient->last_name }}</td>
                    <td>{{ $patient->gender }}</td>
                    <td>{{ $patient->room }}</td>
                    <td>{{ $patient->discharge_confirmed ? 'Sorti' : 'Actif' }}</td>
                </tr>
            @endforeach
        </tbody>
    </table>
</body>
</html>