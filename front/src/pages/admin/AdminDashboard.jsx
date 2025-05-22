import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Dashboard from '../../components/Dashboard';
import PatientList from '../../components/PatientList';
import { FaArrowUp, FaArrowDown, FaUserMd, FaUserNurse, FaUserCog, FaUser, FaBed, FaHeartbeat, FaCapsules, FaEuroSign, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
    const [invitationData, setInvitationData] = useState({ email: '', role: 'medecin' });
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    // Définir l'état pour l'utilisateur et l'erreur
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');

    // Mock data (à remplacer par des appels API réels si modules prêts)
    const [stats, setStats] = useState({
        patients: 124,
        consultations: 87,
        tauxOccupation: 78,
        rendezVous: 42,
        medecins: 28,
        medecinsTotal: 35,
        infirmiers: 45,
        infirmiersTotal: 52,
        techniciens: 12,
        techniciensTotal: 15,
        admin: 18,
        adminTotal: 20,
    });
    const [patients, setPatients] = useState([
        { name: 'Marie Dupont', age: 45, id: 'P-12345', date: '12 mars 2025', service: 'Cardiologie', medecin: 'Dr. Claire Moreau', statut: 'Stable' },
        { name: 'Thomas Martin', age: 62, id: 'P-12346', date: '11 mars 2025', service: 'Chirurgie', medecin: 'Dr. Michel Lambert', statut: 'En observation' },
        { name: 'Sophie Leroy', age: 35, id: 'P-12347', date: '10 mars 2025', service: 'Maternité', medecin: 'Dr. Émilie Bernard', statut: 'Critique' },
        { name: 'Paul Petit', age: 51, id: 'P-12348', date: '9 mars 2025', service: 'Pédiatrie', medecin: 'Dr. Jean Morel', statut: 'Stable' },
    ]);
    const [alertes, setAlertes] = useState([
        { type: 'danger', message: 'Patient critique en soins intensifs (Chambre 305) - Besoin d assistance' },
        { type: 'danger', message: 'Stock critique d antibiotiques (Amoxicilline) - Moins de 10 unités' },
        { type: 'warning', message: 'Service de cardiologie proche de la saturation (92% d occupation)' },
    ]);
    const [lits, setLits] = useState([
        { service: 'Cardiologie', occupe: 32, total: 40, color: 'bg-blue-500' },
        { service: 'Chirurgie', occupe: 18, total: 20, color: 'bg-red-500' },
        { service: 'Pédiatrie', occupe: 15, total: 25, color: 'bg-green-500' },
        { service: 'Soins intensifs', occupe: 9, total: 10, color: 'bg-red-500' },
        { service: 'Maternité', occupe: 12, total: 20, color: 'bg-green-500' },
    ]);
    const [stocks, setStocks] = useState([
        { produit: 'Amoxicilline 500mg', categorie: 'Antibiotiques', stock: 8, seuil: 10, statut: 'Critique' },
        { produit: 'Seringues 10ml', categorie: 'Matériel médical', stock: 29, seuil: 50, statut: 'Critique' },
        { produit: 'Paracétamol 1g', categorie: 'Analgésiques', stock: 15, seuil: 20, statut: 'Faible' },
    ]);
    const [finances, setFinances] = useState({
        revenus: 245680,
        revenusVar: 6,
        factures: 32450,
        facturesVar: 12,
        depenses: 187320,
        depensesVar: -5,
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUser({
                    id: response.data.id,
                    name: response.data.name,
                    surname: response.data.surname,
                    identifier: response.data.identifier,
                    role: response.data.role,
                    last_login: response.data.last_login,
                    photo: response.data.photo,
                });
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_id', response.data.id);
            } catch (error) {
                setError('Erreur lors de la récupération des informations utilisateur');
                navigate('/login-staff');
            }
        };
        fetchUser();
    }, [navigate]);

    const handleInvitationSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/invite', invitationData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setMessage('Invitation envoyée avec succès !');
        } catch (error) {
            setMessage(error.response?.data?.message || 'Erreur lors de l\'envoi de l\'invitation');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login-staff');
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-10 min-h-screen">
            <Dashboard user={user}>
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        {error}
                    </div>
                )}
            </Dashboard>
            {/* Alertes urgentes */}
            <div className="bg-red-50 border-l-8 border-red-400 text-red-700 p-6 rounded-2xl mb-8 shadow-md flex flex-col gap-2 animate-fade-in">
                <div className="font-semibold text-lg mb-1 flex items-center gap-2">
                    <FaExclamationTriangle className="text-red-400 animate-pulse" />
                    Alertes urgentes ({alertes.length})
                </div>
                <ul className="list-disc pl-8 space-y-1">
                    {alertes.map((a, i) => (
                        <li key={i} className={a.type === 'danger' ? 'text-red-700' : 'text-orange-600 font-medium'}>{a.message}</li>
                    ))}
                </ul>
            </div>

            {/* Statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
                    <FaUser className="text-blue-400 text-3xl mb-2" />
                    <div className="text-4xl font-bold text-gray-800 tracking-wide">{stats.patients}</div>
                    <div className="text-gray-500 font-semibold mt-1">PATIENTS HOSPITALISÉS</div>
                    <div className="text-green-500 flex items-center mt-2 text-sm font-medium"><FaArrowUp className="mr-1" />+5% depuis hier</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
                    <FaHeartbeat className="text-green-400 text-3xl mb-2" />
                    <div className="text-4xl font-bold text-gray-800 tracking-wide">{stats.consultations}</div>
                    <div className="text-gray-500 font-semibold mt-1">CONSULTATIONS AUJOURD'HUI</div>
                    <div className="text-blue-500 flex items-center mt-2 text-sm font-medium"><FaArrowDown className="mr-1" />-12% cette semaine</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
                    <FaBed className="text-purple-400 text-3xl mb-2" />
                    <div className="text-4xl font-bold text-gray-800 tracking-wide">{stats.tauxOccupation}%</div>
                    <div className="text-gray-500 font-semibold mt-1">TAUX D'OCCUPATION</div>
                    <div className="text-red-400 flex items-center mt-2 text-sm font-medium"><FaArrowDown className="mr-1" />-3% depuis hier</div>
                </div>
                <div className="bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center transition-transform duration-200 hover:scale-105 hover:shadow-2xl">
                    <FaUserMd className="text-pink-400 text-3xl mb-2" />
                    <div className="text-4xl font-bold text-gray-800 tracking-wide">{stats.rendezVous}</div>
                    <div className="text-gray-500 font-semibold mt-1">RENDEZ-VOUS PROGRAMMÉS</div>
                    <div className="text-gray-400 mt-2 text-sm">Pour aujourd'hui</div>
                </div>
            </div>

            {/* Personnel présent */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
                <div className="bg-blue-100 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaUserMd className="text-blue-400 text-2xl mb-2" />
                    <div className="text-3xl font-semibold text-blue-700">{stats.medecins}</div>
                    <div className="text-gray-500 font-medium">Médecins</div>
                    <div className="text-gray-400 text-xs">Sur {stats.medecinsTotal} au total</div>
                </div>
                <div className="bg-green-100 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaUserNurse className="text-green-400 text-2xl mb-2" />
                    <div className="text-3xl font-semibold text-green-700">{stats.infirmiers}</div>
                    <div className="text-gray-500 font-medium">Infirmiers</div>
                    <div className="text-gray-400 text-xs">Sur {stats.infirmiersTotal} au total</div>
                </div>
                <div className="bg-purple-100 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaUserCog className="text-purple-400 text-2xl mb-2" />
                    <div className="text-3xl font-semibold text-purple-700">{stats.techniciens}</div>
                    <div className="text-gray-500 font-medium">Techniciens</div>
                    <div className="text-gray-400 text-xs">Sur {stats.techniciensTotal} au total</div>
                </div>
                <div className="bg-pink-100 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaUser className="text-pink-400 text-2xl mb-2" />
                    <div className="text-3xl font-semibold text-pink-700">{stats.admin}</div>
                    <div className="text-gray-500 font-medium">Administratifs</div>
                    <div className="text-gray-400 text-xs">Sur {stats.adminTotal} au total</div>
                </div>
            </div>

            {/* Patients récemment admis */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transition-shadow duration-200 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-semibold tracking-wide">Patients récemment admis</div>
                    <button className="text-blue-500 hover:underline text-sm font-medium transition-colors">Voir tout</button>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">PATIENT</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">ID</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">DATE D'ADMISSION</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">SERVICE</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">MÉDECIN</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STATUT</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {patients.map((p, i) => (
                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-2 whitespace-nowrap font-medium">{p.name} <span className="text-xs text-gray-400">{p.age} ans</span></td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.id}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.service}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{p.medecin}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {p.statut === 'Stable' && <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">Stable</span>}
                                    {p.statut === 'En observation' && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">En observation</span>}
                                    {p.statut === 'Critique' && <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Critique</span>}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <button className="text-blue-500 hover:underline text-xs mr-2 font-medium transition-colors">Voir</button>
                                    <button className="text-gray-500 hover:underline text-xs font-medium transition-colors">Modifier</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Capacité des lits par service */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transition-shadow duration-200 hover:shadow-2xl">
                <div className="text-lg font-semibold mb-6 tracking-wide">Capacité des lits par service</div>
                {lits.map((l, i) => {
                    const percent = Math.round((l.occupe / l.total) * 100);
                    return (
                        <div key={i} className="mb-4">
                            <div className="flex justify-between text-sm mb-1">
                                <span className="font-medium">{l.service} ({l.occupe}/{l.total})</span>
                                <span className="font-semibold text-gray-500">{percent}%</span>
                            </div>
                            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden">
                                <div className={`h-4 rounded-full ${l.color} transition-all duration-500`} style={{ width: `${percent}%` }}></div>
                            </div>
                        </div>
                    );
                })}
                <div className="text-right mt-4">
                    <button className="text-blue-500 hover:underline text-sm font-medium transition-colors">Gérer la capacité des lits &rarr;</button>
                </div>
            </div>

            {/* État des stocks critiques */}
            <div className="bg-white rounded-2xl shadow-lg p-8 mb-10 transition-shadow duration-200 hover:shadow-2xl">
                <div className="flex justify-between items-center mb-6">
                    <div className="text-lg font-semibold tracking-wide">État des stocks critiques</div>
                    <button className="text-blue-500 hover:underline text-sm font-medium transition-colors">Voir tout</button>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">PRODUIT</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">CATÉGORIE</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STOCK ACTUEL</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">SEUIL</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STATUT</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {stocks.map((s, i) => (
                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-2 whitespace-nowrap font-medium">{s.produit}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{s.categorie}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{s.stock} boites</td>
                                <td className="px-4 py-2 whitespace-nowrap">{s.seuil} boites</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {s.statut === 'Critique' && <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs font-semibold">Critique</span>}
                                    {s.statut === 'Faible' && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold">Faible</span>}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <button className="text-blue-500 hover:underline text-xs font-medium transition-colors">Commander</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Résumé financier */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div className="bg-blue-50 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaEuroSign className="text-blue-400 text-2xl mb-2" />
                    <div className="text-2xl font-bold text-blue-700">{finances.revenus.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                    <div className="text-gray-500 font-medium">Revenus du mois</div>
                    <div className="text-green-500 flex items-center mt-2 text-sm font-medium">+{finances.revenusVar}% par rapport au mois dernier</div>
                </div>
                <div className="bg-yellow-50 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaEuroSign className="text-yellow-400 text-2xl mb-2" />
                    <div className="text-2xl font-bold text-yellow-700">{finances.factures.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                    <div className="text-gray-500 font-medium">Factures en attente</div>
                    <div className="text-red-500 flex items-center mt-2 text-sm font-medium">+{finances.facturesVar}% par rapport au mois dernier</div>
                        </div>
                <div className="bg-green-50 rounded-2xl p-8 flex flex-col items-center shadow transition-all duration-200 hover:shadow-lg">
                    <FaEuroSign className="text-green-400 text-2xl mb-2" />
                    <div className="text-2xl font-bold text-green-700">{finances.depenses.toLocaleString('fr-FR', { style: 'currency', currency: 'EUR' })}</div>
                    <div className="text-gray-500 font-medium">Dépenses du mois</div>
                    <div className="text-green-500 flex items-center mt-2 text-sm font-medium">{finances.depensesVar}% par rapport au mois dernier</div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;