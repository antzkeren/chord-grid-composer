<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Chord;
use App\Models\ChordRow;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class ChordController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        $chords = Chord::with('song')->get();
        return response()->json($chords);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
            'note' => 'required|string',
            'chord_name' => 'required|string',
        ]);

        $chord = Chord::create($validated);
        return response()->json($chord, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Chord $chord): JsonResponse
    {
        return response()->json($chord->load('song'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Chord $chord): JsonResponse
    {
        $validated = $request->validate([
            'note' => 'sometimes|string',
            'chord_name' => 'sometimes|string',
        ]);

        $chord->update($validated);
        return response()->json($chord);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Chord $chord): JsonResponse
    {
        $chord->delete();
        return response()->json(null, 204);
    }

    /**
     * Store chord row
     */
    public function storeChordRow(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'song_id' => 'required|exists:songs,id',
            'row_index' => 'required|integer',
            'chords' => 'nullable|array',
        ]);

        $chordRow = ChordRow::create($validated);
        return response()->json($chordRow, 201);
    }

    /**
     * Update chord row
     */
    public function updateChordRow(Request $request, ChordRow $chordRow): JsonResponse
    {
        $validated = $request->validate([
            'row_index' => 'sometimes|integer',
            'chords' => 'nullable|array',
        ]);

        $chordRow->update($validated);
        return response()->json($chordRow);
    }

    /**
     * Delete chord row
     */
    public function deleteChordRow(ChordRow $chordRow): JsonResponse
    {
        $chordRow->delete();
        return response()->json(null, 204);
    }
}
