<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\SongModel;
use App\Models\ChordRowModel;
use CodeIgniter\HTTP\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class SongController extends BaseController
{
    protected SongModel $songModel;
    protected ChordRowModel $chordRowModel;
    protected string $jwtSecret;

    public function __construct()
    {
        $this->songModel = new SongModel();
        $this->chordRowModel = new ChordRowModel();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'your-secret-key';
    }

    /**
     * Display a listing of songs the current user is allowed to see.
     */
    public function index()
    {
        $user = $this->getAuthenticatedUser();
        
        $songs = $this->songModel
            ->with(['chords', 'chordRows', 'owner'])
            ->visibleTo($user ? $user['id'] : null)
            ->findAll();

        return $this->response->setJSON($songs);
    }

    /**
     * Store a newly created song. Ownership and default visibility are set
     * based on the authenticated user.
     */
    public function store()
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized']);
        }

        $rules = [
            'title' => 'required|string',
            'artist' => 'permit_empty|string',
            'key' => 'permit_empty|string',
            'notes' => 'permit_empty|string',
            'visibility' => 'permit_empty|in_list[public,unlisted,private]',
            'tempo' => 'permit_empty|integer|min_length[1]',
            'time_signature' => 'permit_empty|string',
            'base_chord' => 'permit_empty|string',
            'rows' => 'permit_empty|is_array',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [
            'title'       => $this->request->getVar('title'),
            'artist'      => $this->request->getVar('artist'),
            'key'         => $this->request->getVar('key'),
            'notes'       => $this->request->getVar('notes'),
            'visibility'  => $this->request->getVar('visibility') ?? 'public',
            'tempo'       => $this->request->getVar('tempo'),
            'time_signature' => $this->request->getVar('time_signature'),
            'base_chord'  => $this->request->getVar('base_chord'),
            'user_id'     => $user['id'],
        ];

        $songId = $this->songModel->insert($data);

        if (!$songId) {
            return $this->response
                ->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON(['message' => 'Failed to create song']);
        }

        // Save chord rows if provided
        $rows = $this->request->getVar('rows');
        if (!empty($rows)) {
            foreach ($rows as $index => $row) {
                $this->chordRowModel->insert([
                    'song_id'   => $songId,
                    'row_index' => $index,
                    'chords'    => $row['cells'] ?? [],
                ]);
            }
        }

        $song = $this->songModel->with(['owner'])->find($songId);

        return $this->response
            ->setStatusCode(Response::HTTP_CREATED)
            ->setJSON($song);
    }

    /**
     * Display the specified song. Throws 403 if the song is private and the
     * requester is not the owner.
     */
    public function show($id = null)
    {
        $user = $this->getAuthenticatedUser();
        
        $song = $this->songModel->with(['chords', 'chordRows', 'owner'])->find($id);

        if (!$song) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Song not found']);
        }

        if ($song['visibility'] === 'private' && (!$user || $user['id'] !== $song['user_id'])) {
            return $this->response
                ->setStatusCode(Response::HTTP_FORBIDDEN)
                ->setJSON(['message' => 'Forbidden']);
        }

        return $this->response->setJSON($song);
    }

    /**
     * Update the specified song. Only owner may update.
     */
    public function update($id = null)
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized']);
        }

        $song = $this->songModel->find($id);
        if (!$song) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Song not found']);
        }

        if ($user['id'] !== $song['user_id']) {
            return $this->response
                ->setStatusCode(Response::HTTP_FORBIDDEN)
                ->setJSON(['message' => 'Forbidden']);
        }

        $rules = [
            'title' => 'permit_empty|string',
            'artist' => 'permit_empty|string',
            'key' => 'permit_empty|string',
            'notes' => 'permit_empty|string',
            'visibility' => 'permit_empty|in_list[public,unlisted,private]',
            'tempo' => 'permit_empty|integer|min_length[1]',
            'time_signature' => 'permit_empty|string',
            'base_chord' => 'permit_empty|string',
            'rows' => 'permit_empty|is_array',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [
            'title'       => $this->request->getVar('title') ?? $song['title'],
            'artist'      => $this->request->getVar('artist') ?? $song['artist'],
            'key'         => $this->request->getVar('key') ?? $song['key'],
            'notes'       => $this->request->getVar('notes') ?? $song['notes'],
            'visibility'  => $this->request->getVar('visibility') ?? $song['visibility'],
            'tempo'       => $this->request->getVar('tempo') ?? $song['tempo'],
            'time_signature' => $this->request->getVar('time_signature') ?? $song['time_signature'],
            'base_chord'  => $this->request->getVar('base_chord') ?? $song['base_chord'],
        ];

        $this->songModel->update($id, $data);

        // Update chord rows if provided
        $rows = $this->request->getVar('rows');
        if ($rows !== null) {
            // Delete existing chord rows
            $this->chordRowModel->where('song_id', $id)->delete();

            // Create new chord rows
            foreach ($rows as $index => $row) {
                $this->chordRowModel->insert([
                    'song_id'   => $id,
                    'row_index' => $index,
                    'chords'    => $row['cells'] ?? [],
                ]);
            }
        }

        return $this->response->setJSON($this->songModel->find($id));
    }

    /**
     * Delete a song. Only the owner can delete.
     */
    public function delete($id = null)
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized']);
        }

        $song = $this->songModel->find($id);
        if (!$song) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON(['message' => 'Song not found']);
        }

        if ($user['id'] !== $song['user_id']) {
            return $this->response
                ->setStatusCode(Response::HTTP_FORBIDDEN)
                ->setJSON(['message' => 'Forbidden']);
        }

        $this->songModel->delete($id);

        return $this->response->setStatusCode(Response::HTTP_NO_CONTENT);
    }

    /**
     * Get authenticated user from token
     */
    protected function getAuthenticatedUser(): ?array
    {
        $token = $this->request->getHeaderLine('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return null;
        }

        $token = substr($token, 7);

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            $userModel = new UserModel();
            return $userModel->find($decoded->sub);
        } catch (\Exception $e) {
            return null;
        }
    }
}
