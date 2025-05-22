<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Http\Controllers\LeaveRequestController;

class CheckLeaveStatus extends Command
{
    protected $signature = 'leaves:check-status';
    protected $description = 'Vérifie et met à jour les statuts des congés';

    public function handle()
    {
        $controller = new LeaveRequestController();
        $result = $controller->checkAndUpdateLeaveStatus();
        
        $this->info($result['message']);
        $this->info("Nombre d'utilisateurs mis à jour : " . $result['updated_users']);
    }
} 