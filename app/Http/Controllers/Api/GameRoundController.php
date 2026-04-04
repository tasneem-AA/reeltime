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
            'user_id' => 'required|exists:users,user_id',
            'score' => 'required|integer|min:0',
        ]);

        $gameRound = GameRound::create([
            'user_id' => $validated['user_id'],
            'game_id' => $validated['game_id'],
            'score' => $validated['score'],
        ]);

        return response()->json([
            'message' => 'Game round saved',
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

    /**
     * Get global leaderboard
     */
    public function leaderboard()
    {
        $leaderboard = GameRound::with(['user'])
            ->select('user_id')
            ->selectRaw('SUM(score) as total_score')
            ->selectRaw('COUNT(*) as games_played')
            ->selectRaw('MAX(created_at) as last_played')
            ->groupBy('user_id')
            ->orderBy('total_score', 'DESC')
            ->limit(50)
            ->get()
            ->map(function ($round, $index) {
                $user = $round->user;
                return [
                    'rank' => $index + 1,
                    'player_name' => $user ? $user->username : 'Anonymous',
                    'score' => $round->total_score,
                    'games_played' => $round->games_played,
                    'last_played' => $round->last_played // Already a string from raw query
                ];
            });

        return response()->json($leaderboard);
    }
}
