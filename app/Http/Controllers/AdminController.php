<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Movie;
use App\Models\Game;
use App\Models\User;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;

class AdminController extends Controller
{
    public function index(){
        $user=Auth::user();
        $movieCount = Movie::count();
        $movies = Movie::latest()->get();
        $gameCount = Game::count();
        $games =Game::latest()->get();
        $userCount = User::count();
        $users=User::latest()->get();
        $bookingCount= Booking::count();
        $bookings=Booking::latest()->get();
        return view('pages.admin', compact('user','movieCount','movies','gameCount','userCount','users','bookingCount','bookings','games'));
       
    }
    public function destroyMovie(Movie $movie){
        $movie->delete();
        return response()->json(['success'=>true]);
    }
    public function destroyGame(Game $game){
        $game->delete();
        return response()->json(['success'=>true]);
    }
    public function destroyUser(User $user){
       if ($user->user_id === Auth::id()) {
            return response()->json(['success' => false, 'message' => 'You cannot delete your own account.'], 403);
        }
        $user->delete();
        return response()->json(['success' => true]);
    }
    public function destroyBooking(Booking $booking){
        $booking->delete();
        return response()->json(['success'=>true]);
    }
}
