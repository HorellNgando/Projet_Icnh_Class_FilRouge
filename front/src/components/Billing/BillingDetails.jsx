import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FaSpinner, FaDownload, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import { billingService } from '../../services/api';

const BillingDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [bill, setBill] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        invoice_number: '',
        patient_id: '',
        amount: '',
        status: '',
        due_date: '',
        payment_date: '',
        description: '',
        items: []
    });

    useEffect(() => {
        const fetchBill = async () => {
            try {
                const response = await billingService.getBill(id);
                setBill(response.data);
                setFormData({
                    invoice_number: response.data.invoice_number,
                    patient_id: response.data.patient_id,
                    amount: response.data.amount,
                    status: response.data.status,
                    due_date: response.data.due_date,
                    payment_date: response.data.payment_date,
                    description: response.data.description,
                    items: response.data.items || []
                });
                setLoading(false);
            } catch (err) {
                setError('Erreur lors du chargement de la facture');
                setLoading(false);
            }
        };

        fetchBill();
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleItemChange = (index, field, value) => {
        const newItems = [...formData.items];
        newItems[index] = {
            ...newItems[index],
            [field]: value
        };
        setFormData(prev => ({
            ...prev,
            items: newItems
        }));
    };

    const addItem = () => {
        setFormData(prev => ({
            ...prev,
            items: [...prev.items, { description: '', quantity: 1, unit_price: 0 }]
        }));
    };

    const removeItem = (index) => {
        setFormData(prev => ({
            ...prev,
            items: prev.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            await billingService.updateBill(id, formData);
            setSuccess(true);
            setIsEditing(false);
            const updatedBill = await billingService.getBill(id);
            setBill(updatedBill.data);
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour de la facture');
        } finally {
            setLoading(false);
        }
    };

    const handleDownload = async () => {
        try {
            const response = await billingService.downloadBill(id);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `facture-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            setError('Erreur lors du téléchargement de la facture');
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'paid': return 'bg-green-100 text-green-800';
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'overdue': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
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
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Détails de la Facture</h2>
                    <div className="flex space-x-4">
                        <button
                            onClick={() => navigate('/dashboard/billing')}
                            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            Retour
                        </button>
                        {!isEditing && (
                            <>
                                <button
                                    onClick={() => setIsEditing(true)}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    <FaEdit className="inline-block mr-2" />
                                    Modifier
                                </button>
                                <button
                                    onClick={handleDownload}
                                    className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                                >
                                    <FaDownload className="inline-block mr-2" />
                                    Télécharger
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {success && (
                    <div className="mb-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                        Facture mise à jour avec succès !
                    </div>
                )}

                {isEditing ? (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label htmlFor="invoice_number" className="block text-sm font-medium text-gray-700">
                                    Numéro de facture *
                                </label>
                                <input
                                    type="text"
                                    id="invoice_number"
                                    name="invoice_number"
                                    required
                                    value={formData.invoice_number}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
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
                                    <option value="pending">En attente</option>
                                    <option value="paid">Payée</option>
                                    <option value="overdue">En retard</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="amount" className="block text-sm font-medium text-gray-700">
                                    Montant total *
                                </label>
                                <input
                                    type="number"
                                    id="amount"
                                    name="amount"
                                    required
                                    step="0.01"
                                    value={formData.amount}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="due_date" className="block text-sm font-medium text-gray-700">
                                    Date d'échéance *
                                </label>
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    required
                                    value={formData.due_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="payment_date" className="block text-sm font-medium text-gray-700">
                                    Date de paiement
                                </label>
                                <input
                                    type="date"
                                    id="payment_date"
                                    name="payment_date"
                                    value={formData.payment_date}
                                    onChange={handleChange}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                />
                            </div>
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

                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium text-gray-900">Articles</h3>
                                <button
                                    type="button"
                                    onClick={addItem}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Ajouter un article
                                </button>
                            </div>

                            <div className="space-y-4">
                                {formData.items.map((item, index) => (
                                    <div key={index} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder="Description"
                                                value={item.description}
                                                onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="w-24">
                                            <input
                                                type="number"
                                                placeholder="Quantité"
                                                value={item.quantity}
                                                onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value))}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <div className="w-32">
                                            <input
                                                type="number"
                                                placeholder="Prix unitaire"
                                                value={item.unit_price}
                                                onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value))}
                                                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                            />
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => removeItem(index)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Supprimer
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

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
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center">
                                        <FaSpinner className="animate-spin -ml-1 mr-2 h-4 w-4" />
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
                                    <p className="text-sm font-medium text-gray-500">Numéro de facture</p>
                                    <p className="mt-1 text-sm text-gray-900">{bill.invoice_number}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Statut</p>
                                    <span className={`mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(bill.status)}`}>
                                        {bill.status}
                                    </span>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Patient</p>
                                    <p className="mt-1 text-sm text-gray-900">{bill.patient?.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Montant total</p>
                                    <p className="mt-1 text-sm text-gray-900">{bill.amount.toFixed(2)} €</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date d'échéance</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {new Date(bill.due_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-500">Date de paiement</p>
                                    <p className="mt-1 text-sm text-gray-900">
                                        {bill.payment_date ? new Date(bill.payment_date).toLocaleDateString() : 'Non payée'}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {bill.description && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Description</h3>
                                <p className="mt-2 text-sm text-gray-500">{bill.description}</p>
                            </div>
                        )}

                        {bill.items && bill.items.length > 0 && (
                            <div>
                                <h3 className="text-lg font-medium text-gray-900">Articles</h3>
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Description
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Quantité
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Prix unitaire
                                                </th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {bill.items.map((item, index) => (
                                                <tr key={index}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.description}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {item.unit_price.toFixed(2)} €
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {(item.quantity * item.unit_price).toFixed(2)} €
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default BillingDetails; 