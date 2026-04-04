<?php

namespace App\Http\Controllers\Api;

use App\Models\Cinema;
use App\Models\Showtime;
use Illuminate\Http\Request;

class CinemaController extends Controller
{
    /**
     * Get all cinemas
     */
    public function index()
    {
        $cinemas = Cinema::withCount('showtimes')->paginate(15);
        return response()->json($cinemas);
    }

    /**
     * Get single cinema
     */
    public function show($cinema_id)
    {
        $cinema = Cinema::where('cinema_id', $cinema_id)
            ->with('showtimes.movie')
            ->firstOrFail();

        return response()->json($cinema);
    }

    /**
     * Get showtimes for a cinema
     */
    public function showtimes($cinema_id)
    {
        $showtimes = Showtime::where('cinema_id', $cinema_id)
            ->with('movie')
            ->where('showtime', '>=', now())
            ->paginate(20);

        return response()->json($showtimes);
    }
}
