import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const AdminPatients = () => {
    const [patients, setPatients] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [doctorFilter, setDoctorFilter] = useState('');

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/admin/patients', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { page: currentPage, search, doctor: doctorFilter },
                });
                setPatients(response.data.data);
                setTotalPages(response.data.last_page);
            } catch (err) {
                console.error('Erreur lors du chargement des patients', err);
            }
        };
        fetchPatients();
    }, [currentPage, search, doctorFilter]);

    const handleSearch = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1);
    };

    const handleDoctorFilter = (e) => {
        setDoctorFilter(e.target.value);
        setCurrentPage(1);
    };

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text('Liste des patients - Clinique de Bali Dr WONDJE', 10, 10);
        doc.setFontSize(12);
        let y = 20;

        patients.forEach((patient, index) => {
            const text = `${index + 1}. ID: ${patient.id} | Nom: ${patient.nom} | Date de naissance: ${patient.date_de_naissance} | Admission: ${patient.date_admission} | Docteur: ${patient.docteur} | Chambre: ${patient.chambre} | Statut: ${patient.statut}`;
            doc.text(text, 10, y);
            y += 10;
            if (y > 280) { // Ajouter une nouvelle page si nécessaire
                doc.addPage();
                y = 10;
            }
        });

        doc.save('liste_patients.pdf');
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar role="admin" />
            <div className="flex-1 ml-0 md:ml-64 p-4 overflow-auto">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold mb-2 sm:mb-0">Gestion des patients</h1>
                    <div className="flex space-x-2">
                        <button onClick={exportToPDF} className="text-blue-600 flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13.586 2H6.414A2 2 0 004 4v12a2 2 0 002 2h7.172a2 2 0 001.414-.586l3.828-3.828A2 2 0 0020 12V4a2 2 0 00-2-2h-4.414zM16 14h-2a2 2 0 01-2 2v2h-2V4h6v10zM6 16h4v-2H6v2zm0-4h8v-2H6v2zm0-4h8V6H6v2z" />
                            </svg>
                            Exporter en PDF
                        </button>
                        <Link to="/admin/patients/add" className="bg-blue-600 text-white px-4 py-2 rounded flex items-center">
                            <svg className="w-5 h-5 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9h2v4H9V7zm0 6h2v2H9v-2z" />
                            </svg>
                            Ajouter un patient
                        </Link>
                    </div>
                </div>

                {/* Recherche */}
                <div className="bg-white p-4 rounded-lg shadow mb-4">
                    <h3 className="text-lg font-semibold mb-2">Recherche de patients</h3>
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        <div className="flex-1 mb-2 sm:mb-0">
                            <label className="block text-gray-700 mb-1">Recherche par nom, ID ou médecin</label>
                            <input
                                type="text"
                                value={search}
                                onChange={handleSearch}
                                placeholder="Recherche d’un patient"
                                className="border p-2 rounded w-full"
                            />
                        </div>
                        <div className="mb-2 sm:mb-0">
                            <label className="block text-gray-700 mb-1">Médecins</label>
                            <select
                                value={doctorFilter}
                                onChange={handleDoctorFilter}
                                className="border p-2 rounded w-full sm:w-auto"
                            >
                                <option value="">Tous</option>
                                <option value="Dr Ndoumbe">Dr Ndoumbe</option>
                                <option value="Dr Misse">Dr Misse</option>
                                <option value="Dr Wondje">Dr Wondje</option>
                                <option value="Dr Etoke">Dr Etoke</option>
                            </select>
                        </div>
                        <button className="bg-gray-200 px-4 py-2 rounded w-full sm:w-auto">Rechercher</button>
                    </div>
                </div>

                {/* Liste des patients */}
                <div className="bg-white p-4 rounded-lg shadow overflow-x-auto">
                    <h3 className="text-lg font-semibold mb-2">Liste des patients</h3>
                    <p className="text-gray-600 mb-4">Montrer 5 patients</p>
                    <table className="w-full min-w-max">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 text-left">ID</th>
                                <th className="p-2 text-left">Nom</th>
                                <th className="p-2 text-left">Date de naissance</th>
                                <th className="p-2 text-left">Date d’admission</th>
                                <th className="p-2 text-left">Docteur</th>
                                <th className="p-2 text-left">Chambre</th>
                                <th className="p-2 text-left">Statut</th>
                                <th className="p-2 text-left">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {patients.map((patient, index) => (
                                <tr key={index} className="border-b">
                                    <td className="p-2">{patient.id}</td>
                                    <td className="p-2">{patient.nom}</td>
                                    <td className="p-2">{patient.date_de_naissance}</td>
                                    <td className="p-2">{patient.date_admission}</td>
                                    <td className="p-2">{patient.docteur}</td>
                                    <td className="p-2">{patient.chambre}</td>
                                    <td className="p-2">
                                        <span
                                            className={`px-2 py-1 rounded ${
                                                patient.statut === 'En cours'
                                                    ? 'bg-green-100 text-green-600'
                                                    : 'bg-blue-100 text-blue-600'
                                            }`}
                                        >
                                            {patient.statut}
                                        </span>
                                    </td>
                                    <td className="p-2 flex space-x-2">
                                        <Link to={`/patient/${patient.id}`} className="text-blue-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9h2v4H9V7zm0 6h2v2H9v-2z" />
                                            </svg>
                                        </Link>
                                        <button className="text-blue-600">
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M13.586 2H6.414A2 2 0 004 4v12a2 2 0 002 2h7.172a2 2 0 001.414-.586l3.828-3.828A2 2 0 0020 12V4a2 2 0 00-2-2h-4.414zM16 14h-2a2 2 0 01-2 2v2h-2V4h6v10zM6 16h4v-2H6v2zm0-4h8v-2H6v2zm0-4h8V6H6v2z" />
                                            </svg>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mt-4">
                        <button
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                            className="text-blue-600 mb-2 sm:mb-0"
                        >
                            ← Previous
                        </button>
                        <div className="flex space-x-2 overflow-x-auto">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded ${
                                        currentPage === i + 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                            className="text-blue-600 mt-2 sm:mt-0"
                        >
                            Next →
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminPatients;