<?php

namespace App\Http\Controllers;

use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;
use Illuminate\Support\Str;

class SearchController extends Controller
{
    public function index()
    {
        $movies = Movie::query()
            ->with([
                'ratings' => fn ($query) => $query
                    ->whereNotNull('comment')
                    ->with('user:user_id,username'),
                'showtimes' => fn ($query) => $query
                    ->whereDate('show_date', '>=', today())
                    ->where('available_seats', '>', 0)
                    ->with('cinema:cinema_id,name')
                    ->orderBy('show_date')
                    ->orderBy('show_time'),
            ])
            ->orderBy('title')
            ->get();

        $searchMovies = $movies
            ->map(fn (Movie $movie) => $this->mapMovie($movie))
            ->values();

        return view('pages.search', compact('searchMovies'));
    }

    private function mapMovie(Movie $movie): array
    {
        return [
            'id' => $movie->movie_id,
            'title' => $movie->title,
            'description' => $movie->description ?? '',
            'rating' => $movie->rating !== null ? (float) $movie->rating : null,
            'duration' => $movie->duration,
            'time' => $movie->duration ? "{$movie->duration} min" : null,
            'poster_url' => $this->posterUrl($movie->poster),
            'trailer_url' => $this->trailerUrl($movie->trailer_link),
            'cast' => $this->splitCsv($movie->cast),
            'genres' => $this->splitCsv($movie->genres),
            'tags' => $this->splitCsv($movie->genres),
            'comments' => $movie->ratings
                ->map(fn ($rating) => [
                    'user' => $rating->user?->username ?? 'ReelTime user',
                    'rating' => (int) round((float) $rating->score),
                    'text' => $rating->comment,
                ])
                ->values()
                ->all(),
            'showtimes' => $movie->showtimes
                ->map(fn (Showtime $showtime) => [
                    'cinema' => $showtime->cinema?->name,
                    'date' => optional($showtime->show_date)->format('Y-m-d'),
                    'display' => $this->formatShowtimeBadge($showtime),
                ])
                ->values()
                ->all(),
        ];
    }

    private function splitCsv(?string $value): array
    {
        if (! $value) {
            return [];
        }

        return collect(explode(',', $value))
            ->map(fn (string $item) => trim($item))
            ->filter()
            ->values()
            ->all();
    }

    private function posterUrl(?string $poster): string
    {
        if (! $poster) {
            return asset('imgs/default-movie.jpg');
        }

        if (Str::startsWith($poster, ['http://', 'https://', '//'])) {
            return $poster;
        }

        return asset(ltrim($poster, '/'));
    }

    private function trailerUrl(?string $trailerLink): string
    {
        if (! $trailerLink) {
            return '';
        }

        if (Str::contains($trailerLink, 'youtube.com/embed/')) {
            return $trailerLink;
        }

        if (preg_match('~(?:youtube\.com/watch\?v=|youtu\.be/)([\w-]{11})~', $trailerLink, $matches)) {
            return 'https://www.youtube.com/embed/' . $matches[1];
        }

        if (preg_match('~^[\w-]{11}$~', $trailerLink)) {
            return 'https://www.youtube.com/embed/' . $trailerLink;
        }

        return $trailerLink;
    }

    private function formatShowtimeBadge(Showtime $showtime): string
    {
        $cinema = $showtime->cinema?->name ?? 'Cinema';
        $date = optional($showtime->show_date)->format('M j');
        $time = $this->formatShowtimeLabel($showtime);

        return trim("{$cinema} {$date} {$time}");
    }

    private function formatShowtimeLabel(Showtime $showtime): string
    {
        $rawTime = (string) ($showtime->getRawOriginal('show_time') ?: $showtime->show_time);
        $format = strlen($rawTime) > 5 ? 'H:i:s' : 'H:i';

        return Carbon::createFromFormat($format, $rawTime)->format('g:i A');
    }
}
