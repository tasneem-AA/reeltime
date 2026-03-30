const MAX_COMMENT_CHARS = 100;
$(document).ready(function () {
    initializeProfile();
    initializeToastStyles();



    function initializeProfile() {
        // Use server auth state first, fallback to sessionStorage
        let user = window.authUser || null;
        if (!user) {
            let userData = sessionStorage.getItem('loggedInUser');
            if (userData) user = JSON.parse(userData);
        }
        if (!user) {
            showLoginRequired();
            return;
        }
        renderProfile(user);
        loadWatchlist(user);
        loadRatedMovies(user);
        loadBookedMovies(user);
        //.off to remove previous handlers and .on to add new handler and rerender booked movies
        $(document).off('change', '#booked-sort').on('change', '#booked-sort', function () {
            loadBookedMovies(user);
        });
        setupProfileSearch();
    }


    //this function if no one login
    function showLoginRequired() {
        $('main').html(`
        <div class="profile-modern">
            <div class="empty-watchlist">
                <div class="empty-icon"><i class="fas fa-film"></i></div>
                <h3>Please Log In</h3>
                <p>You need to be logged in to view your profile and ratings.</p>
                <a href="#" id="profileLoginBtn" class="accent-link">Go to Login <i class="fas fa-arrow-right"></i></a>
            </div>
        </div>
    `);
        // Open login modal
        $(document).on('click', '#profileLoginBtn', function (e) {
            e.preventDefault();
            $('.login').fadeIn(300);
        });
    }

    //this function giv all part of DOM in html
    function renderProfile(user) {
        $('main').html(`
        <div class="profile-modern">
            <div class="profile-hero">
                <div class="user-avatar-container">
                    <img src="${user.img || '../../imgs/default-avatar.jpg'}" alt="${user.username}" class="user-avatar" onerror="this.src='../../imgs/default-avatar.jpg'">
                    <div class="online-status"></div>
                </div>
                <div class="profile-info-modern">
                    <h1>${user.username}</h1>
                    <p class="profile-meta">${user.email}</p>
                    <p class="profile-meta">${user.id}</p>
                    <div class="profile-stats">
                        <div class="stat-item">
                            <span class="stat-number" id="watchlist-count">0</span>
                            <span class="stat-label">In Watchlist</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="rated-count">0</span>
                            <span class="stat-label">Movies Rated</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="total-bookings">0</span>
                            <span class="stat-label">Total Bookings</span>
                        </div>
                        <div class="stat-item">
                            <span class="stat-number" id="member-since">${user.since}</span>
                            <span class="stat-label">Member Since</span>
                        </div>
                    </div>
                    <button class="logout-btn" id="logoutBtn">
                        <i class="fas fa-sign-out-alt"></i> Log Out
                    </button>
                </div>
            </div>
            <div class="search">
                <input id="SearchInput" placeholder="Search movies in your watchlist..." />
            </div>
            <div class="watchlist-section">
                <div class="section-header">
                    <div class="section-title">My Watchlist</div>
                    <div class="watchlist-count" id="watchlist-counter">0 movies</div>
                </div>
                <div class="watchlist-grid-modern" id="modern-watchlist">
                    <div class="loading-watchlist">Loading watchlist...</div>
                </div>
            </div>
            
            <div class="rated-section">
                <div class="section-header">
                    <div class="section-title">My Rated Movies</div>
                    <div class="watchlist-count" id="rated-counter">0 movies rated</div>
                </div>
                <div class="rated-grid-modern" id="modern-rated">
                    <div class="loading-rated">Loading ratings...</div>
                </div>
            </div>
            
            <div class="booked-section">
                <div class="section-header">
                    <div class="section-title">My Booked Movies</div>
                    <div class="watchlist-count" id="booked-counter">0 bookings</div>
                    <select id="booked-sort">
                    <option value="nearest">Nearest date first</option>
                    <option value="latest">Farthest date first</option>
                    <option value="original">Original order</option>
                     <option value="watched">Watched bookings</option>
                     <option value="cancelled">Cancelled bookings</option>
                    <option value="upcoming">Upcoming bookings</option>
                     </select>
                </div>
                <div class="booked-grid-modern" id="booked-grid">
                    <div class="loading-booked">Loading bookings...</div>
                </div>
            </div>
        </div>
    `);

        // Logout handler
        $('#logoutBtn').on('click', function () {
            let $btn = $(this);
            $btn.prop('disabled', true).html('<i class="fas fa-spinner fa-spin"></i> Logging out...');

            $.ajax({
                url: '/auth/logout',
                method: 'POST',
                headers: {
                    'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
                },
                success: function () {
                    sessionStorage.removeItem('loggedInUser');
                    window.authUser = null;
                    window.location.href = '/';
                },
                error: function () {
                    // Even if AJAX fails, try to navigate to logout
                    sessionStorage.removeItem('loggedInUser');
                    window.location.href = '/';
                }
            });
        });
    }


    //this function load the movies in watch list and its rating if it has
    function loadWatchlist(user) {
        let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
        let userWatchlist = saved.filter(movie => movie.username === user.username);
        $('#watchlist-count').text(userWatchlist.length);
        $('#watchlist-counter').text(userWatchlist.length + ' movie' + (userWatchlist.length !== 1 ? 's' : ''));
        let $modernWatchlist = $('#modern-watchlist');
        if (userWatchlist.length === 0) {
            $modernWatchlist.html(`
                <div class="empty-watchlist" style="grid-column: 1 / -1;">
                    <h3>Your Watchlist is Empty</h3>
                    <p>Start adding movies to build your personalized collection!</p>
                    <a href="/search" class="accent-link">Browse Movies <i class="fas fa-arrow-right"></i></a>
                </div>
            `);
            return;
        }
        // Get user ratings
        let savedRatings = {};
        savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const watchlistHTML = userWatchlist.map(movie => {
            const isRated = userRatings[movie.title];
            const safeImage = movie.image || '../../imgs/default-movie.jpg';
            return `
                <div class="watchlist-card-modern">
                    <img src="${safeImage}" alt="${movie.title}" class="card-image" onerror="this.src='../../imgs/default-movie.jpg'">
                    ${isRated ? `<div class="rated-badge">Rated ${userRatings[movie.title].rating}/5 <i class="fas fa-star"></i></div>` : ''}
                    <div class="card-content">
                        <h3 class="card-title">${movie.title}</h3>
                        <div class="card-rating"><i class="fas fa-star"></i> ${movie.rating}/5</div>
                        <div class="card-actions">
                            <button class="btn-rate-large" data-title="${movie.title}">
                                ${isRated ? 'Update' : 'Rate'}
                            </button>
                            <button class="btn-remove" data-title="${movie.title}">
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        $modernWatchlist.html(watchlistHTML);
        // Add event handlers
        $modernWatchlist.off('click', '.btn-rate-large').on('click', '.btn-rate-large', function () {
            const title = $(this).data('title');
            const currentRating = userRatings[title] ? userRatings[title].rating : 0;
            openLargeRatingModal(title, currentRating);
        });
        $modernWatchlist.off('click', '.btn-remove').on('click', '.btn-remove', function () {
            const title = $(this).data('title');
            removeFromWatchlist(title);
        });
    }
    


    //this function load the movies that is rated and we can edit the rate or remove
    function loadRatedMovies(user) {
        let savedRatings = {};
        savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const ratedCount = Object.keys(userRatings).length;
        $('#rated-count').text(ratedCount);
        $('#rated-counter').text(ratedCount + ' movie' + (ratedCount !== 1 ? 's' : '') + ' rated');
        const $ratedGrid = $('#modern-rated');
        if (ratedCount === 0) {
            $ratedGrid.html(`
                <div class="empty-rated">
                    <div class="empty-icon"><i class="fas fa-star-half-alt"></i></div>
                    <h3>No Movies Rated Yet</h3>
                    <p>Rate movies from your watchlist to see them here!</p>
                </div>
            `);
            return;
        }
        const ratedHTML = Object.entries(userRatings).map(([movieTitle, ratingData]) => {
            const safeImage = ratingData.image || '../imgs/default-movie.jpg';

            return `
                <div class="rated-card-modern">
                    <img src="${safeImage}" alt="${movieTitle}" class="card-image" onerror="this.src='../imgs/default-movie.jpg'">
                    <div class="rated-badge">${ratingData.rating}/5 <i class="fas fa-star"></i></div>
                    <div class="card-content">
                        <h3 class="card-title">${movieTitle}</h3>
                        <div class="card-actions">
                            <button class="btn-edit-rating" data-title="${movieTitle}">Edit</button>
                            <button class="btn-remove-rated" data-title="${movieTitle}">Remove</button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');
        $ratedGrid.html(ratedHTML);
        // Add event handlers
        $ratedGrid.off('click', '.btn-edit-rating').on('click', '.btn-edit-rating', function () {
            const title = $(this).data('title');
            const currentRating = userRatings[title].rating;
            openLargeRatingModal(title, currentRating);
        });
        $ratedGrid.off('click', '.btn-remove-rated').on('click', '.btn-remove-rated', function () {
            const title = $(this).data('title');
            removeMovieRating(title);
        });
    }


    function loadBookedMovies(user) {
        let allBookings = {};

        allBookings = JSON.parse(localStorage.getItem('bookings')) || {};

        let userBookings = allBookings[user.username] || [];
        let $bookedGrid = $('#booked-grid');
        let $bookedCounter = $('#booked-counter');

        let now = new Date();
        let changed = false;

        userBookings.forEach((b) => {
            let dateObj = parseBookingDate(b);

            // Only change if aana a valid date and eza mara2 w its not already cancelled
            if (dateObj && dateObj < now && b.status !== 'cancelled') {
                if (b.status !== 'watched') {
                    b.status = 'watched';
                    b.watchedDate = new Date().toISOString();
                    changed = true;
                }
            } else if (!b.status) {
                // upcoming
                b.status = 'upcoming';
                changed = true;
            }
        });

        if (changed) {
            allBookings[user.username] = userBookings;
            localStorage.setItem('bookings', JSON.stringify(allBookings));
        }


        let bookedCount = userBookings.length;

        $('#total-bookings').text(bookedCount);
        $bookedCounter.text(bookedCount + (bookedCount === 1 ? ' booking' : ' bookings'));

        if (userBookings.length === 0) {
            $bookedGrid.html(`
                <div class="empty-booked">
                    <div class="empty-icon"><i class="fas fa-ticket-alt"></i></div>
                    <h3>No Bookings Yet</h3>
                    <p>Book a movie from the bookings page and it will appear here.</p>
                    <a href="/bookings" class="accent-link">Book a Movie <i class="fas fa-arrow-right"></i></a>
                </div>
            `);
            return;
        }
        let sortMode = $('#booked-sort').val() || 'nearest';
        let sortedBookings = sortBookingsByMode(userBookings, sortMode);
        let bookedHTML = sortedBookings.map((b, index) => {
            let originalIndex = userBookings.findIndex(booking =>
                booking.movie === b.movie &&
                booking.date === b.date &&
                booking.time === b.time
            );

            let status = b.status || 'upcoming';
            let statusClass = status === 'cancelled' ? 'status-cancelled' :
                status === 'watched' ? 'status-watched' : 'status-upcoming';
            // here i used <i> tag which is used for icons
            return `
        <div class="booked-card-modern" data-index="${originalIndex}">
            <div class="booked-header">
                <h3 class="booked-movie-title">${b.movie || 'Unknown Movie'}</h3>
                <div class="booked-status ${statusClass}">
                    ${status === 'cancelled' ? '<i class="fas fa-times"></i> Cancelled' :
                    status === 'watched' ? '<i class="fas fa-check"></i> Watched' : '<i class="fas fa-clock"></i> Upcoming'}
                </div>
            </div>
            <div class="booked-meta">
                <span><strong>Date:</strong> ${b.date || 'Not specified'}</span>
                <span><strong>Time:</strong> ${b.time || 'Not specified'}</span>
            </div>
            <div class="booked-extra">
                ${b.seats && b.seats.length ? `<div><strong>Seats:</strong> ${Array.isArray(b.seats) ? b.seats.join(', ') : b.seats}</div>` : ''}
                ${b.price ? `<div><strong>Total:</strong> $${b.price}</div>` : ''}
            </div>
            ${status === 'upcoming' ? `
            <div class="booking-actions-small">
                <button class="btn-action-small btn-cancel-small" data-index="${originalIndex}">
                    <i class="fas fa-times"></i> Cancel
                </button>
            </div>
            ` : ''}
        </div>`;
        }).join('');


        $bookedGrid.html(bookedHTML);
        // Add event handlers for booking actions
        $bookedGrid.off('click', '.btn-watch-small').on('click', '.btn-watch-small', function (e) {
            e.stopPropagation();
            const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
            const index = $(this).data('index');
            updateBookingStatus(userData, index, 'watched');
        });

        $bookedGrid.off('click', '.btn-cancel-small').on('click', '.btn-cancel-small', function (e) {
            e.stopPropagation();
            const index = $(this).data('index');
            openCancelConfirmModal(index);
        });

        $bookedGrid.off('click', '.booked-card-modern').on('click', '.booked-card-modern', function (e) {
            if ($(e.target).closest('.btn-action-small').length) {
                return;
            }

            const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
            const index = $(this).data('index');
            const allBookings = JSON.parse(localStorage.getItem("bookings")) || {};
            const userBookings = allBookings[userData.username] || [];

            if (index >= 0 && index < userBookings.length) {
                openBookingDetailsModal(userBookings[index], index);
            }
        });
    }
    // Add after loadBookedMovies function in profile.js

    function updateBookingStatus(user, bookingIndex, status) {
        let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};
        const userBookings = allBookings[user.username] || [];

        if (bookingIndex >= 0 && bookingIndex < userBookings.length) {
            userBookings[bookingIndex].status = status;
            if (status === 'cancelled') {
                userBookings[bookingIndex].cancelledDate = new Date().toISOString();
            } else if (status === 'watched') {
                userBookings[bookingIndex].watchedDate = new Date().toISOString();
            }

            localStorage.setItem("bookings", JSON.stringify(allBookings));
            loadBookedMovies(user);
            const movieTitle = userBookings[bookingIndex].movie || 'Booking';
            showToast(`${movieTitle} marked as ${status}`, status === 'cancelled' ? 'removed' : 'rated');
        }
    }

    function openBookingDetailsModal(booking, bookingIndex) {
        const modalHTML = `
        <div class="booking-modal-overlay" id="bookingDetailsModal">
            <div class="booking-modal-large">
                <div class="booking-modal-header">
                    <h3>Booking Details</h3>
                    <button class="modal-close-btn" id="closeBookingModal">×</button>
                </div>
                <div class="booking-details-content">
                <div class="booking-detail-row">
                        <span class="detail-label">Name:</span>
                        <span class="detail-value">${booking.name || 'Unknown Cinema'}</span>
                    </div>
                    <div class="booking-detail-row">
                        <span class="detail-label">Movie:</span>
                        <span class="detail-value">${booking.movie || 'Unknown Movie'}</span>
                    </div>
                    <div class="booking-detail-row">
                        <span class="detail-label">Cinema:</span>
                        <span class="detail-value">${booking.cinema || 'Unknown Cinema'}</span>
                    </div>
                    <div class="booking-detail-row">
                        <span class="detail-label">Date:</span>
                        <span class="detail-value">${booking.date || 'Not specified'}</span>
                    </div>
                    <div class="booking-detail-row">
                        <span class="detail-label">Time:</span>
                        <span class="detail-value">${booking.time || 'Not specified'}</span>
                    </div>
                    ${booking.seats && booking.seats.length ? `
                    <div class="booking-detail-row">
                        <span class="detail-label">Seats:</span>
                        <span class="detail-value">${Array.isArray(booking.seats) ? booking.seats.join(', ') : booking.seats}</span>
                    </div>` : ''}
                    ${booking.price ? `
                    <div class="booking-detail-row">
                        <span class="detail-label">Total:</span>
                        <span class="detail-value">$${booking.price}</span>
                    </div>` : ''}
                    ${booking.status ? `
                    <div class="booking-detail-row">
                        <span class="detail-label">Status:</span>
                        <span class="detail-value status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </div>` : ''}
                </div>
                <div class="booking-actions" id="bookingActions">
                    ${booking.status !== 'cancelled' && booking.status !== 'watched' ? `
                   
                    <button class="btn-booking-action btn-cancel" data-index="${bookingIndex}">
                        <i class="fas fa-times-circle"></i> Cancel Booking
                    </button>
                    ` : ''}
                </div>
            </div>
        </div>
    `;

        $('body').append(modalHTML);

        $('#closeBookingModal, #bookingDetailsModal').click(function (e) {
            if (e.target === this || $(e.target).hasClass('modal-close-btn')) {
                $('#bookingDetailsModal').remove();
            }
        });

        $('#bookingActions').on('click', '.btn-watch', function () {
            const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
            const index = $(this).data('index');
            updateBookingStatus(userData, index, 'watched');
            $('#bookingDetailsModal').remove();
        })

        $('#bookingActions').on('click', '.btn-cancel', function () {
            const index = $(this).data('index');
            $('#bookingDetailsModal').remove();
            openCancelConfirmModal(index);
        })

        $(document).on('keydown.bookingModal', function (e) {
            if (e.key === 'Escape') {
                $('#bookingDetailsModal').remove();
                $(document).off('keydown.bookingModal');
            }
        });
    }
    function openCancelConfirmModal(bookingIndex) {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData) return;

        const modalHTML = `
        <div class="booking-modal-overlay" id="cancelBookingModal">
            <div class="booking-modal-large">
                <div class="booking-modal-header">
                    <h3 class="booking-cancel-title">Cancel this booking?</h3>
                    <button class="modal-close-btn" id="closeCancelBookingModal">×</button>
                </div>
                <div class="booking-details-content">
                    <p style="margin-bottom: 10px;">
                        Are you sure you want to cancel this booking?<br>
                        <span style="opacity: 0.8;">This action cannot be undone.</span>
                    </p>
                </div>
                <div class="booking-actions">
                    <button class="btn-booking-action btn-cancel-keep" type="button">
                        Keep Booking
                    </button>
                    <button class="btn-booking-action btn-cancel-confirm" type="button">
                        Cancel Booking
                    </button>
                </div>
            </div>
        </div>
    `;

        $('body').append(modalHTML);

        // Close handlers
        $('#closeCancelBookingModal, .btn-cancel-keep').on('click', function () {
            $('#cancelBookingModal').remove();
        });

        // Confirm cancel
        $('.btn-cancel-confirm').on('click', function () {
            updateBookingStatus(userData, bookingIndex, 'cancelled');
            $('#cancelBookingModal').remove();
        });

        // Close by clicking backdrop
        $('#cancelBookingModal').on('click', function (e) {
            if (e.target === this) {
                $('#cancelBookingModal').remove();
            }
        });

        // Close with ESC
        $(document).on('keydown.cancelBooking', function (e) {
            if (e.key === 'Escape') {
                $('#cancelBookingModal').remove();
                $(document).off('keydown.cancelBooking');
            }
        });
    }



    function parseBookingDate(booking) {
        if (!booking || !booking.date) return null;

        // booking.date aam yethawwal la "YYYY-MM-DD" wl time la "HH:MM"
        const [year, month, day] = booking.date.split("-").map(Number);
        let hour = 0, minute = 0;
        if (booking.time) {
            const [h, m] = booking.time.split(":").map(Number);
            hour = h;
            minute = m;
        }
        return new Date(year, month - 1, day, hour, minute);
    }

    function sortBookingsByMode(bookings, mode) {
        // Keep original index in case we need to preserve order
        const withMeta = bookings.map((b, idx) => ({
            ...b,
            _idx: idx,
            _dateObj: parseBookingDate(b)
        }));

        // First filter based on status if needed
        let filteredBookings = withMeta;
        if (mode === "watched") {
            filteredBookings = withMeta.filter(b => b.status === "watched");
        } else if (mode === "cancelled") {
            filteredBookings = withMeta.filter(b => b.status === "cancelled");
        } else if (mode === "upcoming") {
            filteredBookings = withMeta.filter(b => b.status === "upcoming" || !b.status);
        }

        if (mode === "nearest") {
            // Ascending date (earliest first)
            withMeta.sort((a, b) => {
                if (!a._dateObj && !b._dateObj) return a._idx - b._idx;
                if (!a._dateObj) return 1;   // no date => push to bottom
                if (!b._dateObj) return -1;
                return a._dateObj - b._dateObj;
            });
        } else if (mode === "latest") {
            // Descending date (latest first)
            filteredBookings.sort((a, b) => {
                if (!a._dateObj && !b._dateObj) return a._idx - b._idx;
                if (!a._dateObj) return 1;
                if (!b._dateObj) return -1;
                return b._dateObj - a._dateObj;
            });
        } else {
            //not all bookings only the filtered ones for that i use filterBooking
            filteredBookings.sort((a, b) => a._idx - b._idx);
        }
        return filteredBookings.map(({ _idx, _dateObj, ...rest }) => rest);
    }

    //this function open RATING MODAL FUNCTIONS 
    function openLargeRatingModal(movieTitle, currentRating = 0) {

        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData) {
            alert('Please log in to rate movies.');
            return;
        }

        let savedRatingsAll = {};

        savedRatingsAll = JSON.parse(localStorage.getItem('movieRatings')) || {};


        const userRatingsAll = savedRatingsAll[userData.username] || {};
        const existingRatingData = userRatingsAll[movieTitle];
        const existingComment = existingRatingData ? (existingRatingData.comment || "") : "";

        const modalHTML = `
            <div class="rating-modal-overlay" id="largeRatingModal">
                <div class="rating-modal-large">
                    <div class="rating-modal-header">
                        <h3>Rate "${movieTitle}"</h3>
                        <p>How would you rate this movie?</p>
                    </div>
                    
                    <div class="rating-stars-large" id="largeRatingStars">
                        <span class="rating-star-large" data-rating="1"><i class="fas fa-star"></i></span>
                        <span class="rating-star-large" data-rating="2"><i class="fas fa-star"></i></span>
                        <span class="rating-star-large" data-rating="3"><i class="fas fa-star"></i></span>
                        <span class="rating-star-large" data-rating="4"><i class="fas fa-star"></i></span>
                        <span class="rating-star-large" data-rating="5"><i class="fas fa-star"></i></span>
                    </div>
                    
                    <div class="rating-value-large" id="largeRatingValue">
                        ${currentRating > 0 ? `Current Rating: ${currentRating}/5` : 'Select your rating'}
                    </div>
                    
                    <div class="rating-comment-wrapper">
                        <label for="largeRatingComment">Your comment (optional)
                        <span id="commentCounter" style="font-size: 0.8rem; opacity: 0.8;"> 0/${MAX_COMMENT_CHARS}</span>
                        </label>
                        <textarea id="largeRatingComment" rows="3" maxlength="${MAX_COMMENT_CHARS}" placeholder="What did you think of this movie?">${existingComment}</textarea>
                    </div>

                    <div class="rating-actions-large">
                        <button class="btn-rating-large btn-cancel-large" id="cancelLargeRating">Cancel</button>
                        <button class="btn-rating-large btn-confirm-large" id="confirmLargeRating" 
                                ${currentRating === 0 ? 'disabled style="opacity:0.5"' : ''}>
                            ${currentRating > 0 ? 'Update Rating' : 'Confirm Rating'}
                        </button>
                    </div>
                </div>
            </div>
        `;

        $('body').append(modalHTML);

        let selectedRating = currentRating;
        let $confirmBtn = $('#confirmLargeRating');

        let $comment = $('#largeRatingComment');
        let $counter = $('#commentCounter');

        if ($comment.length && $counter.length) {
            let max = MAX_COMMENT_CHARS;
            let updateCounter = () => {
                let len = $comment.val().length;
                $counter.text(`${len}/${max}`);
            };
            updateCounter();
            $comment.on('input', updateCounter);
        }
        // Initialize stars
        if (currentRating > 0) {
            highlightLargeStars(currentRating);
        }

        // Star interactions
        $('#largeRatingStars .rating-star-large').hover(
            function () {
                const rating = $(this).data('rating');
                highlightLargeStars(rating);
            },
            function () {
                highlightLargeStars(selectedRating);
            }
        ).click(function () {
            selectedRating = $(this).data('rating');
            highlightLargeStars(selectedRating);
            $('#largeRatingValue').text(`Your Rating: ${selectedRating}/5`);
            $confirmBtn.prop('disabled', false).css('opacity', '1');
        });

        // Button events
        $('#cancelLargeRating').click(() => {
            $('#largeRatingModal').remove();
        });

        $('#confirmLargeRating').click(() => {
            if (selectedRating > 0) {
                const commentText = $('#largeRatingComment').val().trim();
                saveMovieRating(movieTitle, selectedRating, commentText);
                $('#largeRatingModal').remove();
                showToast(`"${movieTitle}" rated ${selectedRating}/5 stars!`, 'rated');
            }
        });

        // Close modal on outside click
        $('#largeRatingModal').click(function (e) {
            if (e.target === this) {
                $(this).remove();
            }
        });

        // Close with Escape key
        $(document).on('keydown.ratingModal', function (e) {
            if (e.key === 'Escape') {
                $('#largeRatingModal').remove();
                $(document).off('keydown.ratingModal');
            }
        });
    }



    function highlightLargeStars(rating) {
        $('#largeRatingStars .rating-star-large').each(function () {
            if ($(this).data('rating') <= rating) {
                $(this).addClass('active');
            } else {
                $(this).removeClass('active');
            }
        });
    }

    function saveMovieRating(movieTitle, rating, commentText = "") {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData) return;

        let savedRatings = {};

        savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};


        if (!savedRatings[userData.username]) {
            savedRatings[userData.username] = {};
        }

        // Get movie image from watchlist
        let movieImage = '../imgs/default-movie.jpg';

        const savedWatchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
        const movieFromWatchlist = savedWatchlist.find(
            m => m.title === movieTitle && m.username === userData.username
        );
        if (movieFromWatchlist) {
            movieImage = movieFromWatchlist.image || '../imgs/default-movie.jpg';
        }

        // Save rating
        savedRatings[userData.username][movieTitle] = {
            rating: rating,
            image: movieImage,
            dateRated: new Date().toISOString(),
            comment: commentText
        };

        localStorage.setItem('movieRatings', JSON.stringify(savedRatings));

        // Save comment to extra comments if provided
        if (commentText.trim()) {


            let extraComments = JSON.parse(localStorage.getItem('movieCommentsExtra')) || {};


            if (!extraComments[movieTitle]) {

            } extraComments[movieTitle] = [];

            extraComments[movieTitle] = extraComments[movieTitle].filter(
                c => c.user !== userData.username
            );

            extraComments[movieTitle].push({
                user: userData.username,
                rating: rating,
                text: commentText,
                date: new Date().toISOString()
            });

            localStorage.setItem('movieCommentsExtra', JSON.stringify(extraComments));
        }
        else {
            // If comment is empty, remove user's comment if exists
            let extraComments = JSON.parse(localStorage.getItem('movieCommentsExtra')) || {};
            if (extraComments[movieTitle]) {
                extraComments[movieTitle] = extraComments[movieTitle].filter(
                    c => c.user !== userData.username
                );

                if (extraComments[movieTitle].length === 0) {
                    delete extraComments[movieTitle];
                }

                localStorage.setItem('movieCommentsExtra', JSON.stringify(extraComments));
            }
        }

        // Refresh profile
        loadWatchlist(userData);
        loadRatedMovies(userData);

    }

    function removeMovieRating(movieTitle) {

        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};

        if (savedRatings[userData.username] && savedRatings[userData.username][movieTitle]) {
            delete savedRatings[userData.username][movieTitle];
            localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
        }

        let extraComments = JSON.parse(localStorage.getItem('movieCommentsExtra')) || {};
        if (extraComments[movieTitle]) {
            extraComments[movieTitle] = extraComments[movieTitle].filter(
                c => c.user !== userData.username
            );

            if (extraComments[movieTitle].length === 0) {
                delete extraComments[movieTitle];
            }

            localStorage.setItem('movieCommentsExtra', JSON.stringify(extraComments));
        }
        loadWatchlist(userData);
        loadRatedMovies(userData);

        showToast(`Rating for "${movieTitle}" removed`, 'removed');



    }



    function removeFromWatchlist(title) {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));

        // Remove from watchlist
        let saved = JSON.parse(localStorage.getItem('watchlist')) || [];
        saved = saved.filter(m => !(m.title === title && m.username === userData.username));
        localStorage.setItem('watchlist', JSON.stringify(saved));

        // Remove rating if exists
        removeMovieRating(title);

        // Update session storage
        userData.watchlist = saved.filter(m => m.username === userData.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

        // Reload
        loadWatchlist(userData);
        loadRatedMovies(userData);

        showToast(`"${title}" removed from watchlist and ratings`, 'removed');


    }

    function showToast(message, type) {

        $('.toast').remove();

        const toast = $(`
            <div class="toast toast-${type}">
                ${message}
            </div>
        `);

        $('body').append(toast);

        setTimeout(() => toast.addClass('show'), 10);

        setTimeout(() => {
            toast.removeClass('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);

    }

    // Initialize toast styles
    function initializeToastStyles() {
        if (!$('#toast-styles').length) {
            $('head').append(`
            <style id="toast-styles">
                .toast {
                    position: fixed;
                    bottom: 20px;
                    right: 20px;
                    background: var(--accent-gradient);
                    color: white;
                    padding: 12px 20px;
                    border-radius: 8px;
                    font-weight: 600;
                    z-index: 10000;
                    transform: translateX(100%);
                    transition: transform 0.3s ease;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.3);
                    max-width: 300px;
                }
                .toast.show {
                    transform: translateX(0);
                }
                .toast-rated {
                    background: var(--accent-gradient);
                }
                .toast-removed {
                    background: var(--accent-gradient);
                }
                
                /* Loading states */
                .loading-watchlist, .loading-rated, .loading-booked {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #888;
                }
                
                .error-state {
                    grid-column: 1 / -1;
                    text-align: center;
                    padding: 40px;
                    color: #ff6b6b;
                }
                
                .error-icon {
                    font-size: 3em;
                    margin-bottom: 15px;
                    opacity: 0.7;
                }
                
                .retry-btn {
                    background: var(--accent-gradient);
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin-top: 15px;
                }
            </style>
        `);
        }
    }


});
//profile search 
function setupProfileSearch() {
    const searchInput = document.getElementById("SearchInput");
    if (!searchInput) return;

    // To avoid adding multiple listeners if initializeProfile() is ever called again
    searchInput.oninput = null;

    searchInput.addEventListener("input", () => {
        const q = searchInput.value.toLowerCase().trim();

        const watchContainer = document.getElementById("modern-watchlist");
        const ratedContainer = document.getElementById("modern-rated");
        if (!watchContainer && !ratedContainer) return;

        const watchCards = watchContainer
            ? watchContainer.querySelectorAll(".watchlist-card-modern")
            : [];
        const ratedCards = ratedContainer
            ? ratedContainer.querySelectorAll(".rated-card-modern")
            : [];

        const filterCards = (cards) => {
            cards.forEach((card) => {
                const titleEl = card.querySelector(".card-title");
                const ratingEl = card.querySelector(".rated-badge, .card-rating");

                const titleText = (titleEl?.textContent || "").toLowerCase();
                const ratingText = (ratingEl?.textContent || "").toLowerCase();

                const matches =
                    !q || titleText.includes(q) || ratingText.includes(q);

                card.style.display = matches ? "" : "none";
            });
        };

        const updateEmptyMessage = (container, cardsNodeList, sectionLabel) => {
            if (!container) return;

            const existingMsg = container.querySelector(".search-empty-msg");

            // no query => remove message
            if (!q) {
                if (existingMsg) existingMsg.remove();
                return;
            }

            const visibleCount = Array.from(cardsNodeList).filter(
                (card) => card.style.display !== "none"
            ).length;

            if (visibleCount === 0) {
                if (!existingMsg) {
                    const msg = document.createElement("div");
                    msg.className = "search-empty-msg";
                    msg.style.gridColumn = "1 / -1";
                    msg.style.textAlign = "center";
                    msg.style.padding = "20px";
                    msg.style.opacity = "0.8";
                    msg.textContent = `No movies match your search in ${sectionLabel}.`;
                    container.appendChild(msg);
                }
            } else {
                if (existingMsg) existingMsg.remove();
            }
        };

        // apply filters
        filterCards(watchCards);
        filterCards(ratedCards);

        // empty messages
        updateEmptyMessage(watchContainer, watchCards, "Watchlist");
        updateEmptyMessage(ratedContainer, ratedCards, "Rated Movies");
    });
}
