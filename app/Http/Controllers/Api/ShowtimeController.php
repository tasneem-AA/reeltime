<?php

namespace App\Http\Controllers\Api;

use App\Models\Showtime;
use Illuminate\Http\Request;

class ShowtimeController extends Controller
{
    /**
     * Get all showtimes
     */
    public function index(Request $request)
    {
        $showtimes = Showtime::with('movie', 'cinema')
            ->where('showtime', '>=', now())
            ->orderBy('showtime')
            ->paginate(20);

        return response()->json($showtimes);
    }

    /**
     * Get single showtime
     */
    public function show($showtime_id)
    {
        $showtime = Showtime::where('showtime_id', $showtime_id)
            ->with('movie', 'cinema')
            ->firstOrFail();

        return response()->json($showtime);
    }

    /**
     * Get showtimes for a specific movie
     */
    public function byMovie($movie_id)
    {
        $showtimes = Showtime::where('movie_id', $movie_id)
            ->with('cinema')
            ->where('showtime', '>=', now())
            ->orderBy('showtime')
            ->paginate(20);

        return response()->json($showtimes);
    }
}
