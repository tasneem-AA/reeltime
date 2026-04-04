@extends('layouts.app')

@section('title', 'Bookings | ReelTime')

@section('body-class')
bookings-page
@endsection

@push('scripts')
<script>
  window.bookingData = @json($bookingData);
  window.bookingStoreUrl = "{{ route('bookings.store') }}";
</script>
<script src="{{ asset('js/watchlist.js') }}" defer></script>
<script src="{{ asset('js/bookings.js') }}" defer></script>
@endpush

@section('content')
<div id="searchOverlay" class="search-overlay">
  <div class="search-results"></div>
</div>

<main class="page-shell booking-shell">
  <section class="booking-hero">
    <div class="hero-copy">
      <span class="eyebrow">Book In Minutes</span>
      <h1>Pick a cinema, choose seats, and check out without losing context.</h1>
      <p>
        ReelTime keeps the booking flow simple: choose the movie, set the date and time, reserve seats,
        then finish payment in one continuous path.
      </p>
      <div class="hero-actions">
        <a href="#step1" class="button button-primary">Start booking</a>
        <a href="#gallery2" class="button button-secondary">View showtimes</a>
      </div>
    </div>
  </section>

  <section class="booking-layout">
    <article class="booking-panel booking-flow">
      <div class="section-header">
        <span class="eyebrow">Booking Flow</span>
        <h2>Move through the steps in order.</h2>
        <p>Each step unlocks the next one so the booking stays readable from start to finish.</p>
      </div>

      <div class="booking-pills">
        <span>Cinema</span>
        <span>Movie</span>
        <span>Date</span>
        <span>Seats</span>
        <span>Checkout</span>
      </div>

      <div class="booking-steps">
        <button class="stepsbtn default enabled" id="btn1" type="button" onclick="showStep(1)">1</button>
        <button class="stepsbtn" id="btn2" type="button" onclick="showStep(2)">2</button>
        <button class="stepsbtn" id="btn3" type="button" onclick="showStep(3)">3</button>
        <button class="stepsbtn" id="btn4" type="button" onclick="showStep(4)">4</button>
        <button class="stepsbtn" id="btn5" type="button" onclick="showStep(5)">5</button>
      </div>

      <div class="booking-stage">
        <div class="step-content default" id="step1">
          <select id="cinemasSelect">
            <option value="">Choose a cinema</option>
            @foreach($bookingData['cinemas'] as $cinema)
              <option value="{{ $cinema['id'] }}">{{ $cinema['name'] }}</option>
            @endforeach
          </select>
          <button class="button button-primary" type="button" onclick="completeStep()">Submit</button>
        </div>

        <div class="step-content" id="step2">
          <select id="movieselect">
            <option value="">Choose a movie</option>
          </select>
          <button class="button button-primary" type="button" onclick="completeStep()">Submit</button>
        </div>

        <div class="step-content" id="step3">
          <select id="dateselect">
            <option value="">Choose a date</option>
          </select>
          <select id="timeselect">
            <option value="">Choose a time</option>
          </select>
          <button class="button button-primary" type="button" id="Datebtn" disabled>Submit</button>
          <div id="datecompletestep"></div>
        </div>

        <div class="step-content" id="step4">
          <div class="container">
            <div class="front-screen">
              <div class="screen"></div>
              <div class="overlay"></div>
            </div>
            <div class="seats">
              <div class="front-row first-front-row"></div>
              <div class="front-row second-front-row"></div>
              <div class="middle-row"></div>
              <div class="front-row second-last-row"></div>
              <div class="front-row first-last-row"></div>
            </div>
            <div class="legend">
              <div>
                <div class="seat available"></div>
                <span>Available</span>
              </div>
              <div>
                <div class="seat selected"></div>
                <span>Selected</span>
              </div>
              <div>
                <div class="seat reserved"></div>
                <span>Reserved</span>
              </div>
            </div>
          </div>
          <button class="button button-primary" type="button" id="reserveBtn" disabled onclick="completeStep()">Reserve</button>
        </div>

        <div class="step-content" id="step5">
          <input type="text" id="Name" placeholder="Enter your full name">
          <input type="text" id="Email" placeholder="Enter your email">
          <input type="text" id="PhoneNumber" placeholder="Enter your phone number">
          <input type="text" id="CardNumber" placeholder="Enter your card number">
          <input type="text" id="CVV" placeholder="Enter your CVV">
          <button class="button button-primary" type="button" id="confirmbtn">Confirm</button>
          <div id="TotalPrice"></div>
          <div id="confirmation"></div>
        </div>
      </div>
    </article>

    <aside class="booking-panel booking-gallery">
      <div class="section-header">
        <span class="eyebrow">Now Showing</span>
        <h2>Tap a poster for showtimes and quick context.</h2>
        <p>Each card opens the shared detail modal with the trailer, cast, genres, and reviews.</p>
      </div>

      <section class="gallery2" id="gallery2">
        <div class="movie" id="movie">
          @forelse($featuredMovies as $movie)
            <figure class="movie-card"
              data-movie-id="{{ $movie['id'] }}"
              data-title="{{ $movie['title'] }}"
              data-description="{{ $movie['description'] }}"
              data-trailer-url="{{ $movie['trailer_url'] }}"
              data-cast="{{ implode(', ', $movie['cast']) }}"
              data-genres="{{ implode(', ', $movie['genres']) }}"
              data-this-movie-is="{{ implode(', ', $movie['tags']) }}"
              data-rating="{{ $movie['rating'] !== null ? number_format($movie['rating'], 1) : 'N/A' }}"
              data-time="{{ $movie['time'] ?? 'N/A' }}"
              data-showtimes='@json($movie['modal_showtimes'])'>
              <img src="{{ $movie['poster_url'] }}" alt="{{ $movie['title'] }} poster">
              <button class="showShowTimes-btn" type="button">View showtimes</button>
              <div class="movie-overlay">
                <p class="movie-overlay-title">{{ $movie['title'] }}</p>
                <p class="movie-overlay-desc">{{ $movie['description'] }}</p>
                <div class="movie-overlay-bottom">
                  <span class="film-overlay">{{ $movie['time'] ?? 'N/A' }}</span>
                  <span class="movie-overlay-rating">{{ $movie['rating'] !== null ? number_format($movie['rating'], 1) : 'N/A' }} / 5 stars</span>
                </div>
              </div>
            </figure>
          @empty
            <div class="empty-watchlist" style="grid-column: 1 / -1;">
              <h3>No showtimes available</h3>
              <p>Add movies and showtimes in the database to make the booking flow available here.</p>
            </div>
          @endforelse
        </div>
      </section>
    </aside>
  </section>
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
        <p class="movieshowtime"><strong>Showtimes:</strong></p>
        <div class="showtimes" id="modal-showtimes"></div>
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
