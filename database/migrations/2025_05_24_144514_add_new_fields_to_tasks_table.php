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
            // Only add columns that don't exist yet
            if (!Schema::hasColumn('tasks', 'start_date')) {
                $table->date('start_date')->nullable()->after('due_date');
            }
            if (!Schema::hasColumn('tasks', 'time_estimate')) {
                $table->decimal('time_estimate', 8, 2)->nullable()->after('due_date');
            }
            if (!Schema::hasColumn('tasks', 'tags')) {
                $table->text('tags')->nullable()->after('due_date');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('tasks', function (Blueprint $table) {
            $table->dropColumn(['start_date', 'time_estimate', 'tags']);
        });
    }
};
