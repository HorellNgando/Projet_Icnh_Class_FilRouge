import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest'
    },
    withCredentials: true
});

// Add a request interceptor
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Add a response interceptor
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            window.location.href = '/login-staff';
        }
        return Promise.reject(error);
    }
);

export const userService = {
    getAllUsers: async () => {
        try {
            const response = await api.get('/users');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getCurrentUser: async () => {
        try {
            const response = await api.get('/users/me');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateProfile: async (data) => {
        try {
            const response = await api.put('/users/profile', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    changePassword: async (data) => {
        try {
            const response = await api.put('/users/password', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePreferences: async (data) => {
        try {
            const response = await api.put('/users/preferences', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const patientService = {
    getAllPatients: async (params = {}) => {
        try {
            const response = await api.get('/patients', { params });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllPatientsList: async () => {
        try {
            console.log('Calling getAllPatientsList...');
            const response = await api.get('/patients', { params: { all: 'true' } });
            console.log('getAllPatientsList response:', response);
            return response.data;
        } catch (error) {
            console.error('getAllPatientsList error:', error);
            throw error;
        }
    },
    getPatientById: async (id) => {
        try {
            const response = await api.get(`/patients/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createPatient: async (data) => {
        try {
            const response = await api.post('/patients', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePatient: async (id, data) => {
        try {
            const response = await api.put(`/patients/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deletePatient: async (id) => {
        try {
            const response = await api.delete(`/patients/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const appointmentService = {
    getAllAppointments: async () => {
        try {
            const response = await api.get('/appointments');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAppointmentById: async (id) => {
        try {
            const response = await api.get(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createAppointment: async (data) => {
        try {
            const response = await api.post('/appointments', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateAppointment: async (id, data) => {
        try {
            const response = await api.put(`/appointments/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteAppointment: async (id) => {
        try {
            const response = await api.delete(`/appointments/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAvailableTimeSlots: async (doctorId, date) => {
        try {
            const response = await api.get('/appointments/available-slots', {
                params: { doctorId, date }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const medicalRecordService = {
    getAllRecords: async () => {
        try {
            const response = await api.get('/medical-records');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getRecordById: async (id) => {
        try {
            const response = await api.get(`/medical-records/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createRecord: async (data) => {
        try {
            const response = await api.post('/medical-records', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateRecord: async (id, data) => {
        try {
            const response = await api.put(`/medical-records/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteRecord: async (id) => {
        try {
            const response = await api.delete(`/medical-records/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getRecordsByPatient: async (patientId) => {
        try {
            const response = await api.get(`/medical-records/patient/${patientId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getRecordsByDoctor: async (doctorId) => {
        try {
            const response = await api.get(`/medical-records/doctor/${doctorId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const prescriptionService = {
    getAllPrescriptions: async () => {
        try {
            const response = await api.get('/prescriptions');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPrescriptionById: async (id) => {
        try {
            const response = await api.get(`/prescriptions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createPrescription: async (data) => {
        try {
            const response = await api.post('/prescriptions', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updatePrescription: async (id, data) => {
        try {
            const response = await api.put(`/prescriptions/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deletePrescription: async (id) => {
        try {
            const response = await api.delete(`/prescriptions/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPrescriptionsByPatient: async (patientId) => {
        try {
            const response = await api.get(`/prescriptions/patient/${patientId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getPrescriptionsByDoctor: async (doctorId) => {
        try {
            const response = await api.get(`/prescriptions/doctor/${doctorId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const medicationService = {
    getAllMedications: async () => {
        try {
            const response = await api.get('/medications');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getMedicationById: async (id) => {
        try {
            const response = await api.get(`/medications/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createMedication: async (data) => {
        try {
            const response = await api.post('/medications', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateMedication: async (id, data) => {
        try {
            const response = await api.put(`/medications/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteMedication: async (id) => {
        try {
            const response = await api.delete(`/medications/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateStock: async (id, quantity) => {
        try {
            const response = await api.put(`/medications/${id}/stock`, { quantity });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const billingService = {
    getAllBills: async () => {
        try {
            const response = await api.get('/billing');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getBillById: async (id) => {
        try {
            const response = await api.get(`/billing/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createBill: async (data) => {
        try {
            const response = await api.post('/billing', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateBill: async (id, data) => {
        try {
            const response = await api.put(`/billing/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteBill: async (id) => {
        try {
            const response = await api.delete(`/billing/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    downloadBill: async (id) => {
        try {
            const response = await api.get(`/billing/${id}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const notificationService = {
    getAllNotifications: async () => {
        try {
            const response = await api.get('/notifications');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    markAsRead: async (id) => {
        try {
            const response = await api.put(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    markAllAsRead: async () => {
        try {
            const response = await api.put('/notifications/read-all');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteNotification: async (id) => {
        try {
            const response = await api.delete(`/notifications/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const leaveRequestService = {
    getAllLeaveRequests: async () => {
        try {
            const response = await api.get('/leave-requests');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getLeaveRequestById: async (id) => {
        try {
            const response = await api.get(`/leave-requests/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createLeaveRequest: async (data) => {
        try {
            const response = await api.post('/leave-requests', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateLeaveRequest: async (id, data) => {
        try {
            const response = await api.put(`/leave-requests/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteLeaveRequest: async (id) => {
        try {
            const response = await api.delete(`/leave-requests/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    approveLeaveRequest: async (id) => {
        try {
            const response = await api.put(`/leave-requests/${id}/approve`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    rejectLeaveRequest: async (id) => {
        try {
            const response = await api.put(`/leave-requests/${id}/reject`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const noteService = {
    getAllNotes: async () => {
        try {
            const response = await api.get('/notes');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getNoteById: async (id) => {
        try {
            const response = await api.get(`/notes/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createNote: async (data) => {
        try {
            const response = await api.post('/notes', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateNote: async (id, data) => {
        try {
            const response = await api.put(`/notes/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteNote: async (id) => {
        try {
            const response = await api.delete(`/notes/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const reportService = {
    getAllReports: async () => {
        try {
            const response = await api.get('/reports');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getReportById: async (id) => {
        try {
            const response = await api.get(`/reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createReport: async (data) => {
        try {
            const response = await api.post('/reports', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateReport: async (id, data) => {
        try {
            const response = await api.put(`/reports/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteReport: async (id) => {
        try {
            const response = await api.delete(`/reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    downloadReport: async (id) => {
        try {
            const response = await api.get(`/reports/${id}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export const internReportService = {
    getAllInternReports: async () => {
        try {
            const response = await api.get('/intern-reports');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getInternReportById: async (id) => {
        try {
            const response = await api.get(`/intern-reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    createInternReport: async (data) => {
        try {
            const response = await api.post('/intern-reports', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateInternReport: async (id, data) => {
        try {
            const response = await api.put(`/intern-reports/${id}`, data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteInternReport: async (id) => {
        try {
            const response = await api.delete(`/intern-reports/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    downloadInternReport: async (id) => {
        try {
            const response = await api.get(`/intern-reports/${id}/download`, {
                responseType: 'blob'
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};

export default api; 