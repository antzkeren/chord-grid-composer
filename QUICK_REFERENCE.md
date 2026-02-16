# Quick Reference - MusicGrid Commands

## 🚀 Starting the Application

```bash
# Terminal 1: Frontend
cd /home/saika/Downloads/musicgrid
npm run dev

# Terminal 2: Backend
cd /home/saika/Downloads/musicgrid/backend
php artisan serve
```

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000/api |
| Admin Panel | http://localhost:8000/admin |
| Database (SQLite) | database/database.sqlite |

## 📦 Frontend Commands

```bash
cd /home/saika/Downloads/musicgrid

npm install          # Install dependencies
npm run dev         # Start development server
npm run build       # Build for production
npm run preview     # Preview production build
npm run lint        # Run linter
npm run test        # Run tests
npm run test:watch  # Run tests in watch mode
```

## 🔧 Backend Commands

```bash
cd /home/saika/Downloads/musicgrid/backend

# Server
php artisan serve                           # Start dev server
php artisan serve --port 9000              # Start on different port

# Database
php artisan migrate                         # Run migrations
php artisan migrate:fresh                   # Reset database
php artisan migrate:fresh --seed           # Reset and seed
php artisan db:seed --class=SongSeeder     # Seed specific seeder
php artisan tinker                         # Interactive console

# Cache & Config
php artisan cache:clear                    # Clear cache
php artisan config:clear                   # Clear config cache
php artisan route:list                     # List all routes
php artisan view:clear                     # Clear views

# Artisan Generators
php artisan make:model ModelName -m        # Make model with migration
php artisan make:controller ControllerName # Make controller
php artisan make:migraton migration_name   # Make migration
php artisan make:seeder SeederName         # Make seeder

# Filament
php artisan filament:install --panels      # Install Filament
php artisan make:filament-resource ModelName # Make resource
```

## 🧪 Testing API

```bash
# Run test script
bash backend/test-api.sh

# Or use curl
curl http://localhost:8000/api/songs

# Get specific song
curl http://localhost:8000/api/songs/1

# Create song
curl -X POST http://localhost:8000/api/songs \
  -H "Content-Type: application/json" \
  -d '{"title":"Song","artist":"Artist","key":"C"}'

# Update song
curl -X PATCH http://localhost:8000/api/songs/1 \
  -H "Content-Type: application/json" \
  -d '{"key":"G"}'

# Delete song
curl -X DELETE http://localhost:8000/api/songs/1
```

## 📂 Important Files

**Frontend:**
- `src/main.tsx` - Entry point
- `src/App.tsx` - Main component
- `src/components/` - React components
- `src/hooks/` - Custom hooks
- `vite.config.ts` - Vite configuration
- `package.json` - Dependencies

**Backend:**
- `app/Models/` - Eloquent models
- `app/Http/Controllers/Api/` - API controllers
- `routes/api.php` - API routes
- `database/migrations/` - Database migrations
- `database/seeders/` - Data seeders
- `.env` - Configuration
- `config/cors.php` - CORS settings

## 🐛 Common Issues & Fixes

**"Connection refused" error:**
```bash
# Make sure both servers are running
# Terminal 1: npm run dev
# Terminal 2: php artisan serve
```

**CORS errors from frontend:**
```bash
# Check config/cors.php includes frontend URL
# Restart backend: php artisan serve
```

**Database errors:**
```bash
# Reset database
php artisan migrate:fresh --seed

# Make sure SQLite file exists
ls -la backend/database/database.sqlite
```

**Port already in use:**
```bash
# Use different port
php artisan serve --port 9000
npm run dev -- --port 3000
```

## 📊 API Response Examples

**Get all songs:**
```json
[
  {
    "id": 1,
    "title": "Let It Be",
    "artist": "The Beatles",
    "key": "C",
    "notes": "Classic Beatles song",
    "is_bookmarked": true,
    "created_at": "2026-02-10T10:30:00Z",
    "updated_at": "2026-02-10T10:30:00Z"
  }
]
```

**Create song (POST):**
```json
{
  "title": "New Song",
  "artist": "Artist Name",
  "key": "G",
  "notes": "Optional notes",
  "is_bookmarked": false
}
```

## 🔗 API Endpoints

**Songs:**
- GET `/api/songs` - List all
- POST `/api/songs` - Create
- GET `/api/songs/{id}` - Get one
- PATCH `/api/songs/{id}` - Update
- DELETE `/api/songs/{id}` - Delete

**Chords:**
- GET `/api/chords` - List all
- POST `/api/chords` - Create
- GET `/api/chords/{id}` - Get one
- PATCH `/api/chords/{id}` - Update
- DELETE `/api/chords/{id}` - Delete

**Chord Rows:**
- POST `/api/chord-rows` - Create
- PATCH `/api/chord-rows/{id}` - Update
- DELETE `/api/chord-rows/{id}` - Delete

## 📖 Documentation Files

- `README.md` - Project overview
- `FULLSTACK_SETUP.md` - Complete setup guide
- `backend/API_DOCUMENTATION.md` - Detailed API docs
- `backend/SETUP.md` - Backend setup
- `BACKEND_SETUP_COMPLETE.md` - Summary (this folder root)

## ⚡ Performance Tips

1. **Enable query caching**: `php artisan config:cache`
2. **Optimize autoloader**: `composer dump-autoload --optimize`
3. **Frontend bundling**: `npm run build` for production
4. **Database indexing**: Add indexes to frequently queried columns

## 🎓 Learning Resources

- [Laravel Docs](https://laravel.com/docs)
- [Filament Docs](https://filamentphp.com)
- [React Docs](https://react.dev)
- [Vite Docs](https://vitejs.dev)
- [Tailwind CSS](https://tailwindcss.com)

---

**Bookmark this page for quick reference!** 📌
