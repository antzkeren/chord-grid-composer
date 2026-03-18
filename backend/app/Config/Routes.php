<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// API Routes
$routes->group('api', ['filter' => 'cors'], function ($routes) {
    
    // Auth routes (public)
    $routes->post('auth/register', 'Api\AuthController::register');
    $routes->post('auth/login', 'Api\AuthController::login');
    $routes->post('auth/google', 'Api\AuthController::googleLogin');

    // Protected auth routes
    $routes->get('auth/me', 'Api\AuthController::me', ['filter' => 'jwt']);
    $routes->post('auth/logout', 'Api\AuthController::logout', ['filter' => 'jwt']);

    // Song routes
    $routes->get('songs', 'Api\SongController::index');
    $routes->get('songs/(:num)', 'Api\SongController::show/$1');
    $routes->post('songs', 'Api\SongController::store', ['filter' => 'jwt']);
    $routes->put('songs/(:num)', 'Api\SongController::update/$1', ['filter' => 'jwt']);
    $routes->delete('songs/(:num)', 'Api\SongController::delete/$1', ['filter' => 'jwt']);

    // Chord routes
    $routes->get('chords', 'Api\ChordController::index');
    $routes->get('chords/(:num)', 'Api\ChordController::show/$1');
    $routes->post('chords', 'Api\ChordController::store', ['filter' => 'jwt']);
    $routes->put('chords/(:num)', 'Api\ChordController::update/$1', ['filter' => 'jwt']);
    $routes->delete('chords/(:num)', 'Api\ChordController::delete/$1', ['filter' => 'jwt']);

    // Chord row routes
    $routes->post('chord-rows', 'Api\ChordController::storeChordRow', ['filter' => 'jwt']);
    $routes->put('chord-rows/(:num)', 'Api\ChordController::updateChordRow/$1', ['filter' => 'jwt']);
    $routes->delete('chord-rows/(:num)', 'Api\ChordController::deleteChordRow/$1', ['filter' => 'jwt']);

    // Share routes
    $routes->post('share', 'Api\ShareController::store');
    $routes->get('share/(:alnum)', 'Api\ShareController::show/$1');
});
