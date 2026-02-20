<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Song extends Model
{
    // allow mass assignment of new ownership/visibility fields; the
    // "is_bookmarked" boolean is no longer persisted, bookmarks are
    // kept on a separate pivot table.
    protected $fillable = [
        'title',
        'artist',
        'key',
        'notes',
        'visibility',
        'user_id',
        'original_song_id',
    ];

    protected $casts = [
        'visibility' => 'string',
    ];

    /**
     * The user who created/owns this song.
     */
    public function owner(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    /**
     * Songs that were duplicated from this one ("save as").
     */
    public function duplicates(): HasMany
    {
        return $this->hasMany(self::class, 'original_song_id');
    }

    /**
     * The original song this record was copied from.
     */
    public function originalSong(): \Illuminate\Database\Eloquent\Relations\BelongsTo
    {
        return $this->belongsTo(self::class, 'original_song_id');
    }

    /**
     * Bookmarks relation (many users can bookmark many songs).
     */
    public function bookmarks(): \Illuminate\Database\Eloquent\Relations\BelongsToMany
    {
        return $this->belongsToMany(User::class, 'song_user')
                    ->withTimestamps();
    }

    public function chords(): HasMany
    {
        return $this->hasMany(Chord::class);
    }

    public function chordRows(): HasMany
    {
        return $this->hasMany(ChordRow::class);
    }

    /**
     * Scope a query to include only songs visible to the given user.
     * Public songs are always visible; private/unlisted songs are
     * visible only to their owner. Unlisted are still returned by show().
     */
    public function scopeVisibleTo($query, $user = null)
    {
        $query->when($user, function ($q, $user) {
            $q->where(function ($q) use ($user) {
                $q->where('visibility', 'public')
                  ->orWhere('user_id', $user->id);
            });
        }, function ($q) {
            $q->where('visibility', 'public');
        });
    }
}
