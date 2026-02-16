<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Song extends Model
{
    protected $fillable = [
        'title',
        'artist',
        'key',
        'notes',
        'is_bookmarked',
    ];

    protected $casts = [
        'is_bookmarked' => 'boolean',
    ];

    public function chords(): HasMany
    {
        return $this->hasMany(Chord::class);
    }

    public function chordRows(): HasMany
    {
        return $this->hasMany(ChordRow::class);
    }
}
