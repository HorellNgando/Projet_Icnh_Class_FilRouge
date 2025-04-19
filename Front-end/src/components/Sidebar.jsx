import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LuLogOut } from "react-icons/lu";
import { FaUser, FaUserInjured, FaUserMd, FaCalendarAlt, FaAmbulance  } from "react-icons/fa";
import { MdDashboard, MdOutlinePayment  } from "react-icons/md";
import { FaHospitalUser } from "react-icons/fa6";
import { GiHamburgerMenu } from "react-icons/gi";


const Sidebar = ({ role }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [profilePhoto, setProfilePhoto] = useState(null);
    const navigate = useNavigate();
    // const user = JSON.parse(localStorage.getItem('user'));
    // const role = localStorage.getItem('role');

    // if (!user || !role) {
    //     navigate('/login');
    //     return null;
    // }

    useEffect(() => {
        // Charger la photo de profil depuis le back-end
        const fetchProfilePhoto = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:8000/api/user/profile', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setProfilePhoto(response.data.profile_photo || '/default-profile.png');
            } catch (err) {
                console.error('Erreur lors du chargement de la photo de profil', err);
            }
        };
        fetchProfilePhoto();
    }, []);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const formData = new FormData();
            formData.append('profile_photo', file);
            try {
                const token = localStorage.getItem('token');
                const response = await axios.post('http://localhost:8000/api/user/profile/photo', formData, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    },
                });
                setProfilePhoto(response.data.profile_photo);
            } catch (err) {
                console.error('Erreur lors de la mise à jour de la photo de profil', err);
            }
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        navigate(role === 'admin' ? '/admin/login' : '/login');
    };

    return (
        <>
            {/* Burger Menu pour mobile */}
            <div className="md:hidden fixed top-5 left-5 font-extrabold">
                <button onClick={() => setIsOpen(true)} className="text-black">
                 <GiHamburgerMenu />
                </button>
            </div>

            {/* Sidebar */}
            <div
                className={`fixed top-0 left-0 h-full bg-blue-900 text-white w-64 transform transition-transform ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                } md:translate-x-0 z-40`}
            >
                <div className="p-4">
                    {/* Logo */}
                    <div className="flex items-center mb-6">
                        <img src="/images/CLINIQUE DE BALI.png" alt="Logo" className="h-10 w-10 mr-2" />
                        <span className="text-lg font-bold">Clinique de Bali</span>
                    </div>

                    {/* Photo de profil */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="relative">
                            <img
                                src={profilePhoto}
                                alt="Photo de profil"
                                className="w-16 h-16 rounded-full object-cover"
                            />
                            <label
                                htmlFor="photo-upload"
                                className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 cursor-pointer"
                            >
                                <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M13.586 2H6.414A2 2 0 004 4v12a2 2 0 002 2h7.172a2 2 0 001.414-.586l3.828-3.828A2 2 0 0020 12V4a2 2 0 00-2-2h-4.414zM16 14h-2a2 2 0 01-2 2v2h-2V4h6v10zM6 16h4v-2H6v2zm0-4h8v-2H6v2zm0-4h8V6H6v2z" />
                                </svg>
                            </label>
                            <input
                                id="photo-upload"
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoChange}
                            />
                        </div>
                        {/* <span className="mt-2">{user.nom} {user.prenom}</span>
                        <span className="text-sm">
                            {role === 'admin' ? 'Administrateur' :
                            role === 'medecin' ? 'Médecin' :
                            role === 'infirmier' ? 'Infirmier' :
                            'Patient'}
                        </span> */}
                    </div>

                    {/* Bouton de fermeture sur mobile */}
                    <div className="md:hidden absolute top-4 right-4">
                        <button onClick={() => setIsOpen(false)} className="text-white">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Menu */}
                    <nav className="space-y-2">
                        <Link
                            to={
                                role === 'admin' ? '/admin/dashboard' :
                                role === 'medecin' ? '/medecin/dashboard' :
                                role === 'infirmier' ? '/infirmier/dashboard' :
                                '/patient/dashboard'
                            }
                            className="flex items-center p-2 hover:bg-blue-700 rounded text-xl"
                        >
                            <MdDashboard className="mr-3" />
                            Tableau de bord
                        </Link>
                        {role === 'admin' && (
                            <>
                                <Link to="/admin/profil" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUser className="mr-3" />
                                    Profil
                                </Link>

                                <Link to="/admin/patients" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUserInjured className="mr-3" />
                                    Patients
                                </Link>
                                <Link to="/admin/staff" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUserMd className="mr-3" />
                                    Personnel
                                </Link>
                                <Link to="/admin/appointments" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaCalendarAlt className="mr-3" />
                                    Rendez-vous
                                </Link>
                                <Link to="/admin/records" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaHospitalUser className="mr-3" />
                                    Dossiers médicaux
                                </Link>
                                <Link to="/admin/emergencies" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaAmbulance className="mr-3" />
                                    Urgences & Lits
                                </Link>
                                {/* <Link to="/admin/stocks" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9h2v4H9V7zm0 6h2v2H9v-2z" />
                                    </svg>
                                    Stocks & Pharmacie
                                </Link> */}
                                <Link to="/admin/billing" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <MdOutlinePayment className="mr-3" />
                                    Facturation
                                </Link>
                            </>
                        )}
                        {role === 'patient' && (
                            <>
                                <Link to="/patient/profil" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUser className="mr-3" />
                                    Profil
                                </Link>

                                <Link to="/patient/appointments" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaCalendarAlt className="mr-3" />
                                    Rendez - Vous
                                </Link>
                                <Link to="/patient/record" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaHospitalUser className="mr-3" />
                                    Dossier medical
                                </Link>
                                <Link to="/patient/payments" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <MdOutlinePayment className="mr-3" />
                                    Paiements & Factures
                                </Link>
                                {/* <Link to="/patient/activity" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-9h2v4H9V7zm0 6h2v2H9v-2z" />
                                    </svg>
                                    Activité santé
                                </Link> */}
                            </>
                        )}

                        {role === 'medecin' && (
                            <>
                                <Link to="/medecin/profil" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUser className="mr-3" />
                                    Profil
                                </Link>
                                <Link to="/medecin/appointments" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaCalendarAlt className="mr-3" />
                                    Rendez - Vous
                                </Link>
                                <Link to="/medecin/patient" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUserInjured className="mr-3" />
                                    Patient
                                </Link>
                                
                            </>
                        )}

                        {role === 'infirmier' && (
                            <>
                                <Link to="/infirmier/profil" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUser className="mr-3" />
                                    Profil
                                </Link>
                                <Link to="/infirmier/patient" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaUserInjured className="mr-3" />
                                    Patient
                                </Link>
                                <Link to="/infirmier/appointments" className="flex items-center p-2 hover:bg-blue-700 rounded text-lg">
                                    <FaCalendarAlt className="mr-3" />
                                    Rendez - Vous
                                </Link>
                            </>
                        )}
                        <button
                            onClick={handleLogout}
                            className="flex items-center justify-center mt-auto  bg-blue-950 p-2 hover:bg-blue-700 rounded w-full text-lg"
                        >
                            <LuLogOut className="mr-3" />
                            Déconnexion
                        </button>
                    </nav>
                </div>
            </div>

            {/* Overlay pour mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black opacity-50 md:hidden z-30"
                    onClick={() => setIsOpen(false)}
                ></div>
            )}
        </>
    );
};

export default Sidebar;