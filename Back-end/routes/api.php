<?php

// use Illuminate\Support\Facades\Route;
// use App\Http\Controllers\AuthController;
// use App\Http\Controllers\PatientController;
// use App\Http\Controllers\AdminController;

// Route::post('/register', [AuthController::class, 'register']);
// Route::post('/login', [AuthController::class, 'login']);
// Route::post('/admin/login', [AuthController::class, 'adminLogin']);

// Route::middleware('auth:sanctum')->group(function () {
    // Routes Patient
    // Route::get('/patient/profile', [PatientController::class, 'profile']);
    // Route::put('/patient/profile', [PatientController::class, 'updateProfile']);
    // Route::get('/patient/appointments', [PatientController::class, 'appointments']);
    // Route::post('/patient/appointments', [PatientController::class, 'createAppointment']);
    // Route::get('/patient/factures', [PatientController::class, 'factures']);
    // Route::post('/patient/factures/{id}/pay', [PatientController::class, 'payFacture']);
    // Route::get('/patient/medical-records', [PatientController::class, 'medicalRecords']);
    // Route::get('/patient/health-tracking', [PatientController::class, 'healthTracking']);
    // Route::get('/patient/messages', [PatientController::class, 'messages']);
    // Route::get('/patient/testimonial', [PatientController::class, 'getTestimonial']);
    // Route::post('/patient/testimonial', [PatientController::class, 'createTestimonial']);
    
    // Route publique pour les témoignages
    // Route::get('/testimonials', [AdminController::class, 'testimonials']);

    // Route::post('/logout', [AuthController::class, 'logout']);
    // Route::get('/user/profile', [AuthController::class, 'getProfile']);
    // Route::post('/user/profile/photo', [AuthController::class, 'updateProfilePhoto']);

    // Routes Admin
    // Route::get('/admin/stats', [AdminController::class, 'stats']);
    // Route::get('/admin/recent-patients', [AdminController::class, 'recentPatients']);
    // Route::get('/admin/stocks', [AdminController::class, 'stocks']);
    // Route::get('/admin/finances', [AdminController::class, 'finances']);
    // Route::get('/admin/patients', [AdminController::class, 'patients']);
    // Route::get('/admin/staff', [AdminController::class, 'staff']);
    // Route::post('/admin/staff', [AdminController::class, 'addStaff']);
    // Route::get('/admin/appointments', [AdminController::class, 'appointments']);
    // Route::put('/admin/appointments/{id}', [AdminController::class, 'updateAppointment']);
    // Route::get('/admin/medical-records', [AdminController::class, 'medicalRecords']);
    // Route::get('/admin/connexion-logs', [AdminController::class, 'connexionLogs']);



//     Route::prefix('admin')->group(function () {
//         Route::get('/stats', [AdminController::class, 'stats']);
//         Route::get('/recent-patients', [AdminController::class, 'recentPatients']);
//         Route::get('/critical-stocks', [AdminController::class, 'criticalStocks']);
//         Route::get('/revenues', [AdminController::class, 'revenues']);
//         Route::get('/logs', [AdminController::class, 'logs']);
//         Route::get('/patients', [AdminController::class, 'patients']);
//     });


//     Route::prefix('patient')->group(function () {
//         Route::get('/appointments', [PatientController::class, 'appointments']);
//         Route::get('/messages', [PatientController::class, 'messages']);
//         Route::get('/health', [PatientController::class, 'health']);
//         Route::get('/{id}', [PatientController::class, 'getPatient']);
//         Route::get('/last-login', [PatientController::class, 'lastLogin']);
//     });
// });

// Route::get('/doctors', function () {
//     return \App\Models\Utilisateur::where('role', 'medecin')->get();
// });

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\MedecinController;
use App\Http\Controllers\InfirmierController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/admin/login', [AuthController::class, 'adminLogin']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user/profile', [AuthController::class, 'getProfile']);
    Route::post('/user/profile/photo', [AuthController::class, 'updateProfilePhoto']);

    Route::prefix('admin')->group(function () {
        Route::get('/stats', [AdminController::class, 'stats']);
        Route::get('/recent-patients', [AdminController::class, 'recentPatients']);
        Route::get('/critical-stocks', [AdminController::class, 'criticalStocks']);
        Route::get('/revenues', [AdminController::class, 'revenues']);
        Route::get('/logs', [AdminController::class, 'logs']);
        Route::get('/appointments', [AdminController::class, 'appointments']);
        Route::get('/patients', [AdminController::class, 'patients']);
        Route::post('/staff/add', [AdminController::class, 'addStaff']);
    });

    Route::prefix('patient')->group(function () {
        Route::get('/appointments', [PatientController::class, 'appointments']);
        Route::get('/messages', [PatientController::class, 'messages']);
        Route::get('/health', [PatientController::class, 'health']);
        Route::get('/{id}', [PatientController::class, 'getPatient']);
        Route::get('/last-login', [PatientController::class, 'lastLogin']);
    });

    Route::prefix('medecin')->group(function () {
        Route::get('/patients', [MedecinController::class, 'patients']);
        Route::get('/appointments', [MedecinController::class, 'appointments']);
        Route::get('/last-login', [MedecinController::class, 'lastLogin']);
        Route::post('/profile/update', [MedecinController::class, 'updateProfile']);
    });

    Route::prefix('infirmier')->group(function () {
        Route::get('/patients', [InfirmierController::class, 'patients']);
        Route::get('/last-login', [InfirmierController::class, 'lastLogin']);
        Route::post('/patients/add', [InfirmierController::class, 'addPatient']);
    });
});