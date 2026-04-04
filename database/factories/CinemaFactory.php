<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Cinema>
 */
class CinemaFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return fake()->randomElement([
            [
                'name' => 'Cedars Cinema Achrafieh',
                'location' => 'Achrafieh, Beirut, Lebanon',
            ],
            [
                'name' => 'Mediterranean Screens Hamra',
                'location' => 'Hamra, Beirut, Lebanon',
            ],
            [
                'name' => 'Phoenicia Grand Dbayeh',
                'location' => 'Dbayeh, Metn, Lebanon',
            ],
            [
                'name' => 'Jounieh Waterfront Cinema',
                'location' => 'Jounieh, Keserwan, Lebanon',
            ],
            [
                'name' => 'Byblos Bay Cinema',
                'location' => 'Jbeil, Mount Lebanon, Lebanon',
            ],
            [
                'name' => 'Batroun Harbor Cinema',
                'location' => 'Batroun, North Lebanon, Lebanon',
            ],
            [
                'name' => 'Saida Gate Cinema',
                'location' => 'Sidon, South Lebanon, Lebanon',
            ],
            [
                'name' => 'Bekaa Vista Cinema',
                'location' => 'Zahle, Bekaa, Lebanon',
            ],
            [
                'name' => 'Tripoli Metro Cinema',
                'location' => 'Tripoli, North Lebanon, Lebanon',
            ],
            [
                'name' => 'Tyre Coast Cinema',
                'location' => 'Tyre, South Lebanon, Lebanon',
            ],
        ]);
    }
}
