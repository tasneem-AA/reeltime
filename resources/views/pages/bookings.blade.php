@extends('layouts.app')

@section('title', 'Bookings | ReelTime')

@section('body-class')
bookings-page
@endsection

@push('scripts')
<script src="{{ asset('js/watchlist.js') }}" defer></script>
<script>
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.gallery2 .movie-card').forEach(card => {
      const title = card.dataset.title || '';
      const desc = card.dataset.description || '';
      const rating = card.dataset.rating || 'N/A';
      const time = card.dataset.time || 'N/A';
      const overlay = document.createElement('div');
      overlay.className = 'movie-overlay';
      overlay.innerHTML = `
        <p class="movie-overlay-title">${title}</p>
        <p class="movie-overlay-desc">${desc}</p>
        <div class="movie-overlay-bottom">
          <span class="film-overlay">${time}</span>
          <span class="movie-overlay-rating">${rating} / 5 stars</span>
        </div>
      `;
      card.appendChild(overlay);
    });
  });
</script>
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
            <option value="SpotChoueifat">The Spot Choueifat</option>
            <option value="SpotSaida">The Spot Saida</option>
          </select>
          <button class="button button-primary" type="button" onclick="completeStep()">Submit</button>
        </div>

        <div class="step-content" id="step2">
          <select id="movieselect">
            <option value="TheRunningMan">The Running Man</option>
            <option value="Predator:Badlands">Predator: Badlands</option>
            <option value="HardaBasht">HardaBasht</option>
            <option value="Jujutsu Kaisen:Execution">Jujutsu Kaisen: Execution</option>
            <option value="Playdate">Playdate</option>
            <option value="ElSelemWElThoban">El Selem W El Thoban</option>
          </select>
          <button class="button button-primary" type="button" onclick="completeStep()">Submit</button>
        </div>

        <div class="step-content" id="step3">
          <input type="date" id="dateselect">
          <select id="timeselect">
            <option value="1:00">1:00 pm</option>
            <option value="3:00">3:00 pm</option>
            <option value="6:00">6:00 pm</option>
            <option value="9:00">9:00 pm</option>
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
          <figure class="movie-card" data-title="The Running Man"
            data-description="In a near-future society, The Running Man is the top-rated show on television, a deadly competition where contestants must survive 30 days while being hunted by professional assassins."
            data-trailer-id="YOUR_TRAILER_ID_4"
            data-cast="Arnold Schwarzenegger, Maria Conchita Alonso, Richard Dawson"
            data-genres="Action, Sci-Fi, Thriller"
            data-this-movie-is="Intense, Violent, Futuristic"
            data-rating="4.3"
            data-time="115 min">
            <img src="{{ asset('imgs/therunningman-min.png') }}" alt="The Running Man">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>

          <figure class="movie-card" data-title="Predator:Badlands"
            data-description="A young Predator outcast from his clan finds an unlikely ally on his journey in search of the ultimate adversary."
            data-trailer-id="YOUR_TRAILER_ID_4"
            data-cast="Elle Fanning, Ravi Narayan, Micheal Homik"
            data-genres="Action, Sci-Fi, Horror"
            data-this-movie-is="Gory, Suspenseful, Alien Hunt"
            data-rating="3.3"
            data-time="125 min">
            <img src="{{ asset('imgs/predator badlands-min.png') }}" alt="Predator: Badlands">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>

          <figure class="movie-card" data-title="HardaBasht"
            data-description="A mother and her three boys live in the poor suburbs of Beirut, and a string of choices pulls the whole neighborhood into chaos."
            data-trailer-id="YOUR_TRAILER_ID_4"
            data-cast="Randa Kaady, Alexandra Kahwagi, Hussein Kaouk"
            data-genres="Drama, Family, Crime"
            data-this-movie-is="Emotional, Lebanese, Gritty"
            data-rating="4.1"
            data-time="155 min">
            <img src="{{ asset('imgs/hardabsht-min.png') }}" alt="HardaBasht poster">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>

          <figure class="movie-card" data-title="Jujutsu Kaisen:Execution"
            data-description="A veil drops over Shibuya on Halloween, trapping civilians while sorcerers and curse users collide in one of the series' biggest conflicts."
            data-trailer-id="YOUR_TRAILER_ID_5"
            data-cast="Adam McArthur, Jun'ya Enoki, Yuchi Nakamura"
            data-genres="Action, Fantasy, Anime"
            data-this-movie-is="Exciting, Supernatural, Intense"
            data-rating="4.7"
            data-time="175 min">
            <img src="{{ asset('imgs/jujutsu kaisen-min.png') }}" alt="Jujutsu Kaisen:Execution poster">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>

          <figure class="movie-card" data-title="Playdate"
            data-description="A reluctant stay-at-home dad accepts an invitation that turns into a chaotic run for survival with another father and their kids."
            data-trailer-id="YOUR_TRAILER_ID_6"
            data-cast="Alan Ritchson, Kevin James, Banks Peirce"
            data-genres="Comedy, Action, Thriller"
            data-this-movie-is="Funny, Suspenseful, Action-Packed"
            data-rating="4.2"
            data-time="185 min">
            <img src="{{ asset('imgs/playdate-min.png') }}" alt="Playdate poster">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>

          <figure class="movie-card" data-title="El Selem W El Thoban"
            data-description="In Snake and Ladder, love and ambition collide as two former partners struggle with who they became after distance and new relationships changed everything."
            data-trailer-id="GRm2_FzP1m0"
            data-cast="Amr Youssef, Asmaa Galal, Dhafer L'Abidine"
            data-genres="Romance, Drama"
            data-this-movie-is="Emotional, Romantic, Thought-Provoking"
            data-rating="2.3"
            data-time="168 min">
            <img src="{{ asset('imgs/El Selem W El Thoban-min.png') }}" alt="El Selem W El Thoban">
            <button class="showShowTimes-btn" type="button">View showtimes</button>
          </figure>
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
        <div class="showtimes">
          <span class="showtime-pill">1:00pm</span>
          <span class="showtime-pill">3:00pm</span>
          <span class="showtime-pill">6:00pm</span>
          <span class="showtime-pill">9:00pm</span>
        </div>
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
