<?php

namespace App\Http\Controllers\Api;

use App\Models\GameRound;
use App\Models\Game;
use Illuminate\Http\Request;

class GameRoundController extends Controller
{
    /**
     * Get user's game rounds
     */
    public function index(Request $request)
    {
        $gameRounds = $request->user()
            ->gameRounds()
            ->with('game')
            ->paginate(20);

        return response()->json($gameRounds);
    }

    /**
     * Start a new game round
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'game_id' => 'required|exists:games,game_id',
        ]);

        $gameRound = GameRound::create([
            'user_id' => $request->user()->user_id,
            'game_id' => $validated['game_id'],
            'score' => 0,
            'status' => 'in_progress',
        ]);

        return response()->json([
            'message' => 'Game round started',
            'game_round' => $gameRound
        ], 201);
    }

    /**
     * Get single game round
     */
    public function show(Request $request, $game_round_id)
    {
        $gameRound = GameRound::where('game_round_id', $game_round_id)
            ->where('user_id', $request->user()->user_id)
            ->with('game')
            ->firstOrFail();

        return response()->json($gameRound);
    }

    /**
     * Submit answer to a question
     */
    public function submitAnswer(Request $request, $game_round_id)
    {
        $gameRound = GameRound::where('game_round_id', $game_round_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $validated = $request->validate([
            'question_id' => 'required|exists:questions,question_id',
            'answer' => 'required|string',
        ]);

        // Verify answer (implement your logic here)
        $question = $gameRound->game->questions()
            ->where('question_id', $validated['question_id'])
            ->firstOrFail();

        $isCorrect = strtolower($question->answer) === strtolower($validated['answer']);

        if ($isCorrect) {
            $gameRound->increment('score');
        }

        return response()->json([
            'is_correct' => $isCorrect,
            'correct_answer' => $question->answer,
            'current_score' => $gameRound->score
        ]);
    }
}
