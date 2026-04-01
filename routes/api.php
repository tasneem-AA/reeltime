<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;

// Public API endpoints
Route::get('/games', [GameController::class, 'getAllGames'])->name('api.games');
Route::get('/games/{gameId}/questions', [GameController::class, 'getGameQuestions'])->name('api.game.questions');
Route::get('/leaderboard', [GameController::class, 'getLeaderboard'])->name('api.leaderboard');
Route::get('/leaderboard/{gameId}', [GameController::class, 'getLeaderboard'])->name('api.game.leaderboard');

// Protected API endpoints - require authentication
Route::middleware(['check.auth'])->group(function () {
    Route::post('/game-rounds', [GameController::class, 'saveGameRound'])->name('api.game-round.store');
    Route::get('/user/game-stats', [GameController::class, 'getUserGameStats'])->name('api.user.game-stats');
});
