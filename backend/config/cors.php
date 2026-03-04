<?php

return [
    'paths' => ['api/*', 'sanctum/csrf-cookie'],
    'allowed_methods' => ['*'],
    'allowed_origins' => [
        'http://localhost:8080', 
        'http://localhost:8081', // Vite auto‑switched port
        'http://localhost:5173', 
        'http://127.0.0.1:5173', 
        'http://127.0.0.1:8080',
        'http://127.0.0.1:8081',
        'http://192.168.1.35:8080',
        'http://192.168.1.35:5173',
        'http://192.168.1.35:8081',
        // Production - use FRONTEND_URL env variable
        env('FRONTEND_URL', ''),
    ],
    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
