# Backend Setup - Laravel dengan Filament & MySQL

## Prasyarat
- PHP 8.2+
- Composer
- MySQL Server
- Node.js & npm (untuk asset bundling)

## Instalasi

### 1. Setup Database MySQL
```bash
# Login ke MySQL
mysql -u root -p

# Buat database
CREATE DATABASE musicgrid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Exit
EXIT;
```

### 2. Setup Environment
```bash
cd backend

# Copy .env
cp .env.example .env

# Set environment variables di .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=musicgrid_db
DB_USERNAME=root
DB_PASSWORD=

# Generate app key
php artisan key:generate
```

### 3. Migrate Database
```bash
php artisan migrate
```

### 4. Install Filament (Optional - untuk Admin Panel)
```bash
composer require filament/filament
php artisan filament:install --panels
```

### 5. Jalankan Development Server
```bash
php artisan serve
```

Server akan berjalan di: http://localhost:8000

## API Endpoints

### Songs
- `GET /api/songs` - List semua songs
- `POST /api/songs` - Buat song baru
- `GET /api/songs/{id}` - Get detail song
- `PATCH /api/songs/{id}` - Update song
- `DELETE /api/songs/{id}` - Delete song

### Chords
- `GET /api/chords` - List semua chords
- `POST /api/chords` - Buat chord baru
- `GET /api/chords/{id}` - Get detail chord
- `PATCH /api/chords/{id}` - Update chord
- `DELETE /api/chords/{id}` - Delete chord

### Chord Rows
- `POST /api/chord-rows` - Buat chord row baru
- `PATCH /api/chord-rows/{id}` - Update chord row
- `DELETE /api/chord-rows/{id}` - Delete chord row

## Database Schema

### Songs Table
```sql
- id (PK)
- title (varchar)
- artist (varchar, nullable)
- key (varchar, nullable)
- notes (text, nullable)
- is_bookmarked (boolean)
- created_at, updated_at
```

### Chords Table
```sql
- id (PK)
- song_id (FK)
- note (varchar)
- chord_name (varchar)
- created_at, updated_at
```

### Chord Rows Table
```sql
- id (PK)
- song_id (FK)
- row_index (integer)
- chords (json, nullable)
- created_at, updated_at
```

## Frontend Integration

Frontend React akan connect ke API via:
```
http://localhost:8000/api/
```

Pastikan configure CORS di Laravel untuk allow requests dari frontend.

## Development Commands

```bash
# Run migrations
php artisan migrate

# Fresh database
php artisan migrate:fresh

# Seed database
php artisan db:seed

# Tinker console
php artisan tinker

# Clear cache
php artisan cache:clear
```
