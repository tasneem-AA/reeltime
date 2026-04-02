<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = \App\Models\User::factory(20)->create();

        $this->call(MovieSeeder::class);
        $this->call(GameSeeder::class);
        
        $movies = \App\Models\Movie::all();
        $cinemas = \App\Models\Cinema::factory(5)->create();

        foreach ($users->random(10) as $user) {
            foreach ($movies->random(3) as $movie) {
                \App\Models\Rating::factory()->create([
                    'user_id' => $user->user_id,
                    'movie_id' => $movie->movie_id,
                ]);
            }
        }

        foreach ($users->random(10) as $user) {
            foreach ($movies->random(2) as $movie) {
                \App\Models\Watchlist::factory()->create([
                    'user_id' => $user->user_id,
                    'movie_id' => $movie->movie_id,
                ]);
            }
        }

        foreach ($movies as $movie) {
            foreach ($cinemas->random(2) as $cinema) {
                \App\Models\Showtime::factory(2)->create([
                    'movie_id' => $movie->movie_id,
                    'cinema_id' => $cinema->cinema_id,
                ]);
            }
        }

        $showtimes = \App\Models\Showtime::all();
        foreach ($users->random(15) as $user) {
            foreach ($showtimes->random(2) as $showtime) {
                \App\Models\Booking::factory()->create([
                    'user_id' => $user->user_id,
                    'showtime_id' => $showtime->showtime_id,
                ]);
            }
        }

        foreach ($users->random(10) as $user) {
            // Get all games from the database (created by GameSeeder)
            $games = \App\Models\Game::all();
            
            foreach ($games->random(2) as $game) {
                \App\Models\GameRound::factory()->create([
                    'user_id' => $user->user_id,
                    'game_id' => $game->game_id,
                ]);
            }
        }

        $this->call([
            HeroBannerSeeder::class,
            MovieThisMovieIsSeeder::class,
        ]);
    }
}
