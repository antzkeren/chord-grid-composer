#!/bin/bash

# MusicGrid Service Shutdown Script
# Stops both frontend and backend services

echo "🛑 Stopping MusicGrid services..."

# Kill npm/vite processes (frontend)
echo "📦 Stopping Frontend..."
pkill -f "vite" 2>/dev/null
pkill -f "npm run dev" 2>/dev/null

# Kill PHP artisan serve processes (backend)
echo "🔧 Stopping Backend..."
pkill -f "php artisan serve" 2>/dev/null

# Also kill any node and php processes on specific ports
fuser -k 8080/tcp 2>/dev/null
fuser -k 8000/tcp 2>/dev/null

echo ""
echo "✅ Services stopped successfully!"
echo ""
echo "To start services again, run: ./startup.sh"
