<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Game;
use App\Models\GameRound;
use App\Models\Question;

class GameController extends Controller
{
    /**
     * Get all games
     */
    public function getAllGames()
    {
        $games = Game::select('game_id', 'title', 'description', 'game_type', 'icon')->get();
        return response()->json($games);
    }

    /**
     * Get questions for a specific game
     */
    public function getGameQuestions($gameId)
    {
        $game = Game::findOrFail($gameId);
        
        $questions = Question::where('game_id', $gameId)
            ->select(
                'question_id',
                'game_id',
                'question_text',
                'correct_answer',
                'options',
                'emoji',
                'character',
                'quote',
                'scene',
                'hint',
                'points'
            )
            ->get()
            ->map(function ($question) {
                // Parse JSON options if they exist
                if ($question->options && is_string($question->options)) {
                    $question->options = json_decode($question->options, true);
                }
                return $question;
            });

        return response()->json([
            'game' => $game,
            'questions' => $questions,
            'total_questions' => count($questions)
        ]);
    }

    /**
     * Save game round (player's score)
     */
    public function saveGameRound(Request $request)
    {
        $request->validate([
            'game_id' => 'required|exists:games,game_id',
            'score' => 'required|integer|min:0',
        ]);

        $user = Auth::user();
        
        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $gameRound = GameRound::create([
            'user_id' => $user->user_id,
            'game_id' => $request->game_id,
            'score' => $request->score,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Game round saved',
            'round' => $gameRound
        ], 201);
    }

    /**
     * Get leaderboard (top scores)
     */
    public function getLeaderboard($gameId = null)
    {
        $query = GameRound::with('user:user_id,username')
            ->select('user_id', 'game_id', 'score')
            ->orderBy('score', 'desc')
            ->limit(10);

        if ($gameId) {
            $query->where('game_id', $gameId);
        }

        $leaderboard = $query->get()
            ->map(function ($round, $index) {
                return [
                    'rank' => $index + 1,
                    'player_name' => $round->user->username,
                    'game_id' => $round->game_id,
                    'score' => $round->score,
                    'created_at' => $round->created_at
                ];
            });

        return response()->json($leaderboard);
    }

    /**
     * Get user's game stats
     */
    public function getUserGameStats()
    {
        $user = Auth::user();

        if (!$user) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $stats = GameRound::where('user_id', $user->user_id)
            ->with('game:game_id,title,game_type')
            ->select('game_id', 'score', 'created_at')
            ->orderBy('created_at', 'desc')
            ->get();

        $summary = GameRound::where('user_id', $user->user_id)
            ->select('game_id')
            ->selectRaw('COUNT(*) as total_plays')
            ->selectRaw('MAX(score) as best_score')
            ->selectRaw('AVG(score) as average_score')
            ->groupBy('game_id')
            ->with('game:game_id,title')
            ->get();

        return response()->json([
            'user' => $user->username,
            'stats' => $stats,
            'summary' => $summary
        ]);
    }
}
