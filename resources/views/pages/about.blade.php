@extends('layouts.app')

@section('title', 'About Us | ReelTime')

@section('body-class')
about-page
@endsection

@section('content')
<main class="page-shell about-shell">
  <section class="surface-card about-hero">
    <div class="hero-copy">
      <span class="eyebrow">About ReelTime</span>
      <h1>Built for movie nights that stay focused on the film.</h1>
      <p>
        ReelTime brings trailers, watchlists, seat booking, ratings, and games into one flow so users can move
        from curiosity to checkout without bouncing between disconnected pages.
      </p>
      <div class="hero-actions">
        <a href="{{ route('search') }}" class="button button-primary">Explore movies</a>
        <a href="{{ route('bookings') }}" class="button button-secondary">Plan a booking</a>
      </div>
    </div>

    <div class="hero-metrics">
      <article class="metric-card">
        <strong>500+</strong>
        <span>Movies to rate</span>
      </article>
      <article class="metric-card">
        <strong>24/7</strong>
        <span>Booking access</span>
      </article>
      <article class="metric-card">
        <strong>Fast</strong>
        <span>Trailer-first browsing</span>
      </article>
    </div>
  </section>

  <section class="about-story">
    <article class="surface-card story-copy">
      <div class="section-header">
        <span class="eyebrow">The Story</span>
        <h2>Why ReelTime exists</h2>
        <p>
          We wanted discovery and booking to feel curated, direct, and useful. Open a trailer, check the mood,
          save it for later, then move into seats and showtimes without losing context.
        </p>
      </div>

      <p>
        The product is intentionally simple: fewer distractions, clearer decisions, and a better path from browsing
        to actually watching the movie.
      </p>

      <div class="story-stats">
        <div class="story-stat">
          <span class="stat-number">100+</span>
          <span class="stat-label">Trailers queued</span>
        </div>
        <div class="story-stat">
          <span class="stat-number">Global</span>
          <span class="stat-label">Booking-ready flow</span>
        </div>
        <div class="story-stat">
          <span class="stat-number">95%</span>
          <span class="stat-label">Users stay in flow</span>
        </div>
      </div>
    </article>

    <article class="surface-card story-visual">
      <div class="image-container">
        <img src="{{ asset('imgs/for welcome page.png') }}" alt="ReelTime cinema experience">
        <div class="image-overlay"></div>
      </div>
    </article>
  </section>

  <section>
    <div class="section-header">
      <span class="eyebrow">Why Choose ReelTime</span>
      <h2>Everything stays centered on the movie.</h2>
      <p>
        Discovery, booking, watchlists, and ratings all follow the same visual system and the same low-friction flow.
      </p>
    </div>

    <div class="values-grid">
      <article class="value-card">
        <div class="value-icon">
          <i class="fas fa-ticket-alt" aria-hidden="true"></i>
        </div>
        <h3>Smart booking</h3>
        <p>Reserve seats with a clean, readable flow that keeps timing, selections, and checkout obvious.</p>
      </article>

      <article class="value-card">
        <div class="value-icon">
          <i class="fas fa-play-circle" aria-hidden="true"></i>
        </div>
        <h3>Trailer first</h3>
        <p>Watch the trailer before committing, then decide whether to save, rate, or book.</p>
      </article>

      <article class="value-card">
        <div class="value-icon">
          <i class="fas fa-heart" aria-hidden="true"></i>
        </div>
        <h3>Rate and remember</h3>
        <p>Keep a personal history of what you saved, watched, booked, and reviewed.</p>
      </article>
    </div>
  </section>

  <section>
    <div class="section-header">
      <span class="eyebrow">Mission</span>
      <h2>The product principles behind the experience.</h2>
      <p>Clear decisions, stronger taste signals, and less clutter around movie night.</p>
    </div>

    <div class="about-pillars">
      <article class="pillar-card">
        <img src="{{ asset('imgs/badge.png') }}" alt="Achievements" class="about-icon">
        <h3>Achievements</h3>
        <p>Thousands of bookings, trailer views, and saved titles moving through one cleaner flow.</p>
      </article>

      <article class="pillar-card">
        <img src="{{ asset('imgs/shared-vision.png') }}" alt="Vision" class="about-icon">
        <h3>Vision</h3>
        <p>Be the most direct way to discover, save, and book movies from a single place.</p>
      </article>

      <article class="pillar-card">
        <img src="{{ asset('imgs/mission.png') }}" alt="Mission" class="about-icon">
        <h3>Mission</h3>
        <p>Give movie lovers a fast path from curiosity to the big screen with less friction everywhere.</p>
      </article>
    </div>
  </section>

  <section class="surface-card cta-section">
    <div class="cta-content">
      <span class="eyebrow">Ready To Move?</span>
      <h2>Browse the catalog or lock in seats now.</h2>
      <p>Watch trailers, build a sharper watchlist, and make bookings without leaving the flow.</p>
      <div class="cta-buttons">
        <a href="{{ route('home') }}" class="button button-primary">Start watching</a>
        <a href="{{ route('bookings') }}" class="button button-secondary">Book tickets</a>
      </div>
    </div>
  </section>
</main>
@endsection
