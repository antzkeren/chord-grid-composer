<?php

namespace App\Models;

use CodeIgniter\Model;

class SongModel extends Model
{
    protected $table            = 'songs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'title',
        'artist',
        'key',
        'notes',
        'visibility',
        'user_id',
        'original_song_id',
        'tempo',
        'time_signature',
        'base_chord',
    ];

    protected $dateFormat       = 'datetime';
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    protected $casts = [
        'visibility' => 'string',
        'tempo' => 'integer',
        'time_signature' => 'string',
        'base_chord' => 'string',
    ];

    /**
     * The user who created/owns this song.
     */
    public function owner()
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    /**
     * Songs that were duplicated from this one ("save as").
     */
    public function duplicates()
    {
        return $this->hasMany(self::class, 'original_song_id');
    }

    /**
     * The original song this record was copied from.
     */
    public function originalSong()
    {
        return $this->belongsTo(self::class, 'original_song_id');
    }

    /**
     * Bookmarks relation (many users can bookmark many songs).
     */
    public function bookmarks()
    {
        return $this->belongsToMany(UserModel::class, 'song_user', 'song_id', 'user_id')
                    ->withPivot('created_at', 'updated_at');
    }

    public function chords()
    {
        return $this->hasMany(ChordModel::class, 'song_id');
    }

    public function chordRows()
    {
        return $this->hasMany(ChordRowModel::class, 'song_id');
    }

    /**
     * Scope a query to include only songs visible to the given user.
     * Public songs are always visible; private/unlisted songs are
     * visible only to their owner. Unlisted are still returned by show().
     */
    public function scopeVisibleTo($query, $userId = null)
    {
        if ($userId) {
            $query->where(function ($q) use ($userId) {
                $q->where('visibility', 'public')
                  ->orWhere('user_id', $userId);
            });
        } else {
            $query->where('visibility', 'public');
        }
        return $query;
    }
}
