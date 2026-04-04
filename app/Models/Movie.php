<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Movie extends Model
{
    use HasFactory;

    protected $primaryKey = 'movie_id';

    protected $fillable = [
        'title',
        'description',
        'trailer_link',
        'cast',
        'genres',
        'this_movie_is',
        'rating',
        'duration',
        'poster',
    ];

    protected function casts(): array
    {
        return [
            'rating' => 'decimal:1',
            'duration' => 'integer',
        ];
    }

    /**
     * Get the ratings for this movie.
     */
    public function ratings()
    {
        return $this->hasMany(Rating::class, 'movie_id', 'movie_id');
    }

    /**
     * Get the showtimes for this movie.
     */
    public function showtimes()
    {
        return $this->hasMany(Showtime::class, 'movie_id', 'movie_id');
    }

    /**
     * Get the watchlist entries for this movie.
     */
    public function watchlists()
    {
        return $this->hasMany(Watchlist::class, 'movie_id', 'movie_id');
    }

    /**
     * Get the users who have this movie on their watchlist.
     */
    public function watchlistedByUsers()
    {
        return $this->belongsToMany(User::class, 'watchlists', 'movie_id', 'user_id');
    }

    /**
     * Get the users who have rated this movie.
     */
    public function ratedByUsers()
    {
        return $this->belongsToMany(User::class, 'ratings', 'movie_id', 'user_id')
                    ->withPivot('score', 'comment');
    }
}
