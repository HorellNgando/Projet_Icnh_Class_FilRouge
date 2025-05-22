import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { ThemeProvider } from './context/ThemeContext';
import PageTransition from './components/PageTransition';

// Layout
import Layout from './components/Layout';

// Pages publiques
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';

// Pages d'authentification
import Register from './pages/Register';
import Login from './pages/Login';
import LoginStaff from './pages/LoginStaff';
import VerifyInvitation from './pages/VerifyInvitation';
import RegisterStaff from './pages/RegisterStaff';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import VerifyCodePageB from './pages/VerifyCodePageB';
import ResetPasswordPage from './pages/ResetPasswordPage';

// Pages de tableau de bord
import AdminDashboard from './pages/admin/AdminDashboard';
import MedecinDashboard from './pages/medecin/MedecinDashboard';
import SecretaireDashboard from './pages/secretaire/SecretaireDashboard';
import InfirmierDashboard from './pages/infirmier/InfirmierDashboard';
import StagiaireDashboard from './pages/stagiaire/StagiaireDashboard';
import PatientDashboard from './pages/patient/PatientDashboard';
import MedicalRecord from './pages/patient/MedicalRecord';

// Composants communs
import Profile from './components/Profile';
import PatientList from './components/PatientList';
import PatientCreate from './components/PatientCreate';
import PatientDetails from './components/PatientDetails';
import PatientEdit from './components/PatientEdit';
import UserList from './components/Users/UserList';
import InviteStaff from './components/Users/InviteStaff';
import EditUser from './components/Users/EditUser';

// Composants de modules
import AppointmentList from './components/Appointments/AppointmentList';
import AppointmentCreate from './components/Appointments/AppointmentCreate';
import AppointmentDetails from './components/Appointments/AppointmentDetails';
import MedicalRecordList from './components/MedicalRecords/MedicalRecordList';
import MedicalRecordCreate from './components/MedicalRecords/MedicalRecordCreate';
import MedicalRecordDetails from './components/MedicalRecords/MedicalRecordDetails';
import PrescriptionList from './components/Prescriptions/PrescriptionList';
import PrescriptionCreate from './components/Prescriptions/PrescriptionCreate';
import PrescriptionDetails from './components/Prescriptions/PrescriptionDetails';
import LeaveRequestList from './components/Leaves/LeaveRequestList';
import LeaveRequestCreate from './components/Leaves/LeaveRequestCreate';
import LeaveRequestDetails from './components/Leaves/LeaveRequestDetails';
import NotificationList from './components/Notifications/NotificationList';
import ReportList from './components/Reports/ReportList';
import ReportCreate from './components/Reports/ReportCreate';
import ReportDetails from './components/Reports/ReportDetails';
import MedicationList from './components/Medications/MedicationList';
import MedicationCreate from './components/Medications/MedicationCreate';
import MedicationDetails from './components/Medications/MedicationDetails';
import NoteList from './components/Notes/NoteList';
import NoteCreate from './components/Notes/NoteCreate';
import NoteDetails from './components/Notes/NoteDetails';
import InternReportList from './components/InternReports/InternReportList';
import InternReportCreate from './components/InternReports/InternReportCreate';
import InternReportDetails from './components/InternReports/InternReportDetails';
import BillingList from './components/Billing/BillingList';
import BillingDetails from './components/Billing/BillingDetails';
import BillingCreate from './components/Billing/BillingCreate';
import Confidentialite from './pages/Confidentialite';
import Conditions from './pages/Conditions';

