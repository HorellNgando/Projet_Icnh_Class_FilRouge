import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { medicalRecordService } from '../../services/api';

const MedicalRecordDetails = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [record, setRecord] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        diagnosis: '',
        treatment: '',
        symptoms: '',
        allergies: '',
        medications: '',
        notes: '',
        follow_up_date: '',
        follow_up_notes: ''
    });

    useEffect(() => {
        const fetchRecord = async () => {
            try {
                const response = await medicalRecordService.getRecordById(id);
                setRecord(response.data);
                setFormData({
                    diagnosis: response.data.diagnosis || '',
                    treatment: response.data.treatment || '',
                    symptoms: response.data.symptoms || '',
                    allergies: response.data.allergies || '',
                    medications: response.data.medications || '',
                    notes: response.data.notes || '',
                    follow_up_date: response.data.follow_up_date || '',
                    follow_up_notes: response.data.follow_up_notes || ''
                });
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du dossier médical');
                setLoading(false);
            }
        };

        fetchRecord();
    }, [id]);

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
            await medicalRecordService.updateRecord(id, formData);
            setSuccess(true);
            setIsEditing(false);
            // Rafraîchir les données
            const response = await medicalRecordService.getRecordById(id);
            setRecord(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du dossier médical');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce dossier médical ?')) {
            try {
                await medicalRecordService.deleteRecord(id);
                navigate('/dashboard/admin/medical-records');
            } catch (err) {
                setError('Erreur lors de la suppression du dossier médical');
            }
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

    if (!record) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-gray-500">Dossier médical non trouvé</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Détails du Dossier Médical</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/dashboard/admin/medical-records')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft className="mr-2" />
                            Retour
                        </button>
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 text-blue-600 hover:text-blue-800"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center px-4 py-2 text-red-600 hover:text-red-800"
                                >
                                    <FaTrash className="mr-2" />
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Succès!</strong>
                        <span className="block sm:inline"> Le dossier médical a été mis à jour avec succès.</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Diagnostic */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Diagnostic *
                                </label>
                                <textarea
                                    name="diagnosis"
                                    value={formData.diagnosis}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Symptômes */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Symptômes
                                </label>
                                <textarea
                                    name="symptoms"
                                    value={formData.symptoms}
                                    onChange={handleChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Traitement */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Traitement *
                                </label>
                                <textarea
                                    name="treatment"
                                    value={formData.treatment}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Allergies */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Allergies
                                </label>
                                <textarea
                                    name="allergies"
                                    value={formData.allergies}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Médicaments */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Médicaments
                                </label>
                                <textarea
                                    name="medications"
                                    value={formData.medications}
                                    onChange={handleChange}
                                    rows="2"
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

                            {/* Date de suivi */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date de suivi
                                </label>
                                <input
                                    type="date"
                                    name="follow_up_date"
                                    value={formData.follow_up_date}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Notes de suivi */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Notes de suivi
                                </label>
                                <textarea
                                    name="follow_up_notes"
                                    value={formData.follow_up_notes}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                <FaTimes className="mr-2" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaCheck className="mr-2" />
                                {loading ? 'Mise à jour...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {record.patient?.name} {record.patient?.surname}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Médecin</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    Dr. {record.doctor?.name} {record.doctor?.surname}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {new Date(record.date).toLocaleDateString()}
                                </p>
                            </div>

                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date de suivi</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {record.follow_up_date ? new Date(record.follow_up_date).toLocaleDateString() : 'Non définie'}
                                </p>
                            </div>

                            <div className="md:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Diagnostic</h3>
                                <p className="mt-1 text-lg text-gray-900">{record.diagnosis}</p>
                            </div>

                            {record.symptoms && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Symptômes</h3>
                                    <p className="mt-1 text-lg text-gray-900">{record.symptoms}</p>
                                </div>
                            )}

                            <div className="md:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Traitement</h3>
                                <p className="mt-1 text-lg text-gray-900">{record.treatment}</p>
                            </div>

                            {record.allergies && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Allergies</h3>
                                    <p className="mt-1 text-lg text-gray-900">{record.allergies}</p>
                                </div>
                            )}

                            {record.medications && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Médicaments</h3>
                                    <p className="mt-1 text-lg text-gray-900">{record.medications}</p>
                                </div>
                            )}

                            {record.notes && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Notes</h3>
                                    <p className="mt-1 text-lg text-gray-900">{record.notes}</p>
                                </div>
                            )}

                            {record.follow_up_notes && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Notes de suivi</h3>
                                    <p className="mt-1 text-lg text-gray-900">{record.follow_up_notes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicalRecordDetails; 