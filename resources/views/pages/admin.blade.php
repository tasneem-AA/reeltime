@extends('layouts.app')

@section('title', 'Admin Dashboard | ReelTime')

@section('body-class')
admin-page
@endsection

@push('scripts')
<script src="{{ asset('js/admin.js') }}" defer></script>
@endpush

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
                <tr class="movie-row" style="cursor: pointer;"
                      data-title="{{ addslashes($movie->title) }}"
                      data-description="{{ addslashes($movie->description) }}"
                      data-cast="{{ addslashes($movie->cast) }}"
                      data-genres="{{ addslashes($movie->genres) }}"
                      data-this-movie-is="{{ addslashes($movie->this_movie_is) }}"
                      data-trailer-link="{{ $movie->trailer_link }}"
                      data-rating="{{ $movie->rating }}"
                      data-duration="{{ $movie->duration }}"
                      data-poster="{{ asset($movie->poster) }}">
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
                      <button type="button" class="button button-secondary admin-icon-btn" 
                          onclick="openEditMovieModal(
                              '{{ $movie->movie_id }}',
                              '{{ addslashes($movie->title) }}',
                              '{{ addslashes($movie->description) }}',
                              '{{ addslashes($movie->genres) }}',
                              '{{ addslashes($movie->this_movie_is) }}',
                              '{{ addslashes($movie->cast) }}',
                              '{{ $movie->duration }}',
                              '{{ $movie->trailer_link }}',
                              '{{ $movie->rating }}',
                              '{{ asset($movie->poster) }}'
                          )" aria-label="Edit movie">
                          <i class="fas fa-edit" aria-hidden="true"></i>
                      </button>
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger delete-btn" data-url="{{route('admin.movies.destroy',$movie->movie_id)}}" aria-label="Delete movie">
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
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger delete-btn" data-url="{{ route('admin.games.destroy', $game->game_id) }}" aria-label="Delete game">
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
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger delete-btn" data-url="{{ route('admin.bookings.destroy', $booking->booking_id) }}" aria-label="Delete booking">
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
                      <button type="button" class="button button-secondary admin-icon-btn admin-icon-btn-danger delete-btn" data-url="{{ route('admin.users.destroy', $member->user_id) }}" aria-label="Delete user">
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
    <div class="surface-card admin-modal-shell" onclick="event.stopPropagation()" style="max-width: 700px; max-height: 90vh; display: flex; flex-direction: column;">    
        <div style="flex-shrink: 0; padding: 0 0 1rem 0;">
           <button type="button" class="modal-close-btn" onclick="closeModal('addMovieModal')" aria-label="Close">
    <i class="fas fa-times" aria-hidden="true"></i>
</button>
            <div class="section-header" style="padding-right: 2.5rem;">
                <span class="eyebrow">Movie Tools</span>
                <h2>Add movie</h2>
                <p>Fill in the details to add a new movie to the catalog.</p>
            </div>
        </div>
        
       
        <div style="flex: 1; overflow-y: auto; padding-right: 0.5rem; margin-right: -0.5rem;">
            <form id="addMovieForm" enctype="multipart/form-data">
                @csrf
                <div style="display: grid; gap: 1.25rem;">
                    
                  
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-film" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Title <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" name="title" required 
                               placeholder="Enter movie title"
                               class="form-control" 
                               style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; transition: all 0.2s;">
                    </div>
                    
                   
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-align-left" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Description <span style="color: #ff6b6b;">*</span>
                        </label>
                        <textarea name="description" rows="4" required 
                                  placeholder="Enter movie description..."
                                  style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; resize: vertical; font-family: inherit;"></textarea>
                        <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Provide a compelling description of the movie</small>
                    </div>
                    
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-tags" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Genres <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" name="genres" required 
                               placeholder="e.g., Action, Sci-Fi, Thriller"
                               style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                        <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Separate genres with commas</small>
                    </div>
                     <div>
    <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
        <i class="fas fa-face-smile" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
        This Movie Is (Mood/Tags)
    </label>
    <input type="text" name="this_movie_is" 
           placeholder="e.g., Exciting, Suspenseful, Emotional, Heartwarming"
           style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
    <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Describe the movie mood (comma separated)</small>
