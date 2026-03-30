
//bookings
let selectedSeats = new Set();
let SEAT_PRICE = 7;  //7$ l price la el seat
//movie comments
window.movieComments = {};

function setAuthTab(tab) {
    let isLogin = tab !== "signup";

    $('[data-tab]').each(function () {
        let isActive = $(this).data('tab') === tab;
        $(this)
            .toggleClass('is-active', isActive)
            .attr('aria-selected', isActive ? 'true' : 'false');
    });

    $('#loginPanel').toggle(isLogin);
    $('#signupPanel').toggle(!isLogin);
    $('#loginError, #signupError, #loginSuccess, #signupSuccess').text('');
}

function openAuthModal(tab = "login") {
    setAuthTab(tab);
    $('html, body').addClass('login-open');
    $('.login')
        .stop(true, true)
        .attr('aria-hidden', 'false')
        .fadeIn(240, function () {
            let $firstInput = tab === 'signup'
                ? $('#signupPanel input:visible').first()
                : $('#loginPanel input:visible').first();

            if ($firstInput.length) {
                $firstInput.trigger('focus');
            }
        });
}

function closeAuthModal() {
    $('html, body').removeClass('login-open');
    $('.login')
        .stop(true, true)
        .fadeOut(240, function () {
            $(this).attr('aria-hidden', 'true');
        });
}

