<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Booking>
 */
class BookingFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $seatCount = fake()->numberBetween(1, 5);
        $pricePerSeat = fake()->randomFloat(2, 7, 20);
        $seatMap = [];

        foreach ([
            ['prefix' => 'first-front-row', 'count' => 10],
            ['prefix' => 'second-front-row', 'count' => 14],
            ['prefix' => 'middle-row', 'count' => 80],
            ['prefix' => 'second-last-row', 'count' => 14],
            ['prefix' => 'first-last-row', 'count' => 12],
        ] as $row) {
            for ($seatNumber = 1; $seatNumber <= $row['count']; $seatNumber++) {
                $seatMap[] = "{$row['prefix']}-{$seatNumber}";
            }
        }

        return [
            'user_id' => \App\Models\User::factory(),
            'showtime_id' => \App\Models\Showtime::factory(),
            'seats' => $seatCount,
            'price' => round($seatCount * $pricePerSeat, 2),
            'status' => fake()->randomElement(['pending', 'confirmed', 'confirmed', 'cancelled']),
            'customer_info' => json_encode([
                'name' => fake()->name(),
                'email' => fake()->safeEmail(),
                'phone' => fake()->numerify('70######'),
                'selected_seats' => fake()->randomElements($seatMap, $seatCount),
            ]),
            'booking_date' => now(),
        ];
    }
}
