<?php
use App\Http\Controllers\AuthController;
use App\Http\Controllers\InvitationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\AppointmentController;
use App\Http\Controllers\MedicalRecordController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\BillingController;
use App\Http\Controllers\LeaveRequestController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\MedicationController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\InternReportController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// CSRF cookie route
Route::get('/sanctum/csrf-cookie', function (Request $request) {
    return response()->noContent();
});

Route::prefix('')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/login-staff', [AuthController::class, 'loginStaff']);
    // Forgot Password
    Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
    // Verify Code
    Route::post('/verify-code', [AuthController::class, 'verifyCode']);
    // Reset Password
    Route::post('/reset-password', [AuthController::class, 'resetPassword']);

    Route::post('/invite', [InvitationController::class, 'sendInvitation'])->middleware('auth:sanctum');
    Route::post('/verify-invitation', [InvitationController::class, 'verifyInvitation']);
    Route::post('/register-staff', [InvitationController::class, 'registerStaff']);

    Route::middleware('auth:sanctum')->group(function () {
        // Patients routes
        Route::get('/patients', [PatientController::class, 'index']);
        Route::post('/patients', [PatientController::class, 'store']);
        Route::get('/patients/me', [PatientController::class, 'getMyPatientData']);
        Route::get('/patients/{patient}', [PatientController::class, 'show']);
        Route::put('/patients/{patient}', [PatientController::class, 'update']);
        Route::delete('/patients/{patient}', [PatientController::class, 'destroy']);
        Route::get('/patients/export/pdf', [PatientController::class, 'exportPDF']);
        Route::get('/patients/export/excel', [PatientController::class, 'exportExcel']);
        Route::get('/patients/{patient}/medical-record/pdf', [PatientController::class, 'exportMedicalRecordPDF']);
        Route::get('/doctors/active', [PatientController::class, 'getActiveDoctors']);
        Route::get('/medecin/{doctor}/patients', [PatientController::class, 'getDoctorPatients']);

        // Appointments routes
        Route::get('/appointments', [AppointmentController::class, 'index']);
        Route::post('/appointments', [AppointmentController::class, 'store']);
        Route::get('/appointments/{appointment}', [AppointmentController::class, 'show']);
        Route::put('/appointments/{appointment}', [AppointmentController::class, 'update']);
        Route::delete('/appointments/{appointment}', [AppointmentController::class, 'destroy']);

        // Medical Records routes
        Route::get('/medical-records', [MedicalRecordController::class, 'index']);
        Route::post('/medical-records', [MedicalRecordController::class, 'store']);
        Route::get('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'show']);
        Route::put('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'update']);
        Route::delete('/medical-records/{medicalRecord}', [MedicalRecordController::class, 'destroy']);

        // Prescriptions routes
        Route::get('/prescriptions', [PrescriptionController::class, 'index']);
        Route::post('/prescriptions', [PrescriptionController::class, 'store']);
        Route::get('/prescriptions/{prescription}', [PrescriptionController::class, 'show']);
        Route::put('/prescriptions/{prescription}', [PrescriptionController::class, 'update']);
        Route::delete('/prescriptions/{prescription}', [PrescriptionController::class, 'destroy']);
        Route::get('/prescriptions/patient/{patientId}', [PrescriptionController::class, 'getByPatient']);
        Route::get('/prescriptions/doctor/{doctorId}', [PrescriptionController::class, 'getByDoctor']);

        // Billing routes
        Route::get('/billing', [BillingController::class, 'index']);
        Route::post('/billing', [BillingController::class, 'store']);
        Route::get('/billing/{billing}', [BillingController::class, 'show']);
        Route::put('/billing/{billing}', [BillingController::class, 'update']);
        Route::delete('/billing/{billing}', [BillingController::class, 'destroy']);
        Route::get('/billing/{billing}/download', [BillingController::class, 'download']);

        // Leave Requests routes
        Route::get('/leave-requests', [LeaveRequestController::class, 'index']);
        Route::get('/leave-requests/my-leaves', [LeaveRequestController::class, 'myLeaves']);
        Route::post('/leave-requests', [LeaveRequestController::class, 'store']);
        Route::get('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'show']);
        Route::put('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'update']);
        Route::delete('/leave-requests/{leaveRequest}', [LeaveRequestController::class, 'destroy']);
        Route::put('/leave-requests/{leaveRequest}/approve', [LeaveRequestController::class, 'approve']);
        Route::put('/leave-requests/{leaveRequest}/reject', [LeaveRequestController::class, 'reject']);

        // Notifications routes
        Route::get('/notifications', [NotificationController::class, 'index']);
        Route::put('/notifications/{notification}/read', [NotificationController::class, 'markAsRead']);
        Route::put('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);
        Route::delete('/notifications/{notification}', [NotificationController::class, 'destroy']);

        // Reports routes
        Route::get('/reports', [ReportController::class, 'index']);
        Route::post('/reports', [ReportController::class, 'store']);
        Route::get('/reports/{report}', [ReportController::class, 'show']);
        Route::put('/reports/{report}', [ReportController::class, 'update']);
        Route::delete('/reports/{report}', [ReportController::class, 'destroy']);

        // Medications routes
        Route::get('/medications', [MedicationController::class, 'index']);
        Route::post('/medications', [MedicationController::class, 'store']);
        Route::get('/medications/{medication}', [MedicationController::class, 'show']);
        Route::put('/medications/{medication}', [MedicationController::class, 'update']);
        Route::delete('/medications/{medication}', [MedicationController::class, 'destroy']);

        // Notes routes
        Route::get('/notes', [NoteController::class, 'index']);
        Route::post('/notes', [NoteController::class, 'store']);
        Route::get('/notes/{note}', [NoteController::class, 'show']);
        Route::put('/notes/{note}', [NoteController::class, 'update']);
        Route::delete('/notes/{note}', [NoteController::class, 'destroy']);

        // Intern Reports routes
        Route::get('/intern-reports', [InternReportController::class, 'index']);
        Route::post('/intern-reports', [InternReportController::class, 'store']);
        Route::get('/intern-reports/{internReport}', [InternReportController::class, 'show']);
        Route::put('/intern-reports/{internReport}', [InternReportController::class, 'update']);
        Route::delete('/intern-reports/{internReport}', [InternReportController::class, 'destroy']);

        // User profile routes
        Route::get('/user', function (Request $request) {
            return $request->user();
        });
        
        Route::get('/users/me', [UserController::class, 'getCurrentUser']);
        Route::put('/users/profile', [UserController::class, 'updateProfile']);
        Route::put('/users/password', [UserController::class, 'updatePassword']);
        Route::put('/users/preferences', [UserController::class, 'updatePreferences']);
    });

    Route::get('/users', [UserController::class, 'index']);
    Route::get('/users/{user}', [UserController::class, 'show']);
    Route::put('/users/{user}', [UserController::class, 'update']);
    Route::put('/users/{user}/status', [UserController::class, 'updateStatus']);
    Route::delete('/users/{user}', [UserController::class, 'destroy']);
});