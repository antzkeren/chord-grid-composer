# 🎵 MusicGrid - Complete Setup Guide

Panduan lengkap untuk setup dan menjalankan aplikasi MusicGrid (Frontend React + Backend Laravel + MySQL).

## 📋 Prasyarat

Pastikan sudah terinstall:
- **PHP 8.3+** - `php --version`
- **Composer** - `composer --version`
- **Node.js/Bun** - `bun --version` atau `node --version`
- **MySQL Server** - `mysql --version`
- **Git** (optional) - `git --version`

## 🗄️ Setup Database MySQL

### 1. Jalankan MySQL Server

```bash
# Ubuntu/Linux
sudo service mysql start

# macOS dengan Homebrew
brew services start mysql

# Windows
net start MySQL80  # atau service name yang sesuai
```

### 2. Login ke MySQL dan Buat Database

```bash
# Login ke MySQL
mysql -u root -p

# Ketik password (jika ada)

# Di MySQL prompt, jalankan:
CREATE DATABASE musicgrid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# Verify database
SHOW DATABASES;

# Exit
EXIT;
```

## 🔧 Setup Backend (Laravel + Filament)

### 1. Navigate ke Backend Directory

```bash
cd /home/saika/Downloads/musicgrid/backend
```

### 2. Configure Environment

Edit file `.env`:
```env
APP_NAME=MusicGrid
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

# Database Configuration
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=musicgrid_db
DB_USERNAME=root
DB_PASSWORD=
```

### 3. Generate Application Key

```bash
php artisan key:generate
```

Output:
```
INFO  Application key set successfully.
```

### 4. Run Database Migrations

```bash
php artisan migrate
```

### 5. (Optional) Seed Sample Data

```bash
php artisan db:seed
```

Ini akan membuat 3 sample songs dengan chord data.

### 6. Start Backend Server

```bash
php artisan serve
```

Output:
```
   INFO  Server running on [http://127.0.0.1:8000].
```

Backend telah running di: **http://localhost:8000**

## 🎨 Setup Frontend (React + Vite)

### 1. Navigate ke Root Directory

```bash
cd /home/saika/Downloads/musicgrid
```

### 2. Install Dependencies

```bash
bun install
# atau
npm install
```

### 3. Update API Configuration

Edit `src/` files jika diperlukan untuk set API base URL ke `http://localhost:8000/api/`

### 4. Start Frontend Dev Server

```bash
bun run dev
# atau
npm run dev
```

Output:
```
VITE v5.4.19  ready in 234 ms

➜  Local:   http://localhost:5173/
➜  press h + enter to show help
```

Frontend telah running di: **http://localhost:5173**

## 🧪 Testing API

### Test dengan cURL

```bash
# Get all songs
curl http://localhost:8000/api/songs

# Get song dengan ID 1
curl http://localhost:8000/api/songs/1

# Create new song
curl -X POST http://localhost:8000/api/songs \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Favorite Song",
    "artist": "Artist Name",
    "key": "C",
    "notes": "Some notes"
  }'
```

### Test dengan Postman

1. Import collection atau buat requests manually:
   - **GET** `http://localhost:8000/api/songs`
   - **POST** `http://localhost:8000/api/songs` dengan JSON body

## 📁 Project Structure

```
musicgrid/
├── src/                          # Frontend source
│   ├── components/
│   │   ├── ChordGrid.tsx
│   │   ├── ChordCellComponent.tsx
│   │   ├── ChordKeyboard.tsx
│   │   ├── SongLibrary.tsx
│   │   └── ui/                 # shadcn/ui components
│   ├── hooks/
│   │   ├── useChordGrid.ts
│   │   └── useSongStorage.ts
│   ├── pages/
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   ├── types/
│   │   ├── chord.ts
│   │   └── song.ts
│   ├── App.tsx
│   └── main.tsx
│
├── backend/                      # Backend source
│   ├── app/
│   │   ├── Models/
│   │   │   ├── Song.php
│   │   │   ├── Chord.php
│   │   │   └── ChordRow.php
│   │   └── Http/Controllers/Api/
│   │       ├── SongController.php
│   │       └── ChordController.php
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   │       └── SongSeeder.php
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   ├── config/
│   │   └── cors.php
│   ├── .env
│   └── composer.json
│
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── PROJECT_GUIDE.md
└── README.md
```

