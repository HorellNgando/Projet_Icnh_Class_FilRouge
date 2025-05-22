<?php
namespace App\Providers;

use App\Models\Patient;
use App\Policies\PatientPolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Patient::class => PatientPolicy::class,
    ];

    public function boot()
    {
        $this->registerPolicies();
    }
}