</div>
                    
                   
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-users" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Cast <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" name="cast" required 
                               placeholder="e.g., Actor 1, Actor 2, Actor 3"
                               style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                        <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Separate cast members with commas</small>
                    </div>
                    
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-clock" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Duration (minutes) <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="number" name="duration" required min="1" max="600"
                               placeholder="e.g., 120"
                               style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                        <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Enter duration in minutes (1-600)</small>
                    </div>
                    
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fab fa-youtube" style="margin-right: 0.5rem; color: #ff0000;"></i>
                            Trailer Link
                        </label>
                        <input type="url" name="trailer_link" 
                               placeholder="https://www.youtube.com/embed/VIDEO_ID"
                               style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                        <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">YouTube embed URL (optional)</small>
                    </div>
                    
                  
                    
                    
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600; color: var(--text-color);">
                            <i class="fas fa-image" style="margin-right: 0.5rem; color: var(--accent-3);"></i>
                            Poster Image <span style="color: #ff6b6b;">*</span>
                        </label>
                        <div style="border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 1rem; text-align: center; background: rgba(255,255,255,0.02);">
                            <input type="file" name="poster" accept="image/*" 
                                   id="posterInput"
                                   style="display: none;">
                            <button type="button" onclick="document.getElementById('posterInput').click()" 
                                    style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 0.5rem 1rem; color: white; cursor: pointer; margin-bottom: 0.5rem;">
                                <i class="fas fa-upload"></i> Choose Image
                            </button>
                            <div id="posterPreview" style="margin-top: 0.5rem; display: none;">
                                <img id="posterPreviewImg" style="max-width: 150px; max-height: 150px; border-radius: 8px; margin-top: 0.5rem;">
                                <p id="posterFileName" style="color: var(--text-muted); font-size: 0.85rem; margin-top: 0.25rem;"></p>
                            </div>
                            <small style="color: var(--text-muted); display: block;">JPG, PNG, GIF, SVG up to 2MB</small>
                        </div>
                    </div>
                    
                   
                    <div id="movieFormMessage" style="display: none; padding: 0.75rem 1rem; border-radius: 12px; margin-top: 0.5rem;"></div>
                </div>
            </form>
        </div>
        
        
        <div style="flex-shrink: 0; padding-top: 1.5rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="admin-actions" style="justify-content: flex-end; gap: 1rem;">
              <button type="button" class="button button-secondary" data-close-modal="addMovieModal">
    <i class="fas fa-times"></i> Cancel
</button>
                <button type="submit" form="addMovieForm" class="button button-primary" id="submitMovieBtn" style="min-width: 120px;">
                    <i class="fas fa-plus"></i> Add Movie
                </button>
            </div>
        </div>
    </div>
</div>
<!-- Edit Movie Modal -->
<div id="editMovieModal" class="admin-modal" onclick="closeModal('editMovieModal')">
    <div class="surface-card admin-modal-shell" onclick="event.stopPropagation()" style="max-width: 700px; max-height: 90vh; display: flex; flex-direction: column;">
        <div style="flex-shrink: 0; padding: 0 0 1rem 0;">
            <button type="button" class="modal-close-btn" onclick="closeModal('editMovieModal')" aria-label="Close">
                <i class="fas fa-times" aria-hidden="true"></i>
            </button>
            <div class="section-header" style="padding-right: 2.5rem;">
                <span class="eyebrow">Movie Tools</span>
                <h2>Edit Movie</h2>
                <p>Update the movie details.</p>
            </div>
        </div>

        <div style="flex: 1; overflow-y: auto; padding-right: 0.5rem; margin-right: -0.5rem;">
            <form id="editMovieForm" enctype="multipart/form-data">
                @csrf
                @method('PUT')
                <input type="hidden" name="movie_id" id="edit_movie_id">
                <div style="display: grid; gap: 1.25rem;">
                    <div>
                        <label for="edit_title" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-film"></i> Title <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" id="edit_title" name="title" required class="form-control" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    </div>
                    <div>
                        <label for="edit_description" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-align-left"></i> Description <span style="color: #ff6b6b;">*</span>
                        </label>
                        <textarea id="edit_description" name="description" rows="4" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;"></textarea>
                    </div>
                    <div>
    <label for="edit_this_movie_is" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
        <i class="fas fa-face-smile"></i> This Movie Is (Mood/Tags)
    </label>
    <input type="text" id="edit_this_movie_is" name="this_movie_is" 
           placeholder="e.g., Exciting, Suspenseful, Emotional, Heartwarming"
           style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
    <small style="color: var(--text-muted); display: block; margin-top: 0.25rem;">Describe the movie mood (comma separated)</small>
