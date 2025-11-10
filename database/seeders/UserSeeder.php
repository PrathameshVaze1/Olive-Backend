<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'name' => 'Prathamesh Vaze',
            'email' => 'prathameshvaze@gmail.com',
            'password' => Hash::make('Prathamesh@123'),
            'email_verified_at' => now(),
        ]);
    }
}
