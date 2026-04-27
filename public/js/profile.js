const MAX_COMMENT_CHARS = 100;
let originalBookings = []
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
        loadBookedMovies(user);
        //.off to remove previous handlers and .on to add new handler and rerender booked movies
        // $(document).off('change', '#booked-sort').on('change', '#booked-sort', function () {
        //     loadBookedMovies(user);
        // });
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
   //i put everythimg in blade
    $('.user-avatar').attr('src', user.img || '../../imgs/default-avatar.jpg');
    $('.profile-info-modern h1').text(user.username);
    $('.profile-meta:first').text(user.email);
    $('.profile-meta:last').text(user.id);
    $('#member-since').text(user.since);
    
    const watchlistCount = window.watchlistCount || 0;
    const ratedCount = window.ratedCount || 0;
    const bookingsCount = window.bookingsCount || 0;
    
    $('#watchlist-count').text(watchlistCount);
    $('#watchlist-counter').text(watchlistCount + ' movie' + (watchlistCount !== 1 ? 's' : ''));
    $('#rated-count').text(ratedCount);
    $('#rated-counter').text(ratedCount + ' movie' + (ratedCount !== 1 ? 's' : '') + ' rated');
    $('#total-bookings').text(bookingsCount);
    $('#booked-counter').text(bookingsCount + (bookingsCount === 1 ? ' booking' : ' bookings'));
    
        // Logout handler
        $('#logoutBtn').off('click').on('click', function () {
            let $btn = $(this);


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
    // Add event handlers
    $('#modern-watchlist').off('click', '.btn-rate-icon').on('click', '.btn-rate-icon', function() {
        const $card = $(this).closest('.watchlist-card-modern');
        const title = $(this).data('title');
        const movieId = $card.data('movie-id');
        let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const currentRating = userRatings[title] ? userRatings[title].rating : 0;
        
        openLargeRatingModal(title, currentRating, movieId);
    });
    
    $('#modern-watchlist').off('click', '.btn-remove-card').on('click', '.btn-remove-card', function(e) {
        e.stopPropagation();
        const title = $(this).data('title');
        const movieId = $(this).data('movie-id');
        removeFromWatchlist(title, movieId);
    });
    }
    


    //this function load the movies that is rated and we can edit the rate or remove
    // REMOVED - Rated movies now shown as badge on watchlist cards
    /*
    function loadRatedMovies(user) {
      const $ratedGrid = $('#modern-rated');
    
    $ratedGrid.off('click', '.btn-edit-rating').on('click', '.btn-edit-rating', function() {
        const $card = $(this).closest('.rated-card-modern');
        const title = $(this).data('title');
        const movieId = $card.data('movie-id');
        let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
        const userRatings = savedRatings[user.username] || {};
        const currentRating = userRatings[title] ? userRatings[title].rating : 0;
            openLargeRatingModal(title, currentRating, movieId);
        });
        $ratedGrid.off('click', '.btn-remove-rated').on('click', '.btn-remove-rated', function () {
            const title = $(this).data('title');
            removeMovieRating(title);
        });
    }
    */


    function loadBookedMovies(user) {
        originalBookings = [];
    setupBookingSorting();
    
    // Cancel button handlers
    $('.btn-cancel-small').off('click').on('click', function() {
        const bookingId = $(this).data('booking-id');
        openCancelConfirmModal(bookingId);
    });
}

function setupBookingSorting() {
    if (originalBookings.length === 0) {
        originalBookings = $('#booked-grid .booked-card-modern').toArray();
    }

    $('#booked-sort').off('change').on('change', function() {
        const mode = $(this).val();
        let filteredBookings = [...originalBookings];

        if (mode === 'upcoming') {
            filteredBookings = filteredBookings.filter(card => {
                const statusElem = $(card).find('.booked-status');
                return statusElem.hasClass('status-upcoming') || 
                       statusElem.hasClass('status-confirmed') || 
                       statusElem.hasClass('status-pending');
            });
        } else if (mode === 'watched') {
            filteredBookings = filteredBookings.filter(card => 
                $(card).find('.booked-status').hasClass('status-watched')
            );
        } else if (mode === 'cancelled') {
            filteredBookings = filteredBookings.filter(card => 
                $(card).find('.booked-status').hasClass('status-cancelled')
            );
        }

        if (mode === 'nearest') {
            filteredBookings.sort((a, b) => {
                const dateA = $(a).find('.booked-meta span:first').text().replace('Date:', '').trim();
                const dateB = $(b).find('.booked-meta span:first').text().replace('Date:', '').trim();
                return new Date(dateA) - new Date(dateB);
            });
        } else if (mode === 'latest') {
            filteredBookings.sort((a, b) => {
                const dateA = $(a).find('.booked-meta span:first').text().replace('Date:', '').trim();
                const dateB = $(b).find('.booked-meta span:first').text().replace('Date:', '').trim();
                return new Date(dateB) - new Date(dateA);
            });
        }
        const $grid = $('#booked-grid');
        $grid.empty().append(filteredBookings);
        const visibleCount = filteredBookings.length;
        const totalCount = originalBookings.length;
        
        if (mode === 'upcoming' || mode === 'watched' || mode === 'cancelled') {
            $('#booked-counter').text(`${visibleCount} / ${totalCount} bookings`);
        } else {
            $('#booked-counter').text(`${visibleCount} bookings`);
        }
    });
}
    // Add after loadBookedMovies function in profile.js

    function updateBookingStatus(user, bookingId, status) {
    if (status !== 'cancelled') return;

    $.ajax({
        url: `/api/bookings/${bookingId}`,
        method: 'PUT',
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json'
        },
        data: JSON.stringify({ status: 'cancelled' }),
        contentType: 'application/json',
        success: function(response) {
            if (response.success) {
                showToast('Booking cancelled successfully', 'removed');
                const $card = $(`.booked-card-modern[data-booking-id="${bookingId}"]`);
                const $statusDiv = $card.find('.booked-status');
                const $actionsDiv = $card.find('.booking-actions-small');
                
                
                $statusDiv.removeClass('status-upcoming status-confirmed status-pending');
                $statusDiv.addClass('status-cancelled');
                $statusDiv.html('<i class="fas fa-times"></i> Cancelled');
                
                 if ($actionsDiv.length) {
                    $actionsDiv.remove();
                } else {
                    $card.find('.btn-cancel-small').remove();
                }
                
                
                updateBookingCounters();
            } else {
                showToast(response.message || 'Failed to cancel booking', 'error');
            }
        },
        error: function(xhr) {
            const msg = xhr.responseJSON?.message || 'Error cancelling booking';
            showToast(msg, 'error');
        }
    });
}

    function updateBookingCounters() {
        const total = $('#booked-grid .booked-card-modern').length;
        $('#total-bookings').text(total);
        $('#booked-counter').text(total + (total === 1 ? ' booking' : ' bookings'));
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
    function openLargeRatingModal(movieTitle, currentRating = 0, movieId = null) {

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
                    <button class="rating-modal-close" id="closeRatingModal">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="rating-modal-header">
                        <h3>Rate "${movieTitle}"</h3> 
                    </div>
                    
                    <div class="rating-stars-container">
                        <div class="rating-stars-large" id="largeRatingStars">
                            <span class="rating-star-large" data-rating="1"><i class="fas fa-star"></i></span>
                            <span class="rating-star-large" data-rating="2"><i class="fas fa-star"></i></span>
                            <span class="rating-star-large" data-rating="3"><i class="fas fa-star"></i></span>
                            <span class="rating-star-large" data-rating="4"><i class="fas fa-star"></i></span>
                            <span class="rating-star-large" data-rating="5"><i class="fas fa-star"></i></span>
                        </div>
                        <div class="rating-value-large" id="largeRatingValue">
                            ${currentRating > 0 ? `<span class="rating-number">${currentRating}</span><span class="rating-text">/5</span>` : '<span class="rating-hint">Select a rating</span>'}
                        </div>
                    </div>
                    
                    <div class="rating-comment-wrapper">
                        <label for="largeRatingComment">Your comment <span class="optional">(optional)</span>
                        <span id="commentCounter" class="comment-counter"> 0/${MAX_COMMENT_CHARS}</span>
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
            $('#largeRatingValue').html(`<span class="rating-number">${selectedRating}</span><span class="rating-text">/5</span>`);
            $confirmBtn.prop('disabled', false).css('opacity', '1');
        });

        // Button events
        $('#cancelLargeRating').click(() => {
            $('#largeRatingModal').remove();
        });
        
        $('#closeRatingModal').click(() => {
            $('#largeRatingModal').remove();
        });

        $('#confirmLargeRating').click(() => {
            if (selectedRating > 0) {
                const commentText = $('#largeRatingComment').val().trim();
                saveMovieRating(movieTitle, selectedRating, commentText, movieId);
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

    function saveMovieRating(movieTitle, rating, commentText = "", movieId = null) {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData || !userData.id) {
            alert('Please log in to rate movies.');
            return;
        }

        // If movieId is provided, use it directly
        if (movieId) {
            submitRatingToAPI(movieId, rating, commentText);
            return;
        }

        // Otherwise, find movie_id by searching for the movie
        fetch(`/api/movies?search=${encodeURIComponent(movieTitle)}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': getCSRFToken() || ''
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (!data.data || !data.data.length) {
                alert('Movie not found in database');
                return;
            }

            const foundMovieId = data.data[0].movie_id;
            submitRatingToAPI(foundMovieId, rating, commentText);
        })
        .catch(error => {
            console.error('Error finding movie:', error);
            alert('Error finding movie');
        });
    }

    function submitRatingToAPI(movieId, score, comment) {
        fetch('/api/ratings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': getCSRFToken() || ''
            },
            credentials: 'include',
            body: JSON.stringify({
                movie_id: movieId,
                score: parseInt(score),
                comment: comment || null
            })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(err => {
                    throw new Error(err.message || 'Failed to submit rating');
                });
            }
            return response.json();
        })
        .then(data => { 
            $('#largeRatingModal').remove();
            
            // Update localStorage with the new rating
            const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
            if (userData) {
                let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
                const movieTitle = $('.rating-modal-header h3').text().replace(/^Rate "/, '').replace(/"$/, '');
                if (!savedRatings[userData.username]) {
                    savedRatings[userData.username] = {};
                }
                savedRatings[userData.username][movieTitle] = {
                    rating: data.score,
                    comment: data.comment
                };
                localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
            }
            
            // Reload the profile page to reflect the rating and hide the button
            location.reload();
        })
        .catch(error => {
            console.error('Error submitting rating:', error);
            alert('Error submitting rating: ' + error.message);
        });
    }

    function getCSRFToken() {
        // Try to get CSRF token from meta tag
        let token = document.querySelector('meta[name="csrf-token"]')?.content;
        if (!token) {
            // Try to get from cookie
            const cookies = document.cookie.split(';');
            for (let cookie of cookies) {
                const [name, value] = cookie.trim().split('=');
                if (name === 'XSRF-TOKEN') {
                    token = decodeURIComponent(value);
                    break;
                }
            }
        }
        return token;
    }

    function removeMovieRating(movieTitle) {
        const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
        if (!userData || !userData.id) {
            alert('Please log in to remove ratings.');
            return;
        }

        // Find movie_id and delete rating via API
        fetch(`/api/movies?search=${encodeURIComponent(movieTitle)}`, {
            headers: {
                'X-Requested-With': 'XMLHttpRequest',
                'X-CSRF-TOKEN': getCSRFToken() || ''
            },
            credentials: 'include'
        })
        .then(response => response.json())
        .then(data => {
            if (!data.data || !data.data.length) {
                alert('Movie not found');
                return;
            }

            // We would need to fetch the user's rating first to get the rating_id
            // For now, we'll use updateOrCreate with score = 0 approach
            // Actually, we should fetch user's ratings first
            fetch('/api/ratings/my', {
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'X-CSRF-TOKEN': getCSRFToken() || ''
                },
                credentials: 'include'
            })
            .then(response => response.json())
            .then(ratingData => {
                const movieId = data.data[0].movie_id;
                const userRating = ratingData.data?.find(r => r.movie_id == movieId);
                
                if (userRating && userRating.rating_id) {
                    // Delete the rating
                    fetch(`/api/ratings/${userRating.rating_id}`, {
                        method: 'DELETE',
                        headers: {
                            'X-Requested-With': 'XMLHttpRequest',
                            'X-CSRF-TOKEN': getCSRFToken() || ''
                        },
                        credentials: 'include'
                    })
                    .then(response => {
                        if (response.ok) {
                            alert('Rating removed');
                            // Update localStorage to remove the rating
                            let savedRatings = JSON.parse(localStorage.getItem('movieRatings')) || {};
                            if (userData && savedRatings[userData.username]) {
                                delete savedRatings[userData.username][movieTitle];
                                localStorage.setItem('movieRatings', JSON.stringify(savedRatings));
                            }
                            // Reload the page to show the rate button again
                            location.reload();
                        }
                    })
                    .catch(error => console.error('Error deleting rating:', error));
                }
            });
        })
        .catch(error => console.error('Error finding movie:', error));
    }

    function removeFromWatchlist(title, movieId) {
        console.log('Removing from watchlist - Movie ID:', movieId);
        
        $.ajax({
            url: '/api/watchlist/' + movieId,
            method: 'DELETE',
            headers: {
                'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content'),
                'X-Requested-With': 'XMLHttpRequest',
                'Accept': 'application/json'
            },
            success: function(response) {
                console.log('Successfully removed:', response);
                
                // Remove the card from DOM
                $(`#modern-watchlist .watchlist-card-modern[data-movie-id="${movieId}"]`).fadeOut(300, function() {
                    $(this).remove();
                    
                    // Update counts
                    const newCount = $('#modern-watchlist .watchlist-card-modern').length;
                    $('#watchlist-count').text(newCount);
                    $('#watchlist-counter').text(newCount + ' movie' + (newCount !== 1 ? 's' : ''));
                    
                    // Show empty message if no movies left
                    if (newCount === 0) {
                        $('#modern-watchlist').html(`
                            <div class="empty-watchlist" style="grid-column: 1 / -1;">
                                <h3>Your Watchlist is Empty</h3>
                                <p>Start adding movies to build your personalized collection!</p>
                                <a href="/search" class="accent-link">Browse Movies <i class="fas fa-arrow-right"></i></a>
                            </div>
                        `);
                    }
                });
                
                showToast('Removed from watchlist', 'removed');
            },
            error: function(xhr) {
                console.error('Error removing from watchlist:', xhr);
                const message = xhr.responseJSON?.message || 'Failed to remove from watchlist';
                showToast(message, 'error');
            }
        });
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
    let editProfileModal = document.getElementById('editProfileModal');
    let editProfileBtn = document.getElementById('editProfileBtn');
    let avatarInput = document.getElementById('editAvatarInput');
    let avatarPreview = document.getElementById('editAvatarPreview');
    let saveBtn = document.getElementById('saveProfileBtn');
    let editUsername = document.getElementById('editUsername');
    let editEmail = document.getElementById('editEmail');
    let messageDiv = document.getElementById('editProfileMessage');

    editProfileBtn.addEventListener('click', () => {
        editUsername.value = window.authUser.username;
        editEmail.value = window.authUser.email;
        avatarPreview.src = window.authUser.img;
        messageDiv.style.display = 'none';
        editProfileModal.classList.add('is-open');
        document.body.classList.add('modal-open');
    });

    window.closeEditProfileModal = function() {
        editProfileModal.classList.remove('is-open');
        document.body.classList.remove('modal-open');
    };

    avatarInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                avatarPreview.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    saveBtn.addEventListener('click', async () => {
        const username = editUsername.value.trim();
        const email = editEmail.value.trim();
        const avatarFile = avatarInput.files[0];
        const currentPassword = document.getElementById('current_password')?.value || '';
        const newPassword = document.getElementById('new_password')?.value || '';
        const newPasswordConfirm = document.getElementById('new_password_confirmation')?.value || '';

        if (!username || !email) {
            showToast('Username and email are required.', 'error');
            return;
        }

        if (currentPassword || newPassword || newPasswordConfirm) {
            if (!currentPassword) {
                showToast('Please enter your current password to change it.', 'error');
                return;
            }
            if (newPassword.length < 6) {
                showToast('New password must be at least 6 characters.', 'error');
                return;
            }
            if (newPassword !== newPasswordConfirm) {
                showToast('New passwords do not match.', 'error');
                return;
            }
        }

        saveBtn.disabled = true;
        saveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';
        messageDiv.style.display = 'none';

        try {
            let uploadedAvatarUrl = null;

            const infoResponse = await fetch('/api/user', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify({ username, email })
            });
            const infoData = await infoResponse.json();
            if (!infoData.success) {
                throw new Error(infoData.message || 'Failed to update profile');
            }

            if (currentPassword && newPassword) {
                const passwordResponse = await fetch('/api/user/change-password', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({
                        current_password: currentPassword,
                        new_password: newPassword,
                        new_password_confirmation: newPasswordConfirm
                    })
                });
                
                const passwordData = await passwordResponse.json();
                if (!passwordData.success) {
                    throw new Error(passwordData.message || 'Failed to update password');
                }
                showToast('Password changed successfully!', 'success');
            }

           if (avatarFile) {
                const formData = new FormData();
                formData.append('profile_image', avatarFile);
                const avatarResponse = await fetch('/api/user/profile-image', {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content,
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: formData
                });
                const avatarData = await avatarResponse.json();
                if (!avatarData.success) {
                    throw new Error(avatarData.message || 'Failed to update profile image');
                }
                uploadedAvatarUrl = avatarData.profile_image;
            }
            window.authUser.username = infoData.user.username;
            window.authUser.email = infoData.user.email;
            window.authUser.img = uploadedAvatarUrl || infoData.user.img;
            sessionStorage.setItem('loggedInUser', JSON.stringify(window.authUser));

            const nameEl = document.querySelector('.profile-info-modern h1');
            if (nameEl) nameEl.textContent = window.authUser.username;
            const emailEl = document.querySelector('.profile-info-modern .profile-meta:first-of-type');
            if (emailEl) emailEl.textContent = window.authUser.email;
            const avatarEl = document.querySelector('.user-avatar');
            if (avatarEl) avatarEl.src = window.authUser.img;

            const modalPreview = document.getElementById('editAvatarPreview');
            if (modalPreview) modalPreview.src = window.authUser.img;

            showToast('Profile updated successfully!', 'success');
           if (document.getElementById('current_password')) {
                document.getElementById('current_password').value = '';
                document.getElementById('new_password').value = '';
                document.getElementById('new_password_confirmation').value = '';
            }
            closeEditProfileModal();
        } catch (error) {
            messageDiv.textContent = error.message;
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
            messageDiv.style.color = '#fb7185';
            showToast(error.message, 'error');
        } finally {
            saveBtn.disabled = false;
            saveBtn.innerHTML = 'Save Changes';
        }
    });

   editProfileModal.addEventListener('click', function(e) {
        if (e.target === editProfileModal) closeEditProfileModal();
    });

    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && editProfileModal.classList.contains('is-open')) {
            closeEditProfileModal();
        }
    });

    function setupPasswordToggles() {
        const toggles = document.querySelectorAll('.toggle-password');
        console.log('Found toggles:', toggles.length);
        
        toggles.forEach(toggle => {
            toggle.removeEventListener('click', handlePasswordToggle);
            toggle.addEventListener('click', handlePasswordToggle);
        });
    }

    function handlePasswordToggle(e) {
        e.preventDefault();
        e.stopPropagation();
        const button = e.currentTarget;
        const targetId = button.getAttribute('data-target');
        const input = document.getElementById(targetId);
        
        if (input) {
            const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
            input.setAttribute('type', type);
            const icon = button.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-eye');
                icon.classList.toggle('fa-eye-slash');
            }
        }
    }

    
    function showModalError(message) {
        const messageDiv = document.getElementById('editProfileMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(251, 113, 133, 0.2)';
            messageDiv.style.border = '1px solid rgba(251, 113, 133, 0.3)';
            messageDiv.style.color = '#fb7185';
            messageDiv.style.padding = '0.75rem';
            messageDiv.style.borderRadius = '12px';
            messageDiv.style.marginTop = '0.5rem';
            
            
            setTimeout(() => {
                if (messageDiv) {
                    messageDiv.style.display = 'none';
                }
            }, 5000);
        }
    }

    function showModalSuccess(message) {
        const messageDiv = document.getElementById('editProfileMessage');
        if (messageDiv) {
            messageDiv.textContent = message;
            messageDiv.style.display = 'block';
            messageDiv.style.background = 'rgba(74, 222, 128, 0.2)';
            messageDiv.style.border = '1px solid rgba(74, 222, 128, 0.3)';
            messageDiv.style.color = '#4ade80';
            messageDiv.style.padding = '0.75rem';
            messageDiv.style.borderRadius = '12px';
            messageDiv.style.marginTop = '0.5rem';
        }
    }

    function clearModalMessage() {
        const messageDiv = document.getElementById('editProfileMessage');
        if (messageDiv) {
            messageDiv.style.display = 'none';
            messageDiv.textContent = '';
        }
    }

    const originalOpenEditProfile = window.openEditProfileModal;
    window.openEditProfileModal = function() {
        if (originalOpenEditProfile) {
            originalOpenEditProfile();
        }
        clearModalMessage();
        setTimeout(() => {
            setupPasswordToggles();
        }, 150);
    };

    document.addEventListener('DOMContentLoaded', function() {
        const editProfileBtn = document.getElementById('editProfileBtn');
        if (editProfileBtn) {
            editProfileBtn.addEventListener('click', function() {
                clearModalMessage();
                setTimeout(() => {
                    setupPasswordToggles();
                }, 200);
            });
        }
    });

     const observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            if (mutation.attributeName === 'class') {
                const modal = document.getElementById('editProfileModal');
                if (modal && modal.classList.contains('is-open')) {
                    clearModalMessage();
                    setTimeout(() => {
                        setupPasswordToggles();
                    }, 100);
                }
            }
        });
    });

    const modal = document.getElementById('editProfileModal');
    if (modal) {
        observer.observe(modal, { attributes: true });
    }

    function initSaveButtonHandler() {
        const saveBtn = document.getElementById('saveProfileBtn');
        if (!saveBtn) return;
 
        const newSaveBtn = saveBtn.cloneNode(true);
        saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
        
        newSaveBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const editUsername = document.getElementById('editUsername');
            const editEmail = document.getElementById('editEmail');
            const avatarInput = document.getElementById('editAvatarInput');
            const messageDiv = document.getElementById('editProfileMessage');
            
            const username = editUsername?.value.trim() || '';
            const email = editEmail?.value.trim() || '';
            const avatarFile = avatarInput?.files[0];

            const currentPassword = document.getElementById('current_password')?.value || '';
            const newPassword = document.getElementById('new_password')?.value || '';
            const newPasswordConfirm = document.getElementById('new_password_confirmation')?.value || '';

            clearModalMessage();

            if (!username || !email) {
                showModalError('Username and email are required.');
                return;
            }

            if (currentPassword || newPassword || newPasswordConfirm) {
                if (!currentPassword) {
                    showModalError('Please enter your current password to change it.');
                    return;
                }
                if (newPassword.length < 6) {
                    showModalError('New password must be at least 6 characters.');
                    return;
                }
                if (newPassword !== newPasswordConfirm) {
                    showModalError('New passwords do not match.');
                    return;
                }
            }

            const originalText = newSaveBtn.innerHTML;
            newSaveBtn.disabled = true;
            newSaveBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Saving...';

            try {
                const infoResponse = await fetch('/api/user', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                        'Accept': 'application/json'
                    },
                    credentials: 'include',
                    body: JSON.stringify({ username, email })
                });
                
                const infoData = await infoResponse.json();
                if (!infoData.success) {
                    throw new Error(infoData.message || 'Failed to update profile');
                }

                if (currentPassword && newPassword) {
                    const passwordResponse = await fetch('/api/user/change-password', {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                            'Accept': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            current_password: currentPassword,
                            new_password: newPassword,
                            new_password_confirmation: newPasswordConfirm
                        })
                    });
                    
                    const passwordData = await passwordResponse.json();
                    if (!passwordData.success) {
                        throw new Error(passwordData.message || 'Failed to update password');
                    }
                }

                if (avatarFile) {
                    const formData = new FormData();
                    formData.append('profile_image', avatarFile);
                    const avatarResponse = await fetch('/api/user/profile-image', {
                        method: 'POST',
                        headers: {
                            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || '',
                            'Accept': 'application/json'
                        },
                        credentials: 'include',
                        body: formData
                    });
                    const avatarData = await avatarResponse.json();
                    if (!avatarData.success) {
                        throw new Error(avatarData.message || 'Failed to update profile image');
                    }
                    window.authUser.img = avatarData.profile_image;
                    sessionStorage.setItem('loggedInUser', JSON.stringify(window.authUser));
                }

                window.authUser.username = infoData.user.username;
                window.authUser.email = infoData.user.email;
                window.authUser.img = infoData.user.img;
                sessionStorage.setItem('loggedInUser', JSON.stringify(window.authUser));

                const nameEl = document.querySelector('.profile-info-modern h1');
                if (nameEl) nameEl.textContent = window.authUser.username;
                const emailEl = document.querySelector('.profile-info-modern .profile-meta:first-of-type');
                if (emailEl) emailEl.textContent = window.authUser.email;
                const avatarEl = document.querySelector('.user-avatar');
                if (avatarEl) avatarEl.src = window.authUser.img;

                const modalPreview = document.getElementById('editAvatarPreview');
                if (modalPreview) modalPreview.src = window.authUser.img;

                showModalSuccess('Profile updated successfully!');
                
                const currentPwdField = document.getElementById('current_password');
                const newPwdField = document.getElementById('new_password');
                const newPwdConfirmField = document.getElementById('new_password_confirmation');
                if (currentPwdField) currentPwdField.value = '';
                if (newPwdField) newPwdField.value = '';
                if (newPwdConfirmField) newPwdConfirmField.value = '';
                
                setTimeout(() => {
                    closeEditProfileModal();
                    showToast('Profile updated successfully!', 'success');
                }, 1500);
                
            } catch (error) {
                console.error('Save error:', error);
                showModalError(error.message || 'An error occurred while saving. Please try again.');
            } finally {
                newSaveBtn.disabled = false;
                newSaveBtn.innerHTML = originalText;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSaveButtonHandler);
    } else {
        initSaveButtonHandler();
    }
}
