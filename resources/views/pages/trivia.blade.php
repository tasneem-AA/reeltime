@extends('layouts.app')

@section('title', 'Movie Games | ReelTime')

@section('body-class')
trivia-page
@endsection

@push('scripts')
<script src="{{ asset('js/trivia-updated.js') }}" defer></script>
@endpush

@section('content')
<main class="page-shell trivia-main">
  <section class="surface-card games-hero">
    <div class="hero-copy">
      <span class="eyebrow">Movie Games</span>
      <h1>Test your movie memory and keep the night going.</h1>
      <p>Play through quick game modes, stack points, and climb the leaderboard without leaving the ReelTime flow.</p>
    </div>

    <div class="hero-notes">
      <article class="note-card">
        <span>01</span>
        <h3>Emoji challenge</h3>
        <p>Guess the movie from a tiny clue.</p>
      </article>
      <article class="note-card">
        <span>02</span>
        <h3>Quote mode</h3>
        <p>Match famous lines to the right film.</p>
      </article>
      <article class="note-card">
        <span>03</span>
        <h3>Leaderboard</h3>
        <p>See who is keeping score across the app.</p>
      </article>
    </div>
  </section>

  <div id="loginRequired" class="surface-card login-required" style="display: none;">
    <div class="notlogin">
      <div class="empty-icon"><i class="fas fa-gamepad" aria-hidden="true"></i></div>
      <h3>Please log in</h3>
      <p>You need to be signed in to play games and keep your score on the leaderboard.</p>
      <a href="{{ route('home') }}" class="button button-secondary">Go to login</a>
    </div>
  </div>

  <div id="gamesContainer" class="games-container" style="display: none;">
    <section class="games-grid">
      <article class="game-card" data-game="guess">
        <div class="game-icon">
          <i class="fas fa-theater-masks" aria-hidden="true"></i>
        </div>
        <h3>Emoji challenge</h3>
        <p>Guess movies from emoji combinations.</p>
        <button class="play-btn" type="button" onclick="startGuessGame()">Play now</button>
      </article>

      <article class="game-card" data-game="character">
        <div class="game-icon">
          <i class="fas fa-users" aria-hidden="true"></i>
        </div>
        <h3>Character match</h3>
        <p>Match characters to their movies.</p>
        <button class="play-btn" type="button" onclick="startCharacterGame()">Play now</button>
      </article>

      <article class="game-card" data-game="quotes">
        <div class="game-icon">
          <i class="fas fa-quote-right" aria-hidden="true"></i>
        </div>
        <h3>Movie quotes</h3>
        <p>Identify movies from famous lines.</p>
        <button class="play-btn" type="button" onclick="startQuotesGame()">Play now</button>
      </article>

      <article class="game-card" data-game="scenes">
        <div class="game-icon">
          <i class="fas fa-film" aria-hidden="true"></i>
        </div>
        <h3>Movie scenes</h3>
        <p>Guess movies from scene descriptions.</p>
        <button class="play-btn" type="button" onclick="startScenesGame()">Play now</button>
      </article>

      <article class="game-card" data-game="coming-soon">
        <div class="game-icon">
          <i class="fas fa-rocket" aria-hidden="true"></i>
        </div>
        <h3>More games</h3>
        <p>New game modes are on the way.</p>
        <button class="play-btn" type="button" disabled>Coming soon</button>
      </article>
    </section>

    <section class="surface-card leaderboard-section">
      <div class="section-header">
        <span class="eyebrow">Leaderboard</span>
        <h2>Top players</h2>
        <p>Scores stack across game sessions, so the best regulars stay visible.</p>
      </div>
      <div class="leaderboard" id="leaderboard"></div>
    </section>
  </div>
</main>

<div id="triviaModal" class="game-modal">
  <div class="modal-content surface-card">
    <span class="close-btn" onclick="closeGame()">&times;</span>
    <div id="game-content"></div>
  </div>
</div>
@endsection
