<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ChordRow extends Model
{
    protected $fillable = [
        'song_id',
        'row_index',
        'chords',
    ];

    protected $casts = [
        'chords' => 'array',
    ];

    public function song(): BelongsTo
    {
        return $this->belongsTo(Song::class);
    }
}
