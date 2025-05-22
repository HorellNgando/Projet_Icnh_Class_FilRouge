import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaEdit, FaTrash, FaDownload, FaArrowLeft } from 'react-icons/fa';
import { reportService } from '../../services/api';

const ReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: '',
        status: '',
        content: '',
        attachments: []
    });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await reportService.getReport(id);
                setReport(response.data);
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    type: response.data.type,
                    status: response.data.status,
                    content: response.data.content,
                    attachments: response.data.attachments || []
                });
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du rapport');
                setLoading(false);
            }
        };

        fetchReport();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            attachments: [...prev.attachments, ...files]
        }));
    };

    const removeAttachment = (index) => {
        setFormData(prev => ({
            ...prev,
            attachments: prev.attachments.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'attachments') {
                    formData.attachments.forEach(file => {
                        formDataToSend.append('attachments', file);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            await reportService.updateReport(id, formDataToSend);
            setSuccess(true);
            setIsEditing(false);
            const updatedReport = await reportService.getReport(id);
            setReport(updatedReport.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du rapport');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport ?')) {
            try {
                await reportService.deleteReport(id);
                navigate('/dashboard/reports');
            } catch (err) {
                setError('Erreur lors de la suppression du rapport');
            }
        }
    };

    const handleDownload = async (attachmentId) => {
        try {
            const response = await reportService.downloadAttachment(id, attachmentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attachment-${attachmentId}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Erreur lors du téléchargement de la pièce jointe');
        }
    };

    const getTypeColor = (type) => {
        switch (type) {
            case 'medical': return 'bg-blue-100 text-blue-800';
            case 'financial': return 'bg-green-100 text-green-800';
            case 'administrative': return 'bg-purple-100 text-purple-800';
            case 'statistical': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'draft': return 'bg-gray-100 text-gray-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading && !report) {
        return (
            <div className="flex justify-center items-center h-screen">
                <FaSpinner className="animate-spin h-8 w-8 text-blue-500" />
            </div>
        );
    }

    if (error && !report) {
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
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <button
                        onClick={() => navigate('/dashboard/reports')}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <FaArrowLeft className="mr-2" />
                        Retour
                    </button>
                    <div className="flex space-x-4">
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                                >
                                    <FaTrash className="mr-2" />
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {error && (
                    <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Rapport mis à jour avec succès !
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                                Titre *
                            </label>
                            <input
                                type="text"
                                id="title"
                                name="title"
                                required
                                value={formData.title}
                                onChange={handleChange}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                                    Type *
                                </label>
                                <select
                                    id="type"
                                    name="type"
                                    required
                                    value={formData.type}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="medical">Médical</option>
                                    <option value="financial">Financier</option>
                                    <option value="administrative">Administratif</option>
                                    <option value="statistical">Statistique</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                                    Statut *
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    required
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                >
                                    <option value="draft">Brouillon</option>
                                    <option value="pending">En attente</option>
                                    <option value="completed">Terminé</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Contenu *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                required
                                value={formData.content}
                                onChange={handleChange}
                                rows="10"
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pièces jointes
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <svg
                                        className="mx-auto h-12 w-12 text-gray-400"
                                        stroke="currentColor"
                                        fill="none"
                                        viewBox="0 0 48 48"
                                        aria-hidden="true"
                                    >
                                        <path
                                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                                            strokeWidth={2}
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500"
                                        >
                                            <span>Télécharger des fichiers</span>
                                            <input
                                                id="file-upload"
                                                name="file-upload"
                                                type="file"
                                                multiple
                                                className="sr-only"
                                                onChange={handleFileChange}
                                            />
                                        </label>
                                        <p className="pl-1">ou glisser-déposer</p>
                                    </div>
                                    <p className="text-xs text-gray-500">
                                        PNG, JPG, PDF jusqu'à 10MB
                                    </p>
                                </div>
                            </div>
                        </div>

                        {formData.attachments.length > 0 && (
                            <div className="mt-4">
                                <h4 className="text-sm font-medium text-gray-700 mb-2">Fichiers sélectionnés :</h4>
                                <ul className="space-y-2">
                                    {formData.attachments.map((file, index) => (
                                        <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                                            <span className="text-sm text-gray-600">{file.name}</span>
                                            <button
                                                type="button"
                                                onClick={() => removeAttachment(index)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Supprimer
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => setIsEditing(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                        Mise à jour en cours...
                                    </span>
                                ) : (
                                    'Enregistrer les modifications'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="flex justify-between items-start">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{report.title}</h1>
                                <p className="mt-1 text-sm text-gray-500">{report.description}</p>
                            </div>
                            <div className="flex space-x-2">
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(report.type)}`}>
                                    {report.type}
                                </span>
                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(report.status)}`}>
                                    {report.status}
                                </span>
                            </div>
                        </div>

                        <div className="border-t border-gray-200 pt-4">
                            <h3 className="text-lg font-medium text-gray-900">Contenu</h3>
                            <div className="mt-2 prose max-w-none">
                                {report.content}
                            </div>
                        </div>

                        {report.attachments && report.attachments.length > 0 && (
                            <div className="border-t border-gray-200 pt-4">
                                <h3 className="text-lg font-medium text-gray-900">Pièces jointes</h3>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {report.attachments.map((attachment, index) => (
                                        <li key={index} className="py-3 flex justify-between items-center">
                                            <span className="text-sm text-gray-600">{attachment.name}</span>
                                            <button
                                                onClick={() => handleDownload(attachment.id)}
                                                className="text-blue-600 hover:text-blue-900"
                                            >
                                                <FaDownload className="h-5 w-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        <div className="border-t border-gray-200 pt-4">
                            <div className="text-sm text-gray-500">
                                Créé le {new Date(report.created_at).toLocaleDateString()}
                                {report.updated_at && ` • Mis à jour le ${new Date(report.updated_at).toLocaleDateString()}`}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ReportDetails; 