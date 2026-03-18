# Railway + MySQL Deployment Guide

## 1. Buat Project di Railway

1. Buka https://railway.app
2. Login dengan GitHub
3. Klik **"New Project"**
4. Pilih **"Deploy from GitHub repo"**
5. Select repository: `chord-grid-composer`
6. **Penting**: Pada Root Directory, isi: `backend`

## 2. Tambah MySQL Database

1. Di Railway dashboard, klik **"+ New"** (atau tombol + di project)
2. Pilih **"MySQL"**
3. Tunggu sampai selesai provisioning
4. Klik **"MySQL"** → tab **"Connect"**
5. Copy semua variabel database (DB_HOST, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD)

## 3. Setup Environment Variables

Di Railway project → tab **"Variables"**, tambah:

```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx=
FRONTEND_URL=https://chord-grid-composer.vercel.app

# Database - sudah dikonfigurasi
DB_CONNECTION=mysql
DB_HOST=nozomi.proxy.rlwy.net
DB_PORT=57534
DB_DATABASE=railway
DB_USERNAME=root
DB_PASSWORD=NcpnUaddxyYUvQdDepvdxZUiTIggrSVz
```

**CATATAN: Production Database Credentials:**
```
DB_HOST: nozomi.proxy.rlwy.net
DB_PORT: 57534
DB_DATABASE: railway
DB_USERNAME: root
DB_PASSWORD: NcpnUaddxyYUvQdDepvdxZUiTIggrSVz
```

**Generate APP_KEY:**
```bash
# Di local (sudah ada di backend/.env)
php artisan key:generate
```
 Atau bisa generate di https://generate.laravel-apotek-app.com

## 4. Build & Deploy

1. Railway akan auto-detect Dockerfile dari folder `backend`
2. Pastikan Root Directory = `backend`
3. Klik **"Deploy"** atau tunggu auto-deploy dari GitHub
4. Cek logs untuk memastikan tidak ada error

**Penting:** Pastikan file-file ini ada di folder `backend/`:
- `Dockerfile` - Mendefinisikan image PHP dengan ekstensi `intl` dan `zip`
- `railway.json` - Konfigurasi build Railway
- `composer.json` dan `composer.lock` - Dependencies Laravel

## 5. Run Migration

1. Di Railway dashboard → **"Deployments"** → klik deployment terbaru
2. Atau pakai Railway CLI:
```bash
npm i -g @railway/cli
railway login
railway link
railway run php artisan migrate
```

## 6. Setup Storage (untuk upload gambar)

```bash
railway run php artisan storage:link
```

## 7. Jika Gagal

**Cek common issues:**
- Pastikan ROOT DIRECTORY = `backend`
- Pastikan `FRONTEND_URL` sudah benar (tanpa trailing slash)
- Pastikan `APP_KEY` sudah di-set

## 8. Setelah Sukses

Copy URL Railway (contoh: `https://chord-grid-composer-backend.up.railway.app`)

Nanti untuk Vercel frontend, tambah env:
```
VITE_API_URL=https://chord-grid-composer-production.up.railway.app/api
```