## 📚 Database Schema

### Songs Table
```sql
CREATE TABLE songs (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  artist VARCHAR(255),
  key VARCHAR(255),
  notes TEXT,
  is_bookmarked BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Chords Table
```sql
CREATE TABLE chords (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  song_id BIGINT UNSIGNED NOT NULL,
  note VARCHAR(255) NOT NULL,
  chord_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);
```

### Chord Rows Table
```sql
CREATE TABLE chord_rows (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  song_id BIGINT UNSIGNED NOT NULL,
  row_index INT NOT NULL,
  chords JSON,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  FOREIGN KEY (song_id) REFERENCES songs(id) ON DELETE CASCADE
);
```

## 🔌 API Endpoints

### Songs
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/songs` | List semua songs |
| POST | `/api/songs` | Buat song baru |
| GET | `/api/songs/{id}` | Get detail song |
| PATCH | `/api/songs/{id}` | Update song |
| DELETE | `/api/songs/{id}` | Delete song |

### Chords
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/chords` | List semua chords |
| POST | `/api/chords` | Buat chord baru |
| GET | `/api/chords/{id}` | Get detail chord |
| PATCH | `/api/chords/{id}` | Update chord |
| DELETE | `/api/chords/{id}` | Delete chord |

### Chord Rows
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/chord-rows` | Buat chord row |
| PATCH | `/api/chord-rows/{id}` | Update chord row |
| DELETE | `/api/chord-rows/{id}` | Delete chord row |

## 🛠️ Useful Commands

### Backend Commands

```bash
cd backend

# Database
php artisan migrate              # Run migrations
php artisan migrate:fresh        # Fresh database
php artisan db:seed              # Seed database
php artisan tinker               # Interactive shell

# Development
php artisan serve                # Start dev server
php artisan serve --port=8001    # Start di port lain

# Cache & Cleanup
php artisan cache:clear
php artisan config:cache
php artisan view:clear

# Testing
php artisan test
```

### Frontend Commands

```bash
# Development
bun run dev                 # Start dev server
bun run build              # Build for production
bun run preview            # Preview production build
bun run lint               # Run ESLint
bun run test               # Run tests
bun run test:watch         # Watch mode testing
```

## 🐛 Troubleshooting

### Backend Issues

**Error: "SQLSTATE[HY000] [2002] Connection refused"**
- MySQL server tidak running
- Solusi: `sudo service mysql start`

**Error: "Access denied for user 'root'@'localhost'"**
- Password database salah di `.env`
- Solusi: Update `DB_PASSWORD` di `.env`

**Error: "Class 'App\Models\Song' not found"**
- Models belum di-generate
- Solusi: `php artisan make:model Song`

### Frontend Issues

**Error: "Cannot find module '@/*'"**
- Path alias tidak dikonfigurasi dengan benar
- Solusi: Check `vite.config.ts` dan `tsconfig.json`

**Error: "CORS error when calling API"**
- Backend CORS tidak dikonfigurasi
- Solusi: Check `config/cors.php` di backend

## ✨ Next Steps

1. ✅ Setup database dan migrations
2. ✅ Generate sample data dengan seeding
3. ✅ Test API endpoints
4. 🔄 Integrate frontend dengan backend API
5. 🔄 Setup Filament admin panel (optional)
6. 🔄 Deploy ke production

## 📖 Additional Resources

- [Laravel Documentation](https://laravel.com/docs)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [Filament Documentation](https://filamentphp.com)

## 📧 Support

Jika ada masalah atau pertanyaan, silakan:
1. Check dokumentasi project
2. Review error messages dengan teliti
3. Verify semua prasyarat sudah terinstall

---

**Happy Coding!** 🎵✨
