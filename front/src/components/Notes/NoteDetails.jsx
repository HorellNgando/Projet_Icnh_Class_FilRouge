import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { noteService, patientService } from '../../services/api';

const NoteDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [note, setNote] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        patient_id: '',
        type: '',
        priority: '',
        is_private: false
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [noteResponse, patientsResponse] = await Promise.all([
                    noteService.getNoteById(id),
                    patientService.getAllPatients()
                ]);
                setNote(noteResponse.data);
                setFormData(noteResponse.data);
                setPatients(patientsResponse.data);
            } catch (err) {
                setError('Erreur lors du chargement des données');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await noteService.updateNote(id, formData);
            setNote(formData);
            setSuccess(true);
            setIsEditing(false);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la note');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette note ?')) {
            setLoading(true);
            try {
                await noteService.deleteNote(id);
                navigate('/dashboard/admin/notes');
            } catch (err) {
                setError('Erreur lors de la suppression de la note');
                setLoading(false);
            }
        }
    };

    if (loading && !note) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !note) {
        return (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong className="font-bold">Erreur!</strong>
                <span className="block sm:inline"> {error}</span>
            </div>
        );
    }

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgente': return 'text-red-600';
            case 'haute': return 'text-orange-600';
            case 'normal': return 'text-blue-600';
            case 'basse': return 'text-green-600';
            default: return 'text-gray-600';
        }
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Détails de la Note</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/dashboard/admin/notes')}
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

                {error && (
                    <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Erreur!</strong>
                        <span className="block sm:inline"> {error}</span>
                    </div>
                )}

                {success && (
                    <div className="mb-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
                        <strong className="font-bold">Succès!</strong>
                        <span className="block sm:inline"> La note a été mise à jour avec succès.</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Titre */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Titre *
                                </label>
                                <input
                                    type="text"
                                    name="title"
                                    value={formData.title}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Patient */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Patient *
                                </label>
                                <select
                                    name="patient_id"
                                    value={formData.patient_id}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {patients.map(patient => (
                                        <option key={patient.id} value={patient.id}>
                                            {patient.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Type */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type *
                                </label>
                                <select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="consultation">Consultation</option>
                                    <option value="observation">Observation</option>
                                    <option value="suivi">Suivi</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            {/* Priorité */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Priorité *
                                </label>
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="basse">Basse</option>
                                    <option value="normal">Normal</option>
                                    <option value="haute">Haute</option>
                                    <option value="urgente">Urgente</option>
                                </select>
                            </div>

                            {/* Note privée */}
                            <div className="flex items-center">
                                <input
                                    type="checkbox"
                                    name="is_private"
                                    checked={formData.is_private}
                                    onChange={handleChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label className="ml-2 block text-sm text-gray-900">
                                    Note privée
                                </label>
                            </div>

                            {/* Contenu */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contenu *
                                </label>
                                <textarea
                                    name="content"
                                    value={formData.content}
                                    onChange={handleChange}
                                    required
                                    rows="6"
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
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Titre</h3>
                                <p className="mt-1 text-lg text-gray-900">{note.title}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Patient</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {patients.find(p => p.id === note.patient_id)?.name || 'Patient inconnu'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Type</h3>
                                <p className="mt-1 text-lg text-gray-900 capitalize">{note.type}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Priorité</h3>
                                <p className={`mt-1 text-lg capitalize ${getPriorityColor(note.priority)}`}>
                                    {note.priority}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Statut</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {note.is_private ? 'Privée' : 'Publique'}
                                </p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date de création</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {new Date(note.created_at).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                        <div>
                            <h3 className="text-sm font-medium text-gray-500">Contenu</h3>
                            <p className="mt-1 text-lg text-gray-900 whitespace-pre-wrap">{note.content}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NoteDetails; 