@extends('layouts.app')

@section('title', 'Admin Dashboard | ReelTime')

@section('body-class')
admin-page
@endsection

@section('content')
@php($adminAvatar = Illuminate\Support\Str::startsWith($user->profile_image, ['http://', 'https://']) ? $user->profile_image : asset($user->profile_image))
<main class="page-shell admin-shell">
  <section class="surface-card admin-hero">
    <div class="admin-hero-main">
      <div class="admin-avatar-wrap">
        <img src="{{ $adminAvatar }}" alt="Admin" class="admin-avatar">
      </div>

      <div class="admin-hero-copy">
        <span class="eyebrow">Administrator</span>
        <h1>Welcome back, {{ $user->username }}</h1>
        <p>Manage movies, games, users, and bookings from one dashboard using the same ReelTime visual system as the public site.</p>
      </div>
    </div>

    <div class="admin-hero-actions">
      <button type="button" onclick="openModal('addMovieModal')" class="button button-primary">
        <i class="fas fa-plus" aria-hidden="true"></i>
        <span>Add Movie</span>
      </button>
      <button type="button" onclick="openModal('addGameModal')" class="button button-secondary">
        <i class="fas fa-plus" aria-hidden="true"></i>
        <span>Add Game</span>
      </button>
    </div>
  </section>

  <section class="admin-stats">
    <article class="surface-card admin-stat-card">
      <div class="admin-stat-icon">
        <i class="fas fa-film" aria-hidden="true"></i>
      </div>
      <div>
        <span class="admin-stat-label">Total Movies</span>
        <strong class="admin-stat-value">{{ $movieCount }}</strong>
      </div>
    </article>

    <article class="surface-card admin-stat-card">
      <div class="admin-stat-icon">
        <i class="fas fa-gamepad" aria-hidden="true"></i>
      </div>
      <div>
        <span class="admin-stat-label">Total Games</span>
        <strong class="admin-stat-value">{{ $gameCount }}</strong>
      </div>
    </article>

    <article class="surface-card admin-stat-card">
      <div class="admin-stat-icon">
        <i class="fas fa-users" aria-hidden="true"></i>
      </div>
      <div>
        <span class="admin-stat-label">Total Users</span>
        <strong class="admin-stat-value">{{ $userCount }}</strong>
      </div>
    </article>

    <article class="surface-card admin-stat-card">
      <div class="admin-stat-icon">
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>
      </div>
      <div>
        <span class="admin-stat-label">Total Bookings</span>
        <strong class="admin-stat-value">{{ $bookingCount }}</strong>
      </div>
    </article>
  </section>

  <section class="surface-card admin-tabs-panel">
    <div class="admin-tabs" role="tablist" aria-label="Admin sections">
      <button class="button button-secondary admin-tab-btn is-active" id="moviesTabBtn" type="button" onclick="switchTab('movies')">
        <i class="fas fa-film" aria-hidden="true"></i>
        <span>Movies</span>
      </button>
      <button class="button button-secondary admin-tab-btn" id="gamesTabBtn" type="button" onclick="switchTab('games')">
        <i class="fas fa-gamepad" aria-hidden="true"></i>
        <span>Games</span>
      </button>
      <button class="button button-secondary admin-tab-btn" id="bookingsTabBtn" type="button" onclick="switchTab('bookings')">
        <i class="fas fa-ticket-alt" aria-hidden="true"></i>
        <span>Bookings</span>
      </button>
      <button class="button button-secondary admin-tab-btn" id="usersTabBtn" type="button" onclick="switchTab('users')">
        <i class="fas fa-users" aria-hidden="true"></i>
        <span>Users</span>
      </button>
    </div>

    <section id="moviesTab" class="admin-tab-pane">
      <div class="section-header">
        <span class="eyebrow">Movies</span>
        <h2>Catalog overview</h2>
        <p>Review the current movie inventory and keep the poster catalog tidy.</p>
      </div>

      <div class="admin-data-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Poster</th>
                <th>Title</th>
                <th>Rating</th>
                <th>Duration</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @forelse($movies as $movie)
                <tr>
                  <td>{{ $movie->movie_id }}</td>
                  <td>
                    @if($movie->poster)
                      <img src="{{ asset($movie->poster) }}" class="admin-thumb" alt="Poster">
                    @else
                      <div class="admin-thumb admin-thumb-placeholder"></div>
                    @endif
                  </td>
                  <td>{{ $movie->title }}</td>
                  <td>{{ $movie->rating }}</td>
                  <td>{{ $movie->duration }} min</td>
                  <td>
                    <div class="admin-actions">
                      <button type="button" class="button button-secondary admin-icon-btn" aria-label="Edit movie">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger" aria-label="Delete movie">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              @empty
                <tr>
                  <td colspan="6" class="admin-empty">No movies yet.</td>
                </tr>
              @endforelse
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="gamesTab" class="admin-tab-pane d-none">
      <div class="section-header">
        <span class="eyebrow">Games</span>
        <h2>Playable content</h2>
        <p>Keep track of the enabled game types and their icons.</p>
      </div>

      <div class="admin-data-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Icon</th>
                <th>Title</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @forelse($games as $game)
                <tr>
                  <td>{{ $game->game_id }}</td>
                  <td>
                    <div class="admin-table-icon">
                      <i class="fas {{ $game->icon }}" aria-hidden="true"></i>
                    </div>
                  </td>
                  <td>{{ $game->title }}</td>
                  <td>{{ $game->game_type }}</td>
                  <td>
                    <div class="admin-actions">
                      <button type="button" class="button button-secondary admin-icon-btn" aria-label="Edit game">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger" aria-label="Delete game">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              @empty
                <tr>
                  <td colspan="5" class="admin-empty">No games yet.</td>
                </tr>
              @endforelse
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="bookingsTab" class="admin-tab-pane d-none">
      <div class="section-header">
        <span class="eyebrow">Bookings</span>
        <h2>Recent reservations</h2>
        <p>Monitor booking volume, movie demand, and reservation status from one view.</p>
      </div>

      <div class="admin-data-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>User</th>
                <th>Movie</th>
                <th>Poster</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @forelse($bookings as $booking)
                @php($bookingStatus = strtolower($booking->status ?? 'pending'))
                <tr>
                  <td>{{ $booking->booking_id }}</td>
                  <td>{{ $booking->user->username }}</td>
                  <td>{{ $booking->showtime->movie->title }}</td>
                  <td>
                    <img src="{{ asset($booking->showtime->movie->poster) }}" class="admin-thumb" alt="Poster">
                  </td>
                  <td>{{ $booking->booking_date }}</td>
                  <td>
                    <span class="admin-badge {{ 'status-' . $bookingStatus }}">{{ $booking->status }}</span>
                  </td>
                  <td>
                    <div class="admin-actions">
                      <button type="button" class="button button-secondary admin-icon-btn" aria-label="View booking">
                        <i class="fas fa-eye" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger" aria-label="Delete booking">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              @empty
                <tr>
                  <td colspan="7" class="admin-empty">No bookings yet.</td>
                </tr>
              @endforelse
            </tbody>
          </table>
        </div>
      </div>
    </section>

    <section id="usersTab" class="admin-tab-pane d-none">
      <div class="section-header">
        <span class="eyebrow">Users</span>
        <h2>Member directory</h2>
        <p>Review account activity and role assignments without leaving the dashboard.</p>
      </div>

      <div class="admin-data-card">
        <div class="admin-table-wrap">
          <table class="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Avatar</th>
                <th>Username</th>
                <th>Email</th>
                <th>Member Since</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              @forelse($users as $member)
                <tr>
                  <td>{{ $member->user_id }}</td>
                  <td>
                    @if($member->profile_image)
                      <img src="{{ Illuminate\Support\Str::startsWith($member->profile_image, ['http://', 'https://']) ? $member->profile_image : asset($member->profile_image) }}" class="admin-avatar-sm" alt="{{ $member->username }}">
                    @else
                      <div class="admin-avatar-sm admin-thumb-placeholder"></div>
                    @endif
                  </td>
                  <td>{{ $member->username }}</td>
                  <td>{{ $member->email }}</td>
                  <td>{{ $member->member_since }}</td>
                  <td>
                    <span class="admin-badge {{ $member->role === 'admin' ? 'role-admin' : 'role-user' }}">{{ $member->role }}</span>
                  </td>
                  <td>
                    <div class="admin-actions">
                      <button type="button" class="button button-secondary admin-icon-btn" aria-label="Edit user">
                        <i class="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger" aria-label="Delete user">
                        <i class="fas fa-trash" aria-hidden="true"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              @empty
                <tr>
                  <td colspan="7" class="admin-empty">No users yet.</td>
                </tr>
              @endforelse
            </tbody>
          </table>
        </div>
      </div>
    </section>
  </section>
