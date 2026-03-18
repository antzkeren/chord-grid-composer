<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\ChordController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShareController;

// CORS preflight handler - must be first
Route::options('{any}', function () {
    return response('', 200)
        ->header('Access-Control-Allow-Origin', '*')
        ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
        ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, X-CSRF-TOKEN')
        ->header('Access-Control-Allow-Credentials', 'true')
        ->header('Access-Control-Max-Age', '86400');
})->where('any', '.*');

// Public Auth Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
Route::post('/google-login', [AuthController::class, 'googleLogin']);
Route::post('/forgot-password', [AuthController::class, 'forgotPassword']);
Route::post('/reset-password', [AuthController::class, 'resetPassword']);

// Protected Routes (require authentication)
Route::middleware('auth:sanctum')->group(function () {
    Route::get('/user', [AuthController::class, 'me']);
    Route::post('/logout', [AuthController::class, 'logout']);
});

// Songs API - list and show require authentication to see private songs
Route::middleware('auth:sanctum')->group(function () {
    Route::get('songs', [SongController::class, 'index']);
    Route::get('songs/{song}', [SongController::class, 'show']);
    Route::post('songs', [SongController::class, 'store']);
    Route::put('songs/{song}', [SongController::class, 'update']);
    Route::patch('songs/{song}', [SongController::class, 'update']);
    Route::delete('songs/{song}', [SongController::class, 'destroy']);

    // bookmark toggling
    Route::post('songs/{song}/bookmark', [SongController::class, 'bookmark']);

    // duplicate/save-as
    Route::post('songs/{song}/duplicate', [SongController::class, 'duplicate']);
});

// Chords API (public for development)
Route::apiResource('chords', ChordController::class);

// ChordRows API (public for development)
Route::post('chord-rows', [ChordController::class, 'storeChordRow']);
Route::patch('chord-rows/{chordRow}', [ChordController::class, 'updateChordRow']);
Route::delete('chord-rows/{chordRow}', [ChordController::class, 'deleteChordRow']);

// Share API (public)
Route::post('/share', [ShareController::class, 'store']);
Route::get('/share/{shareId}', [ShareController::class, 'show']);
