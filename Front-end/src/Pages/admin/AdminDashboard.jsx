import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const [stats, setStats] = useState({});
    const [recentPatients, setRecentPatients] = useState([]);
    const [criticalStocks, setCriticalStocks] = useState([]);
    const [revenues, setRevenues] = useState({});
    const [logs, setLogs] = useState([]);
    const [adminInfo, setAdminInfo] = useState({});

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };

                const statsResponse = await axios.get('http://localhost:8000/api/admin/stats', { headers });
                setStats(statsResponse.data);

                const patientsResponse = await axios.get('http://localhost:8000/api/admin/recent-patients', { headers });
                setRecentPatients(patientsResponse.data);

                const stocksResponse = await axios.get('http://localhost:8000/api/admin/critical-stocks', { headers });
                setCriticalStocks(stocksResponse.data);

                const revenuesResponse = await axios.get('http://localhost:8000/api/admin/revenues', { headers });
                setRevenues(revenuesResponse.data);

                const logsResponse = await axios.get('http://localhost:8000/api/admin/logs', { headers });
                setLogs(logsResponse.data);

                const adminResponse = await axios.get('http://localhost:8000/api/user/profile', { headers });
                setAdminInfo(adminResponse.data);
            } catch (err) {
                console.error('Erreur lors du chargement des données', err);
            }
        };
        fetchData();
    }, []);

    const filteredPatients = recentPatients.filter(patient =>
        (patient.nom.toLowerCase().includes(search.toLowerCase()) ||
         patient.id.toLowerCase().includes(search.toLowerCase())) &&
        (doctorFilter === '' || patient.medecin === doctorFilter) &&
        (serviceFilter === '' || patient.service === serviceFilter)
    );
    
    return (
        <div className="flex">
            <Sidebar role="admin" />
            <div className="flex-1 ml-0 md:ml-64 p-4">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Tableau de bord</h1>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">ID: {adminInfo.id_utilisateur || 'N/A'}</span>
                        <span className="text-gray-600">{adminInfo.nom} {adminInfo.prenom}</span>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        </svg>
                    </div>
                </div>

                <div className="bg-blue-600 text-white p-4 rounded-lg mb-4">
                    <h2 className="text-xl font-semibold">Bienvenue, {adminInfo.nom} {adminInfo.prenom}</h2>
                    <p>Voici un aperçu de la situation actuelle de l’hôpital.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Patients</h3>
                        <p className="text-2xl font-bold">{stats.patients || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Consultations aujourd’hui</h3>
                        <p className="text-2xl font-bold">{stats.consultations || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Taux d’occupation</h3>
                        <p className="text-2xl font-bold">{stats.occupancy || 0}%</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Rendez-vous aujourd’hui</h3>
                        <p className="text-2xl font-bold">{stats.appointments || 0}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Total du personnel</h3>
                        <p className="text-2xl font-bold">{stats.staff || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Médecins</h3>
                        <p className="text-2xl font-bold">{stats.doctors || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Infirmiers</h3>
                        <p className="text-2xl font-bold">{stats.nurses || 0}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Techniciens</h3>
                        <p className="text-2xl font-bold">{stats.technicians || 0}</p>
                    </div>
                </div>

                <div className="grid grid-rows gap-4">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Patients récents</h3>
                        <table className="w-full">
                            <thead>
                                <tr className="bg-gray-100">
                                    <th className="p-2 text-left">PATIENT</th>
                                    <th className="p-2 text-left">ID</th>
                                    <th className="p-2 text-left">SERVICE</th>
                                    <th className="p-2 text-left">MÉDECIN</th>
                                    <th className="p-2 text-left">STATUT</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentPatients.map((patient, index) => (
                                    <tr key={index} className="border-b py-2">
                                        <td className="p-2 font-semibold">{patient.nom}</td>
                                        <td className="p-2">{patient.id}</td>
                                        <td className="p-2">{patient.service}</td>
                                        <td className="p-2">{patient.medecin}</td>
                                        <td className="p-2">
                                            <span
                                                className={`px-2 py-1 rounded ${
                                                    patient.statut === 'CRITIQUE'
                                                        ? 'bg-red-100 text-red-600'
                                                        : patient.statut === 'En observation'
                                                        ? 'bg-yellow-100 text-yellow-600'
                                                        : 'bg-green-100 text-green-600'
                                                }`}
                                            >
                                                {patient.statut}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className="text-center mt-5">
                            <Link to="/admin/patients" className="text-blue-600">Voir tout →</Link>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-lg font-semibold mb-2">Stocks critiques</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {criticalStocks.map((stock, index) => (
                                <div key={index} className="border-r  py-2">
                                    <p className="font-semibold">{stock.produit}</p>
                                    <p className="text-gray-600">{stock.categorie}</p>
                                    <p className="text-gray-600">Quantité: {stock.quantite}</p>
                                    <p className="text-gray-600">Seuil: {stock.seuil}</p>
                                </div>
                            ))}
                        </div>
                        <div className="text-center mt-5">
                            <a href="#" className="text-blue-600">Voir tout →</a>
                        </div>
                    </div>

                

                {/* Capacité des lits */}
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="text-lg font-semibold mb-2">Capacité des lits par service</h3>
                    <div className="space-y-2">
                        <div>
                            <p>Cardiologie (140/420)</p>
                            <div className="bg-gray-200 h-4 rounded">
                                <div className="bg-blue-600 h-4 rounded" style={{ width: '33%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p>Chirurgie (184/200)</p>
                            <div className="bg-gray-200 h-4 rounded">
                                <div className="bg-red-600 h-4 rounded" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p>Pédiatrie (115/125)</p>
                            <div className="bg-gray-200 h-4 rounded">
                                <div className="bg-green-600 h-4 rounded" style={{ width: '92%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p>Soins intensifs (81/90)</p>
                            <div className="bg-gray-200 h-4 rounded">
                                <div className="bg-yellow-600 h-4 rounded" style={{ width: '90%' }}></div>
                            </div>
                        </div>
                        <div>
                            <p>Maternité (112/120)</p>
                            <div className="bg-gray-200 h-4 rounded">
                                <div className="bg-red-600 h-4 rounded" style={{ width: '93%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 text-center">
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Revenus mensuels</h3>
                        <p className="text-2xl font-bold">{revenues.monthly}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Paiements en attente</h3>
                        <p className="text-2xl font-bold">{revenues.pending}</p>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow">
                        <h3 className="text-sm text-gray-500">Dépenses</h3>
                        <p className="text-2xl font-bold">{revenues.expenses}</p>
                    </div>
                </div>
            </div>
                <div className="bg-white p-4 rounded-lg shadow mt-10">
                    <h3 className="text-lg font-semibold mb-2">Logs de connexion</h3>
                    <table className="w-full">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">Utilisateur</th>
                                <th className="p-2 text-left">Email</th>
                                <th className="p-2 text-left">Rôle</th>
                                <th className="p-2 text-left">Connexion</th>
                                <th className="p-2 text-left">Déconnexion</th>
                                <th className="p-2 text-left">Durée</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logs.map((log, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{log.nom}</td>
                                    <td className="p-2">{log.email}</td>
                                    <td className="p-2">{log.role}</td>
                                    <td className="p-2">{log.connexion_at}</td>
                                    <td className="p-2">{log.deconnexion_at || 'N/A'}</td>
                                    <td className="p-2">{log.duree || 'N/A'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;