</main>

<div id="addMovieModal" class="admin-modal" onclick="closeModal('addMovieModal')">
  <div class="surface-card admin-modal-shell" onclick="event.stopPropagation()">
    <button type="button" class="modal-close-btn" onclick="closeModal('addMovieModal')" aria-label="Close">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
    <div class="section-header">
      <span class="eyebrow">Movie Tools</span>
      <h2>Add movie</h2>
      <p>The create flow can be wired into this panel when you are ready to move beyond the placeholder state.</p>
    </div>
  </div>
</div>

<div id="addGameModal" class="admin-modal" onclick="closeModal('addGameModal')">
  <div class="surface-card admin-modal-shell" onclick="event.stopPropagation()">
    <button type="button" class="modal-close-btn" onclick="closeModal('addGameModal')" aria-label="Close">
      <i class="fas fa-times" aria-hidden="true"></i>
    </button>
    <div class="section-header">
      <span class="eyebrow">Game Tools</span>
      <h2>Add game</h2>
      <p>The create flow can be wired into this panel when you are ready to manage new trivia content.</p>
    </div>
  </div>
</div>

<script>
  function switchTab(tab) {
    const tabs = ['movies', 'games', 'bookings', 'users'];
    tabs.forEach((name) => {
      const content = document.getElementById(`${name}Tab`);
      const btn = document.getElementById(`${name}TabBtn`);
      const isActive = name === tab;

      if (content) {
        content.classList.toggle('d-none', !isActive);
      }

      if (btn) {
        btn.classList.toggle('is-active', isActive);
      }
    });
  }

  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  document.addEventListener('DOMContentLoaded', () => switchTab('movies'));
</script>
@endsection
