<?php

namespace Database\Seeders;

use App\Models\Movie;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\File;

class MovieSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = public_path('data/movies.json');

        // If JSON file is missing, fall back to dummy factory data
        if (! File::exists($path)) {
            Movie::factory()->count(10)->create();
            return;
        }

        $json = File::get($path);
        $data = json_decode($json, true);

        // If JSON structure is not as expected, also fall back to dummy data
        if (! is_array($data) || ! isset($data['categories'])) {
            Movie::factory()->count(10)->create();
            return;
        }

        $movies = [];

        foreach ($data['categories'] as $category) {
            if (! isset($category['movies']) || ! is_array($category['movies'])) {
                continue;
            }

            foreach ($category['movies'] as $movieData) {
                // Avoid duplicates if a movie is in multiple categories
                if (! isset($movieData['id']) || isset($movies[$movieData['id']])) {
                    continue;
                }

                // Duration from JSON (e.g. "165 min"), fallback to 120 if missing/invalid
                $duration = 120;
                if (! empty($movieData['time'])) {
                    if (preg_match('/(\d+)/', $movieData['time'], $matches)) {
                        $duration = (int) $matches[1] ?: 120;
                    }
                }

                $movies[$movieData['id']] = [
                    'title'        => $movieData['title'] ?? fake()->sentence(3),
                    'description'  => $movieData['description'] ?? fake()->paragraph(),
                    'trailer_link' => $movieData['trailerId'] ?? null,
                    'cast'         => isset($movieData['cast']) && is_array($movieData['cast'])
                        ? implode(', ', $movieData['cast'])
                        : null,
                    'genres'       => isset($movieData['genres']) && is_array($movieData['genres'])
                        ? implode(', ', $movieData['genres'])
                        : null,
                    'rating'       => $movieData['rating'] ?? fake()->randomFloat(1, 2, 5),
                    'duration'     => $duration,
                    'poster'       => $movieData['image'] ?? null,
                    'created_at'   => now(),
                    'updated_at'   => now(),
                ];
            }
        }

        // If JSON was empty or invalid after parsing, still seed some dummy movies
        if (empty($movies)) {
            Movie::factory()->count(10)->create();
            return;
        }

        foreach ($movies as $movie) {
            Movie::updateOrCreate(
                ['title' => $movie['title']],
                $movie
            );
        }
    }
}
