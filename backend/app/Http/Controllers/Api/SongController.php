<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SongController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $songs = Song::with(['chords', 'chordRows'])->get();
        return response()->json($songs);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'artist' => 'nullable|string',
            'key' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_bookmarked' => 'boolean',
        ]);

        $song = Song::create($validated);
        return response()->json($song, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Song $song): JsonResponse
    {
        return response()->json($song->load(['chords', 'chordRows']));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Song $song): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'sometimes|string',
            'artist' => 'nullable|string',
            'key' => 'nullable|string',
            'notes' => 'nullable|string',
            'is_bookmarked' => 'boolean',
        ]);

        $song->update($validated);
        return response()->json($song);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Song $song): JsonResponse
    {
        $song->delete();
        return response()->json(null, 204);
    }
}
