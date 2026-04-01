<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Models\HeroBanner;

Route::get('/', function () {
    $heroBanners = HeroBanner::orderBy('position')->get();
    return view('index', compact('heroBanners'));
})->name('home');

Route::get('/about', function () {
    return view('pages.about');
})->name('about');

Route::get('/bookings', function () {
    return view('pages.bookings');
})->name('bookings');

Route::get('/search', function () {
    return view('pages.search');
})->name('search');

Route::get('/trivia', function () {
    return view('pages.trivia');
})->name('trivia');

// Admin Area
Route::middleware(['check.admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
    Route::delete('admin/movies/{movie}',[AdminController::class, 'destroyMovie'])->name('admin.movies.destroy');
    Route::delete('/admin/games/{game}', [AdminController::class, 'destroyGame'])->name('admin.games.destroy');
    Route::delete('/admin/bookings/{booking}', [AdminController::class, 'destroyBooking'])->name('admin.bookings.destroy');
    Route::delete('/admin/users/{user}', [AdminController::class, 'destroyUser'])->name('admin.users.destroy');

});

// Protected routes
Route::middleware(['check.auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    

    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
});

// Authentication routes (AJAX) - Guests only
Route::middleware(['guest'])->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
});

Route::get('/auth/user', [AuthController::class, 'currentUser'])->name('auth.user');

