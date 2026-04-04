@extends('layouts.app')

@section('title', 'Search Movies | ReelTime')

@section('body-class')
search-page
@endsection

@push('scripts')
<script>
  window.searchMovies = @json($searchMovies);
</script>
<script src="{{ asset('js/search.js') }}" defer></script>
<script src="{{ asset('js/watchlist.js') }}" defer></script>
@endpush

@section('content')
<main class="page-shell search-main">
  <section class="surface-card search-hero">
    <div class="hero-copy">
      <span class="eyebrow">Discover / Rate / Book</span>
      <h1>Find your next movie without the noise.</h1>
      <p>
        Search the ReelTime catalog by title, genre, or mood, then jump straight into trailers, reviews,
        and watchlist saves using the same poster system as the homepage.
      </p>
    </div>

    <div class="hero-metrics">
      <article class="metric-card">
        <strong>Title</strong>
        <span>Search by film name</span>
      </article>
      <article class="metric-card">
        <strong>Genre</strong>
        <span>Filter by taste fast</span>
      </article>
      <article class="metric-card">
        <strong>Mood</strong>
        <span>Browse by vibe, not clutter</span>
      </article>
    </div>
  </section>

  <section class="surface-card search-results-card">
    <div class="section-header">
      <span class="eyebrow">Search The Catalog</span>
      <h2>Start with a title, genre, or keyword.</h2>
      <p>Results update as you type, and each poster opens the same detail modal used across the site.</p>
    </div>

    <div class="search-bar-large" role="search">
      <div class="search-type">
        <i class="fa-solid fa-film" aria-hidden="true"></i>
        <span>Movie finder</span>
      </div>
      <input id="mainSearchInput" type="text" placeholder="Type a movie title, genre, or keyword..." aria-label="Search movies">
      <button id="mainSearchBtn" type="button" aria-label="Search">
        <i class="fa fa-search" aria-hidden="true"></i>
      </button>
    </div>
  </section>

  <section class="surface-card search-results-card search-results-section">
    <div class="results-header">
      <div class="section-header">
        <span class="eyebrow">Results</span>
        <h2>Matching titles</h2>
        <p id="resultsCount">Loading movies...</p>
      </div>

      <select id="searchSort" aria-label="Sort search results">
        <option value="relevance">Relevance</option>
        <option value="title-asc">Title A-Z</option>
        <option value="title-desc">Title Z-A</option>
        <option value="rating-desc">Rating High to Low</option>
        <option value="rating-asc">Rating Low to High</option>
      </select>
    </div>

    <div id="searchResults" aria-live="polite"></div>

    <div id="searchEmpty" class="surface-card search-empty" style="display:none;">
      <h3>No results found</h3>
      <p>Try another title, genre, or keyword.</p>
    </div>
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
