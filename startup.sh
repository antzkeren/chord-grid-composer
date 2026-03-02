#!/bin/bash

# MusicGrid Service Startup Script
# Starts both frontend and backend services

echo "🚀 Starting MusicGrid services..."

# Start frontend (React/Vite)
echo "📦 Starting Frontend (Vite)..."
cd /home/saika/Downloads/musicgrid/chord-grid-composer
npm run dev &
FRONTEND_PID=$!

# Wait a moment for frontend to start
sleep 2

# Start backend (Laravel)
echo "🔧 Starting Backend (Laravel)..."
cd /home/saika/Downloads/musicgrid/chord-grid-composer/backend
php artisan serve --host=0.0.0.0 --port=8000 &
BACKEND_PID=$!

echo ""
echo "✅ Services started successfully!"
echo "   Frontend: http://localhost:8080"
echo "   Backend:  http://localhost:8000"
echo ""
echo "To stop services, run: ./shutdown.sh"
