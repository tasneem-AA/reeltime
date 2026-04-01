<?php

namespace App\Http\Controllers\Api;

use App\Models\Rating;
use App\Models\Movie;
use Illuminate\Http\Request;

class RatingController extends Controller
{
    /**
     * Get user's ratings
     */
    public function myRatings(Request $request)
    {
        $ratings = $request->user()
            ->ratings()
            ->with('movie')
            ->paginate(12);

        return response()->json($ratings);
    }

    /**
     * Submit or create a rating
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,movie_id',
            'score' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
        ]);

        $rating = Rating::updateOrCreate(
            [
                'user_id' => $request->user()->user_id,
                'movie_id' => $validated['movie_id'],
            ],
            [
                'score' => $validated['score'],
                'comment' => $validated['comment'] ?? null,
            ]
        );

        return response()->json([
            'message' => 'Rating submitted',
            'rating' => $rating
        ], 201);
    }

    /**
     * Update a rating
     */
    public function update(Request $request, $rating_id)
    {
        $rating = Rating::where('rating_id', $rating_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $validated = $request->validate([
            'score' => 'required|integer|between:1,5',
            'comment' => 'nullable|string|max:500',
        ]);

        $rating->update($validated);

        return response()->json([
            'message' => 'Rating updated',
            'rating' => $rating
        ]);
    }

    /**
     * Delete a rating
     */
    public function destroy(Request $request, $rating_id)
    {
        $rating = Rating::where('rating_id', $rating_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $rating->delete();

        return response()->json(['message' => 'Rating deleted']);
    }

    /**
     * Get user's rating for a specific movie
     */
    public function userMovieRating(Request $request, $movie_id)
    {
        $rating = Rating::where('user_id', $request->user()->user_id)
            ->where('movie_id', $movie_id)
            ->first();

        if (!$rating) {
            return response()->json(['rating' => null], 404);
        }

        return response()->json($rating);
    }
}
