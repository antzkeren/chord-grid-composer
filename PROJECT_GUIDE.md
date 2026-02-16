# MusicGrid - Full Stack Application

Aplikasi web untuk membuat dan mengelola chord progessions musik dengan UI yang interaktif.

## Tech Stack

### Frontend
- **Language**: TypeScript
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Framework**: shadcn/ui + Tailwind CSS
- **UI Components**: Radix UI
- **Routing**: React Router
- **State Management**: React Query + React Hook Form
- **Storage**: Browser localStorage

### Backend
- **Language**: PHP 8.3
- **Framework**: Laravel 12
- **Database**: MySQL
- **Admin Panel**: Filament (Optional)
- **API**: RESTful API

## Struktur Project

```
musicgrid/
├── frontend (React + Vite)
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── pages/
│   │   ├── types/
│   │   └── App.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend (Laravel)
│   ├── app/
│   │   ├── Models/
│   │   │   ├── Song.php
│   │   │   ├── Chord.php
│   │   │   └── ChordRow.php
│   │   └── Http/Controllers/Api/
│   │       ├── SongController.php
│   │       └── ChordController.php
│   ├── database/
│   │   └── migrations/
│   ├── routes/
│   │   └── api.php
│   ├── .env
│   └── composer.json
│
└── README.md
```

## Quick Start

### Backend Setup

```bash
cd backend

# Setup environment
cp .env.example .env
php artisan key:generate

# Setup MySQL
mysql -u root -p
CREATE DATABASE musicgrid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Update .env with database credentials
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=musicgrid_db
DB_USERNAME=root
DB_PASSWORD=

# Run migrations
php artisan migrate

# Start server
php artisan serve
```

Backend akan berjalan di: http://localhost:8000

### Frontend Setup

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

Frontend akan berjalan di: http://localhost:5173

## Database Schema

### Songs
- `id` - Primary Key
- `title` - Judul lagu
- `artist` - Nama artis
- `key` - Kunci musik
- `notes` - Catatan tambahan
- `is_bookmarked` - Status bookmark
- `timestamps` - Created & Updated at

### Chords
- `id` - Primary Key
- `song_id` - Foreign Key ke Songs
- `note` - Nada (C, D, E, etc)
- `chord_name` - Nama chord lengkap
- `timestamps`

### Chord Rows
- `id` - Primary Key
- `song_id` - Foreign Key ke Songs
- `row_index` - Urutan baris
- `chords` - JSON array of chords
- `timestamps`

## API Endpoints

### Songs
```
GET    /api/songs           - List all songs
POST   /api/songs           - Create new song
GET    /api/songs/{id}      - Get song detail
PATCH  /api/songs/{id}      - Update song
DELETE /api/songs/{id}      - Delete song
```

### Chords
```
GET    /api/chords           - List all chords
POST   /api/chords           - Create new chord
GET    /api/chords/{id}      - Get chord detail
PATCH  /api/chords/{id}      - Update chord
DELETE /api/chords/{id}      - Delete chord
```

### Chord Rows
```
POST   /api/chord-rows              - Create chord row
PATCH  /api/chord-rows/{id}         - Update chord row
DELETE /api/chord-rows/{id}         - Delete chord row
```

## Features

- ✅ Create & manage songs
- ✅ Add chord progressions
- ✅ Organize with chord grid
- ✅ Bookmark favorite songs
- ✅ Search & filter functionality
- ✅ Responsive UI
- ✅ Local storage sync
- ✅ RESTful API backend
- 🔜 Admin panel dengan Filament

## Development

### Frontend
```bash
cd /home/saika/Downloads/musicgrid
bun run dev      # Start dev server
bun run build    # Build for production
bun run lint     # Run ESLint
bun run test     # Run tests
```

### Backend
```bash
cd /home/saika/Downloads/musicgrid/backend
php artisan serve              # Start dev server
php artisan migrate            # Run migrations
php artisan tinker             # Interactive shell
php artisan test               # Run tests
```

## Notes

- Frontend menggunakan localStorage untuk penyimpanan lokal
- Backend menggunakan MySQL untuk penyimpanan persistent
- CORS sudah dikonfigurasi untuk memungkinkan frontend connect ke backend
- API base URL dari frontend: `http://localhost:8000/api/`

---

Happy coding! 🎵
