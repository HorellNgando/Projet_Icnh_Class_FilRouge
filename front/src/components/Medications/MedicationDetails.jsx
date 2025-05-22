import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';
import { medicationService } from '../../services/api';

const MedicationDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [medication, setMedication] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        category: '',
        description: '',
        stock: 0,
        price: 0,
        supplier: '',
        expiry_date: '',
        storage_conditions: '',
        side_effects: '',
        contraindications: ''
    });

    useEffect(() => {
        const fetchMedication = async () => {
            try {
                const response = await medicationService.getMedicationById(id);
                setMedication(response.data);
                setFormData({
                    name: response.data.name,
                    category: response.data.category,
                    description: response.data.description,
                    stock: response.data.stock,
                    price: response.data.price,
                    supplier: response.data.supplier,
                    expiry_date: response.data.expiry_date,
                    storage_conditions: response.data.storage_conditions || '',
                    side_effects: response.data.side_effects || '',
                    contraindications: response.data.contraindications || ''
                });
            } catch (err) {
                setError('Erreur lors du chargement du médicament');
            } finally {
                setLoading(false);
            }
        };

        fetchMedication();
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
            await medicationService.updateMedication(id, formData);
            setSuccess(true);
            setIsEditing(false);
            const response = await medicationService.getMedicationById(id);
            setMedication(response.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du médicament');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer ce médicament ?')) {
            setLoading(true);
            setError(null);

            try {
                await medicationService.deleteMedication(id);
                navigate('/dashboard/admin/medications');
            } catch (err) {
                setError(err.response?.data?.message || 'Erreur lors de la suppression du médicament');
                setLoading(false);
            }
        }
    };

    const handleStockUpdate = async (quantity) => {
        try {
            await medicationService.updateStock(id, quantity);
            const response = await medicationService.getMedicationById(id);
            setMedication(response.data);
            setFormData(prev => ({ ...prev, stock: response.data.stock }));
            setSuccess(true);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du stock');
        }
    };

    if (loading && !medication) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error && !medication) {
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
                    <h2 className="text-2xl font-bold text-gray-800">Détails du Médicament</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/dashboard/admin/medications')}
                            className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            <FaArrowLeft className="mr-2" />
                            Retour
                        </button>
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                                >
                                    <FaEdit className="mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDelete}
                                    className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
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
                        <span className="block sm:inline"> Les modifications ont été enregistrées avec succès.</span>
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Nom */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Catégorie */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Catégorie *
                                </label>
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="antibiotique">Antibiotique</option>
                                    <option value="antalgique">Antalgique</option>
                                    <option value="anti-inflammatoire">Anti-inflammatoire</option>
                                    <option value="antiviral">Antiviral</option>
                                    <option value="antifongique">Antifongique</option>
                                    <option value="autre">Autre</option>
                                </select>
                            </div>

                            {/* Description */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description *
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Stock *
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Prix */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prix (€) *
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Fournisseur */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Fournisseur *
                                </label>
                                <input
                                    type="text"
                                    name="supplier"
                                    value={formData.supplier}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Date d'expiration */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Date d'expiration *
                                </label>
                                <input
                                    type="date"
                                    name="expiry_date"
                                    value={formData.expiry_date}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Conditions de stockage */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Conditions de stockage
                                </label>
                                <textarea
                                    name="storage_conditions"
                                    value={formData.storage_conditions}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Effets secondaires */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Effets secondaires
                                </label>
                                <textarea
                                    name="side_effects"
                                    value={formData.side_effects}
                                    onChange={handleChange}
                                    rows="2"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* Contre-indications */}
                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Contre-indications
                                </label>
                                <textarea
                                    name="contraindications"
                                    value={formData.contraindications}
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
                                className="flex items-center px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                            >
                                <FaTimes className="mr-2" />
                                Annuler
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <FaSave className="mr-2" />
                                {loading ? 'Enregistrement...' : 'Enregistrer'}
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Nom</h3>
                                <p className="mt-1 text-lg text-gray-900">{medication.name}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Catégorie</h3>
                                <p className="mt-1 text-lg text-gray-900">{medication.category}</p>
                            </div>
                            <div className="md:col-span-2">
                                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                                <p className="mt-1 text-lg text-gray-900">{medication.description}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Stock</h3>
                                <div className="mt-1 flex items-center space-x-4">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        medication.stock <= 0 ? 'bg-red-100 text-red-800' :
                                        medication.stock < 10 ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-green-100 text-green-800'
                                    }`}>
                                        {medication.stock}
                                    </span>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleStockUpdate(medication.stock - 1)}
                                            disabled={medication.stock <= 0}
                                            className="px-2 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            -1
                                        </button>
                                        <button
                                            onClick={() => handleStockUpdate(medication.stock + 1)}
                                            className="px-2 py-1 text-sm bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            +1
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Prix</h3>
                                <p className="mt-1 text-lg text-gray-900">{medication.price} €</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Fournisseur</h3>
                                <p className="mt-1 text-lg text-gray-900">{medication.supplier}</p>
                            </div>
                            <div>
                                <h3 className="text-sm font-medium text-gray-500">Date d'expiration</h3>
                                <p className="mt-1 text-lg text-gray-900">
                                    {new Date(medication.expiry_date).toLocaleDateString()}
                                </p>
                            </div>
                            {medication.storage_conditions && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Conditions de stockage</h3>
                                    <p className="mt-1 text-lg text-gray-900">{medication.storage_conditions}</p>
                                </div>
                            )}
                            {medication.side_effects && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Effets secondaires</h3>
                                    <p className="mt-1 text-lg text-gray-900">{medication.side_effects}</p>
                                </div>
                            )}
                            {medication.contraindications && (
                                <div className="md:col-span-2">
                                    <h3 className="text-sm font-medium text-gray-500">Contre-indications</h3>
                                    <p className="mt-1 text-lg text-gray-900">{medication.contraindications}</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MedicationDetails; 