$(function () {
    window.movieComments = window.movieComments || {};
    // comments lal movies in bookings
    let bookingMovieComments = {
        "The Running Man": [
            {
                user: "user1",
                rating: 5,
                text: "Great movie, def recommend!"
            },
            {
                user: "movieFan99",
                rating: 4,
                text: "Loved the show concept and action."
            },
            {
                user: "retroAddict",
                rating: 5,
                text: "Pure 80s chaos in the best way."
            }
        ],

        "Predator:Badlands": [
            {
                user: "sciFiNerd",
                rating: 4,
                time: "155 min",
                text: "Cool expansion of the Predator universe."
            }
        ],

        "HardaBasht": [
            {
                user: "beirutWatcher",
                rating: 5,
                time: "169 min",
                text: "Hits hard. Really good Lebanese drama."
            }
        ],

        "Jujutsu Kaisen:Execution": [
            {
                user: "animeFan",
                rating: 5,
                time: "175 min",
                text: "Peak JJK energy, fights are insane."
            }
        ],

        "Playdate": [
            {
                user: "dadJokes",
                rating: 4,
                time: "135 min",
                text: "Weird but fun, loved the dynamic."
            }
        ],

        "El Selem W El Thoban": [
            {
                user: "dramaQueen",
                rating: 5,
                time: "125 min",
                text: "Beautiful story, really liked the chemistry."
            }
        ]
    };
    // Merge booking movie comments into global movieComments kermel el render te2dar testa3mela
    Object.entries(bookingMovieComments).forEach(([title, comments]) => {
        // if title already exists from movies.json, we append
        let existing = window.movieComments[title] || [];
        window.movieComments[title] = existing.concat(comments);
    });

    let $gallery = $("#gallery");
    //was getting errors when hosting
    const basePath = window.location.pathname.includes("/")
        ? "../"
        : "./";
    $.getJSON(basePath + "data/movies.json")
        .done(function (data) {
            if (!$gallery.length) return;
            $gallery.empty();

            if (!data || !Array.isArray(data.categories)) {
                console.error("movies.json: 'categories' is missing or not an array.");
                return;
            }

            data.categories.forEach(category => {
                // Create the category section
                let $section = $(`
          <section class="movies-cat">
            <h3>${category.name}</h3>
            <div class="movie"></div>
          </section>
        `);

                let $row = $section.find(".movie");

                // Add each movie card
                (category.movies || []).forEach(movie => {
                    let rating = movie.rating ?? "N/A";

                    let $card = $(`
            <figure class="movie-card">
              <img src="${movie.image}" alt="${movie.title} poster">
             
            </figure>`
                    );

                    // Data attributes so script.js can use them
                    $card.attr("data-movie-id", movie.id || "");
                    $card.attr("data-title", movie.title || "");
                    $card.attr("data-description", movie.description || "");
                    $card.attr("data-trailer-id", movie.trailerId || "");
                    $card.attr("data-rating", rating);
                    $card.attr("data-cast", (movie.cast || []).join(", "));
                    $card.attr("data-genres", (movie.genres || []).join(", "));
                    $card.attr("data-this-movie-is", (movie.thisMovieIs || []).join(", "));
                    // Store comments globally
                    if (Array.isArray(movie.comments)) {
                        window.movieComments[movie.title] = movie.comments;
                    }
                    // Rating overlay
                    let $overlay = $(`
                    <div class="movie-overlay">
                        <p class="movie-overlay-title">${movie.title || ""}</p>
                        <p class="movie-overlay-desc">${movie.description || ""}</p>
                        <div class="movie-overlay-bottom">
                            <span class="film-overlay"> ${movie.time} </span>
                            <span class="movie-overlay-rating">${rating} / 5 ★</span>
                        </div>
                    </div>
                    `);


                    $card.append($overlay);

                    $row.append($card);
                });

                $gallery.append($section);
            });
        })
        .fail(function (jqxhr, textStatus, error) {
            console.error("Failed to load movies.json:", textStatus, error);
        });
    //seat selection
    function appendSeats(seats, rowType) {
        let row = $("." + rowType)
        for (let i = 1; i <= seats; i++) {
            let seat = $("<div>")
            seat.addClass("seat");
            seat.attr("data-seat-id", rowType + "-" + i)
            row.append(seat);
        }
    }

    function getRandomSeats(seats, count) {
        let shuffledSeats = seats.toArray().sort(() => 0.5 - Math.random());
        return shuffledSeats.slice(0, count);
    }
    function markRandomSeats(SEATS_RESERVED) {
        let totalSeats = $(".seat");
        let reservedSeats = getRandomSeats(totalSeats, SEATS_RESERVED);
        reservedSeats.forEach(seat => {
            $(seat).addClass("reserved");
        });
    }
    let SEATS_RESERVED = 10;
    //instead of adding div aa kel wehde mennon
    appendSeats(10, "first-front-row");
    appendSeats(14, "second-front-row");
    appendSeats(80, "middle-row");
    appendSeats(14, "second-last-row");
    appendSeats(12, "first-last-row");


    markRandomSeats(SEATS_RESERVED);
    //for selecting seats


    $(document).on("click", ".seat:not(.reserved)", function () {
        $(this).toggleClass("selected");

        let id = $(this).data("seat-id");

        if ($(this).hasClass("selected")) {
            selectedSeats.add(id);
        } else {
            selectedSeats.delete(id);
        }

        updateReserveBtn();
    });

    function updateReserveBtn() {
        $("#reserveBtn").prop("disabled", selectedSeats.size === 0);
    }

    updateReserveBtn();

    //login - Real Laravel Authentication

    let currentUser = null;

    // Setup AJAX to always send CSRF token
    $.ajaxSetup({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        }
    });

    $(document).ready(function () {
        // Initialize auth state from server
        if (window.authUser) {
            currentUser = window.authUser.username;
            // Mirror to sessionStorage for backward compatibility with profile.js
            sessionStorage.setItem('loggedInUser', JSON.stringify(window.authUser));
        } else {
            sessionStorage.removeItem('loggedInUser');
        }

        if (window.loginModalShouldOpen) {
            openAuthModal('login');
            window.loginModalShouldOpen = false;
        }

        // Tab switching
        $(document).on('click', '[data-tab]', function () {
            let tab = $(this).data('tab');
            setAuthTab(tab);
        });

        // Login toggle button click
        $(document).on('click', '.login-toggle-btn', function (e) {
            e.preventDefault();
            let headerDrawer = document.getElementById('headerDrawer');
            if (headerDrawer && typeof bootstrap !== 'undefined' && bootstrap.Offcanvas) {
                let drawerInstance = bootstrap.Offcanvas.getInstance(headerDrawer);
                if (drawerInstance) {
                    drawerInstance.hide();
                }
            }

            if (window.authUser) {
                if (window.authUser.role==='admin'){
                    window.location.href='/admin';
                }
                else{
                    window.location.href = '/profile';
                    }
            } else {
                openAuthModal('login');
            }
        });

        $(document).on('show.bs.offcanvas', '#headerDrawer', function () {
            $('html, body').addClass('header-drawer-open');
        });

        $(document).on('hidden.bs.offcanvas', '#headerDrawer', function () {
            $('html, body').removeClass('header-drawer-open');
        });

        $(document).on('click', '[data-login-close]', function (e) {
            e.preventDefault();
            closeAuthModal();
        });

        // Close modal on background click
        $('.login-background').click(function (e) {
            if (e.target === this) {
                closeAuthModal();
            }
        });

        $(document).on('keydown', function (e) {
            if (e.key === 'Escape' && $('.login').is(':visible')) {
                closeAuthModal();
            }
        });

        // ==== LOGIN FORM SUBMISSION ====
        $('#loginForm').on('submit', function (e) {
            e.preventDefault();

            let $btn = $('#loginSubmitBtn');
            let $btnText = $btn.find('.btn-text');
            let $btnLoader = $btn.find('.btn-loader');

            let username = $('#loginUsername').val().trim();
            let password = $('#loginPassword').val();

            if (!username || !password) {
                $('#loginError').text('Please fill in all fields.');
                return;
            }

            // Show loading state
            $btn.prop('disabled', true);
            $btnText.hide();
            $btnLoader.show();
            $('#loginError').text('');
            $('#loginSuccess').text('');

            $.ajax({
                url: '/auth/login',
                method: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: function (response) {
                    if (response.success) {
                        currentUser = response.user.username;
                        window.authUser = response.user;

                        // Mirror to sessionStorage for backward compatibility
                        sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));

                        $('#loginSuccess').text(response.message);
                        $('#loginError').text('');

                        updateLoginStatus();

                        setTimeout(function () {
                            closeAuthModal();
                            $('#loginUsername').val('');
                            $('#loginPassword').val('');
                            $('#loginSuccess').text('');
                            location.reload();
                        }, 800);
                    }
                },
                error: function (xhr) {
                    let msg = 'Login failed. Please try again.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        msg = typeof xhr.responseJSON.message === 'string'
                            ? xhr.responseJSON.message
                            : Object.values(xhr.responseJSON.message).flat().join(' ');
                    }
                    $('#loginError').text(msg);
                },
                complete: function () {
                    $btn.prop('disabled', false);
                    $btnText.show();
                    $btnLoader.hide();
                }
            });
        });

        // ==== SIGNUP FORM SUBMISSION ====
        $('#signupForm').on('submit', function (e) {
            e.preventDefault();

            let $btn = $('#signupSubmitBtn');
            let $btnText = $btn.find('.btn-text');
            let $btnLoader = $btn.find('.btn-loader');

            let username = $('#signupUsername').val().trim();
            let email = $('#signupEmail').val().trim();
            let password = $('#signupPassword').val();
            let passwordConfirm = $('#signupPasswordConfirm').val();

            // Client-side validations
            if (!username || !email || !password || !passwordConfirm) {
                $('#signupError').text('Please fill in all fields.');
                return;
            }

            if (password !== passwordConfirm) {
                $('#signupError').text('Passwords do not match.');
                return;
            }

            if (password.length < 6) {
                $('#signupError').text('Password must be at least 6 characters.');
                return;
            }

            // Show loading state
            $btn.prop('disabled', true);
            $btnText.hide();
            $btnLoader.show();
            $('#signupError').text('');
            $('#signupSuccess').text('');

            $.ajax({
                url: '/auth/register',
                method: 'POST',
                data: {
                    username: username,
                    email: email,
                    password: password,
                    password_confirmation: passwordConfirm
                },
                success: function (response) {
                    if (response.success) {
                        currentUser = response.user.username;
                        window.authUser = response.user;

                        sessionStorage.setItem('loggedInUser', JSON.stringify(response.user));

                        $('#signupSuccess').text(response.message);
                        $('#signupError').text('');

                        updateLoginStatus();

                        setTimeout(function () {
                            closeAuthModal();
                            $('#signupUsername, #signupEmail, #signupPassword, #signupPasswordConfirm').val('');
                            $('#signupSuccess').text('');
                            location.reload();
                        }, 1200);
                    }
                },
                error: function (xhr) {
                    let msg = 'Registration failed. Please try again.';
                    if (xhr.responseJSON && xhr.responseJSON.message) {
                        if (typeof xhr.responseJSON.message === 'object') {
                            msg = Object.values(xhr.responseJSON.message).flat().join(' ');
                        } else {
                            msg = xhr.responseJSON.message;
                        }
                    }
                    $('#signupError').text(msg);
                },
                complete: function () {
                    $btn.prop('disabled', false);
                    $btnText.show();
                    $btnLoader.hide();
                }
            });
        });

        updateLoginStatus();
    });

    function updateLoginStatus() {
        let $loginToggleBtns = $('.login-toggle-btn');

        if (window.authUser) {
            $loginToggleBtns.html(`<i class="fas fa-user me-1"></i><span>${window.authUser.username}</span>`);
            $loginToggleBtns.addClass('logged-in');
        } else {
            $loginToggleBtns.html('<i class="fas fa-user me-1"></i><span>Login</span>');
            $loginToggleBtns.removeClass('logged-in');
        }
    }



    $(document).on("click", ".add-watchlist-btn.login-required", function (e) {
        e.preventDefault();
        e.stopPropagation();

        openAuthModal('login');

        showMessage("Please login to add movies to your watchlist!", 'info');
    });

    function showMessage(message, type) {
        let $message = $('<div class="alert-message"></div>')
            .text(message)
            .addClass(type)
            .hide()
            .appendTo('body')
            .fadeIn();

        setTimeout(() => {
            $message.fadeOut(() => $(this).remove());
        }, 3000);
    }
});
let current = 1;
function showStep(n) {
    let btn = $("#btn" + n);
    if (!btn.hasClass("enabled")) {
        return;
    }
    $(".step-content").removeClass("default");
    $("#step" + n).addClass("default");

    $(".stepsbtn").removeClass("default");
    btn.addClass("default");
    current = n;
}
function completeStep() {
    let next = current + 1;
    if (current === 4) {
        let count = selectedSeats.size;
        let total = count * SEAT_PRICE;

        $("#TotalPrice").html(`
            <p><strong>Seats Selected:</strong> ${count}</p>
            <p><strong>Total Price:</strong> $${total}</p>
            <hr>
        `);

        // Store totals so Step 5 can save them
        sessionStorage.setItem("selectedSeats", JSON.stringify([...selectedSeats]));
        sessionStorage.setItem("totalPrice", total);
    }
    if (next <= 5) {
        let nextBtn = $("#btn" + next);
        nextBtn.addClass("enabled");
        nextBtn.css("cursor", "pointer");

        showStep(next);
    }
}
//checks eza number
function isNumeric(value) {
    return /^[0-9]+$/.test(value);
}
function isValidBookingDate(date) {
    if (!date) return false;
    let [y, m, d] = date.split("-").map(Number);
    let selected = new Date(y, m - 1, d); // midnight
    selected.setHours(0, 0, 0, 0);
    let today = new Date();
    today.setHours(0, 0, 0, 0);

    return selected >= today;
}
$("#dateselect").on("input change", function () {
    let date = $(this).val();
    $("#datecompletestep").empty();

    if (!date) {
        $("#Datebtn").prop("disabled", true);
        return;
    }

    if (!isValidBookingDate(date)) {
        $("#Datebtn").prop("disabled", true);
        $("#datecompletestep").html(`<span style="color:#ff6b6b; position: relative; top:10px; bottom: 10px;">Please pick a valid date.</span>`);
        return;
    }

    $("#Datebtn").prop("disabled", false);
});

