<footer class="cinema-footer surface-card">
  <div class="footer-main">
    <div class="footer-section">
      <a href="{{ route('home') }}" class="footer-brand text-decoration-none" aria-label="ReelTime home">
        <span class="logo"><img src="{{ asset('imgs/movie.png') }}" alt="ReelTime logo"></span>
        <span class="brand-copy">
          <span class="brand-name">ReelTime</span>
          <small>cinema, curated</small>
        </span>
      </a>
      <p class="footer-tagline">
        A cleaner way to discover films, save favorites, and book seats without the clutter.
      </p>
    </div>

    <div class="footer-nav">
      <div class="nav-column">
        <strong class="footer-heading">Explore</strong>
        <a href="{{ route('home') }}" class="footer-link">Home</a>
        <a href="{{ route('bookings') }}" class="footer-link">Bookings</a>
        <a href="{{ route('trivia') }}" class="footer-link">Games</a>
        <a href="{{ route('about') }}" class="footer-link">About</a>
      </div>

      <div class="nav-column">
        <strong class="footer-heading">Socials</strong>
        <a href="#" class="footer-link">Instagram</a>
        <a href="#" class="footer-link">Facebook</a>
        <a href="#" class="footer-link">TikTok</a>
      </div>
    </div>
  </div>

  <div class="footer-credits">
    <p>Built for trailers, tickets, and late-night rewatches.</p>
    <p>&copy; {{ date('Y') }} ReelTime</p>
  </div>
</footer>
