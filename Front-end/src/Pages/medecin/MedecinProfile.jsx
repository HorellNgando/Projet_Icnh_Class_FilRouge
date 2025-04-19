import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MedecinProfile = () => {
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        email: '',
        telephone: '',
        service: '',
        photo: null,
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setFormData({
                    nom: response.data.nom,
                    prenom: response.data.prenom,
                    email: response.data.email,
                    telephone: response.data.telephone,
                    service: response.data.service || '',
                    photo: null,
                });
            } catch (err) {
                console.error('Erreur lors du chargement du profil', err);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        if (e.target.name === 'photo') {
            setFormData({ ...formData, photo: e.target.files[0] });
        } else {
            setFormData({ ...formData, [e.target.name]: e.target.value });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };

            const data = new FormData();
            data.append('nom', formData.nom);
            data.append('prenom', formData.prenom);
            data.append('email', formData.email);
            data.append('telephone', formData.telephone);
            data.append('service', formData.service);
            if (formData.photo) {
                data.append('photo', formData.photo);
            }

            await axios.post('http://localhost:8000/api/medecin/profile/update', data, { headers });
            navigate('/medecin/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Erreur lors de la mise à jour du profil.');
        }
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role="medecin" />
            <div className="flex-1 ml-0 md:ml-64 p-4">
                <h1 className="text-2xl font-bold mb-4">Modifier le profil</h1>
                {error && <p className="text-red-500 mb-4">{error}</p>}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-gray-700">Nom</label>
                            <input
                                type="text"
                                name="nom"
                                value={formData.nom}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Prénom</label>
                            <input
                                type="text"
                                name="prenom"
                                value={formData.prenom}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Email</label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Téléphone</label>
                            <input
                                type="text"
                                name="telephone"
                                value={formData.telephone}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Service</label>
                            <input
                                type="text"
                                name="service"
                                value={formData.service}
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700">Photo de profil</label>
                            <input
                                type="file"
                                name="photo"
                                onChange={handleChange}
                                className="border p-2 rounded w-full"
                            />
                        </div>
                    </div>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded mt-4">
                        Mettre à jour
                    </button>
                </form>
            </div>
        </div>
    );
};

export default MedecinProfile;