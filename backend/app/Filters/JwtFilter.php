<?php

namespace App\Filters;

use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\ResponseInterface;
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use App\Models\UserModel;

class JwtFilter implements FilterInterface
{
    protected string $jwtSecret;

    public function __construct()
    {
        $this->jwtSecret = getenv('JWT_SECRET') ?: 'your-secret-key';
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        $token = $request->getHeaderLine('Authorization');

        if (!$token || !str_starts_with($token, 'Bearer ')) {
            return response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized - No token provided']);
        }

        $token = substr($token, 7);

        try {
            $decoded = JWT::decode($token, new Key($this->jwtSecret, 'HS256'));
            
            $userModel = new UserModel();
            $user = $userModel->find($decoded->sub);

            if (!$user) {
                return response()
                    ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                    ->setJSON(['message' => 'Unauthorized - User not found']);
            }

            // Add user to request
            $request->user = $user;

        } catch (\Exception $e) {
            return response()
                ->setStatusCode(ResponseInterface::HTTP_UNAUTHORIZED)
                ->setJSON(['message' => 'Unauthorized - Invalid token']);
        }
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Nothing to do here
    }
}