$("#Datebtn").on("click", function (e) {
    e.preventDefault();
    let date = $("#dateselect").val();
    if (!isValidBookingDate(date)) return;
    completeStep();
});
// confirm booing
$("#confirmbtn").on("click", function () {
    let userData = sessionStorage.getItem("loggedInUser");

    if (!userData) {
        // User is not logged in
        $("#confirmation").empty();
        $("#confirmation").html(`
            <div style="text-align: center; padding: 20px;">
                <p style="color: #ff6b6b; margin-bottom: 15px;">
                    <i class="fas fa-exclamation-triangle"></i> 
                    You need to log in to confirm your booking.
                </p>
                <button id="loginFromBookingBtn" style="
                    background: linear-gradient(135deg, var(--accent), var(--accent-2));
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 25px;
                    cursor: pointer;
                    font-weight: bold;
                    margin-top: 10px;
                ">
                    <i class="fas fa-sign-in-alt"></i> Log In Now
                </button>
            </div>
        `);

        setTimeout(() => {
            $("#loginFromBookingBtn").on("click", function () {
                openAuthModal('login');
            });
        }, 100);

        return;
    }


    let userObj = JSON.parse(userData);
    let username = userObj.username;
    let cinema = $("#cinemasSelect").val();
    let movie = $("#movieselect").val();
    let date = $("#dateselect").val();
    let time = $("#timeselect").val();
    let name = $("#Name").val();
    let email = $("#Email").val();
    let card = $("#CardNumber").val();
    let cvv = $("#CVV").val();
    let phone = $("#PhoneNumber").val();
    let seats = JSON.parse(sessionStorage.getItem("selectedSeats")) || [];
    let price = sessionStorage.getItem("totalPrice") || 0;

    if (!name.trim()) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter your full name.</span>`);
        return;
    }
    if (!email.trim()) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter your email.</span>`);
        return;
    }
    if (!phone.trim()) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter your Phone Number.</span>`);
        return;
    }

    if (!isNumeric(phone)) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter a valid phone number.</span>`);
        return;
    }
    if (!card.trim()) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter your card number.</span>`);
        return;
    }
    if (!isNumeric(card)) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter a valid card number.</span>`);
        return;
    }
    if (!cvv.trim()) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter your CVV.</span>`);
        return;
    }
    if (!isNumeric(cvv) || cvv.length != 3) {
        $("#confirmation").empty();
        $("#confirmation").html(`<span style=" color: #ff6b6b;">Please enter a valid 3-character CVV.</span>`);
        return;
    }
    // byekhdo aa step 3
    // if (!date) {
    //     $("#confirmation").empty();
    //     $("#confirmation").html(

    //         `<span style=" color: #ff6b6b;">Please choose a date. Returning to Step 3...</span>`
    //     );
    //     setTimeout(() => showStep(3), 800);
    //     return;
    // }

    let booking = { name, cinema, movie, date, time, seats, price, status: 'upcoming' };//by default upcoming

    let allBookings = JSON.parse(localStorage.getItem("bookings")) || {};

    if (!allBookings[username]) {
        allBookings[username] = [];
    }

    allBookings[username].push(booking);
    localStorage.setItem("bookings", JSON.stringify(allBookings));


    console.log(allBookings);
    // Disable l confirm button 
    let $confirmBtn = $("#confirmbtn");
    $confirmBtn.prop("disabled", true);
    $confirmBtn.text("Processing...");
    $("#confirmation").html(`
        <p style="margin-top:8px;font-size:0.95rem;opacity:0.9;">
          Processing your booking, please wait...
        </p>
    `);
    setTimeout(() => {
        $("#confirmation").html(`
        <p>Thank you, <strong>${name}</strong>!</p>
        <p>Your booking is confirmed:</p>
        <ul style="margin-left:15px;">
            <li><strong>Movie:</strong> ${movie}</li>
            <li><strong>Date:</strong> ${date}</li>
            <li><strong>Time:</strong> ${time}</li>
            <li><strong>Cinema:</strong> ${cinema}</li>
            <li><strong>Seats:</strong> ${seats.join(", ")}</li>
            <li><strong>Total Price:</strong> $${price}</li>
        </ul>
        <p style="color:#7a5cff;">Enjoy your movie!</p>
    `);
        //small msg tahet l confirm
        $("#confirmation").append(`
        <p style="margin-top:8px;font-size:0.9rem;opacity:0.8;  color: #ff6b6b;;">
        Going back to Step 1 so you can make another booking in 10 seconds...
        </p>
    `);
        // After 10 secs, reset w back to Step 1
        setTimeout(() => {
            //clear
            $("#Name, #Email, #PhoneNumber, #CardNumber, #CVV").val("");
            $("#TotalPrice").empty();
            $("#confirmation").empty();
            $("#movieselect").prop("selectedIndex", 0);
            $("#dateselect").val("");
            $("#timeselect").prop("selectedIndex", 0);
            $("#cinemasSelect").prop("selectedIndex", 0);
            // Reset seats
            selectedSeats.clear();
            $(".seat.selected").removeClass("selected");
            sessionStorage.removeItem("selectedSeats");
            sessionStorage.removeItem("totalPrice");
            $("#reserveBtn").prop("disabled", true);

            // Reset
            $(".stepsbtn").removeClass("default enabled").css("cursor", "default");
            $("#btn1").addClass("default enabled").css("cursor", "pointer");
            $(".step-content").removeClass("default");
            $("#step1").addClass("default");
            current = 1;
            showStep(1);
            //10 secs
            $confirmBtn.prop("disabled", false);
            $confirmBtn.text("Confirm");
        }, 10000);
    }, 3000); // Simulate processing delay
});
