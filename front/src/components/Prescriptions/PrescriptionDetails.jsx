import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes, FaFilePdf, FaDownload } from 'react-icons/fa';
import { prescriptionService } from '../../services/api';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import axios from 'axios';
import { Link } from 'react-router-dom';

const PrescriptionDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [prescription, setPrescription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [formData, setFormData] = useState({
        medications: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        notes: '',
        status: ''
    });

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login-staff');
            return;
        }

        // Récupérer le rôle de l'utilisateur depuis le token
        const user = JSON.parse(localStorage.getItem('user'));
        setUserRole(user?.role);

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

        const fetchPrescription = async () => {
            try {
                console.log('Fetching prescription details for ID:', id);
                const response = await axios.get(`http://localhost:8000/api/prescriptions/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                console.log('Prescription details response:', response);
                setPrescription(response.data);
                setFormData({
                    medications: response.data.medications,
                    dosage: response.data.dosage || '',
                    frequency: response.data.frequency || '',
                    duration: response.data.duration || '',
                    instructions: response.data.instructions || '',
                    notes: response.data.notes || '',
                    status: response.data.status
                });
            } catch (error) {
                console.error('Error in fetchPrescription:', error);
                setError('Erreur lors du chargement de la prescription');
            } finally {
                setLoading(false);
            }
        };

        fetchUserRole();
        fetchPrescription();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await prescriptionService.updatePrescription(id, formData);
            setSuccess(true);
            setIsEditing(false);
            const response = await prescriptionService.getPrescriptionById(id);
            setPrescription(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la prescription');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette prescription ?')) {
            try {
                await axios.delete(`http://localhost:8000/api/prescriptions/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
                });
                navigate(`/dashboard/${userRole}/prescriptions`);
            } catch (error) {
                setError('Erreur lors de la suppression de la prescription');
            }
        }
    };

    const canEditPrescription = ['admin', 'medecin'].includes(userRole);
    const canDeletePrescription = ['admin', 'medecin'].includes(userRole);
    const isReadOnly = ['infirmier', 'stagiaire', 'patient'].includes(userRole);
    const canExportPDF = ['admin', 'patient', 'secretaire'].includes(userRole);

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

    const exportToPDF = () => {
        const doc = new jsPDF();
        
        // En-tête
        doc.setFontSize(20);
        doc.text('Prescription Médicale', 105, 20, { align: 'center' });
        
        // Informations du patient
        doc.setFontSize(12);
        doc.text('Informations du Patient', 20, 40);
        doc.setFontSize(10);
        doc.text(`ID: ${prescription.patient?.identifier}`, 20, 50);
        doc.text(`Nom: ${prescription.patient?.name} ${prescription.patient?.surname}`, 20, 60);
        doc.text(`Email: ${prescription.patient?.email}`, 20, 70);
        doc.text(`Téléphone: ${prescription.patient?.phone}`, 20, 80);

        // Informations de la prescription
        doc.setFontSize(12);
        doc.text('Détails de la Prescription', 20, 100);
        doc.setFontSize(10);
        doc.text(`Médecin: Dr. ${prescription.doctor?.name} ${prescription.doctor?.surname}`, 20, 110);
        doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString()}`, 20, 120);
        doc.text(`Statut: ${getStatusLabel(prescription.status)}`, 20, 130);

        // Médicaments et posologie
        doc.setFontSize(12);
        doc.text('Traitement Prescrit', 20, 150);
        
        // Tableau des médicaments
        const medications = Array.isArray(prescription.medications) 
            ? prescription.medications 
            : [{ name: prescription.medications }];

        autoTable(doc, {
            startY: 160,
            head: [['Médicament', 'Posologie', 'Fréquence', 'Durée']],
            body: medications.map(med => [
                med.name,
                prescription.dosage || 'Non spécifié',
                prescription.frequency || 'Non spécifié',
                prescription.duration || 'Non spécifié'
            ]),
            theme: 'grid',
            headStyles: { fillColor: [41, 128, 185] }
        });

        // Notes
        if (prescription.notes) {
            const finalY = doc.lastAutoTable.finalY || 200;
            doc.setFontSize(12);
            doc.text('Notes et Instructions', 20, finalY + 20);
            doc.setFontSize(10);
            const splitNotes = doc.splitTextToSize(prescription.notes, 170);
            doc.text(splitNotes, 20, finalY + 30);
        }

        // Pied de page
        const pageCount = doc.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            doc.setFontSize(8);
            doc.text(
                `Page ${i} sur ${pageCount}`,
                doc.internal.pageSize.width / 2,
                doc.internal.pageSize.height - 10,
                { align: 'center' }
            );
        }

        // Sauvegarder le PDF
        doc.save(`prescription_${prescription.id}.pdf`);
    };

    const handleDownloadPDF = () => {
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

    if (loading && !prescription) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !prescription) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <div>
                    <h2 className="text-2xl font-bold text-gray-800">Détails de la Prescription</h2>
                        <p className="text-gray-600 mt-1">ID: {prescription?.id}</p>
                    </div>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate(`/dashboard/${userRole}/prescriptions`)}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft className="mr-2" />
                            Retour
                        </button>
                        {canExportPDF && (
                                <button
                                onClick={exportToPDF}
                                className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                            >
                                <FaFilePdf className="mr-2" />
                                Exporter en PDF
                            </button>
                        )}
                        {userRole !== 'patient' && (
                            <>
                                <Link
                                    to={`/dashboard/${userRole}/prescriptions/${id}/edit`}
                                    className="flex items-center px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </Link>
                                {userRole === 'admin' && (
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                >
                                    <FaTrash className="mr-2" />
                                    Supprimer
                                </button>
                                )}
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Erreur!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Succès!</strong>
                        <span className="block sm:inline"> La prescription a été mise à jour avec succès.</span>
                    </div>
                )}

                {!isEditing && prescription && (
                    <div className="space-y-8">
                        {/* Informations du patient */}
                        <div className="bg-gray-50 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Informations du Patient</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Identifiant</p>
                                    <p className="text-lg font-medium text-gray-900">{prescription.patient?.identifier}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Nom complet</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {prescription.patient?.name} {prescription.patient?.surname}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Email</p>
                                    <p className="text-lg font-medium text-gray-900">{prescription.patient?.email}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Téléphone</p>
                                    <p className="text-lg font-medium text-gray-900">{prescription.patient?.phone}</p>
                                </div>
                            </div>
                        </div>

                        {/* Informations de la prescription */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Détails de la Prescription</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <p className="text-sm text-gray-500">Médecin prescripteur</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        Dr. {prescription.doctor?.name} {prescription.doctor?.surname}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Statut</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(prescription.status)}`}>
                                        {getStatusLabel(prescription.status)}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Date de prescription</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {new Date(prescription.created_at).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Dernière mise à jour</p>
                                    <p className="text-lg font-medium text-gray-900">
                                        {new Date(prescription.updated_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Médicaments et instructions */}
                        <div className="bg-white border border-gray-200 rounded-lg p-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-4">Traitement</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-sm text-gray-500 mb-2">Médicaments prescrits</p>
                                    <div className="bg-gray-50 rounded-lg p-4">
                                        {Array.isArray(prescription.medications) ? (
                                            <ul className="list-disc list-inside space-y-2">
                                                {prescription.medications.map((med, index) => (
                                                    <li key={index} className="text-gray-900">
                                                        {med.name}
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="text-gray-900">{prescription.medications}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Posologie */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Dosage</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900">{prescription.dosage || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Fréquence</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900">{prescription.frequency || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Durée</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900">{prescription.duration || 'Non spécifié'}</p>
                                        </div>
                                    </div>
                                </div>

                                {prescription.notes && (
                                    <div>
                                        <p className="text-sm text-gray-500 mb-2">Notes et instructions</p>
                                        <div className="bg-gray-50 rounded-lg p-4">
                                            <p className="text-gray-900 whitespace-pre-wrap">{prescription.notes}</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {isEditing && (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Status */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Status *
                                </label>
                                <select
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="completed">Complétée</option>
                                    <option value="cancelled">Annulée</option>
                                </select>
                            </div>

                            {/* Médicaments */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Médicaments *
                                </label>
                                <textarea
                                    name="medications"
                                    value={formData.medications}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Dosage */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Dosage *
                                </label>
                                <input
                                    type="text"
                                    name="dosage"
                                    value={formData.dosage}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Fréquence */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fréquence *
                                </label>
                                <input
                                    type="text"
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Durée */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Durée *
                                </label>
                                <input
                                    type="text"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Instructions */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Instructions
                                </label>
                                <textarea
                                    name="instructions"
                                    value={formData.instructions}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Notes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                <FaTimes className="mr-2" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                            >
                                <FaSave className="mr-2" />
                                Enregistrer
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
};

export default PrescriptionDetails; 