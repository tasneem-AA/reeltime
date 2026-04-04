<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Movie;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class AdminController_Api extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
 public function store(Request $request)
    {
        \Log::info('Admin API store called', $request->all());
        
        $validated = $request->validate([
            'title' => 'required|string|max:255|unique:movies,title',
            'description' => 'required|string',
            'trailer_link' => 'nullable|url',
            'genres' => 'required|string',  
            'this_movie_is' => 'nullable|string',
            'cast' => 'required|string',
            'duration' => 'required|integer|min:1',
            'rating' => 'nullable|numeric|min:0|max:10',
            'poster' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ]);
        
        try {
            
            $posterPath = null;
            if ($request->hasFile('poster')) {
                $file = $request->file('poster');
                $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
                $posterPath = $file->storeAs('posters', $filename, 'public');
            }
            
            $movie = Movie::create([
                'title' => $validated['title'],
                'description' => $validated['description'],
                'trailer_link' => $validated['trailer_link'] ?? null,
                'genres' => $validated['genres'],  
                'cast' => $validated['cast'],
                'duration' => $validated['duration'],
                'rating' => $validated['rating'] ?? 0,
                'poster' => $posterPath ? 'storage/' . $posterPath : null,
                'this_movie_is' => $validated['this_movie_is'] ?? null,
            ]);
            
            return response()->json([
                'success' => true,
                'message' => 'Movie added successfully',
                'data' => $movie
            ], 201);
            
        } catch (\Exception $e) {
            \Log::error('Movie creation failed: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to add movie: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
   public function show($id)
{
    $movie = Movie::findOrFail($id);
    return response()->json([
        'success' => true,
        'data' => $movie
    ]);
}
    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $movie_id)
    {
    \Log::info('Admin API update called', ['movie_id' => $movie_id, 'data' => $request->all()]);

    $movie = Movie::findOrFail($movie_id);

    $validated = $request->validate([
        'title' => 'required|string|max:255|unique:movies,title,' . $movie_id . ',movie_id',
        'description' => 'required|string',
        'trailer_link' => 'nullable|url',
        'genres' => 'required|string',
        'this_movie_is' => 'nullable|string',
        'cast' => 'required|string',
        'duration' => 'required|integer|min:1',
        'rating' => 'nullable|numeric|min:0|max:10',
        'poster' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
    ]);

    try {
        if ($request->hasFile('poster')) {
           if ($movie->poster && Storage::disk('public')->exists(str_replace('storage/', '', $movie->poster))) {
                Storage::disk('public')->delete(str_replace('storage/', '', $movie->poster));
            }

            $file = $request->file('poster');
            $filename = time() . '_' . Str::slug($validated['title']) . '.' . $file->getClientOriginalExtension();
            $posterPath = $file->storeAs('posters', $filename, 'public');
            $movie->poster = 'storage/' . $posterPath;
        }

        $movie->title = $validated['title'];
        $movie->description = $validated['description'];
        $movie->trailer_link = $validated['trailer_link'] ?? null;
        $movie->genres = $validated['genres'];
        $movie->this_movie_is = $validated['this_movie_is'] ?? null;
        $movie->cast = $validated['cast'];
        $movie->duration = $validated['duration'];
        $movie->rating = $validated['rating'] ?? 0;
        $movie->save();

        return response()->json([
            'success' => true,
            'message' => 'Movie updated successfully',
            'data' => $movie
        ], 200);

    } catch (\Exception $e) {
        \Log::error('Movie update failed: ' . $e->getMessage());
        return response()->json([
            'success' => false,
            'message' => 'Failed to update movie: ' . $e->getMessage()
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
