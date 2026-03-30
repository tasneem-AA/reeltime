@extends('layouts.app')

@section('title', 'ReelTime - Discover, Rate & Watch')

@section('body-class')
home-page
@endsection

@push('scripts')
<script src="{{ asset('js/watchlist.js') }}" defer></script>
@endpush

@section('content')
<main class="home-shell d-grid px-3 px-lg-4 py-4 py-lg-5">
  <section class="surface-card home-hero">
    <div class="hero-copy">
      <span class="eyebrow">ReelTime cinema club</span>
      <h1>One place to discover, book, rate, and play.</h1>
      <p>
        Open a trailer, save a watchlist, reserve seats, and jump into trivia without losing the thread.
      </p>
      <div class="hero-actions">
        <a href="{{ route('search') }}" class="button button-primary">Browse movies</a>
        <a href="{{ route('bookings') }}" class="button button-secondary">Book seats</a>
      </div>
    </div>

    <div class="hero-notes">
      <article class="note-card">
        <span>01</span>
        <h3>Trailer first</h3>
        <p>Preview the mood before you commit.</p>
      </article>
      <article class="note-card">
        <span>02</span>
        <h3>Watchlist ready</h3>
        <p>Save picks and return later.</p>
      </article>
      <article class="note-card">
        <span>03</span>
        <h3>Built-in trivia</h3>
        <p>Keep the night going after the credits.</p>
      </article>
    </div>
  </section>

  <div class="welcome-box" id="heroBox">
    <button class="hero-btn prev" onclick="prevImage()">&#10094;</button>
    <button class="hero-btn next" onclick="nextImage()">&#10095;</button>

    @foreach($heroBanners ?? [] as $banner)
      <div class="hero-slide {{ $loop->first ? 'active' : '' }}" data-position="{{ $banner->position }}">
        @if($banner->subtitle)
          <p class="hero-kicker">{{ $banner->subtitle }}</p>
        @endif
        <h1>{{ $banner->title }}</h1>
        @if($banner->cta_label && $banner->cta_route_name)
          <a href="{{ route($banner->cta_route_name) }}" class="button button-primary hero-cta">{{ $banner->cta_label }}</a>
        @endif
      </div>
    @endforeach
  </div>

  <section class="gallery" id="gallery"></section>
</main>

<div class="modal" id="card-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__backdrop" data-close-modal></div>
  <div class="modal__dialog surface-card" role="document">
    <button class="modal__close" id="modal-close" aria-label="Close dialog" data-close-modal>&times;</button>

    <div class="modal__media">
      <div id="trailer-container">
        <iframe id="modal-trailer" width="100%" height="315" src="" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen>
        </iframe>
      </div>
      <div id="movieinfo">
        <p><strong>Cast:</strong> <span id="modal-cast"></span></p>
        <p><strong>Genres:</strong> <span id="modal-genres"></span></p>
        <p><strong>This movie is:</strong> <span id="modal-this-movie-is"></span></p>
      </div>
    </div>

    <div class="modal__body">
      <h3 id="modal-title">movie</h3>
      <p id="modal-text"></p>
      <button class="add-watchlist-btn">+ Add to Watchlist</button>
      <div class="comments-section">
        <h4>Reviews</h4>
        <div id="comments-list"></div>
      </div>
    </div>
  </div>
</div>
@endsection
