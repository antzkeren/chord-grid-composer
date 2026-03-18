# MusicGrid - Backend API Documentation

Backend untuk MusicGrid dibangun dengan **Laravel 12**, **Filament** (Admin Panel), dan **SQLite** (untuk development).

## 🚀 Setup & Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js (untuk asset compilation)

### Installation Steps

1. **Navigate ke backend folder**
   ```bash
   cd /home/saika/Downloads/musicgrid/backend
   ```

2. **Install dependencies**
   ```bash
   composer install
   ```

3. **Setup environment**
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. **Create database & run migrations**
   ```bash
   # Database sudah di .env configured untuk SQLite
   # Migrations akan otomatis berjalan
   php artisan migrate
   ```

5. **Seed sample data**
   ```bash
   php artisan db:seed --class=SongSeeder
   ```

## 🌐 API Endpoints

### Base URL
```
http://localhost:8000/api
```

### Songs Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/songs` | Get all songs with relationships |
| POST | `/songs` | Create new song |
| GET | `/songs/{id}` | Get specific song |
| PATCH | `/songs/{id}` | Update song |
| DELETE | `/songs/{id}` | Delete song |

**Create/Update Song Request Body:**
```json
{
  "title": "Song Title",
  "artist": "Artist Name",
  "key": "C",
  "notes": "Optional notes",
  "is_bookmarked": false
}
```

### Chords Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/chords` | Get all chords |
| POST | `/chords` | Create new chord |
| GET | `/chords/{id}` | Get specific chord |
| PATCH | `/chords/{id}` | Update chord |
| DELETE | `/chords/{id}` | Delete chord |

**Create/Update Chord Request Body:**
```json
{
  "song_id": 1,
  "note": "C",
  "chord_name": "C Major"
}
```

### Chord Rows Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/chord-rows` | Create new chord row |
| PATCH | `/chord-rows/{id}` | Update chord row |
| DELETE | `/chord-rows/{id}` | Delete chord row |

**Create/Update Chord Row Request Body:**
```json
{
  "song_id": 1,
  "row_index": 0,
  "chords": ["C", "Am", "F", "G"]
}
```

## 📊 Database Schema

### songs table
```
- id (bigint, PK)
- title (varchar)
- artist (varchar, nullable)
- key (varchar, nullable)
- notes (text, nullable)
- is_bookmarked (boolean)
- created_at (timestamp)
- updated_at (timestamp)
```

### chords table
```
- id (bigint, PK)
- song_id (bigint, FK → songs.id)
- note (varchar)
- chord_name (varchar)
- created_at (timestamp)
- updated_at (timestamp)
```

### chord_rows table
```
- id (bigint, PK)
- song_id (bigint, FK → songs.id)
- row_index (integer)
- chords (json, nullable)
- created_at (timestamp)
- updated_at (timestamp)
```

## 🛠️ Running the Backend

### Development Server
```bash
php artisan serve
```
Server berjalan di: **http://localhost:8000**

### Filament Admin Panel
```
http://localhost:8000/admin
```
(Perlu setup authentication untuk production)

## 📁 Project Structure

```
backend/
├── app/
│   ├── FilamentAdmin/
│   ├── Http/
│   │   └── Controllers/
│   │       └── Api/
│   │           ├── SongController.php
│   │           └── ChordController.php
│   └── Models/
│       ├── Song.php
│       ├── Chord.php
│       └── ChordRow.php
├── database/
│   ├── migrations/
│   ├── seeders/
│   └── database.sqlite
├── routes/
│   ├── api.php
│   └── web.php
├── .env
└── ...
```

## 🔧 Useful Commands

```bash
# Database operations
php artisan migrate                 # Run migrations
php artisan migrate:fresh          # Fresh migration (reset DB)
php artisan db:seed               # Run all seeders
php artisan db:seed --class=SongSeeder  # Run specific seeder

# Cache clearing
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Tinker (Interactive console)
php artisan tinker

# Check routes
php artisan route:list
```

## 📝 Response Format

All API responses follow this format:

**Success (2xx):**
```json
{
  "id": 1,
  "title": "Song Title",
  "artist": "Artist Name",
  "key": "C",
  "notes": "Notes",
  "is_bookmarked": true,
  "created_at": "2026-02-10T10:30:00Z",
  "updated_at": "2026-02-10T10:30:00Z"
}
```

**Error (4xx/5xx):**
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Error detail"]
  }
}
```

## 🚀 Deployment

### For Production with MySQL:

1. **Update .env:**
   ```
   DB_CONNECTION=mysql
   DB_HOST=your_host
   DB_PORT=3306
   DB_DATABASE=musicgrid_db
   DB_USERNAME=your_user
   DB_PASSWORD=your_password
   ```

2. **Run migrations on production:**
   ```bash
   php artisan migrate --force
   ```

3. **Setup Filament authentication** (recommended for admin panel)

## 📚 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com)
- [Eloquent Documentation](https://laravel.com/docs/eloquent)

## 📧 Support

For issues or questions, refer to the main README.md in the root folder.
