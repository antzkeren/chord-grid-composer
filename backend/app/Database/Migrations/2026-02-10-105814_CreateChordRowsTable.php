<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateChordRowsTable extends Migration
{
    public function up()
    {
        $this->forge->addField([
            'id' => [
                'type'           => 'INT',
                'constraint'     => 11,
                'unsigned'       => true,
                'auto_increment' => true,
            ],
            'song_id' => [
                'type'       => 'INT',
                'constraint' => 11,
                'unsigned'   => true,
            ],
            'row_index' => [
                'type'       => 'INT',
                'constraint' => 11,
            ],
            'chords' => [
                'type' => 'JSON',
                'null' => true,
            ],
            'created_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
            'updated_at' => [
                'type' => 'DATETIME',
                'null' => true,
            ],
        ]);
        $this->forge->addKey('id', true);
        $this->forge->addForeignKey('song_id', 'songs', 'id', 'CASCADE', 'CASCADE');
        $this->forge->createTable('chord_rows');
    }

    public function down()
    {
        $this->forge->dropTable('chord_rows');
    }
}
