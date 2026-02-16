# 🎵 MusicGrid - Full Stack Setup Guide

Complete setup guide untuk menjalankan **MusicGrid** dengan React Frontend + Laravel Backend.

## 📋 System Requirements

- **Node.js** 18+ (untuk React frontend)
- **PHP** 8.2+ (untuk Laravel backend)
- **Composer** (untuk PHP dependency management)
- **npm** atau **bun** (untuk frontend package manager)
- **SQLite** (sudah built-in dengan PHP) atau **MySQL** (untuk production)

## 🚀 Quick Start (Development)

### 1. Terminal 1 - Frontend (React + Vite)
```bash
cd /home/saika/Downloads/musicgrid

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or  
bun run dev
```

Frontend akan berjalan di: **http://localhost:5173**

### 2. Terminal 2 - Backend (Laravel)
```bash
cd /home/saika/Downloads/musicgrid/backend

# Database sudah tersetup dengan SQLite
# Jika belum, jalankan:
php artisan migrate
php artisan db:seed --class=SongSeeder

# Start Laravel development server
php artisan serve
```

Backend akan berjalan di: **http://localhost:8000**

## 🎯 Access Points

| Service | URL | Purpose |
|---------|-----|---------|
| **Frontend** | http://localhost:5173 | React app |
| **API** | http://localhost:8000/api | REST API endpoints |
| **Admin Panel** | http://localhost:8000/admin | Filament admin (Filament) |

## 📊 Tech Stack Summary

### Frontend
```
├── React 18.3.1
├── TypeScript
├── Vite (build tool)
├── React Router
├── React Hook Form
├── TanStack Query
├── Tailwind CSS
└── shadcn/ui
```

### Backend
```
├── Laravel 12
├── PHP 8.3
├── Filament (Admin Panel)
├── SQLite (development)
└── RESTful API
```

## 🔄 Data Flow Architecture

```
┌─────────────────────────────────────────────┐
│        React Frontend (Port 5173)            │
│  - ChordGrid Component                       │
│  - SongLibrary Component                     │
│  - Local State Management (React Query)      │
└──────────────────┬──────────────────────────┘
                   │
                   │ HTTP Requests (CORS enabled)
                   │
                   ▼
┌─────────────────────────────────────────────┐
│        Laravel Backend API (Port 8000)       │
│  - Song Controller                           │
│  - Chord Controller                          │
│  - Validation & Business Logic               │
└──────────────────┬──────────────────────────┘
                   │
                   │ SQL Queries
                   │
                   ▼
┌─────────────────────────────────────────────┐
│     SQLite Database (development)            │
│  - songs table                               │
│  - chords table                              │
│  - chord_rows table                          │
└─────────────────────────────────────────────┘
```

## 🔧 API Integration

Frontend communicates dengan backend API:

```typescript
// Example: Fetch songs from backend
const response = await fetch('http://localhost:8000/api/songs');
const songs = await response.json();
```

API base URL dapat dikonfigurasi di environment atau constants.

## 🛠️ Development Workflow

### 1. Making Database Changes

**Add new field to Songs table:**
```bash
cd backend
php artisan make:model Song -m  # Create new migration
# Edit migration file
php artisan migrate
```

### 2. Adding New API Endpoints

**Create new controller:**
```bash
cd backend
php artisan make:controller Api/CategoryController --api
# Add routes in routes/api.php
```

### 3. Frontend Component Updates

**Update React components:**
```bash
cd /home/saika/Downloads/musicgrid
# Edit src/components/*.tsx
# Changes auto-reload with HMR (Hot Module Replacement)
```

## 📦 Building for Production

### Frontend Build
```bash
cd /home/saika/Downloads/musicgrid
npm run build
# Output: dist/ folder ready for deployment
```

### Backend Deployment
```bash
cd backend
# Set production environment variables in .env
DB_CONNECTION=mysql  # Use MySQL in production
php artisan migrate --force
php artisan cache:clear
```

## 🐛 Troubleshooting

### Frontend not connecting to API
- Check CORS configuration in `backend/config/cors.php`
- Ensure backend is running on port 8000
- Check browser console for CORS errors

### Database issues
```bash
cd backend
php artisan migrate:fresh  # Reset database
php artisan db:seed --class=SongSeeder  # Re-seed data
```

### Port conflicts
```bash
# Run frontend on different port
npm run dev -- --port 3000

# Run backend on different port
php artisan serve --port 9000
# Update API URL in frontend to http://localhost:9000/api
```

## 📚 Additional Documentation

- [Frontend Setup](./README.md)
- [Backend API Docs](./backend/API_DOCUMENTATION.md)
- [Database Schema](./backend/SETUP.md)

## 🎓 Learning Resources

- [React Documentation](https://react.dev)
- [Vite Guide](https://vitejs.dev)
- [Laravel Documentation](https://laravel.com/docs)
- [Filament Documentation](https://filamentphp.com)

---

**Happy Coding!** 🎶
