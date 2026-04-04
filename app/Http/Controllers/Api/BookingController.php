<?php

namespace App\Http\Controllers\Api;

use App\Models\Booking;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    /**
     * Get user's bookings
     */
    public function index(Request $request)
    {
        $bookings = $request->user()
            ->bookings()
            ->with('user', 'movie')
            ->paginate(10);

        return response()->json($bookings);
    }

    /**
     * Create a new booking
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'movie_id' => 'required|exists:movies,movie_id',
            'showtime_id' => 'required|exists:showtimes,showtime_id',
            'seats' => 'required|array|min:1',
            'seats.*' => 'string',
            'payment_method' => 'required|in:card,cash',
            'total_price' => 'required|numeric|min:0.01',
        ]);

        $booking = Booking::create([
            'user_id' => $request->user()->user_id,
            'movie_id' => $validated['movie_id'],
            'showtime_id' => $validated['showtime_id'] ?? null,
            'seats' => json_encode($validated['seats']),
            'total_price' => $validated['total_price'],
            'payment_method' => $validated['payment_method'],
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Booking created successfully',
            'booking' => $booking
        ], 201);
    }

    /**
     * Get single booking
     */
    public function show(Request $request, $booking_id)
    {
        $booking = Booking::where('booking_id', $booking_id)
            ->where('user_id', $request->user()->user_id)
            ->with('movie')
            ->firstOrFail();

        return response()->json($booking);
    }

    /**
     * Update booking (cancel or modify)
     */
    public function update(Request $request, $booking_id)
    {
        $booking = Booking::where('booking_id', $booking_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $validated = $request->validate([
            'status' => 'in:confirmed,cancelled',
        ]);

        $booking->update($validated);

        return response()->json([
            'message' => 'Booking updated',
            'booking' => $booking
        ]);
    }

    /**
     * Cancel booking
     */
    public function destroy(Request $request, $booking_id)
    {
        $booking = Booking::where('booking_id', $booking_id)
            ->where('user_id', $request->user()->user_id)
            ->firstOrFail();

        $booking->update(['status' => 'cancelled']);

        return response()->json(['message' => 'Booking cancelled']);
    }
}
