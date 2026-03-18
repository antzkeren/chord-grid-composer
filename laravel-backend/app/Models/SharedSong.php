<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SharedSong extends Model
{
    protected $fillable = [
        'share_id',
        'title',
        'rows',
        'owner_name',
        'user_id',
    ];

    protected $casts = [
        'rows' => 'array',
    ];

    /**
     * Get the user who shared this song.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Generate a unique short share ID.
     */
    public static function generateShareId(): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $length = 8;
        
        do {
            $shareId = '';
            for ($i = 0; $i < $length; $i++) {
                $shareId .= $characters[rand(0, strlen($characters) - 1)];
            }
        } while (self::where('share_id', $shareId)->exists());
        
        return $shareId;
    }
}
