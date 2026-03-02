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
        Schema::create('shared_songs', function (Blueprint $table) {
            $table->id();
            $table->string('share_id', 16)->unique()->index();
            $table->string('title');
            $table->json('rows'); // Store chord rows as JSON
            $table->string('owner_name');
            $table->unsignedBigInteger('user_id')->nullable(); // Who shared it
            $table->timestamps();
            
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('shared_songs');
    }
};
