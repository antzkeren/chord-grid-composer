<?php

namespace App\Models;

use CodeIgniter\Model;

class SharedSongModel extends Model
{
    protected $table            = 'shared_songs';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'share_id',
        'title',
        'rows',
        'owner_name',
        'user_id',
    ];

    protected $dateFormat       = 'datetime';
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    /**
     * Get the user who shared this song.
     */
    public function user()
    {
        return $this->belongsTo(UserModel::class, 'user_id');
    }

    /**
     * Generate a unique short share ID.
     */
    public static function generateShareId(): string
    {
        $characters = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        $length = 8;
        
        $model = new self();
        do {
            $shareId = '';
            for ($i = 0; $i < $length; $i++) {
                $shareId .= $characters[random_int(0, strlen($characters) - 1)];
            }
        } while ($model->where('share_id', $shareId)->first() !== null);
        
        return $shareId;
    }
}
