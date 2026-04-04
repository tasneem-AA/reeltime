<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Permissions-Policy" content="autoplay=(self),encrypted-media=(self)">
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="csrf-token" content="{{ csrf_token() }}">
  <meta name="theme-color" content="#0b1320">
  <title>@yield('title', 'ReelTime')</title>
  <link rel="shortcut icon" href="{{ asset('imgs/movie.png') }}" type="image/x-icon">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css">
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="{{ asset('css/styles.css') }}">
  @stack('styles')
  <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
  <script>
    window.routes = {
        profile: "{{ route('profile') }}",
        home: "{{ route('home') }}",
        about: "{{ route('about') }}",
        bookings: "{{ route('bookings') }}",
        search: "{{ route('search') }}",
        trivia: "{{ route('trivia') }}"
    };

    window.authUser = {{ Illuminate\Support\Js::from(Auth::check() ? [
        'id' => Auth::user()->user_id,
        'username' => Auth::user()->username,
        'email' => Auth::user()->email,
        'img' => Auth::user()->profile_image ?? 'https://robohash.org/' . urlencode(Auth::user()->username),
        'since' => optional(Auth::user()->member_since)->year ?? Auth::user()->created_at->year,
        'role'=> Auth::user()->role,
    ] : null) }};

    window.loginModalShouldOpen = {{ session('login_required') ? 'true' : 'false' }};
  </script>
  <script src="{{ asset('js/config.js') }}"></script>
  <script src="{{ asset('js/script.js') }}" defer></script>
  @stack('head-scripts')
</head>
@php($bodyClass = trim($__env->yieldContent('body-class')))
<body class="{{ trim('bg-dark text-light ' . $bodyClass) }}" data-bs-theme="dark">
  @include('partials.header')

  @if(session('success') || session('error'))
    <div id="flash-message" class="site-flash {{ session('success') ? 'is-success' : 'is-error' }}">
        {{ session('success') ?? session('error') }}
    </div>
    <script>
        setTimeout(() => {
            const flash = document.getElementById('flash-message');
            if (!flash) return;
            flash.classList.add('is-hiding');
            setTimeout(() => flash.remove(), 320);
        }, 3000);
    </script>
  @endif

  @yield('content')

  @include('partials.footer')
  @include('partials.login-modal')

  <script src="{{ asset('js/scriptJQ.js') }}" defer></script>
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
  @stack('scripts')
</body>
</html>
