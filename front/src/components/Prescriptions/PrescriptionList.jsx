import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaSearch, FaChevronLeft, FaChevronRight, FaPlus, FaFilter, FaEye, FaEdit, FaTrash, FaDownload } from 'react-icons/fa';
import { prescriptionService } from '../../services/api';
import axios from 'axios';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const PrescriptionList = () => {
    const navigate = useNavigate();
    const [prescriptions, setPrescriptions] = useState([]);
    const [filteredPrescriptions, setFilteredPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [userRole, setUserRole] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [showFilters, setShowFilters] = useState(false);
    const prescriptionsPerPage = 10;

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/user', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                setUserRole(response.data.role);
            } catch (error) {
                console.error('Erreur lors de la récupération du rôle:', error);
            }
        };

        fetchUserRole();
    }, []);

    useEffect(() => {
        const fetchPrescriptions = async () => {
            try {
                let response;
                if (userRole === 'patient') {
                    const userResponse = await axios.get('http://localhost:8000/api/user', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    const patientResponse = await axios.get('http://localhost:8000/api/patients/me', {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                    response = await axios.get(`http://localhost:8000/api/prescriptions/patient/${patientResponse.data.id}`, {
                        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                    });
                } else {
                    response = await prescriptionService.getAllPrescriptions();
                }
                setPrescriptions(response.data);
                setFilteredPrescriptions(response.data);
            } catch (error) {
                setError('Erreur lors du chargement des prescriptions');
                console.error('Erreur:', error);
            } finally {
                setLoading(false);
            }
        };

        if (userRole) {
            fetchPrescriptions();
        }
    }, [userRole]);

    useEffect(() => {
        let filtered = prescriptions;

        if (searchTerm) {
            const searchLower = searchTerm.toLowerCase();
            filtered = filtered.filter(prescription => 
                prescription.patient?.first_name?.toLowerCase().includes(searchLower) ||
                prescription.patient?.last_name?.toLowerCase().includes(searchLower) ||
                prescription.doctor?.first_name?.toLowerCase().includes(searchLower) ||
                prescription.doctor?.last_name?.toLowerCase().includes(searchLower) ||
                prescription.medications?.some(med => 
                    med.name.toLowerCase().includes(searchLower)
                )
            );
        }

        if (selectedStatus !== 'all') {
            filtered = filtered.filter(prescription => 
                prescription.status === selectedStatus
            );
        }

        setFilteredPrescriptions(filtered);
        setCurrentPage(1);
    }, [searchTerm, selectedStatus, prescriptions]);

    const indexOfLastPrescription = currentPage * prescriptionsPerPage;
    const indexOfFirstPrescription = indexOfLastPrescription - prescriptionsPerPage;
    const currentPrescriptions = filteredPrescriptions.slice(indexOfFirstPrescription, indexOfLastPrescription);
    const totalPages = Math.ceil(filteredPrescriptions.length / prescriptionsPerPage);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'bg-green-100 text-green-800';
            case 'completed':
                return 'bg-blue-100 text-blue-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusLabel = (status) => {
        switch (status?.toLowerCase()) {
            case 'active':
                return 'Active';
            case 'completed':
                return 'Complétée';
            case 'cancelled':
                return 'Annulée';
            default:
                return status;
        }
    };

    const canCreatePrescription = ['admin', 'medecin'].includes(userRole?.toLowerCase());
    const canEditPrescription = ['admin', 'medecin'].includes(userRole?.toLowerCase());
    const canDeletePrescription = userRole?.toLowerCase() === 'admin';

    const handleDelete = async (id) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
            try {
                await prescriptionService.deletePrescription(id);
                setPrescriptions(prescriptions.filter(p => p.id !== id));
            } catch (error) {
                setError('Erreur lors de la suppression de la prescription');
                console.error('Erreur:', error);
            }
        }
    };

    const handleViewDetails = async (id) => {
        try {
            console.log('Fetching prescription details for ID:', id);
            const prescription = await prescriptionService.getPrescriptionById(id);
            console.log('Prescription details response:', prescription);
            navigate(`/dashboard/${userRole}/prescriptions/${id}`, { state: { prescription } });
        } catch (error) {
            console.error('Erreur lors du chargement des détails:', error);
            setError('Erreur lors du chargement de la prescription');
        }
    };

    const handleDownloadPDF = async (prescription) => {
        try {
            const doc = new jsPDF();
            
            // En-tête
            doc.setFontSize(20);
            doc.text('Prescription Médicale', 105, 20, { align: 'center' });
            
            // Informations du patient
            doc.setFontSize(12);
            doc.text('Informations du Patient:', 14, 40);
            doc.setFontSize(10);
            doc.text(`Nom: ${prescription.patient?.first_name} ${prescription.patient?.last_name}`, 14, 50);
            doc.text(`ID: ${prescription.patient?.identifier}`, 14, 55);
            
            // Informations de la prescription
            doc.setFontSize(12);
            doc.text('Détails de la Prescription:', 14, 70);
            doc.setFontSize(10);
            doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 14, 80);
            doc.text(`Médecin: Dr. ${prescription.doctor?.name} ${prescription.doctor?.surname}`, 14, 85);
            doc.text(`Statut: ${getStatusLabel(prescription.status)}`, 14, 90);
            
            // Médicaments
            doc.setFontSize(12);
            doc.text('Médicaments Prescrits:', 14, 105);
            
            const medications = Array.isArray(prescription.medications) ? prescription.medications : [];
            const tableData = medications.map(med => [
                med.name,
                med.dosage,
                med.frequency,
                med.duration
            ]);
            
            doc.autoTable({
                startY: 110,
                head: [['Médicament', 'Dosage', 'Fréquence', 'Durée']],
                body: tableData,
                theme: 'grid',
                headStyles: { fillColor: [66, 139, 202] }
            });
            
            // Notes
            if (prescription.notes) {
                const finalY = doc.lastAutoTable.finalY || 150;
                doc.setFontSize(12);
                doc.text('Notes:', 14, finalY + 10);
                doc.setFontSize(10);
                doc.text(prescription.notes, 14, finalY + 20);
            }
            
            // Pied de page
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.text(`Page ${i} sur ${pageCount}`, 105, 285, { align: 'center' });
            }
            
            // Sauvegarde du PDF
            doc.save(`prescription_${prescription.id}.pdf`);
        } catch (error) {
            console.error('Erreur lors de la génération du PDF:', error);
            setError('Erreur lors de la génération du PDF');
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Prescriptions</h2>
                        <p className="text-gray-600 mt-1">
                            {filteredPrescriptions.length} prescription(s) trouvée(s)
                        </p>
                    </div>
                    <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Rechercher une prescription..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    ×
                                </button>
                            )}
                        </div>

                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <FaFilter className="mr-2" />
                            Filtres
                        </button>

                        {userRole !== 'patient' && (
                            <Link
                                to={`/dashboard/${userRole}/prescriptions/new`}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                <FaPlus className="mr-2" />
                                Nouvelle Prescription
                            </Link>
                        )}
                    </div>
                </div>

                {showFilters && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Statut
                                </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="all">Tous les statuts</option>
                                    <option value="active">Active</option>
                                    <option value="completed">Complétée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Patient
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Médecin
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Médicaments
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Statut
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {currentPrescriptions.length > 0 ? (
                                currentPrescriptions.map((prescription) => (
                                    <tr 
                                        key={prescription.id} 
                                        className="hover:bg-gray-50 transition-colors duration-200"
                                    >
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center">
                                                <div>
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {prescription.patient?.first_name} {prescription.patient?.last_name}
                                                    </div>
                                                    <div className="text-sm text-gray-500">
                                                        ID: {prescription.patient?.identifier}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {prescription.doctor ? (
                                                    <>
                                                        Dr. {prescription.doctor.name} {prescription.doctor.surname}
                                                    </>
                                                ) : prescription.doctor_id ? (
                                                    `Dr. (ID: ${prescription.doctor_id})`
                                                ) : (
                                                    'Médecin non spécifié'
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm text-gray-900">
                                                {new Date(prescription.created_at).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-900 max-w-xs truncate">
                                                {Array.isArray(prescription.medications) 
                                                    ? prescription.medications.map(med => med.name).join(', ')
                                                    : prescription.medications}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(prescription.status)}`}>
                                                {getStatusLabel(prescription.status)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                <button
                                                    onClick={() => handleViewDetails(prescription.id)}
                                                    className="text-blue-600 hover:text-blue-900"
                                                    title="Voir les détails"
                                                >
                                                    <FaEye />
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadPDF(prescription)}
                                                    className="text-green-600 hover:text-green-900"
                                                    title="Télécharger PDF"
                                                >
                                                    <FaDownload />
                                                </button>
                                                {userRole !== 'patient' && (
                                                    <>
                                                        <Link
                                                            to={`/dashboard/${userRole}/prescriptions/${prescription.id}/edit`}
                                                            className="text-yellow-600 hover:text-yellow-900"
                                                            title="Modifier"
                                                        >
                                                            <FaEdit />
                                                        </Link>
                                                        {userRole === 'admin' && (
                                                            <button
                                                                onClick={() => handleDelete(prescription.id)}
                                                                className="text-red-600 hover:text-red-900"
                                                                title="Supprimer"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        )}
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                        Aucune prescription trouvée
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {totalPages > 1 && (
                    <div className="flex justify-center mt-6">
                        <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                            <button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={currentPage === 1}
                                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronLeft className="h-5 w-5" />
                            </button>
                            {[...Array(totalPages)].map((_, index) => (
                                <button
                                    key={index + 1}
                                    onClick={() => handlePageChange(index + 1)}
                                    className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium
                                        ${currentPage === index + 1
                                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                                        }`}
                                >
                                    {index + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={currentPage === totalPages}
                                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaChevronRight className="h-5 w-5" />
                            </button>
                        </nav>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PrescriptionList; 