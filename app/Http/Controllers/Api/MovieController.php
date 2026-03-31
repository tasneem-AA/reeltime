<?php

namespace App\Http\Controllers\Api;

use App\Models\Movie;
use Illuminate\Http\Request;

class MovieController extends Controller
{
    /**
     * Get all movies
     */
    public function index()
    {
        $movies = Movie::with('ratings', 'watchlists')->paginate(12);
        return response()->json($movies);
    }

    /**
     * Get single movie
     */
    public function show($movie_id)
    {
        $movie = Movie::with('ratings.user', 'showtimes.cinema')
            ->where('movie_id', $movie_id)
            ->firstOrFail();
        
        return response()->json($movie);
    }

    /**
     * Search movies by title, description, cast, genres
     */
    public function search(Request $request)
    {
        $query = $request->get('q', '');
        
        if (!$query || strlen($query) < 2) {
            return response()->json(['data' => [], 'message' => 'Query too short']);
        }

        $movies = Movie::where('title', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->orWhere('cast', 'like', "%{$query}%")
            ->orWhere('genres', 'like', "%{$query}%")
            ->limit(20)
            ->get();

        return response()->json(['data' => $movies, 'count' => $movies->count()]);
    }

    /**
     * Get movie ratings
     */
    public function ratings($movie_id)
    {
        $movie = Movie::where('movie_id', $movie_id)->firstOrFail();
        $ratings = $movie->ratings()->with('user')->paginate(10);
        
        return response()->json($ratings);
    }
}
