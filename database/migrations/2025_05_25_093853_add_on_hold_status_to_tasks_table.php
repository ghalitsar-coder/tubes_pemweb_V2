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
        Schema::table('tasks', function (Blueprint $table) {
            // Modify the enum to include 'on_hold'
            $table->enum('status', ['todo', 'in_progress', 'on_hold', 'completed'])->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            // Revert back to original enum values
            $table->enum('status', ['todo', 'in_progress', 'completed'])->change();
        });
    }
};
