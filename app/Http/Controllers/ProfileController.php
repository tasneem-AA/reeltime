<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        if (! $user) {
            return redirect()->route('home')->with('login_required', true);
        }

        $watchlist = $user->watchlistedMovies()->get();

        return view('pages.profile', compact('user', 'watchlist'));
    }
}
