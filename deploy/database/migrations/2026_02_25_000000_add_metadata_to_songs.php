<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('songs', function (Blueprint $table) {
            $table->integer('tempo')->nullable()->after('notes');
            $table->string('time_signature')->nullable()->after('tempo');
            $table->string('base_chord')->nullable()->after('time_signature');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('songs', function (Blueprint $table) {
            $table->dropColumn(['tempo', 'time_signature', 'base_chord']);
        });
    }
};
