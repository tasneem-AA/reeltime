<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SearchController;
use App\Models\HeroBanner;

Route::get('/', function () {
    $heroBanners = HeroBanner::orderBy('position')->get();
    return view('index', compact('heroBanners'));
})->name('home');

Route::get('/about', function () {
    return view('pages.about');
})->name('about');

Route::get('/bookings', [BookingController::class, 'index'])->name('bookings');

Route::get('/search', [SearchController::class, 'index'])->name('search');

Route::get('/trivia', function () {
    return view('pages.trivia');
})->name('trivia');

// Admin Area
Route::middleware(['check.admin'])->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
});

// Protected routes
Route::middleware(['check.auth'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');

    Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout');
});

// Authentication routes (AJAX) - Guests only
Route::middleware(['guest'])->group(function () {
    Route::post('/auth/login', [AuthController::class, 'login'])->name('auth.login');
    Route::post('/auth/register', [AuthController::class, 'register'])->name('auth.register');
});

Route::get('/auth/user', [AuthController::class, 'currentUser'])->name('auth.user');
