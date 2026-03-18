<?php

namespace App\Models;

use CodeIgniter\Model;

class UserModel extends Model
{
    protected $table            = 'users';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'name',
        'email',
        'password',
    ];

    protected $useAuthTokens    = true;
    protected $dateFormat       = 'datetime';
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    protected $hidden = ['password'];

    /**
     * A user may own many songs.
     */
    public function songs()
    {
        return $this->hasMany(SongModel::class, 'user_id');
    }

    /**
     * Songs this user has bookmarked.
     */
    public function bookmarks()
    {
        return $this->belongsToMany(SongModel::class, 'song_user', 'user_id', 'song_id')
                    ->withPivot('created_at', 'updated_at');
    }

    /**
     * Check if user owns a song
     */
    public function ownsSong($songId)
    {
        return $this->where('id', $songId)->first() !== null;
    }
}
