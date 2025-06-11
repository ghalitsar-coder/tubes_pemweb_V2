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
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description')->nullable();
            $table->date('event_date');
            $table->time('start_time')->nullable();
            $table->time('end_time')->nullable();
            $table->enum('event_type', [
                'meeting',
                'task_deadline', 
                'review',
                'important_deadline',
                'personal',
                'reminder',
                'milestone'
            ])->default('meeting');
            $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
            $table->string('color_theme')->default('blue'); // blue, purple, green, red, yellow, indigo
            $table->boolean('is_all_day')->default(false);
            $table->json('attendees')->nullable(); // Store user IDs or email addresses
            $table->string('location')->nullable();
            $table->text('notes')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('medium');
            $table->boolean('is_recurring')->default(false);
            $table->json('recurrence_settings')->nullable(); // For recurring events
            $table->timestamp('reminder_at')->nullable();
            $table->boolean('reminder_sent')->default(false);
            
            // Relations
            $table->foreignId('user_id')->constrained()->onDelete('cascade'); // Event creator
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade'); // Optional project link
            $table->foreignId('task_id')->nullable()->constrained()->onDelete('cascade'); // Optional task link
            
            $table->timestamps();
            $table->softDeletes();
            
            // Indexes
            $table->index(['event_date', 'user_id']);
            $table->index(['event_type', 'status']);
            $table->index(['project_id', 'event_date']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
