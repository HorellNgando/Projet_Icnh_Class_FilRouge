<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UserPreference extends Model
{
    protected $fillable = [
        'user_id',
        'email_notifications',
        'sms_notifications',
        'language',
        'theme'
    ];

    protected $casts = [
        'email_notifications' => 'boolean',
        'sms_notifications' => 'boolean'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
} 