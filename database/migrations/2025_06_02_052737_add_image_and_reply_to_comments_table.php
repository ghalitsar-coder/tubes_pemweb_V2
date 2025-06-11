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
        Schema::table('comments', function (Blueprint $table) {
            // Add project_id for project comments
            $table->foreignId('project_id')->nullable()->constrained()->onDelete('cascade');
            
            // Add parent_id for nested comments (replies)
            $table->foreignId('parent_id')->nullable()->constrained('comments')->onDelete('cascade');
            
            // Add image support
            $table->string('image_path')->nullable();
            
            // Add polymorphic columns for flexible commenting
            $table->string('commentable_type')->nullable();
            $table->unsignedBigInteger('commentable_id')->nullable();
            
            // Add index for polymorphic relationship
            $table->index(['commentable_type', 'commentable_id']);
            
            // Add index for parent_id for better performance on nested queries
            $table->index('parent_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('comments', function (Blueprint $table) {
            $table->dropForeign(['project_id']);
            $table->dropForeign(['parent_id']);
            $table->dropColumn([
                'project_id',
                'parent_id', 
                'image_path',
                'commentable_type',
                'commentable_id'
            ]);
        });
    }
};
