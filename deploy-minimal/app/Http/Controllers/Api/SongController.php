<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Song;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class SongController extends Controller
{
    public function __construct()
    {
        // only authenticated users may create, update, delete, bookmark or duplicate
        $this->middleware('auth:sanctum')->only(['store','update','destroy','bookmark','duplicate']);
    }

    /**
     * Display a listing of songs the current user is allowed to see.
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $songs = Song::with(['chords', 'chordRows', 'owner'])
                     ->visibleTo($user)
                     ->withCount('bookmarks')
                     ->get();
        return response()->json($songs);
    }

    /**
     * Store a newly created song. Ownership and default visibility are set
     * based on the authenticated user.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string',
            'artist' => 'nullable|string',
            'key' => 'nullable|string',
            'notes' => 'nullable|string',
            'visibility' => 'in:public,unlisted,private',
            'tempo' => 'nullable|integer|min:1',
            'time_signature' => 'nullable|string',
            'base_chord' => 'nullable|string',
            'rows' => 'nullable|array',
        ]);

        $song = new Song($validated);
        $song->user_id = $request->user()->id;
        $song->save();

        // Save chord rows if provided
        if (!empty($validated['rows'])) {
            foreach ($validated['rows'] as $index => $row) {
                $song->chordRows()->create([
                    'row_index' => $index,
                    'chords' => $row['cells'] ?? [],
                ]);
            }
        }

        return response()->json($song->load('owner'), 201);
    }

    /**
     * Display the specified song. Throws 403 if the song is private and the
     * requester is not the owner.
     */
    public function show(Request $request, Song $song): JsonResponse
    {
        $user = $request->user();
        if ($song->visibility === 'private' && (!$user || $user->id !== $song->user_id)) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json($song->load(['chords', 'chordRows', 'owner'])->loadCount('bookmarks'));
    }

    /**
     * Update the specified song. Only owner may update.
     */
    public function update(Request $request, Song $song): JsonResponse
    {
        $user = $request->user();
        if ($user->id !== $song->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $validated = $request->validate([
            'title' => 'sometimes|string',
            'artist' => 'nullable|string',
            'key' => 'nullable|string',
            'notes' => 'nullable|string',
            'visibility' => 'in:public,unlisted,private',
            'tempo' => 'nullable|integer|min:1',
            'time_signature' => 'nullable|string',
            'base_chord' => 'nullable|string',
            'rows' => 'nullable|array',
        ]);

        $song->update($validated);

        // Update chord rows if provided
        if (!empty($validated['rows'])) {
            // Delete existing chord rows
            $song->chordRows()->delete();
            
            // Create new chord rows
            foreach ($validated['rows'] as $index => $row) {
                $song->chordRows()->create([
                    'row_index' => $index,
                    'chords' => $row['cells'] ?? [],
                ]);
            }
        }

        return response()->json($song);
    }

    /**
     * Delete a song. Only the owner can delete.
     */
    public function destroy(Request $request, Song $song): JsonResponse
    {
        $user = $request->user();
        if ($user->id !== $song->user_id) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $song->delete();
        return response()->json(null, 204);
    }

    /**
     * Toggle bookmark for the current user.
     */
    public function bookmark(Request $request, Song $song): JsonResponse
    {
        $user = $request->user();
        if ($user->bookmarks()->where('song_id', $song->id)->exists()) {
            $user->bookmarks()->detach($song->id);
            $msg = 'removed';
        } else {
            $user->bookmarks()->attach($song->id);
            $msg = 'added';
        }
        return response()->json(['message' => "bookmark {$msg}"]); 
    }

    /**
     * Duplicate a song ("save as"). The copy belongs to the authenticated
     * user and original_song_id is set. Chords and chord rows are cloned.
     */
    public function duplicate(Request $request, Song $song): JsonResponse
    {
        $user = $request->user();
        $copy = $song->replicate(['title','artist','key','notes','tempo','time_signature','base_chord']);
        $copy->user_id = $user->id;
        $copy->original_song_id = $song->id;
        $copy->visibility = 'private';
        $copy->save();

        // clone relations
        foreach ($song->chords as $chord) {
            $copy->chords()->create($chord->toArray());
        }
        foreach ($song->chordRows as $row) {
            $copy->chordRows()->create($row->toArray());
        }

        return response()->json($copy, 201);
    }
}
