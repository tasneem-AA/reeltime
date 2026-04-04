<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            // Add JSON fields for storing question metadata
            $table->json('options')->nullable()->after('correct_answer');
            $table->string('emoji')->nullable()->after('options');
            $table->string('character')->nullable()->after('emoji');
            $table->text('quote')->nullable()->after('character');
            $table->text('scene')->nullable()->after('quote');
            $table->text('hint')->nullable()->after('scene');
        });
    }

    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            $table->dropColumn(['options', 'emoji', 'character', 'quote', 'scene', 'hint']);
        });
    }
};
