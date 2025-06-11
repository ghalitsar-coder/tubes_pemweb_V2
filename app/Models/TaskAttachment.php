<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Support\Facades\Storage;

class TaskAttachment extends Model
{
  protected $table = 'task_attachments'; // Tentukan nama tabel

    protected $fillable = [
        'task_id', // Tambahkan task_id
        'filename',
        'path',
        'type',
        'public_id', // Opsional: untuk menyimpan public_id Cloudinary
        'uploaded_at',
    ];
    protected $casts = [
        'uploaded_at' => 'datetime',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
    ];

    public function task(): BelongsTo
    {
        return $this->belongsTo(Task::class);
    }

    public function comments(): HasMany
    {
        return $this->hasMany(TaskAttachmentComment::class);
    }

    public function delete()
  {        // Hapus file dari Cloudinary jika public_id tersedia
        if ($this->public_id) {
            try {
                Cloudinary::uploadApi()->destroy($this->public_id);
            } catch (\Exception $e) {
                \Log::error('Failed to delete file from Cloudinary: ' . $e->getMessage());
            }
        }

        // Panggil parent delete untuk menghapus record dari database
        return parent::delete();
    }
} 