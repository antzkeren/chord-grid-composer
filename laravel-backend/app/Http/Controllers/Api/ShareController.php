<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\SharedSong;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Auth;

class ShareController extends Controller
{
    /**
     * Store a new shared song.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'rows' => 'required|array',
            'owner_name' => 'required|string|max:255',
        ]);

        $sharedSong = SharedSong::create([
            'share_id' => SharedSong::generateShareId(),
            'title' => $validated['title'],
            'rows' => $validated['rows'],
            'owner_name' => $validated['owner_name'],
            'user_id' => Auth::id(),
        ]);

        return response()->json([
            'success' => true,
            'share_id' => $sharedSong->share_id,
            'url' => url('/shared/' . $sharedSong->share_id),
        ]);
    }

    /**
     * Get a shared song by share_id.
     */
    public function show(string $shareId): JsonResponse
    {
        $sharedSong = SharedSong::where('share_id', $shareId)->first();

        if (!$sharedSong) {
            return response()->json([
                'success' => false,
                'message' => 'Song not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'song' => [
                'id' => $sharedSong->share_id,
                'title' => $sharedSong->title,
                'rows' => $sharedSong->rows,
                'owner' => $sharedSong->owner_name,
                'created_at' => $sharedSong->created_at,
            ],
        ]);
    }
}
