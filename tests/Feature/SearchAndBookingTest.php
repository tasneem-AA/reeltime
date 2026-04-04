<?php

namespace Tests\Feature;

use App\Models\Cinema;
use App\Models\Movie;
use App\Models\Showtime;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SearchAndBookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_search_page_uses_database_movies(): void
    {
        $movie = Movie::factory()->create([
            'title' => 'Database Driven Movie',
        ]);

        $response = $this->get(route('search'));

        $response->assertOk();
        $response->assertSee('Database Driven Movie');
        $response->assertSee((string) $movie->movie_id);
    }

    public function test_authenticated_user_can_create_booking_and_reduce_available_seats(): void
    {
        $user = User::factory()->create();
        $movie = Movie::factory()->create();
        $cinema = Cinema::factory()->create();
        $showtime = Showtime::factory()->create([
            'movie_id' => $movie->movie_id,
            'cinema_id' => $cinema->cinema_id,
            'show_date' => now()->addDay()->format('Y-m-d'),
            'show_time' => '18:00:00',
            'available_seats' => 20,
            'price_seat' => 12.50,
        ]);

        $response = $this
            ->actingAs($user)
            ->postJson(route('bookings.store'), [
                'showtime_id' => $showtime->showtime_id,
                'seats' => 2,
                'customer_name' => 'Test User',
                'customer_email' => 'test@example.com',
                'customer_phone' => '70123456',
                'selected_seats' => ['A-1', 'A-2'],
            ]);

        $response->assertOk();
        $response->assertJsonPath('success', true);
        $response->assertJsonPath('booking.movie', $movie->title);
        $response->assertJsonPath('showtime.available_seats', 18);

        $this->assertDatabaseHas('bookings', [
            'user_id' => $user->user_id,
            'showtime_id' => $showtime->showtime_id,
            'seats' => 2,
            'status' => 'confirmed',
        ]);

        $this->assertDatabaseHas('showtimes', [
            'showtime_id' => $showtime->showtime_id,
            'available_seats' => 18,
        ]);
    }
}
