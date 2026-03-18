<?php

namespace App\Models;

use CodeIgniter\Model;

class ChordRowModel extends Model
{
    protected $table            = 'chord_rows';
    protected $primaryKey       = 'id';
    protected $useAutoIncrement = true;
    protected $returnType       = 'array';
    protected $useSoftDeletes   = false;

    protected $allowedFields    = [
        'song_id',
        'row_index',
        'chords',
    ];

    protected $dateFormat       = 'datetime';
    protected $createdField     = 'created_at';
    protected $updatedField     = 'updated_at';

    protected $casts = [
        'chords' => 'array',
    ];

    public function song()
    {
        return $this->belongsTo(SongModel::class, 'song_id');
    }
}
