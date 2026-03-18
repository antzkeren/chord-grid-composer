<?php

namespace App\Database\Migrations;

use CodeIgniter\Database\Migration;

class CreateChordsTable extends Migration
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
            'note' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
            ],
            'chord_name' => [
                'type'       => 'VARCHAR',
                'constraint' => 50,
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
        $this->forge->createTable('chords');
    }

    public function down()
    {
        $this->forge->dropTable('chords');
    }
}
