<?php
namespace App\Models;

use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable
{
    use HasApiTokens;

    protected $fillable = [
        'identifier', 'name', 'surname', 'email', 'phone', 'password', 'role', 'status', 'photo', 'last_login', 'remember_me',
        'leave_start_date', 'leave_end_date'
    ];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'last_login' => 'datetime',
        'leave_start_date' => 'datetime',
        'leave_end_date' => 'datetime'
    ];

    public function leaveRequests()
    {
        return $this->hasMany(LeaveRequest::class, 'staff_id');
    }

    public function preferences()
    {
        return $this->hasOne(UserPreference::class);
    }
}