<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\SharedSongModel;
use App\Models\UserModel;
use CodeIgniter\HTTP\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class ShareController extends BaseController
{
    protected SharedSongModel $sharedSongModel;
    protected string $jwtSecret;

    public function __construct()
    {
        $this->sharedSongModel = new SharedSongModel();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'your-secret-key';
    }

    /**
     * Store a new shared song.
     */
    public function store()
    {
        $rules = [
            'title'     => 'required|string|max_length[255]',
            'rows'      => 'required|is_array',
            'owner_name' => 'required|string|max_length[255]',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $userId = null;
        $token = $this->request->getHeaderLine('Authorization');
        if ($token && str_starts_with($token, 'Bearer ')) {
            $token = substr($token, 7);
            try {
                $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
                $userId = $decoded->sub;
            } catch (\Exception $e) {
                // Continue without user
            }
        }

        $sharedSong = $this->sharedSongModel->insert([
            'share_id'  => SharedSongModel::generateShareId(),
            'title'     => $this->request->getVar('title'),
            'rows'      => $this->request->getVar('rows'),
            'owner_name' => $this->request->getVar('owner_name'),
            'user_id'   => $userId,
        ]);

        if (!$sharedSong) {
            return $this->response
                ->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON(['message' => 'Failed to create shared song']);
        }

        $sharedSongData = $this->sharedSongModel->find($sharedSong);

        return $this->response->setJSON([
            'success' => true,
            'share_id' => $sharedSongData['share_id'],
            'url' => base_url('/shared/' . $sharedSongData['share_id']),
        ]);
    }

    /**
     * Get a shared song by share_id.
     */
    public function show($shareId = null)
    {
        $sharedSong = $this->sharedSongModel->where('share_id', $shareId)->first();

        if (!$sharedSong) {
            return $this->response
                ->setStatusCode(Response::HTTP_NOT_FOUND)
                ->setJSON([
                    'success' => false,
                    'message' => 'Song not found',
                ]);
        }

        return $this->response->setJSON([
            'success' => true,
            'song' => [
                'id'         => $sharedSong['share_id'],
                'title'      => $sharedSong['title'],
                'rows'       => $sharedSong['rows'],
                'owner'      => $sharedSong['owner_name'],
                'created_at' => $sharedSong['created_at'],
            ],
        ]);
    }
}
