<?php

namespace App\Models;

use CodeIgniter\Model;

class ChordModel extends Model
{
    protected $table            = 'chords';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'song_id',
        'note',
        'chord_name',
    ];

    protected $dateFormat       = 'datetime';
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    public function song()
    {
        return $this->belongsTo(SongModel::class, 'song_id');
    }
}
