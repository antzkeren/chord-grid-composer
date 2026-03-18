<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Chord extends Model
{
    protected $fillable = [
        'song_id',
        'note',
        'chord_name',
    ];

    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }
}
