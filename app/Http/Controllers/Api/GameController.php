<?php

namespace App\Http\Controllers\Api;

use App\Models\Game;
use Illuminate\Http\Request;

class GameController extends Controller
{
    /**
     * Get all games
     */
    public function index()
    {
        $games = Game::withCount('gameRounds')->paginate(10);
        return response()->json($games);
    }

    /**
     * Get single game
     */
    public function show($game_id)
    {
        $game = Game::where('game_id', $game_id)
            ->with('questions')
            ->firstOrFail();

        return response()->json($game);
    }

    /**
     * Get game questions
     */
    public function questions($game_id)
    {
        $game = Game::where('game_id', $game_id)->firstOrFail();
        $questions = $game->questions()->get();

        return response()->json([
            'game_id' => $game->game_id,
            'title' => $game->title,
            'question_count' => $questions->count(),
            'questions' => $questions
        ]);
    }
}
