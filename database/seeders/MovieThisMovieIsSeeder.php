<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Movie;
use Illuminate\Support\Facades\File;

class MovieThisMovieIsSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $path = public_path('data/movies.json');
        
        if (!File::exists($path)) {
            $this->command->error('movies.json not found!');
            return;
        }
        
        $json = File::get($path);
        $data = json_decode($json, true);
        
        if (!is_array($data) || !isset($data['categories'])) {
            $this->command->error('Invalid movies.json structure!');
            return;
        }
        
        $movieData = [];
        
        foreach ($data['categories'] as $category) {
            if (!isset($category['movies']) || !is_array($category['movies'])) {
                continue;
            }
            
            foreach ($category['movies'] as $movie) {
                $title = $movie['title'] ?? null;
                $thisMovieIs = $movie['thisMovieIs'] ?? null;
                
                if ($title && $thisMovieIs) {
                    $thisMovieIsString = is_array($thisMovieIs) 
                        ? implode(', ', $thisMovieIs) 
                        : $thisMovieIs;
                    
                    $movieData[$title] = $thisMovieIsString;
                }
            }
        }
        
        $updatedCount = 0;
        foreach ($movieData as $title => $thisMovieIs) {
            $movie = Movie::where('title', $title)->first();
            if ($movie) {
                $movie->this_movie_is = $thisMovieIs;
                $movie->save();
                $updatedCount++;
                $this->command->info("Updated: {$title} → {$thisMovieIs}");
            } else {
                $this->command->warn("Movie not found in database: {$title}");
            }
        }
        
        $this->command->info(" Updated {$updatedCount} movies with 'this_movie_is' data!");
    }
    }

