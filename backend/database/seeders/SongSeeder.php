<?php

namespace Database\Seeders;

use App\Models\Song;
use App\Models\Chord;
use App\Models\ChordRow;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SongSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Sample Song 1
        $song1 = Song::create([
            'title' => 'Let It Be',
            'artist' => 'The Beatles',
            'key' => 'C',
            'notes' => 'Classic Beatles song',
            'is_bookmarked' => true,
        ]);

        // Add chords for song 1
        Chord::create([
            'song_id' => $song1->id,
            'note' => 'C',
            'chord_name' => 'C Major',
        ]);
        Chord::create([
            'song_id' => $song1->id,
            'note' => 'Am',
            'chord_name' => 'A Minor',
        ]);
        Chord::create([
            'song_id' => $song1->id,
            'note' => 'F',
            'chord_name' => 'F Major',
        ]);
        Chord::create([
            'song_id' => $song1->id,
            'note' => 'G',
            'chord_name' => 'G Major',
        ]);

        // Add chord rows for song 1
        ChordRow::create([
            'song_id' => $song1->id,
            'row_index' => 0,
            'chords' => ['C', 'Am', 'F', 'G'],
        ]);
        ChordRow::create([
            'song_id' => $song1->id,
            'row_index' => 1,
            'chords' => ['C', 'Am', 'F', 'G'],
        ]);

        // Sample Song 2
        $song2 = Song::create([
            'title' => 'Imagine',
            'artist' => 'John Lennon',
            'key' => 'C',
            'notes' => 'Peaceful and inspiring',
            'is_bookmarked' => false,
        ]);

        // Add chords for song 2
        Chord::create([
            'song_id' => $song2->id,
            'note' => 'C',
            'chord_name' => 'C Major',
        ]);
        Chord::create([
            'song_id' => $song2->id,
            'note' => 'Cmaj7',
            'chord_name' => 'C Major 7',
        ]);
        Chord::create([
            'song_id' => $song2->id,
            'note' => 'F',
            'chord_name' => 'F Major',
        ]);

        // Add chord rows for song 2
        ChordRow::create([
            'song_id' => $song2->id,
            'row_index' => 0,
            'chords' => ['C', 'Cmaj7', 'F'],
        ]);
        ChordRow::create([
            'song_id' => $song2->id,
            'row_index' => 1,
            'chords' => ['C', 'Cmaj7', 'F'],
        ]);

        // Sample Song 3
        $song3 = Song::create([
            'title' => 'Wonderwall',
            'artist' => 'Oasis',
            'key' => 'Em7',
            'notes' => null,
            'is_bookmarked' => true,
        ]);

        // Add chords for song 3
        Chord::create([
            'song_id' => $song3->id,
            'note' => 'Em7',
            'chord_name' => 'E Minor 7',
        ]);
        Chord::create([
            'song_id' => $song3->id,
            'note' => 'Asuspension',
            'chord_name' => 'A Suspension',
        ]);
        Chord::create([
            'song_id' => $song3->id,
            'note' => 'Cadd9',
            'chord_name' => 'C Add 9',
        ]);

        // Add chord rows for song 3
        ChordRow::create([
            'song_id' => $song3->id,
            'row_index' => 0,
            'chords' => ['Em7', 'Asuspension', 'Cadd9'],
        ]);
    }
}
