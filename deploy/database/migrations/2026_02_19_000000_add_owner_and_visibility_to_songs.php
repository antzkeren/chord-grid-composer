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
            // owner relation
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();

            // visibility: public, unlisted, private
            $table->enum('visibility', ['public', 'unlisted', 'private'])->default('public');

            // track original song for "save as" duplicates
            $table->foreignId('original_song_id')->nullable()->constrained('songs')->nullOnDelete();

            // remove the old global bookmark flag, no longer needed
            if (Schema::hasColumn('songs', 'is_bookmarked')) {
                $table->dropColumn('is_bookmarked');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('songs', function (Blueprint $table) {
            // re-add original columns if rolling back
            if (!Schema::hasColumn('songs', 'is_bookmarked')) {
                $table->boolean('is_bookmarked')->default(false);
            }
            $table->dropForeign(['user_id']);
            $table->dropColumn('user_id');

            $table->dropColumn('visibility');
            $table->dropForeign(['original_song_id']);
            $table->dropColumn('original_song_id');
        });
    }
};
