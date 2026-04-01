<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\MovieController;
use App\Http\Controllers\Api\WatchlistController;
use App\Http\Controllers\Api\RatingController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CinemaController;
use App\Http\Controllers\Api\ShowtimeController;
use App\Http\Controllers\Api\GameController;
use App\Http\Controllers\Api\GameRoundController;
use App\Http\Controllers\Api\HeroBannerController;

Route::get('/movies', [MovieController::class, 'index']);
Route::get('/movies/{movie_id}', [MovieController::class, 'show']);
Route::get('/movies/search', [MovieController::class, 'search']);
Route::get('/movies/{movie_id}/ratings', [MovieController::class, 'ratings']);

Route::get('/cinemas', [CinemaController::class, 'index']);
Route::get('/cinemas/{cinema_id}', [CinemaController::class, 'show']);
Route::get('/cinemas/{cinema_id}/showtimes', [CinemaController::class, 'showtimes']);

Route::get('/showtimes', [ShowtimeController::class, 'index']);
Route::get('/showtimes/{showtime_id}', [ShowtimeController::class, 'show']);
Route::get('/showtimes/movie/{movie_id}', [ShowtimeController::class, 'byMovie']);

Route::get('/games', [GameController::class, 'index']);
Route::get('/games/{game_id}', [GameController::class, 'show']);
Route::get('/games/{game_id}/questions', [GameController::class, 'questions']);

Route::get('/game-rounds/leaderboard', [GameRoundController::class, 'leaderboard']);

Route::get('/hero-banners', [HeroBannerController::class, 'index']);
    
Route::middleware('web')->group(function () {  
    Route::get('/user', [UserController::class, 'profile']);
    Route::put('/user', [UserController::class, 'update']);
    Route::post('/user/logout', [UserController::class, 'logout']);
        
    Route::get('/watchlist', [WatchlistController::class, 'index']);
    Route::post('/watchlist', [WatchlistController::class, 'store']);
    Route::delete('/watchlist/{watchlist_id}', [WatchlistController::class, 'destroy']);
    Route::get('/watchlist/check/{movie_id}', [WatchlistController::class, 'check']);
        
    Route::get('/ratings/my', [RatingController::class, 'myRatings']);
    Route::post('/ratings', [RatingController::class, 'store']);
    Route::put('/ratings/{rating_id}', [RatingController::class, 'update']);
    Route::delete('/ratings/{rating_id}', [RatingController::class, 'destroy']);
    Route::get('/ratings/movie/{movie_id}/my', [RatingController::class, 'userMovieRating']);
        
    Route::get('/bookings', [BookingController::class, 'index']);
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/bookings/{booking_id}', [BookingController::class, 'show']);
    Route::put('/bookings/{booking_id}', [BookingController::class, 'update']);
    Route::delete('/bookings/{booking_id}', [BookingController::class, 'destroy']);
        
    Route::post('/game-rounds', [GameRoundController::class, 'store']);
    Route::get('/game-rounds', [GameRoundController::class, 'index']);
    Route::get('/game-rounds/{game_round_id}', [GameRoundController::class, 'show']);
    Route::post('/game-rounds/{game_round_id}/answer', [GameRoundController::class, 'submitAnswer']);
}); 