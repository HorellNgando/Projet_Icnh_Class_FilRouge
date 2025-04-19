import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import About from './Pages/About';
import Contact from './Pages/Contact';
import FAQ from './Pages/FAQ';
import Services from './Pages/Services';
import Team from './Pages/Team';
import Login from './Pages/Login';
import Register from './Pages/Register';
import AdminLogin from './Pages/admin/AdminLogin';
import AdminDashboard from './Pages/admin/AdminDashboard';
import AdminPatients from './Pages/admin/AdminPatients';
import AdminAppointments from './Pages/admin/AdminAppointments';
import PatientDashboard from './Pages/patient/PatientDashboard';
import PatientRecord from './Pages/patient/PatientRecord';
import ProtectedRoute from './components/ProtectedRoute';
import MedecinDashboard from './Pages/medecin/MedecinDashboard';
import MedecinProfile from './Pages/medecin/MedecinProfile';
import AddPatient from './Pages/infirmier/AddPatient';
import InfirmierDashboard from './Pages/infirmier/InfirmierDashboard';
import AddStaff from './Pages/admin/AddStaff';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="/services" element={<Services />} />
                <Route path="/team" element={<Team />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/add-staff" element={<AddStaff />} />
                <Route path="/medecin/dashboard" element={<MedecinDashboard />} />
                <Route path="/medecin/profil" element={<MedecinProfile />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/infirmier/add-patient" element={<AddPatient />} />

                <Route path="/infirmier/dashboard" element={<InfirmierDashboard />} />
                
                <Route
                    path="/admin/dashboard"
                    element={
                        // <ProtectedRoute role="admin">
                            <AdminDashboard />
                        // </ProtectedRoute>
                    }
                />
                <Route
                    path="/admin/patients"
                    element={
                        // <ProtectedRoute role="admin">
                            <AdminPatients />
                        // </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/dashboard"
                    element={
                        // <ProtectedRoute role="patient">
                            <PatientDashboard />
                        // </ProtectedRoute>
                    }
                />
                <Route
                    path="/patient/:id"
                    element={
                        // <ProtectedRoute role={['admin', 'patient']}>
                            <PatientRecord />
                        // </ProtectedRoute>
                    }
                />
            </Routes>
        </Router>
    );
};

export default App;