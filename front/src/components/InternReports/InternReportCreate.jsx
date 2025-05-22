import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSpinner, FaUpload, FaTimes } from 'react-icons/fa';
import { internReportService } from '../../services/api';
import '../../styles/common.css';

const InternReportCreate = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
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

            await internReportService.createInternReport(formDataToSend);
            setSuccess(true);
            setTimeout(() => {
                navigate(`/dashboard/${userRole}/intern-reports`);
            }, 2000);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la création du rapport de stage');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container">
            <div className="card p-6">
                <div className="page-header">
                    <h2 className="page-title">Créer un nouveau rapport de stage</h2>
                    <p className="page-description">Remplissez le formulaire ci-dessous pour créer un nouveau rapport de stage</p>
                </div>

                {error && (
                    <div className="alert alert-error">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        Rapport de stage créé avec succès !
                    </div>
                )}

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
                            onClick={() => navigate(`/dashboard/${userRole}/intern-reports`)}
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
                                    Création en cours...
                                </span>
                            ) : (
                                'Créer le rapport'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InternReportCreate; 