// Import des composants de gestion des congés
import LeaveList from './components/Leaves/LeaveList';
import LeaveForm from './components/Leaves/LeaveForm';
import LeaveDetails from './components/Leaves/LeaveDetails';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AnimatePresence mode="wait">
          <Routes>
            {/* Routes publiques */}
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/about" element={<PageTransition><About /></PageTransition>} />
            <Route path="/services" element={<PageTransition><Services /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/faq" element={<PageTransition><FAQ /></PageTransition>} />
            {/* Routes d'authentification */}
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/login-staff" element={<PageTransition><LoginStaff /></PageTransition>} />
            <Route path="/verify-invitation" element={<PageTransition><VerifyInvitation /></PageTransition>} />
            <Route path="/register-staff" element={<PageTransition><RegisterStaff /></PageTransition>} />
            <Route path="/forgot-password" element={<PageTransition><ForgotPasswordPage /></PageTransition>} />
            <Route path="/verifyCode" element={<PageTransition><VerifyCodePageB /></PageTransition>} />
            <Route path="/reset-password" element={<PageTransition><ResetPasswordPage /></PageTransition>} />

            {/* Routes Admin */}
            <Route path="/dashboard/admin" element={<Layout><PageTransition><AdminDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/patients" element={<Layout><PageTransition><PatientList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/patients/create" element={<Layout><PageTransition><PatientCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/patients/:id" element={<Layout><PageTransition><PatientDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/patients/edit/:id" element={<Layout><PageTransition><PatientEdit /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/users" element={<Layout><PageTransition><UserList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/users/invite" element={<Layout><PageTransition><InviteStaff /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/users/:id/edit" element={<Layout><PageTransition><EditUser /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/appointments" element={<Layout><PageTransition><AppointmentList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/appointments/create" element={<Layout><PageTransition><AppointmentCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/appointments/:id" element={<Layout><PageTransition><AppointmentDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medical-records" element={<Layout><PageTransition><MedicalRecordList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medical-records/create" element={<Layout><PageTransition><MedicalRecordCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medical-records/:id" element={<Layout><PageTransition><MedicalRecordDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/prescriptions" element={<Layout><PageTransition><PrescriptionList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/prescriptions/create" element={<Layout><PageTransition><PrescriptionCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/prescriptions/:id" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/prescriptions/:id/edit" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/leaves" element={<Layout><PageTransition><LeaveList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/leaves/create" element={<Layout><PageTransition><LeaveRequestCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/leaves/:id" element={<Layout><PageTransition><LeaveRequestDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/notifications" element={<Layout><PageTransition><NotificationList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/reports" element={<Layout><PageTransition><ReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/reports/create" element={<Layout><PageTransition><ReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/reports/:id" element={<Layout><PageTransition><ReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medications" element={<Layout><PageTransition><MedicationList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medications/create" element={<Layout><PageTransition><MedicationCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/medications/:id" element={<Layout><PageTransition><MedicationDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/notes/create" element={<Layout><PageTransition><NoteCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/intern-reports" element={<Layout><PageTransition><InternReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/intern-reports/create" element={<Layout><PageTransition><InternReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/intern-reports/:id" element={<Layout><PageTransition><InternReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/billing" element={<Layout><PageTransition><BillingList /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/billing/create" element={<Layout><PageTransition><BillingCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/admin/billing/:id" element={<Layout><PageTransition><BillingDetails /></PageTransition></Layout>} />

            {/* Routes Médecin */}
            <Route path="/dashboard/medecin" element={<Layout><PageTransition><MedecinDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/patients" element={<Layout><PageTransition><PatientList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/patients/:id" element={<Layout><PageTransition><PatientDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/patients/edit/:id" element={<Layout><PageTransition><PatientEdit /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/appointments" element={<Layout><PageTransition><AppointmentList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/appointments/create" element={<Layout><PageTransition><AppointmentCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/appointments/:id" element={<Layout><PageTransition><AppointmentDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/prescriptions" element={<Layout><PageTransition><PrescriptionList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/prescriptions/create" element={<Layout><PageTransition><PrescriptionCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/prescriptions/:id" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/prescriptions/:id/edit" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/notes/create" element={<Layout><PageTransition><NoteCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/leaves" element={<Layout><PageTransition><LeaveList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/leaves/new" element={<Layout><PageTransition><LeaveForm /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/leaves/:id" element={<Layout><PageTransition><LeaveDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/notifications" element={<Layout><PageTransition><NotificationList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/reports" element={<Layout><PageTransition><ReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/reports/create" element={<Layout><PageTransition><ReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/reports/:id" element={<Layout><PageTransition><ReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/medical-records" element={<Layout><PageTransition><MedicalRecordList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/medical-records/create" element={<Layout><PageTransition><MedicalRecordCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/medical-records/:id" element={<Layout><PageTransition><MedicalRecordDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/medications" element={<Layout><PageTransition><MedicationList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/medications/:id" element={<Layout><PageTransition><MedicationDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/intern-reports" element={<Layout><PageTransition><InternReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/intern-reports/create" element={<Layout><PageTransition><InternReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/medecin/intern-reports/:id" element={<Layout><PageTransition><InternReportDetails /></PageTransition></Layout>} />

            {/* Routes Infirmier */}
            <Route path="/dashboard/infirmier" element={<Layout><PageTransition><InfirmierDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/patients" element={<Layout><PageTransition><PatientList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/patients/create" element={<Layout><PageTransition><PatientCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/patients/:id" element={<Layout><PageTransition><PatientDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/patients/edit/:id" element={<Layout><PageTransition><PatientEdit /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/notes/create" element={<Layout><PageTransition><NoteCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/leaves" element={<Layout><PageTransition><LeaveList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/leaves/new" element={<Layout><PageTransition><LeaveForm /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/leaves/:id" element={<Layout><PageTransition><LeaveDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/notifications" element={<Layout><PageTransition><NotificationList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/reports" element={<Layout><PageTransition><ReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/reports/create" element={<Layout><PageTransition><ReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/reports/:id" element={<Layout><PageTransition><ReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/medical-records" element={<Layout><PageTransition><MedicalRecordList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/medical-records/:id" element={<Layout><PageTransition><MedicalRecordDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/prescriptions" element={<Layout><PageTransition><PrescriptionList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/prescriptions/:id" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/medications" element={<Layout><PageTransition><MedicationList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/medications/:id" element={<Layout><PageTransition><MedicationDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/intern-reports" element={<Layout><PageTransition><InternReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/intern-reports/create" element={<Layout><PageTransition><InternReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/infirmier/intern-reports/:id" element={<Layout><PageTransition><InternReportDetails /></PageTransition></Layout>} />

            {/* Routes Stagiaire */}
            <Route path="/dashboard/stagiaire" element={<Layout><PageTransition><StagiaireDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/patients" element={<Layout><PageTransition><PatientList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/patients/create" element={<Layout><PageTransition><PatientCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/patients/:id" element={<Layout><PageTransition><PatientDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/patients/edit/:id" element={<Layout><PageTransition><PatientEdit /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/notes/create" element={<Layout><PageTransition><NoteCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/leaves" element={<Layout><PageTransition><LeaveList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/leaves/new" element={<Layout><PageTransition><LeaveForm /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/leaves/:id" element={<Layout><PageTransition><LeaveDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/notifications" element={<Layout><PageTransition><NotificationList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/reports" element={<Layout><PageTransition><ReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/reports/create" element={<Layout><PageTransition><ReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/reports/:id" element={<Layout><PageTransition><ReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/medical-records" element={<Layout><PageTransition><MedicalRecordList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/medical-records/create" element={<Layout><PageTransition><MedicalRecordCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/medical-records/:id" element={<Layout><PageTransition><MedicalRecordDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/medications" element={<Layout><PageTransition><MedicationList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/medications/:id" element={<Layout><PageTransition><MedicationDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/intern-reports" element={<Layout><PageTransition><InternReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/intern-reports/create" element={<Layout><PageTransition><InternReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/stagiaire/intern-reports/:id" element={<Layout><PageTransition><InternReportDetails /></PageTransition></Layout>} />

            {/* Routes Secrétaire */}
            <Route path="/dashboard/secretaire" element={<Layout><PageTransition><SecretaireDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/appointments" element={<Layout><PageTransition><AppointmentList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/appointments/create" element={<Layout><PageTransition><AppointmentCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/appointments/:id" element={<Layout><PageTransition><AppointmentDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/patients/create" element={<Layout><PageTransition><PatientCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/billing" element={<Layout><PageTransition><BillingList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/billing/create" element={<Layout><PageTransition><BillingCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/billing/:id" element={<Layout><PageTransition><BillingDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/notes/create" element={<Layout><PageTransition><NoteCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/leaves" element={<Layout><PageTransition><LeaveList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/leaves/new" element={<Layout><PageTransition><LeaveForm /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/leaves/:id" element={<Layout><PageTransition><LeaveDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/notifications" element={<Layout><PageTransition><NotificationList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/reports" element={<Layout><PageTransition><ReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/reports/create" element={<Layout><PageTransition><ReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/reports/:id" element={<Layout><PageTransition><ReportDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/intern-reports" element={<Layout><PageTransition><InternReportList /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/intern-reports/create" element={<Layout><PageTransition><InternReportCreate /></PageTransition></Layout>} />
            <Route path="/dashboard/secretaire/intern-reports/:id" element={<Layout><PageTransition><InternReportDetails /></PageTransition></Layout>} />

            {/* Routes Patient */}
            <Route path="/dashboard/patient" element={<Layout><PageTransition><PatientDashboard /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/profile" element={<Layout><PageTransition><Profile /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/appointments" element={<Layout><PageTransition><AppointmentList /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/medical-record" element={<Layout><PageTransition><MedicalRecord /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/billing" element={<Layout><PageTransition><BillingList /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/prescriptions" element={<Layout><PageTransition><PrescriptionList /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/prescriptions/:id" element={<Layout><PageTransition><PrescriptionDetails /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/notes" element={<Layout><PageTransition><NoteList /></PageTransition></Layout>} />
            <Route path="/dashboard/patient/notes/:id" element={<Layout><PageTransition><NoteDetails /></PageTransition></Layout>} />
            <Route path="/confidentialite" element={<PageTransition><Confidentialite /></PageTransition>} />
            <Route path="/conditions" element={<PageTransition><Conditions /></PageTransition>} />
          </Routes>
        </AnimatePresence>
      </Router>
    </ThemeProvider>
  );
}

export default App;