<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;

class FilamentUserSeeder extends Seeder
{
    public function run(): void
    {
        // Check if admin user already exists
        $admin = User::where('email', 'admin@test.com')->first();

        if (!$admin) {
            $admin = User::create([
                'name' => 'Admin',
                'email' => 'admin@test.com',
                'password' => bcrypt('admin123'),
            ]);
            $this->command->info('Admin user created: admin@test.com / admin123');
        } else {
            $this->command->info('Admin user already exists: admin@test.com');
        }
    }
}
