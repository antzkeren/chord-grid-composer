<?php

namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\UserModel;
use CodeIgniter\HTTP\Response;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;

class AuthController extends BaseController
{
    protected UserModel $userModel;
    protected string $jwtSecret;

    public function __construct()
    {
        $this->userModel = new UserModel();
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'your-secret-key';
    }

    /**
     * Register a new user
     */
    public function register()
    {
        $rules = [
            'name'     => 'required|string|max_length[255]',
            'email'    => 'required|valid_email|max_length[255]|is_unique[users.email]',
            'password' => 'required|min_length[8]',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $data = [
            'name'     => $this->request->getVar('name'),
            'email'    => $this->request->getVar('email'),
            'password' => password_hash($this->request->getVar('password'), PASSWORD_BCRYPT),
        ];

        $user = $this->userModel->insert($data);

        if (!$user) {
            return $this->response
                ->setStatusCode(Response::HTTP_INTERNAL_SERVER_ERROR)
                ->setJSON(['message' => 'Failed to create user']);
        }

        $token = $this->generateToken($user);

        return $this->response
            ->setStatusCode(Response::HTTP_CREATED)
            ->setJSON([
                'user'  => $this->userModel->find($user),
                'token' => $token,
            ]);
    }

    /**
     * Login user and create token
     */
    public function login()
    {
        $rules = [
            'email'    => 'required|valid_email',
            'password' => 'required',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $email    = $this->request->getVar('email');
        $password = $this->request->getVar('password');

        $user = $this->userModel->where('email', $email)->first();

        if (!$user || !password_verify($password, $user['password'])) {
            return $this->response
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Invalid credentials']);
        }

        // Generate new token
        $token = $this->generateToken($user);

        return $this->response
            ->setJSON([
                'user'  => $user,
                'token' => $token,
            ]);
    }

    /**
     * Get authenticated user
     */
    public function me()
    {
        $user = $this->getAuthenticatedUser();
        if (!$user) {
            return $this->response
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized']);
        }

        return $this->response->setJSON($user);
    }

    /**
     * Logout user (revoke token - client side token removal)
     */
    public function logout()
    {
        return $this->response->setJSON(['message' => 'Logged out successfully']);
    }

    /**
     * Handle Google OAuth login
     */
    public function googleLogin()
    {
        $rules = [
            'google_id' => 'required|string',
            'email'    => 'required|valid_email',
            'name'     => 'required|string',
        ];

        if (!$this->validate($rules)) {
            return $this->response
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON(['errors' => $this->validator->getErrors()]);
        }

        $googleId = $this->request->getVar('google_id');
        $email    = $this->request->getVar('email');
        $name     = $this->request->getVar('name');

        // Find user by Google ID or email
        $user = $this->userModel->where('google_id', $googleId)
            ->orWhere('email', $email)
            ->first();

        if ($user) {
            // Update existing user with Google ID if not set
            if (empty($user['google_id'])) {
                $this->userModel->update($user['id'], ['google_id' => $googleId]);
            }
        } else {
            // Create new user
            $userId = $this->userModel->insert([
                'name'      => $name,
                'email'     => $email,
                'google_id' => $googleId,
                'password'  => password_hash(bin2hex(random_bytes(12)), PASSWORD_BCRYPT),
            ]);
            $user = $this->userModel->find($userId);
        }

        $token = $this->generateToken($user);

        return $this->response->setJSON([
            'user'  => $user,
            'token' => $token,
        ]);
    }

    /**
     * Generate JWT token
     */
    protected function generateToken(array $user): string
    {
        $iat = time();
        $exp = $iat + 3600 * 24; // 24 hours

        $payload = [
            'iss'  => 'chord-grid-composer',
            'aud'  => 'chord-grid-composer',
            'sub'  => $user['id'],
            'iat'  => $iat,
            'exp'  => $exp,
            'user' => [
                'id'   => $user['id'],
                'name' => $user['name'],
                'email'=> $user['email'],
            ],
        ];

        return JWT::encode($payload, $this->jwtSecret, 'HS256');
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
            return $this->userModel->find($decoded->sub);
        } catch (\Exception $e) {
            return null;
        }
    }
}
