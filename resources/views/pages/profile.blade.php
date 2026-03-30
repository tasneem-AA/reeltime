@extends('layouts.app')

@section('title', 'Your Profile | ReelTime')

@section('body-class')
profile-page
@endsection

@push('scripts')
<script>
    window.authUser = @json([
        'id' => $user->user_id,
        'username' => $user->username,
        'email' => $user->email,
        'img' => $user->profile_image ?? ('https://robohash.org/' . urlencode($user->username)),
        'since' => optional($user->member_since ?? $user->created_at)->year,
        'role' => $user->role,
    ]);
    window.watchlistCount = {{ $watchlist->count() }};
</script>
<script src="{{ asset('js/profile.js') }}" defer></script>
<script src="{{ asset('js/watchlist.js') }}" defer></script>
@endpush

@section('content')
<main class="profile-page"></main>
@endsection
