<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{    public function up(): void
    {
        Schema::create('project_comments', function (Blueprint $table) {
            $table->id();
            $table->text('content');
            $table->foreignId('project_id')->constrained()->onDelete('cascade');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('parent_id')->nullable()->constrained('project_comments')->onDelete('cascade'); // For replies
            $table->string('image_path')->nullable(); // For image uploads
            $table->timestamps();
            $table->softDeletes();
            
            // Add indexes for better performance
            $table->index(['project_id', 'created_at']);
            $table->index(['parent_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('project_comments');
    }
};
