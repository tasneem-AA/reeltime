<?php

namespace App\Http\Controllers\Api;

use App\Models\Watchlist;
use App\Models\Movie;
use Illuminate\Http\Request;

class WatchlistController extends Controller
{
    /**
     * Get user's watchlist
     */
    public function index(Request $request)
    {
        $watchlist = $request->user()
            ->watchlists()
            ->with('movie')
            ->paginate(12);

        return response()->json($watchlist);
    }

    /**
     * Add movie to watchlist
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,movie_id',
        ]);

        $exists = Watchlist::where('user_id', $request->user()->user_id)
            ->where('movie_id', $validated['movie_id'])
            ->first();

        if ($exists) {
            return response()->json(['message' => 'Movie already in watchlist'], 409);
        }

        $watchlist = Watchlist::create([
            'user_id' => $request->user()->user_id,
            'movie_id' => $validated['movie_id'],
        ]);

        return response()->json([
            'message' => 'Movie added to watchlist',
            'watchlist' => $watchlist
        ], 201);
    }

    /**
     * Remove from watchlist
     */
    public function destroy(Request $request, $watchlist_id)
    {
        $watchlist = Watchlist::where('watchlist_id', $watchlist_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $watchlist->delete();

        return response()->json(['message' => 'Removed from watchlist']);
    }

    /**
     * Check if movie is in user's watchlist
     */
    public function check(Request $request, $movie_id)
    {
        $inWatchlist = Watchlist::where('user_id', $request->user()->user_id)
            ->where('movie_id', $movie_id)
            ->exists();

        return response()->json(['in_watchlist' => $inWatchlist]);
    }
}
