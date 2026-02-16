# 🚀 Quick Start Reference

## Instan Start Commands

### Setup Database
```bash
mysql -u root -p
CREATE DATABASE musicgrid_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### Setup Backend (Terminal 1)
```bash
cd /home/saika/Downloads/musicgrid/backend

# Setup Laravel
php artisan key:generate
php artisan migrate
php artisan db:seed

# Run server
php artisan serve
```

### Setup Frontend (Terminal 2)
```bash
cd /home/saika/Downloads/musicgrid

# Install dependencies
bun install

# Run dev server
bun run dev
```

## URLs

- 🌐 **Frontend**: http://localhost:5173
- 🔌 **Backend API**: http://localhost:8000
- 📊 **Sample API**: http://localhost:8000/api/songs

## Test API

```bash
# Get all songs
curl http://localhost:8000/api/songs

# Get song by ID
curl http://localhost:8000/api/songs/1

# Create song
curl -X POST http://localhost:8000/api/songs \
  -H "Content-Type: application/json" \
  -d '{"title":"New Song","artist":"Artist","key":"C"}'
```

## File Structure

```
musicgrid/
├── src/                    # Frontend React
├── backend/               # Backend Laravel
│   ├── app/Models/        # ✅ Song, Chord, ChordRow
│   ├── app/Http/Controllers/Api/
│   │   ├── SongController.php  # ✅
│   │   └── ChordController.php # ✅
│   ├── database/migrations/    # ✅ All tables
│   ├── routes/api.php          # ✅
│   ├── config/cors.php         # ✅
│   └── .env                    # ✅
├── SETUP_COMPLETE.md       # Full guide
├── BACKEND_CHECKLIST.md    # Checklist
└── PROJECT_GUIDE.md        # Overview
```

## Key Features Implemented

✅ Database schema (Songs, Chords, ChordRows)
✅ Eloquent Models with relationships
✅ RESTful API Controllers
✅ API Routes configuration
✅ CORS configuration
✅ Database migrations
✅ Sample data seeder
✅ Error handling

## What's Next

1. Test the API endpoints
2. Update frontend to fetch from backend
3. Remove localStorage dependency (or keep for caching)
4. Implement authentication (optional)
5. Setup Filament admin panel (optional)
6. Deploy to production

## Troubleshooting

**MySQL not running?**
```bash
sudo service mysql start
```

**Port 8000 already in use?**
```bash
php artisan serve --port=8001
```

**Database error in migrations?**
```bash
php artisan migrate:fresh --seed
```

**Need to check Laravel tinker?**
```bash
cd backend
php artisan tinker
Song::all()
```

---

**Everything is ready! Start both servers and begin development.** 🎵
