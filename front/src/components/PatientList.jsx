import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaFileMedical, FaEdit, FaPlus, FaEye, FaTrash, FaDownload } from 'react-icons/fa';
import Sidebar from './Sidebar';

const PatientList = () => {
    const [patients, setPatients] = useState([]);
    const [pagination, setPagination] = useState({ current_page: 1, last_page: 1 });
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({ status: '', gender: '' });
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

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
                });
                localStorage.setItem('user_role', response.data.role);
                localStorage.setItem('user_id', response.data.id);
            } catch (error) {
                setError('Erreur lors de la récupération du rôle');
                navigate('/login-staff');
            }
        };
        fetchUser();
    }, [navigate]);

    useEffect(() => {
        if (user?.role === 'patient' && user?.id) {
            navigate(`/dashboard/patients/${user.id}`);
        }
    }, [user, navigate]);

    const fetchPatients = async (page = 1) => {
        try {
            let endpoint = 'http://localhost:8000/api/patients';
            
            // Si c'est un médecin, on ne récupère que ses patients
            if (user?.role === 'medecin') {
                endpoint = `http://localhost:8000/api/medecin/${user.identifier}/patients`;
            }
            
            const response = await axios.get(endpoint, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                params: { page, search, ...filters },
            });
            setPatients(response.data.data);
            setPagination({
                current_page: response.data.current_page,
                last_page: response.data.last_page,
            });
            setError('');
        } catch (error) {
            setError(error.response?.data?.message || 'Erreur lors du chargement des patients');
        }
    };

    const handleExport = async (type) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/patients/export/${type}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `patients.${type}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Erreur lors de l\'exportation');
        }
    };

    const handleDownloadMedicalRecord = async (patientId, identifier) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/patients/${patientId}/medical-record/pdf`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `dossier_medical_${identifier}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            setError('Erreur lors du téléchargement du dossier médical');
        }
    };

    const handleDelete = async (patientId) => {
        if (!window.confirm('Voulez-vous vraiment supprimer ce patient ?')) return;
        try {
            await axios.delete(`http://localhost:8000/api/patients/${patientId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            setPatients(patients.filter((patient) => patient.id !== patientId));
            setError('');
        } catch (error) {
            setError('Erreur lors de la suppression du patient');
        }
    };

    useEffect(() => {
        if (user?.role && user.role !== 'patient') {
            fetchPatients();
        }
    }, [search, filters, user]);

    const handlePageChange = (page) => {
        fetchPatients(page);
    };

    const handleSearch = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (user.role === 'patient') {
        return null;
    }

    const canAddPatient = ['admin', 'infirmier', 'secretaire'].includes(user.role);
    const canEditPatient = ['admin', 'medecin', 'secretaire', 'infirmier',].includes(user.role);
    const canDeletePatient = user.role === 'admin';
    const canExport = user.role === 'admin';
    const canViewMedicalRecord = ['admin', 'medecin', 'infirmier', 'stagiaire'].includes(user.role);
    const canSearch = !['stagiaire'].includes(user.role);

    return (
        <div className="flex">
            <div className="flex-1 p-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    {user.role === 'medecin' ? 'Mes Patients' : 'Gestion des patients'}
                </h1>

                {error && (
                    <div className="mb-4 p-3 bg-red-100 border-l-4 border-red-500 text-red-700 rounded">
                        {error}
                    </div>
                )}

                <div className="mb-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Recherche patients</h2>
                    <div className="flex flex-col md:flex-row md:items-center gap-4 bg-white p-4 rounded-lg shadow">
                        {canSearch && (
                            <>
                                <div className="flex-1">
                                    <input
                                        type="text"
                                        placeholder="Rechercher un patient"
                                        value={search}
                                        onChange={handleSearch}
                                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <select
                                    name="status"
                                    value={filters.status}
                                    onChange={handleFilterChange}
                                    className="p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Médecins</option>
                                    <option value="active">Actif</option>
                                    <option value="discharged">Sorti</option>
                                </select>
                                <button
                                    onClick={() => fetchPatients(1)}
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
                                >
                                    Rechercher
                                </button>
                            </>
                        )}
                        {canAddPatient && (
                            <Link
                                to="/dashboard/admin/patients/create"
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200 flex items-center"
                            >
                                <FaPlus className="mr-2" /> Ajouter un patient
                            </Link>
                        )}
                    </div>
                </div>

                {canExport && (
                    <div className="mb-6 flex space-x-4">
                        <button
                            onClick={() => handleExport('pdf')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                        >
                            Exporter en PDF
                        </button>
                        <button
                            onClick={() => handleExport('excel')}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition duration-200"
                        >
                            Exporter en Excel
                        </button>
                    </div>
                )}

                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    <h2 className="text-xl font-bold text-gray-800 p-6 border-b bg-gradient-to-r from-blue-50 to-blue-100 sticky top-0 z-10">Liste des patients</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[800px]">
                            <thead>
                                <tr className="bg-blue-100 text-blue-800 uppercase text-xs leading-normal sticky top-0 z-10">
                                    <th className="py-4 px-4 text-left">ID</th>
                                    <th className="py-4 px-4 text-left">Nom</th>
                                    <th className="py-4 px-4 text-left">Date de naissance</th>
                                    <th className="py-4 px-4 text-left">Date admission</th>
                                    <th className="py-4 px-4 text-left">Docteur</th>
                                    <th className="py-4 px-4 text-left">N° Téléphone</th>
                                    <th className="py-4 px-4 text-left">Statut</th>
                                    <th className="py-4 px-4 text-left">Action</th>
                                </tr>
                            </thead>
                            <tbody className="text-gray-700 divide-y divide-gray-100">
                                {patients.length === 0 && (
                                    <tr>
                                        <td colSpan="8" className="py-8 text-center text-gray-400">Aucun patient trouvé.</td>
                                    </tr>
                                )}
                                {patients.map((patient) => (
                                    <tr key={patient.id} className="hover:bg-blue-50 transition-colors duration-150">
                                        <td className="py-3 px-4 font-mono text-xs text-gray-500">{patient.identifier}</td>
                                        <td className="py-3 px-4 font-semibold">{patient.first_name} {patient.last_name}</td>
                                        <td className="py-3 px-4">{patient.birth_date || '-'}</td>
                                        <td className="py-3 px-4">{patient.admission_date_formatted || '-'}</td>
                                        <td className="py-3 px-4">{patient.doctor_name || <span className='text-gray-400'>N/A</span>}</td>
                                        <td className="py-3 px-4">{patient.phone || <span className='text-gray-400'>N/A</span>}</td>
                                        <td className="py-3 px-4">
                                            <span className={`inline-block px-3 w-auto py-1 rounded-full text-xs font-bold ${patient.discharge_confirmed ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                                                {patient.discharge_confirmed ? 'Sorti' : 'En cours'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 flex flex-wrap gap-2 items-center">
                                            {canEditPatient && (
                                                <Link
                                                    to={`/dashboard/admin/patients/edit/${patient.id}`}
                                                    className="text-yellow-500 hover:text-yellow-700 p-2 rounded hover:bg-yellow-50"
                                                    title="Modifier"
                                                >
                                                    <FaEdit />
                                                </Link>
                                            )}
                                            {canViewMedicalRecord && (
                                                <Link
                                                    to={`/dashboard/admin/patients/${patient.id}`}
                                                    className="text-blue-500 hover:text-blue-700 p-2 rounded hover:bg-blue-50"
                                                    title="Voir le dossier médical"
                                                >
                                                    <FaFileMedical />
                                                </Link>
                                            )}
                                            {canViewMedicalRecord && (
                                                <button
                                                    onClick={() => handleDownloadMedicalRecord(patient.id, patient.identifier)}
                                                    className="text-green-500 hover:text-green-700 p-2 rounded hover:bg-green-50"
                                                    title="Télécharger le dossier médical"
                                                >
                                                    <FaDownload />
                                                </button>
                                            )}
                                            {canDeletePatient && (
                                                <button
                                                    onClick={() => handleDelete(patient.id)}
                                                    className="text-red-500 hover:text-red-700 p-2 rounded hover:bg-red-50"
                                                    title="Supprimer"
                                                >
                                                    <FaTrash />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {pagination.last_page > 1 && (
                        <div className="flex flex-col md:flex-row justify-between items-center p-4 gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.current_page - 1)}
                                disabled={pagination.current_page === 1}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Précédent
                            </button>
                            <span className="text-sm text-gray-600">
                                Page {pagination.current_page} sur {pagination.last_page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.current_page + 1)}
                                disabled={pagination.current_page === pagination.last_page}
                                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Suivant
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PatientList;