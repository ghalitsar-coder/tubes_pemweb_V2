<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PembagianTugasSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $data = [
            [
                'nama' => 'Ghalytsar',
                'nim' => '152023158',
                'tugas' => 'Frontend Backend',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Muhamad Prabu',
                'nim' => '152023163',
                'tugas' => 'ERD dan TRD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Genta Nur Muhamad',
                'nim' => '152023130',
                'tugas' => 'ERD dan TRD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'nama' => 'Farras Abdillah Fauzan',
                'nim' => '152023097',
                'tugas' => 'ERD dan TRD',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        DB::table('pembagian_tugas')->insert($data);
        
        $this->command->info('Successfully created pembagian tugas data for 4 members.');
    }
}
