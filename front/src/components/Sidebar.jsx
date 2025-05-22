import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
    FaHome, 
    FaUserMd, 
    FaUserNurse, 
    FaUserGraduate, 
    FaUser, 
    FaSignOutAlt, 
    FaIdCard,
    FaCalendarAlt,
    FaFileMedical,
    FaPrescriptionBottle,
    FaCalendarCheck,
    FaBell,
    FaChartBar,
    FaPills,
    FaStickyNote,
    FaFileAlt,
    FaFileInvoiceDollar,
    FaUsers,
    FaUserPlus,
    FaUserCog
} from 'react-icons/fa';
import '../styles/common.css';

const Sidebar = ({ user }) => {
    const navigate = useNavigate();

    const menuItems = {
        admin: [
            { to: '/dashboard/admin', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/admin/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/admin/patients', label: 'Patients', icon: <FaUsers /> },
            { to: '/dashboard/admin/users', label: 'Utilisateurs', icon: <FaUserCog /> },
            { to: '/dashboard/admin/appointments', label: 'Rendez-vous', icon: <FaCalendarAlt /> },
            { to: '/dashboard/admin/medical-records', label: 'Dossiers médicaux', icon: <FaFileMedical /> },
            { to: '/dashboard/admin/prescriptions', label: 'Ordonnances', icon: <FaPrescriptionBottle /> },
            { to: '/dashboard/admin/leaves', label: 'Congés', icon: <FaCalendarCheck /> },
            { to: '/dashboard/admin/notifications', label: 'Notifications', icon: <FaBell /> },
            { to: '/dashboard/admin/reports', label: 'Rapports', icon: <FaChartBar /> },
            { to: '/dashboard/admin/medications', label: 'Médicaments', icon: <FaPills /> },
            { to: '/dashboard/admin/notes', label: 'Notes', icon: <FaStickyNote /> },
            { to: '/dashboard/admin/intern-reports', label: 'Rapports de stage', icon: <FaFileAlt /> },
            { to: '/dashboard/admin/billing', label: 'Facturation', icon: <FaFileInvoiceDollar /> }
        ],
        medecin: [
            { to: '/dashboard/medecin', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/medecin/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/medecin/patients', label: 'Patients', icon: <FaUsers /> },
            { to: '/dashboard/medecin/appointments', label: 'Rendez-vous', icon: <FaCalendarAlt /> },
            { to: '/dashboard/medecin/prescriptions', label: 'Ordonnances', icon: <FaPrescriptionBottle /> },
            { to: '/dashboard/medecin/notes', label: 'Notes', icon: <FaStickyNote /> },
            { to: '/dashboard/medecin/leaves', label: 'Congés', icon: <FaCalendarCheck /> },
            { to: '/dashboard/medecin/notifications', label: 'Notifications', icon: <FaBell /> },
            { to: '/dashboard/medecin/reports', label: 'Rapports', icon: <FaChartBar /> },
            { to: '/dashboard/medecin/medical-records', label: 'Dossiers médicaux', icon: <FaFileMedical /> },
            { to: '/dashboard/medecin/medications', label: 'Médicaments', icon: <FaPills /> },
            { to: '/dashboard/medecin/intern-reports', label: 'Rapports de stage', icon: <FaFileAlt /> }
        ],
        infirmier: [
            { to: '/dashboard/infirmier', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/infirmier/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/infirmier/patients', label: 'Patients', icon: <FaUsers /> },
            { to: '/dashboard/infirmier/notes', label: 'Notes', icon: <FaStickyNote /> },
            { to: '/dashboard/infirmier/leaves', label: 'Congés', icon: <FaCalendarCheck /> },
            { to: '/dashboard/infirmier/notifications', label: 'Notifications', icon: <FaBell /> },
            { to: '/dashboard/infirmier/reports', label: 'Rapports', icon: <FaChartBar /> },
            { to: '/dashboard/infirmier/medical-records', label: 'Dossiers médicaux', icon: <FaFileMedical /> },
            { to: '/dashboard/infirmier/prescriptions', label: 'Ordonnances', icon: <FaPrescriptionBottle /> },
            { to: '/dashboard/infirmier/medications', label: 'Médicaments', icon: <FaPills /> },
            { to: '/dashboard/infirmier/intern-reports', label: 'Rapports de stage', icon: <FaFileAlt /> }
        ],
        stagiaire: [
            { to: '/dashboard/stagiaire', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/stagiaire/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/stagiaire/patients', label: 'Patients', icon: <FaUsers /> },
            { to: '/dashboard/stagiaire/notes', label: 'Notes', icon: <FaStickyNote /> },
            { to: '/dashboard/stagiaire/leaves', label: 'Congés', icon: <FaCalendarCheck /> },
            { to: '/dashboard/stagiaire/notifications', label: 'Notifications', icon: <FaBell /> },
            { to: '/dashboard/stagiaire/reports', label: 'Rapports', icon: <FaChartBar /> },
            { to: '/dashboard/stagiaire/medical-records', label: 'Dossiers médicaux', icon: <FaFileMedical /> },
            { to: '/dashboard/stagiaire/medications', label: 'Médicaments', icon: <FaPills /> },
            { to: '/dashboard/stagiaire/intern-reports', label: 'Rapports de stage', icon: <FaFileAlt /> }
        ],
        secretaire: [
            { to: '/dashboard/secretaire', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/secretaire/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/secretaire/appointments', label: 'Rendez-vous', icon: <FaCalendarAlt /> },
            { to: '/dashboard/secretaire/patients/create', label: 'Nouveau patient', icon: <FaUserPlus /> },
            { to: '/dashboard/secretaire/billing', label: 'Facturation', icon: <FaFileInvoiceDollar /> },
            { to: '/dashboard/secretaire/notes', label: 'Notes', icon: <FaStickyNote /> },
            { to: '/dashboard/secretaire/leaves', label: 'Congés', icon: <FaCalendarCheck /> },
            { to: '/dashboard/secretaire/notifications', label: 'Notifications', icon: <FaBell /> },
            { to: '/dashboard/secretaire/reports', label: 'Rapports', icon: <FaChartBar /> },
            { to: '/dashboard/secretaire/intern-reports', label: 'Rapports de stage', icon: <FaFileAlt /> }
        ],
        patient: [
            { to: '/dashboard/patient', label: 'Tableau de bord', icon: <FaHome /> },
            { to: '/dashboard/patient/profile', label: 'Mon Profil', icon: <FaIdCard /> },
            { to: '/dashboard/patient/appointments', label: 'Rendez-vous', icon: <FaCalendarAlt /> },
            { to: '/dashboard/patient/medical-record', label: 'Dossiers médicaux', icon: <FaFileMedical /> },
            { to: '/dashboard/patient/billing', label: 'Facturation', icon: <FaFileInvoiceDollar /> },
            { to: '/dashboard/patient/prescriptions', label: 'Ordonnances', icon: <FaPrescriptionBottle /> },
            { to: '/dashboard/patient/notes', label: 'Notes', icon: <FaStickyNote /> }
        ]
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        navigate('/login-staff');
    };

    const getInitials = (name, surname) => {
        return `${name?.charAt(0) || ''}${surname?.charAt(0) || ''}`.toUpperCase();
    };

    const colors = ['#4F46E5', '#7C3AED', '#EC4899', '#F59E0B', '#10B981', '#3B82F6'];
    const colorIndex = (user?.name?.length || 0) % colors.length;
    const bgColor = colors[colorIndex];

    return (
        <div className="fixed h-screen w-64 bg-white shadow-lg flex flex-col">
            {/* En-tête fixe */}
            <div className="p-4 border-b">
                <div className="flex items-center space-x-3">
                    {user?.photo ? (
                        <img
                            src={user.photo}
                            alt="Profile"
                            className="w-10 h-10 rounded-full"
                        />
                    ) : (
                        <div
                            className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                            style={{ backgroundColor: bgColor }}
                        >
                            {getInitials(user?.name, user?.surname)}
                        </div>
                    )}
                    <div>
                        <h2 className="font-semibold text-gray-800">{user?.name} {user?.surname}</h2>
                        <p className="text-sm text-gray-600">{user?.role}</p>
                        <p className="text-xs text-gray-500">ID: {user?.identifier}</p>
                    </div>
                </div>
            </div>

            {/* Section des onglets scrollable */}
            <div className="flex-1 overflow-y-auto">
                <nav className="p-4">
                    {menuItems[user?.role]?.map((item, index) => (
                        <Link
                            key={index}
                            to={item.to}
                            className="flex items-center space-x-3 px-4 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                        >
                            {item.icon}
                            <span>{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>

            {/* Bouton de déconnexion fixe */}
            <div className="p-4 border-t">
                <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200"
                >
                    <FaSignOutAlt />
                    <span>Déconnexion</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;