</div>
                    <div>
                        <label for="edit_genres" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-tags"></i> Genres <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" id="edit_genres" name="genres" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    </div>
                    <div>
                        <label for="edit_cast" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-users"></i> Cast <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="text" id="edit_cast" name="cast" required style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    </div>
                    <div>
                        <label for="edit_duration" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-clock"></i> Duration (minutes) <span style="color: #ff6b6b;">*</span>
                        </label>
                        <input type="number" id="edit_duration" name="duration" required min="1" max="600" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    </div>
                    <div>
                        <label for="edit_trailer_link" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fab fa-youtube"></i> Trailer Link
                        </label>
                        <input type="url" id="edit_trailer_link" name="trailer_link" style="width: 100%; padding: 0.75rem 1rem; border-radius: 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white;">
                    </div>
                    <div>
                        <label style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-star"></i> Rating (0-10)
                        </label>
                        <div style="display: flex; align-items: center; gap: 1rem;">
                            <input type="range" id="edit_rating_slider" name="rating" step="0.1" min="0" max="10" value="0" style="flex: 1;">
                            <input type="number" id="edit_rating_number" step="0.1" min="0" max="10" value="0" style="width: 70px; padding: 0.5rem; border-radius: 8px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); color: white; text-align: center;">
                        </div>
                    </div>
                    <div>
                        <label for="edit_poster" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">
                            <i class="fas fa-image"></i> Poster Image (leave empty to keep current)
                        </label>
                        <div style="border: 2px dashed rgba(255,255,255,0.2); border-radius: 12px; padding: 1rem; text-align: center;">
                            <input type="file" name="poster" accept="image/*" id="edit_poster_input" style="display: none;">
                            <button type="button" onclick="document.getElementById('edit_poster_input').click()" class="button button-secondary">
                                <i class="fas fa-upload"></i> Choose New Image
                            </button>
                            <div id="edit_poster_preview" style="margin-top: 0.5rem; display: none;">
                                <img id="edit_poster_preview_img" style="max-width: 150px; max-height: 150px; border-radius: 8px;">
                                <p id="edit_poster_file_name" style="color: var(--text-muted); font-size: 0.85rem;"></p>
                            </div>
                            <small style="color: var(--text-muted); display: block;">JPG, PNG, GIF, SVG up to 2MB</small>
                        </div>
                    </div>
                    <div id="editMovieFormMessage" style="display: none; padding: 0.75rem 1rem; border-radius: 12px;"></div>
                </div>
            </form>
        </div>
        <div style="flex-shrink: 0; padding-top: 1.5rem; margin-top: 1rem; border-top: 1px solid rgba(255,255,255,0.1);">
            <div class="admin-actions" style="justify-content: flex-end; gap: 1rem;">
                <button type="button" class="button button-secondary" onclick="closeModal('editMovieModal')">
                    <i class="fas fa-times"></i> Cancel
                </button>
                <button type="submit" form="editMovieForm" class="button button-primary" id="submitEditMovieBtn">
                    <i class="fas fa-save"></i> Update Movie
                </button>
            </div>
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
<!-- Delete Confirmation Modal -->
<div id="deleteConfirmModal" class="admin-modal">
    <div class="surface-card admin-modal-shell" style="max-width: 400px;">
        <button type="button" class="modal-close-btn" id="closeDeleteModal" aria-label="Close">
            <i class="fas fa-times" aria-hidden="true"></i>
        </button>
        <div class="section-header">
            <span class="eyebrow">Confirm Delete</span>
            <h2>Are you sure?</h2>
            <p>This action cannot be undone.</p>
        </div>
        <div class="admin-actions" style="justify-content: flex-end; margin-top: 1rem;">
            <button class="button button-secondary cancel-delete-btn" id="cancelDeleteBtn">Cancel</button>
            <button class="button button-primary confirm-delete-btn" id="confirmDeleteBtn">Delete</button>
        </div>
    </div>
</div>
<!-- Movie Detail Modal (same as homepage) -->
<div class="modal" id="card-modal" aria-hidden="true" role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <div class="modal__backdrop" data-close-modal></div>
  <div class="modal__dialog surface-card" role="document">
    <button class="modal__close" id="modal-close" aria-label="Close dialog" data-close-modal>&times;</button>
    <div class="modal__media">
      <div id="trailer-container">
        <iframe id="modal-trailer" width="100%" height="315" src="" frameborder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowfullscreen></iframe>
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
<style>
    .admin-table tbody tr.movie-row {
        cursor: pointer;
        transition: background 0.2s ease;
    }
    .admin-table tbody tr.movie-row:hover {
        background: rgba(255, 255, 255, 0.05);
    }
</style>
@endsection
