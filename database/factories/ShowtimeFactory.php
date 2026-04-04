<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Showtime>
 */
class ShowtimeFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'movie_id' => \App\Models\Movie::factory(),
            'cinema_id' => \App\Models\Cinema::factory(),
            'show_date' => fake()->dateTimeBetween('+1 day', '+1 month')->format('Y-m-d'),
            'show_time' => fake()->randomElement([
                '10:30:00',
                '13:45:00',
                '17:00:00',
                '20:15:00',
                '22:30:00',
            ]),
            'available_seats' => fake()->numberBetween(60, 130),
            'price_seat' => fake()->randomFloat(2, 5, 25),
        ];
    }
}
