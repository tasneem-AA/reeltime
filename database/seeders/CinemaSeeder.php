<?php

namespace Database\Seeders;

use App\Models\Cinema;
use Illuminate\Database\Seeder;

class CinemaSeeder extends Seeder
{
    private const CINEMAS = [
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
    ];

    public function run(): void
    {
        foreach (self::CINEMAS as $cinema) {
            Cinema::updateOrCreate(
                ['name' => $cinema['name']],
                ['location' => $cinema['location']]
            );
        }
    }
}
