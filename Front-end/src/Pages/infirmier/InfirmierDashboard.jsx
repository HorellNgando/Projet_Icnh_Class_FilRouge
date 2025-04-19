import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const InfirmierDashboard = () => {
    const [infirmierInfo, setInfirmierInfo] = useState({});
    const [patients, setPatients] = useState([]);
    const [lastLogin, setLastLogin] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const infirmierResponse = await axios.get('http://localhost:8000/api/user/profile', { headers });
                setInfirmierInfo(infirmierResponse.data);

                const patientsResponse = await axios.get('http://localhost:8000/api/infirmier/patients', { headers });
                setPatients(patientsResponse.data);

                const lastLoginResponse = await axios.get('http://localhost:8000/api/infirmier/last-login', { headers });
                setLastLogin(lastLoginResponse.data.last_login);
            } catch (err) {
                console.error('Erreur lors du chargement des données', err);
            }
        };
        fetchData();
    }, []);

    const handleAddPatient = () => {
        navigate('/infirmier/patients/add');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role="infirmier" />
            <div className="flex-1 ml-0 md:ml-64 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tableau de bord - Infirmier</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600 text-sm">Dernière connexion: {lastLogin}</span>
                        <span className="text-gray-600">ID: {infirmierInfo.id_utilisateur || 'N/A'}</span>
                        <span>{infirmierInfo.nom} {infirmierInfo.prenom}</span>
                    </div>
                </div>

                <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <h2 className="text-xl font-semibold">Bienvenue, {infirmierInfo.nom} {infirmierInfo.prenom}</h2>
                    <p>Voici un aperçu de vos patients.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Nombre de patients</h3>
                        <p className="text-2xl font-bold">{patients.length}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Service</h3>
                        <p className="text-2xl font-bold">{infirmierInfo.service || 'N/A'}</p>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold">Mes patients</h3>
                        <button onClick={handleAddPatient} className="bg-blue-600 text-white px-4 py-2 rounded">
                           <a href="/infirmier/add-patient">Ajouter un patient</a>
                        </button>
                    </div>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nom</th>
                                <th className="p-2 text-left">Date d’admission</th>
                                <th className="p-2 text-left">Statut</th>
                                <th className="p-2 text-left">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{patient.id}</td>
                                    <td className="p-2">{patient.nom}</td>
                                    <td className="p-2">{patient.date_admission}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 rounded ${patient.statut === 'En cours' ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'}`}>
                                            {patient.statut}
                                        </span>
                                    </td>
                                    <td className="p-2">
                                        <Link to={`/patient/${patient.id}`} className="text-blue-600">Voir dossier</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InfirmierDashboard;