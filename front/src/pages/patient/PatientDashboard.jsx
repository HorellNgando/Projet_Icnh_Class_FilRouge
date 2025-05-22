import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { FaArrowLeft, FaEye, FaFileDownload, FaUser, FaHeartbeat, FaHospital, FaFileInvoice, FaSignOutAlt, FaFileMedical, FaPrescriptionBottle, FaCalendarAlt, FaVial, FaEnvelope, FaPlus, FaCheckCircle, FaClock } from 'react-icons/fa';
import Sidebar from '../../components/Sidebar';

const PatientDashboard = () => {
    const [patientData, setPatientData] = useState(null);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [showDetails, setShowDetails] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [prescriptions, setPrescriptions] = useState([]);
    const navigate = useNavigate();

    // Récupérer les informations utilisateur
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
                    email: response.data.email,
                    identifier: response.data.identifier,
                    role: response.data.role,
                    last_login: response.data.last_login,
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

    // Restreindre l'accès au rôle patient
    useEffect(() => {
        if (user && user.role !== 'patient') {
            setError('Accès réservé aux patients');
            navigate('/dashboard/' + user.role);
        }
    }, [user, navigate]);

    // Récupérer le dossier médical du patient
    useEffect(() => {
        const fetchPatientData = async () => {
            if (!user) return;
            try {
                const response = await axios.get('http://localhost:8000/api/patients/me', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                const formattedData = {
                    ...response.data,
                    date_of_birth: response.data.date_of_birth ? response.data.date_of_birth.split('T')[0] : '',
                    admission_date: response.data.admission_date ? response.data.admission_date.replace(' ', 'T') : '',
                    discharge_date: response.data.discharge_date ? response.data.discharge_date.replace(' ', 'T') : '',
                    follow_up_date: response.data.follow_up_date ? response.data.follow_up_date.replace(' ', 'T') : '',
                };
                setPatientData(formattedData);
            } catch (error) {
                setError('Erreur lors de la récupération du dossier médical');
            }
            setLoading(false);
        };

        if (user) {
            fetchPatientData();
        }
    }, [user]);

    // Récupérer les prescriptions du patient
    useEffect(() => {
        const fetchPrescriptions = async () => {
            if (!user || !patientData) return;
            try {
                const response = await axios.get(`http://localhost:8000/api/prescriptions/patient/${patientData.id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setPrescriptions(response.data);
            } catch (error) {
                console.error('Erreur lors de la récupération des prescriptions:', error);
            }
        };

        if (user && patientData) {
            fetchPrescriptions();
        }
    }, [user, patientData]);

    // Fonction pour télécharger le PDF
    const handleDownloadPDF = async () => {
        setIsDownloading(true);
        try {
            const response = await axios.post(
                'http://localhost:8000/api/patients/me/pdf',
                {},
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    responseType: 'blob',
                }
            );
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'dossier-medical.pdf');
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            setError('Erreur lors du téléchargement du PDF');
        }
        setIsDownloading(false);
    };

    // Mock data
    const nextAppointment = {
        date: '15 mars 2025, 10:30',
        doctor: 'Dr. Claire Moreau',
        service: 'Cardiologie',
    };
    const recentResults = {
        label: 'Analyse sanguine',
        date: '10/03/2025',
    };
    const unreadMessages = {
        count: 3,
        from: 'Dr. Michel Lambert',
        time: '2h',
    };
    const healthData = { tension: '--', poids: '68' };
    const appointments = [
        { date: '15 mars 2025, 10:30', doctor: 'Dr. Claire Moreau', service: 'Cardiologie', status: 'Confirmé' },
        { date: '22 mars 2025, 14:00', doctor: 'Dr. Michel Lambert', service: 'Chirurgie', status: 'En attente' },
    ];
    const messages = [
        { from: 'Dr. Michel Lambert', time: 'il y a 2 heures', content: 'Bonjour Mme Martin, suite à votre dernière consultation, je vous confirme que vos résultats sont normaux. N hésitez pas à me contacter si vous avez des questions.' },
        { from: 'Secrétariat Médical', time: 'Hier, 14:30', content: 'Nous vous rappelons votre rendez-vous du 15 mars à 10h30 avec le Dr. Claire Moreau en cardiologie. Merci de vous présenter 15 minutes avant.' },
    ];
    const news = [
        { title: 'Prévention des maladies cardiaques', date: '10 mars 2025', content: 'Découvrez les dernières recommandations pour maintenir votre cœur en bonne santé.', link: '#' },
        { title: 'Alimentation équilibrée', date: '8 mars 2025', content: 'Comment adapter son alimentation pour prévenir les problèmes de santé.', link: '#' },
        { title: 'Importance du sommeil', date: '5 mars 2025', content: 'Les effets d\'un bon sommeil sur votre santé physique et mentale.', link: '#' }
    ];

    if (loading || !user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-blue-100 pb-10">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-400 rounded-b-3xl shadow-lg px-8 py-8 flex flex-col md:flex-row justify-between items-center mb-10 animate-fade-in">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">Bienvenue, {user.name}</h1>
                    <p className="text-white text-opacity-80">Nous espérons que vous allez bien aujourd'hui.</p>
                </div>
                <button className="mt-6 md:mt-0 flex items-center gap-2 bg-white text-blue-600 font-semibold px-6 py-3 rounded-full shadow hover:bg-blue-50 transition-all duration-200">
                    <FaPlus /> Nouveau rendez-vous
                </button>
            </div>

            {/* Cartes accès rapide */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10 px-4 md:px-0">
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start hover:shadow-2xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaCalendarAlt className="text-blue-400 text-2xl" />
                        <span className="font-semibold text-gray-700">Prochain rendez-vous</span>
                    </div>
                    <div className="text-gray-700 font-medium">{nextAppointment.date}</div>
                    <div className="text-gray-500 text-sm">{nextAppointment.doctor} · {nextAppointment.service}</div>
                    <a href="#" className="text-blue-500 text-sm mt-2 hover:underline">Voir tous les rendez-vous →</a>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start hover:shadow-2xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaVial className="text-green-400 text-2xl" />
                        <span className="font-semibold text-gray-700">Résultats récents</span>
                    </div>
                    <div className="text-gray-700 font-medium">{recentResults.label}</div>
                    <div className="text-gray-500 text-sm">Disponible depuis le {recentResults.date}</div>
                    <a href="#" className="text-green-500 text-sm mt-2 hover:underline">Consulter les résultats →</a>
                </div>
                <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col gap-2 items-start hover:shadow-2xl transition-all duration-200">
                    <div className="flex items-center gap-3 mb-2">
                        <FaEnvelope className="text-purple-400 text-2xl" />
                        <span className="font-semibold text-gray-700">Messages non lus</span>
                    </div>
                    <div className="text-gray-700 font-medium">{unreadMessages.count} nouveaux messages</div>
                    <div className="text-gray-500 text-sm">{unreadMessages.from} · {unreadMessages.time}</div>
                    <a href="#" className="text-purple-500 text-sm mt-2 hover:underline">Voir les messages →</a>
                </div>
            </div>

            {/* Suivi de santé */}
            <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0 flex flex-col md:flex-row gap-8 animate-fade-in">
                <div className="flex-1">
                    <div className="text-gray-500 font-semibold mb-2">Tension artérielle</div>
                    <div className="text-2xl font-bold text-gray-700">{healthData.tension} <span className="text-base font-normal text-gray-400">mmHg</span></div>
                </div>
                <div className="flex-1">
                    <div className="text-gray-500 font-semibold mb-2">Poids (kg)</div>
                    <div className="text-2xl font-bold text-gray-700">{healthData.poids} <span className="text-base font-normal text-gray-400">kg</span></div>
                </div>
            </div>

            {/* Prochains rendez-vous */}
            <div className="bg-white rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold tracking-wide">Prochains rendez-vous</div>
                    <a href="#" className="text-blue-500 hover:underline text-sm font-medium transition-colors">Voir tout</a>
                </div>
                <table className="min-w-full divide-y divide-gray-100">
                    <thead>
                        <tr>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">DATE</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">MÉDECIN</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">SERVICE</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">STATUT</th>
                            <th className="px-4 py-2 text-left text-xs font-semibold text-gray-400 uppercase">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-100">
                        {appointments.map((a, i) => (
                            <tr key={i} className="hover:bg-blue-50 transition-colors">
                                <td className="px-4 py-2 whitespace-nowrap font-medium">{a.date}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{a.doctor}</td>
                                <td className="px-4 py-2 whitespace-nowrap">{a.service}</td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    {a.status === 'Confirmé' && <span className="bg-green-50 text-green-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaCheckCircle className="text-green-400" /> Confirmé</span>}
                                    {a.status === 'En attente' && <span className="bg-yellow-50 text-yellow-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1"><FaClock className="text-yellow-400" /> En attente</span>}
                                </td>
                                <td className="px-4 py-2 whitespace-nowrap">
                                    <button className="text-blue-500 hover:underline text-xs mr-2 font-medium transition-colors">Modifier</button>
                                    <button className="text-red-400 hover:underline text-xs font-medium transition-colors">Annuler</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Messages récents */}
            <div className="bg-blue-50 rounded-2xl shadow p-8 mb-10 mx-4 md:mx-0 animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <div className="text-lg font-semibold tracking-wide">Messages récents</div>
                    <a href="#" className="text-blue-500 hover:underline text-sm font-medium transition-colors">Voir tout</a>
                </div>
                <div className="space-y-4">
                    {messages.map((m, i) => (
                        <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-blue-100">
                            <div className="font-semibold text-blue-700 mb-1">{m.from} <span className="text-xs text-gray-400 font-normal">{m.time}</span></div>
                            <div className="text-gray-700 text-sm">{m.content}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Actualités santé */}
            <div className="bg-white rounded-2xl shadow p-8 mx-4 md:mx-0 animate-fade-in">
                <div className="text-lg font-semibold tracking-wide mb-6">Actualités santé</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {news.map((n, i) => (
                        <div key={i} className="bg-blue-50 rounded-xl p-6 shadow-sm flex flex-col gap-2 hover:shadow-md transition-all">
                            <div className="font-semibold text-gray-700 mb-1">{n.title}</div>
                            <div className="text-xs text-gray-400 mb-2">{n.date}</div>
                            <div className="text-gray-600 text-sm flex-1">{n.content}</div>
                            <a href={n.link} className="text-blue-500 text-sm mt-2 hover:underline font-medium">Lire l'article →</a>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PatientDashboard;