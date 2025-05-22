import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaDownload, FaTrash, FaEdit, FaCheck, FaTimes, FaUpload } from 'react-icons/fa';
import { internReportService } from '../../services/api';
import '../../styles/common.css';

const InternReportDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const userRole = localStorage.getItem('user_role');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        content: '',
        objectives: '',
        methodology: '',
        results: '',
        conclusion: '',
        attachments: []
    });

    useEffect(() => {
        const fetchReport = async () => {
            try {
                const response = await internReportService.getInternReport(id);
                setReport(response.data);
                setFormData({
                    title: response.data.title,
                    description: response.data.description,
                    content: response.data.content,
                    objectives: response.data.objectives,
                    methodology: response.data.methodology,
                    results: response.data.results,
                    conclusion: response.data.conclusion,
                    attachments: response.data.attachments || []
                });
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement du rapport de stage');
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

            await internReportService.updateInternReport(id, formDataToSend);
            setSuccess(true);
            setIsEditing(false);
            const updatedReport = await internReportService.getInternReport(id);
            setReport(updatedReport.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du rapport de stage');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce rapport de stage ?')) {
            setIsDeleting(true);
            try {
                await internReportService.deleteInternReport(id);
                navigate(`/dashboard/${userRole}/intern-reports`);
            } catch (err) {
                setError('Erreur lors de la suppression du rapport de stage');
            } finally {
                setIsDeleting(false);
            }
        }
    };

    const handleDownload = async (attachmentId) => {
        setIsDownloading(true);
        try {
            const response = await internReportService.downloadAttachment(id, attachmentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `attachment-${attachmentId}`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Erreur lors du téléchargement de la pièce jointe');
        } finally {
            setIsDownloading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'draft': return 'badge-info';
            case 'pending': return 'badge-warning';
            case 'approved': return 'badge-success';
            case 'rejected': return 'badge-danger';
            default: return 'badge-info';
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="loading-spinner">
                    <FaSpinner className="h-12 w-12 text-primary-color" />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="alert alert-error">
                    <strong className="font-bold">Erreur!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <div className="card p-6">
                <div className="page-header">
                    <h2 className="page-title">Détails du rapport de stage</h2>
                    <p className="page-description">Consultez et gérez les détails du rapport de stage</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate(`/dashboard/${userRole}/intern-reports`)}
                            className="btn btn-secondary"
                        >
                            Retour
                        </button>
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="btn btn-primary"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="btn btn-danger"
                                    disabled={isDeleting}
                                >
                                    {isDeleting ? (
                                        <FaSpinner className="loading-spinner mr-2" />
                                    ) : (
                                        <FaTrash className="mr-2" />
                                    )}
                                    Supprimer
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="alert alert-success">
                        Rapport de stage mis à jour avec succès !
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
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                                Description *
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                required
                                value={formData.description}
                                onChange={handleChange}
                                rows="3"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="objectives" className="block text-sm font-medium text-gray-700">
                                Objectifs *
                            </label>
                            <textarea
                                id="objectives"
                                name="objectives"
                                required
                                value={formData.objectives}
                                onChange={handleChange}
                                rows="4"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="methodology" className="block text-sm font-medium text-gray-700">
                                Méthodologie *
                            </label>
                            <textarea
                                id="methodology"
                                name="methodology"
                                required
                                value={formData.methodology}
                                onChange={handleChange}
                                rows="4"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="results" className="block text-sm font-medium text-gray-700">
                                Résultats *
                            </label>
                            <textarea
                                id="results"
                                name="results"
                                required
                                value={formData.results}
                                onChange={handleChange}
                                rows="4"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="conclusion" className="block text-sm font-medium text-gray-700">
                                Conclusion *
                            </label>
                            <textarea
                                id="conclusion"
                                name="conclusion"
                                required
                                value={formData.conclusion}
                                onChange={handleChange}
                                rows="4"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label htmlFor="content" className="block text-sm font-medium text-gray-700">
                                Contenu détaillé *
                            </label>
                            <textarea
                                id="content"
                                name="content"
                                required
                                value={formData.content}
                                onChange={handleChange}
                                rows="10"
                                className="form-input mt-1"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Pièces jointes
                            </label>
                            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                                <div className="space-y-1 text-center">
                                    <FaUpload className="mx-auto h-12 w-12 text-gray-400" />
                                    <div className="flex text-sm text-gray-600">
                                        <label
                                            htmlFor="file-upload"
                                            className="relative cursor-pointer bg-white rounded-md font-medium text-primary-color hover:text-primary-hover focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary-color"
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
                                                className="text-danger-color hover:text-danger-hover"
                                            >
                                                <FaTimes />
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
                                className="btn btn-secondary"
                            >
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn btn-primary"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="loading-spinner -ml-1 mr-2 h-4 w-4" />
                                        Enregistrement...
                                    </span>
                                ) : (
                                    'Enregistrer les modifications'
                                )}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Informations générales</h3>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Titre</p>
                                    <p className="mt-1 text-sm text-gray-900">{report.title}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Statut</p>
                                    <span className={`badge ${getStatusColor(report.status)}`}>
                                        {report.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Stagiaire</p>
                                    <p className="mt-1 text-sm text-gray-900">{report.intern?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date de soumission</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(report.submitted_at).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Description</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.description}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Objectifs</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.objectives}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Méthodologie</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.methodology}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Résultats</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.results}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Conclusion</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.conclusion}</p>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Contenu détaillé</h3>
                            <p className="mt-2 text-sm text-gray-500">{report.content}</p>
                        </div>

                        {report.attachments && report.attachments.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Pièces jointes</h3>
                                <ul className="mt-2 divide-y divide-gray-200">
                                    {report.attachments.map((attachment) => (
                                        <li key={attachment.id} className="py-3 flex justify-between items-center">
                                            <div className="flex items-center">
                                                <span className="text-sm text-gray-500">{attachment.name}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDownload(attachment.id)}
                                                className="text-primary-color hover:text-primary-hover"
                                                disabled={isDownloading}
                                            >
                                                {isDownloading ? (
                                                    <FaSpinner className="loading-spinner h-4 w-4" />
                                                ) : (
                                                    <FaDownload />
                                                )}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default InternReportDetails; 