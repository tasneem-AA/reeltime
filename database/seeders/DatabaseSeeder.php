<?php

namespace Database\Seeders;

use App\Models\Booking;
use App\Models\Cinema;
use App\Models\Game;
use App\Models\GameRound;
use App\Models\Movie;
use App\Models\Rating;
use App\Models\Showtime;
use App\Models\User;
use App\Models\Watchlist;
use Carbon\Carbon;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Collection;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    private const SEAT_MAP_CAPACITY = 130;

    private const SEAT_ROWS = [
        ['prefix' => 'first-front-row', 'count' => 10],
        ['prefix' => 'second-front-row', 'count' => 14],
        ['prefix' => 'middle-row', 'count' => 80],
        ['prefix' => 'second-last-row', 'count' => 14],
        ['prefix' => 'first-last-row', 'count' => 12],
    ];

    private const SHOWTIME_SLOTS = [
        '10:30:00',
        '13:45:00',
        '17:00:00',
        '20:15:00',
        '22:30:00',
    ];

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $users = User::factory(20)->create();

        $this->call(MovieSeeder::class);
        $this->call(GameSeeder::class);
        $this->call(CinemaSeeder::class);

        $movies = Movie::all();
        $cinemas = Cinema::all();

        foreach ($users->random(10) as $user) {
            foreach ($movies->random(3) as $movie) {
                Rating::factory()->create([
                    'user_id' => $user->user_id,
                    'movie_id' => $movie->movie_id,
                ]);
            }
        }

        foreach ($users->random(10) as $user) {
            foreach ($movies->random(2) as $movie) {
                Watchlist::factory()->create([
                    'user_id' => $user->user_id,
                    'movie_id' => $movie->movie_id,
                ]);
            }
        }

        $showtimes = $this->seedShowtimes($movies, $cinemas);
        $this->seedBookings($users, $showtimes);

        foreach ($users->random(10) as $user) {
            $games = Game::all();

            foreach ($games->random(2) as $game) {
                GameRound::factory()->create([
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

    private function seedShowtimes(Collection $movies, Collection $cinemas): Collection
    {
        $showtimes = collect();

        foreach ($movies as $movie) {
            $movieCinemas = $cinemas
                ->shuffle()
                ->take(min($cinemas->count(), random_int(2, 3)));

            foreach ($movieCinemas as $cinema) {
                $dayOffsets = collect(range(1, 14))
                    ->shuffle()
                    ->take(random_int(2, 4))
                    ->sort()
                    ->values();

                foreach ($dayOffsets as $dayOffset) {
                    $timeSlots = collect(self::SHOWTIME_SLOTS)
                        ->shuffle()
                        ->take(random_int(1, 2))
                        ->sort()
                        ->values();

                    foreach ($timeSlots as $slot) {
                        $showtimes->push(Showtime::create([
                            'movie_id' => $movie->movie_id,
                            'cinema_id' => $cinema->cinema_id,
                            'show_date' => now()->addDays((int) $dayOffset)->toDateString(),
                            'show_time' => $slot,
                            'available_seats' => self::SEAT_MAP_CAPACITY,
                            'price_seat' => fake()->randomFloat(2, 7, 22),
                        ]));
                    }
                }
            }
        }

        return $showtimes;
    }

    private function seedBookings(Collection $users, Collection $showtimes): void
    {
        $seatMap = $this->seatMap();

        foreach ($showtimes as $showtime) {
            $remainingSeats = $seatMap;

            if (random_int(1, 100) <= 20) {
                continue;
            }

            $bookingCount = random_int(2, 8);

            for ($index = 0; $index < $bookingCount; $index++) {
                if (count($remainingSeats) === 0) {
                    break;
                }

                $status = $this->bookingStatus();
                $seatCount = random_int(1, min(6, count($remainingSeats)));

                if ($status === 'cancelled') {
                    $assignedSeats = collect($seatMap)
                        ->shuffle()
                        ->take($seatCount)
                        ->values()
                        ->all();
                } else {
                    shuffle($remainingSeats);
                    $assignedSeats = array_splice($remainingSeats, 0, $seatCount);
                }

                $customerName = fake()->name();
                $eventDateTime = Carbon::parse(
                    $showtime->show_date->format('Y-m-d') . ' ' . $showtime->getRawOriginal('show_time')
                );
                $bookingDate = (clone $eventDateTime)
                    ->subDays(random_int(1, 21))
                    ->subHours(random_int(1, 12));

                if ($bookingDate->isFuture()) {
                    $bookingDate = now()->subHours(random_int(1, 72));
                }

                Booking::create([
                    'user_id' => $users->random()->user_id,
                    'showtime_id' => $showtime->showtime_id,
                    'seats' => $seatCount,
                    'price' => round(((float) $showtime->price_seat) * $seatCount, 2),
                    'status' => $status,
                    'customer_info' => json_encode([
                        'name' => $customerName,
                        'email' => fake()->safeEmail(),
                        'phone' => fake()->numerify('70######'),
                        'selected_seats' => $assignedSeats,
                    ]),
                    'booking_date' => $bookingDate,
                    'created_at' => $bookingDate,
                    'updated_at' => $bookingDate,
                ]);
            }

            $showtime->forceFill([
                'available_seats' => count($remainingSeats),
            ])->save();
        }
    }

    private function seatMap(): array
    {
        $seats = [];

        foreach (self::SEAT_ROWS as $row) {
            for ($seatNumber = 1; $seatNumber <= $row['count']; $seatNumber++) {
                $seats[] = "{$row['prefix']}-{$seatNumber}";
            }
        }

        return $seats;
    }

    private function bookingStatus(): string
    {
        $roll = random_int(1, 10);

        if ($roll === 1) {
            return 'cancelled';
        }

        if ($roll <= 3) {
            return 'pending';
        }

        return 'confirmed';
    }
}
