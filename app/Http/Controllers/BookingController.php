<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Cinema;
use App\Models\Movie;
use App\Models\Showtime;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class BookingController extends Controller
{
    private const SEAT_MAP_CAPACITY = 130;

    public function index()
    {
        $cinemas = Cinema::query()
            ->whereHas('showtimes', fn ($query) => $query
                ->whereDate('show_date', '>=', today())
                ->where('available_seats', '>', 0)
                ->whereTime('show_time', '>=', '14:00')
                ->whereTime('show_time', '<=', '23:59'))
            ->orderBy('name')
            ->get();

        $movies = Movie::query()
            ->whereHas('showtimes', fn ($query) => $query
                ->whereDate('show_date', '>=', today())
                ->where('available_seats', '>', 0)
                ->whereTime('show_time', '>=', '14:00')
                ->whereTime('show_time', '<=', '23:59'))
            ->with([
                'ratings' => fn ($query) => $query
                    ->whereNotNull('comment')
                    ->with('user:user_id,username'),
                'showtimes' => fn ($query) => $query
                    ->whereDate('show_date', '>=', today())
                    ->where('available_seats', '>', 0)
                    ->whereTime('show_time', '>=', '14:00')
                    ->whereTime('show_time', '<=', '23:59')
                    ->with('cinema:cinema_id,name,location')
                    ->orderBy('show_date')
                    ->orderBy('show_time'),
            ])
            ->orderBy('title')
            ->get();

        $bookingMovies = $movies
            ->map(fn (Movie $movie) => $this->mapMovie($movie))
            ->values();

        $bookingData = [
            'cinemas' => $cinemas->map(fn (Cinema $cinema) => [
                'id' => $cinema->cinema_id,
                'name' => $cinema->name,
                'location' => $cinema->location,
            ])->values(),
            'movies' => $bookingMovies,
            'showtimes' => $movies
                ->flatMap(fn (Movie $movie) => $movie->showtimes->map(
                    fn (Showtime $showtime) => $this->mapShowtime($showtime)
                ))
                ->values(),
            'seat_map_capacity' => self::SEAT_MAP_CAPACITY,
        ];

        $featuredMovies = $bookingMovies->take(6);

        return view('pages.bookings', compact('bookingData', 'featuredMovies'));
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'showtime_id' => ['required', 'integer', 'exists:showtimes,showtime_id'],
            'seats' => ['required', 'integer', 'min:1', 'max:' . self::SEAT_MAP_CAPACITY],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_email' => ['required', 'email', 'max:255'],
            'customer_phone' => ['required', 'string', 'max:30'],
            'payment_method' => ['required', 'string', 'in:card,cash'],
            'selected_seats' => ['nullable', 'array'],
            'selected_seats.*' => ['string', 'max:30'],
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => $validator->errors()->first(),
                'errors' => $validator->errors(),
            ], 422);
        }

        $payload = $validator->validated();
        $seatCount = (int) $payload['seats'];
        $selectedSeats = $payload['selected_seats'] ?? [];

        if ($selectedSeats && count($selectedSeats) !== $seatCount) {
            return response()->json([
                'success' => false,
                'message' => 'Selected seats do not match the requested seat count.',
            ], 422);
        }

        DB::beginTransaction();

        try {
            $showtime = Showtime::query()
                ->with(['movie', 'cinema'])
                ->lockForUpdate()
                ->findOrFail($payload['showtime_id']);

            $showtimeDateTime = Carbon::parse(
                optional($showtime->show_date)->format('Y-m-d') . ' ' . $this->timeValue($showtime)
            );

            if ($showtimeDateTime->isPast()) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'This showtime has already started. Please choose another one.',
                ], 422);
            }

            if ((int) $showtime->available_seats < $seatCount) {
                DB::rollBack();

                return response()->json([
                    'success' => false,
                    'message' => 'Not enough seats are available for this showtime.',
                ], 422);
            }

            $totalPrice = round(((float) $showtime->price_seat) * $seatCount, 2);

            $booking = Booking::create([
                'user_id' => Auth::id(),
                'showtime_id' => $showtime->showtime_id,
                'seats' => $seatCount,
                'price' => $totalPrice,
                'status' => 'confirmed',
                'customer_info' => json_encode([
                    'name' => $payload['customer_name'],
                    'email' => $payload['customer_email'],
                    'phone' => $payload['customer_phone'],
                    'payment_method' => $payload['payment_method'],
                    'selected_seats' => $selectedSeats,
                ]),
                'booking_date' => now(),
            ]);

            $showtime->available_seats = max(0, (int) $showtime->available_seats - $seatCount);
            $showtime->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Booking confirmed.',
                'booking' => [
                    'id' => $booking->booking_id,
                    'movie' => $showtime->movie?->title,
                    'cinema' => $showtime->cinema?->name,
                    'date' => optional($showtime->show_date)->format('Y-m-d'),
                    'time' => $this->timeLabel($showtime),
                    'seats' => $selectedSeats,
                    'seat_count' => $seatCount,
                    'price' => $totalPrice,
                    'payment_method' => $payload['payment_method'],
                    'payment_method_label' => $this->paymentMethodLabel($payload['payment_method']),
                    'status' => 'upcoming',
                ],
                'showtime' => [
                    'id' => $showtime->showtime_id,
                    'available_seats' => (int) $showtime->available_seats,
                ],
            ]);
        } catch (\Throwable $exception) {
            DB::rollBack();

            throw $exception;
        }
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
                ->map(fn (Showtime $showtime) => $this->mapShowtime($showtime))
                ->values()
                ->all(),
            'modal_showtimes' => $movie->showtimes
                ->map(fn (Showtime $showtime) => $this->formatShowtimeBadge($showtime))
                ->unique()
                ->values()
                ->take(8)
                ->all(),
        ];
    }

    private function mapShowtime(Showtime $showtime): array
    {
        return [
            'id' => $showtime->showtime_id,
            'movie_id' => $showtime->movie_id,
            'cinema_id' => $showtime->cinema_id,
            'date' => optional($showtime->show_date)->format('Y-m-d'),
            'display_date' => optional($showtime->show_date)->format('M j, Y'),
            'time' => $this->timeValue($showtime),
            'display_time' => $this->timeLabel($showtime),
            'available_seats' => (int) $showtime->available_seats,
            'price_seat' => (float) $showtime->price_seat,
            'cinema_name' => $showtime->cinema?->name,
            'movie_title' => $showtime->movie?->title,
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
        $time = $this->timeLabel($showtime);

        return trim("{$cinema} {$date} {$time}");
    }

    private function timeValue(Showtime $showtime): string
    {
        $rawTime = (string) ($showtime->getRawOriginal('show_time') ?: $showtime->show_time);

        return substr($rawTime, 0, 5);
    }

    private function timeLabel(Showtime $showtime): string
    {
        $rawTime = (string) ($showtime->getRawOriginal('show_time') ?: $showtime->show_time);
        $format = strlen($rawTime) > 5 ? 'H:i:s' : 'H:i';
        $carbon = Carbon::createFromFormat($format, $rawTime);

        // Round minutes to nearest 30
        $minutes = $carbon->minute;
        if ($minutes < 15) {
            $carbon->setMinute(0);
        } elseif ($minutes < 45) {
            $carbon->setMinute(30);
        } else {
            $carbon->setMinute(0);
            $carbon->addHour();
        }

        // Format: show minutes only if not :00
        return $carbon->minute === 0 ? $carbon->format('g A') : $carbon->format('g:i A');
    }

    private function paymentMethodLabel(string $paymentMethod): string
    {
        return match ($paymentMethod) {
            'cash' => 'Pay at cinema',
            default => 'Card',
        };
    }
}
