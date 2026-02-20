<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\SongController;
use App\Http\Controllers\Api\ChordController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ShareController;

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

// Songs API
// list/show may be public (visibility rules applied in controller),
// but creation, updates and special actions require authentication.
Route::get('songs', [SongController::class, 'index']);
Route::get('songs/{song}', [SongController::class, 'show']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('songs', [SongController::class, 'store']);
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
