(function () {
    if (!document.body.classList.contains("bookings-page")) {
        return;
    }

    const bookingData = window.bookingData || { cinemas: [], movies: [], showtimes: [], seat_map_capacity: 130 };
    const rowConfig = [
        { selector: ".first-front-row", count: 10 },
        { selector: ".second-front-row", count: 14 },
        { selector: ".middle-row", count: 80 },
        { selector: ".second-last-row", count: 14 },
        { selector: ".first-last-row", count: 12 },
    ];

    const state = {
        cinemaId: "",
        movieId: "",
        date: "",
        time: "",
        selectedShowtime: null,
    };

    function seatCapacity() {
        return Number(bookingData.seat_map_capacity) || 130;
    }

    function getLoggedInUser() {
        try {
            return JSON.parse(sessionStorage.getItem("loggedInUser"));
        } catch (error) {
            return null;
        }
    }

    function getShowtimes(filters = {}) {
        return (bookingData.showtimes || [])
            .filter((showtime) => {
                if (filters.cinemaId && String(showtime.cinema_id) !== String(filters.cinemaId)) {
                    return false;
                }

                if (filters.movieId && String(showtime.movie_id) !== String(filters.movieId)) {
                    return false;
                }

                if (filters.date && showtime.date !== filters.date) {
                    return false;
                }

                if (filters.time && showtime.time !== filters.time) {
                    return false;
                }

                return Number(showtime.available_seats) > 0;
            })
            .sort((left, right) => {
                const leftKey = `${left.date} ${left.time}`;
                const rightKey = `${right.date} ${right.time}`;
                return leftKey.localeCompare(rightKey);
            });
    }

    function getMoviesForCinema(cinemaId) {
        const movieIds = new Set(
            getShowtimes({ cinemaId }).map((showtime) => String(showtime.movie_id))
        );

        return (bookingData.movies || []).filter((movie) => movieIds.has(String(movie.id)));
    }

    function populateSelect($select, options, placeholder, selectedValue = "") {
        $select.empty();
        $select.append(`<option value="">${placeholder}</option>`);

        options.forEach((option) => {
            const isSelected = String(option.value) === String(selectedValue);
            $select.append(
                `<option value="${option.value}"${isSelected ? " selected" : ""}>${option.label}</option>`
            );
        });
    }

    function renderMovieOptions(selectedMovieId = "") {
        const movies = state.cinemaId ? getMoviesForCinema(state.cinemaId) : [];
        populateSelect(
            $("#movieselect"),
            movies.map((movie) => ({ value: movie.id, label: movie.title })),
            state.cinemaId ? "Choose a movie" : "Choose a cinema first",
            selectedMovieId
        );
    }

    function renderDateOptions(selectedDate = "") {
        const showtimes = getShowtimes({
            cinemaId: state.cinemaId,
            movieId: state.movieId,
        });

        const dates = [];
        const seen = new Set();

        showtimes.forEach((showtime) => {
            if (seen.has(showtime.date)) {
                return;
            }

            seen.add(showtime.date);
            dates.push({
                value: showtime.date,
                label: showtime.display_date,
            });
        });

        populateSelect(
            $("#dateselect"),
            dates,
            state.movieId ? "Choose a date" : "Choose a movie first",
            selectedDate
        );
    }

    function renderTimeOptions(selectedTime = "") {
        const showtimes = getShowtimes({
            cinemaId: state.cinemaId,
            movieId: state.movieId,
            date: state.date,
        });

        populateSelect(
            $("#timeselect"),
            showtimes.map((showtime) => ({
                value: showtime.time,
                label: `${showtime.display_time} (${showtime.available_seats} seats left)`,
            })),
            state.date ? "Choose a time" : "Choose a date first",
            selectedTime
        );
    }

    function syncSelectedShowtime() {
        state.selectedShowtime =
            getShowtimes({
                cinemaId: state.cinemaId,
                movieId: state.movieId,
                date: state.date,
                time: state.time,
            })[0] || null;
    }

    function setStepEnabled(stepNumber, enabled) {
        const $button = $(`#btn${stepNumber}`);
        $button.toggleClass("enabled", enabled);
        $button.css("cursor", enabled ? "pointer" : "default");
    }

    function resetProgressFrom(stepNumber) {
        for (let step = 1; step <= stepNumber; step += 1) {
            setStepEnabled(step, true);
        }

        for (let step = stepNumber + 1; step <= 5; step += 1) {
            setStepEnabled(step, false);
            $(`#step${step}`).removeClass("default");
        }

        $(".step-content").removeClass("default");
        $(".stepsbtn").removeClass("default");
        $(`#btn${stepNumber}`).addClass("default");
        $(`#step${stepNumber}`).addClass("default");
        window.current = stepNumber;
    }

    function showStep(stepNumber) {
        const $button = $(`#btn${stepNumber}`);

        if (!$button.hasClass("enabled")) {
            return;
        }

        $(".step-content").removeClass("default");
        $(".stepsbtn").removeClass("default");

        $(`#step${stepNumber}`).addClass("default");
        $button.addClass("default");
        window.current = stepNumber;
    }

    function unlockStep(stepNumber) {
        setStepEnabled(stepNumber, true);
        showStep(stepNumber);
    }

    function showDateMessage(message) {
        if (!message) {
            $("#datecompletestep").empty();
            return;
        }

        $("#datecompletestep").html(
            `<span style="color:#ff6b6b; position: relative; top:10px; bottom:10px;">${message}</span>`
        );
    }

    function stableHash(text) {
        let hash = 0;

        for (let index = 0; index < text.length; index += 1) {
            hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
        }

        return hash;
    }

    function renderSeatMap(showtime) {
        rowConfig.forEach((row) => {
            const $row = $(row.selector);
            $row.empty();

            for (let seatIndex = 1; seatIndex <= row.count; seatIndex += 1) {
                const seatId = `${row.selector.replace(".", "")}-${seatIndex}`;
                $row.append(`<div class="seat" data-seat-id="${seatId}"></div>`);
            }
        });

        selectedSeats.clear();
        sessionStorage.removeItem("selectedSeats");
        sessionStorage.removeItem("totalPrice");
        $("#reserveBtn").prop("disabled", true);

        if (!showtime) {
            updateCheckoutSummary();
            return;
        }

        const capacity = seatCapacity();
        const availableSeats = Math.max(0, Math.min(capacity, Number(showtime.available_seats) || 0));
        const reservedCount = Math.max(0, capacity - availableSeats);
        const seats = Array.from(document.querySelectorAll(".seat"));

        seats
            .sort((left, right) => {
                return (
                    stableHash(`${showtime.id}:${left.dataset.seatId}`) -
                    stableHash(`${showtime.id}:${right.dataset.seatId}`)
                );
            })
            .slice(0, reservedCount)
            .forEach((seat) => {
                seat.classList.add("reserved");
            });

        updateCheckoutSummary();
    }

    function updateCheckoutSummary() {
        if (!state.selectedShowtime) {
            $("#TotalPrice").html("");
            return;
        }

        const seatCount = selectedSeats.size;
        const pricePerSeat = Number(state.selectedShowtime.price_seat) || 0;
        const total = (seatCount * pricePerSeat).toFixed(2);

        sessionStorage.setItem("selectedSeats", JSON.stringify([...selectedSeats]));
        sessionStorage.setItem("totalPrice", total);

        $("#TotalPrice").html(`
            <p><strong>Seats Selected:</strong> ${seatCount}</p>
            <p><strong>Price Per Seat:</strong> $${pricePerSeat.toFixed(2)}</p>
            <p><strong>Total Price:</strong> $${total}</p>
            <hr>
        `);
    }

    function prefillFromMovie(movieId) {
        const movieShowtimes = getShowtimes({ movieId });
        const firstShowtime = movieShowtimes[0];

        if (!firstShowtime) {
            return;
        }

        state.cinemaId = String(firstShowtime.cinema_id);
        $("#cinemasSelect").val(state.cinemaId);
        renderMovieOptions(movieId);

        state.movieId = String(movieId);
        $("#movieselect").val(state.movieId);
        renderDateOptions(firstShowtime.date);

        state.date = firstShowtime.date;
        $("#dateselect").val(state.date);
        renderTimeOptions(firstShowtime.time);

        state.time = firstShowtime.time;
        $("#timeselect").val(state.time);
        syncSelectedShowtime();
        showDateMessage("");
        $("#Datebtn").prop("disabled", !state.selectedShowtime);

        setStepEnabled(2, true);
        setStepEnabled(3, true);
        showStep(3);
        document.querySelector(".booking-flow")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    function resetFormToStart() {
        state.cinemaId = "";
        state.movieId = "";
        state.date = "";
        state.time = "";
        state.selectedShowtime = null;

        $("#cinemasSelect").val("");
        renderMovieOptions();
        renderDateOptions();
        renderTimeOptions();

        $("#Name, #Email, #PhoneNumber, #CardNumber, #CVV").val("");
        $("#confirmation").empty();
        $("#Datebtn").prop("disabled", true);
        showDateMessage("");

        renderSeatMap(null);

        $(".step-content").removeClass("default");
        $("#step1").addClass("default");
        $(".stepsbtn").removeClass("default enabled").css("cursor", "default");
        $("#btn1").addClass("default enabled").css("cursor", "pointer");
        window.current = 1;
        showStep(1);
    }

    function cacheBookingLocally(user, booking) {
        const cachedBookings = JSON.parse(localStorage.getItem("bookings")) || {};

        if (!cachedBookings[user.username]) {
            cachedBookings[user.username] = [];
        }

        cachedBookings[user.username].push({
            name: $("#Name").val().trim(),
            cinema: booking.cinema,
            movie: booking.movie,
            date: booking.date,
            time: state.selectedShowtime?.time || booking.time,
            seats: booking.seats,
            price: booking.price,
            status: booking.status,
        });

        localStorage.setItem("bookings", JSON.stringify(cachedBookings));
    }

    function updateLocalAvailability(showtimeId, availableSeats) {
        (bookingData.showtimes || []).forEach((showtime) => {
            if (String(showtime.id) === String(showtimeId)) {
                showtime.available_seats = availableSeats;
            }
        });

        (bookingData.movies || []).forEach((movie) => {
            (movie.showtimes || []).forEach((showtime) => {
                if (String(showtime.id) === String(showtimeId)) {
                    showtime.available_seats = availableSeats;
                }
            });
        });
    }

    function validateCheckoutFields() {
        const name = $("#Name").val().trim();
        const email = $("#Email").val().trim();
        const phone = $("#PhoneNumber").val().trim();
        const card = $("#CardNumber").val().trim();
        const cvv = $("#CVV").val().trim();

        if (!name) return "Please enter your full name.";
        if (!email) return "Please enter your email.";
        if (!phone) return "Please enter your phone number.";
        if (!/^[0-9]+$/.test(phone)) return "Please enter a valid phone number.";
        if (!card) return "Please enter your card number.";
        if (!/^[0-9]+$/.test(card)) return "Please enter a valid card number.";
        if (!cvv) return "Please enter your CVV.";
        if (!/^[0-9]{3}$/.test(cvv)) return "Please enter a valid 3-digit CVV.";

        return "";
    }

    function showLoginPrompt() {
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
                openAuthModal("login");
            });
        }, 100);
    }

    function handleConfirmBooking() {
        const user = getLoggedInUser();
        if (!user) {
            showLoginPrompt();
            return;
        }

        if (!state.selectedShowtime) {
            $("#confirmation").html(`<span style="color:#ff6b6b;">Please choose a valid showtime first.</span>`);
            return;
        }

        if (!selectedSeats.size) {
            $("#confirmation").html(`<span style="color:#ff6b6b;">Please select at least one seat.</span>`);
            return;
        }

        const validationMessage = validateCheckoutFields();
        if (validationMessage) {
            $("#confirmation").html(`<span style="color:#ff6b6b;">${validationMessage}</span>`);
            return;
        }

        const $confirmButton = $("#confirmbtn");
        $confirmButton.prop("disabled", true).text("Processing...");
        $("#confirmation").html(`
            <p style="margin-top:8px;font-size:0.95rem;opacity:0.9;">
                Processing your booking, please wait...
            </p>
        `);

        $.ajax({
            url: window.bookingStoreUrl,
            method: "POST",
            headers: {
                Accept: "application/json",
            },
            data: {
                showtime_id: state.selectedShowtime.id,
                seats: selectedSeats.size,
                customer_name: $("#Name").val().trim(),
                customer_email: $("#Email").val().trim(),
                customer_phone: $("#PhoneNumber").val().trim(),
                selected_seats: [...selectedSeats],
            },
            success(response) {
                if (!response.success) {
                    $("#confirmation").html(`<span style="color:#ff6b6b;">${response.message || "Booking failed."}</span>`);
                    $confirmButton.prop("disabled", false).text("Confirm");
                    return;
                }

                cacheBookingLocally(user, response.booking);
                updateLocalAvailability(response.showtime.id, response.showtime.available_seats);

                $("#confirmation").html(`
                    <p>Thank you, <strong>${$("#Name").val().trim()}</strong>!</p>
                    <p>Your booking is confirmed:</p>
                    <ul style="margin-left:15px;">
                        <li><strong>Movie:</strong> ${response.booking.movie}</li>
                        <li><strong>Date:</strong> ${response.booking.date}</li>
                        <li><strong>Time:</strong> ${response.booking.time}</li>
                        <li><strong>Cinema:</strong> ${response.booking.cinema}</li>
                        <li><strong>Seats:</strong> ${(response.booking.seats || []).join(", ")}</li>
                        <li><strong>Total Price:</strong> $${Number(response.booking.price).toFixed(2)}</li>
                    </ul>
                    <p style="color:#f97316;">Enjoy your movie!</p>
                `);

                setTimeout(() => {
                    resetFormToStart();
                    $confirmButton.prop("disabled", false).text("Confirm");
                }, 3000);
            },
            error(xhr) {
                const message =
                    xhr.responseJSON?.message ||
                    "Booking failed. Please try another showtime.";

                $("#confirmation").html(`<span style="color:#ff6b6b;">${message}</span>`);
                $confirmButton.prop("disabled", false).text("Confirm");
            },
        });
    }

    window.showStep = function (stepNumber) {
        showStep(stepNumber);
    };

    window.completeStep = function () {
        if (window.current === 1) {
            if (!state.cinemaId) {
                $("#cinemasSelect").trigger("focus");
                return;
            }

            unlockStep(2);
            return;
        }

        if (window.current === 2) {
            if (!state.movieId) {
                $("#movieselect").trigger("focus");
                return;
            }

            unlockStep(3);
            return;
        }

        if (window.current === 4) {
            if (!selectedSeats.size) {
                $("#confirmation").html(`<span style="color:#ff6b6b;">Please select at least one seat.</span>`);
                return;
            }

            updateCheckoutSummary();
            unlockStep(5);
        }
    };

    $(function () {
        window.current = 1;
        window.movieComments = window.movieComments || {};

        (bookingData.movies || []).forEach((movie) => {
            if (Array.isArray(movie.comments) && movie.comments.length) {
                window.movieComments[movie.title] = movie.comments;
            }
        });

        $("#dateselect").off("input change");
        $("#Datebtn").off("click");
        $("#confirmbtn").off("click");

        resetFormToStart();

        $("#cinemasSelect").on("change", function () {
            state.cinemaId = $(this).val();
            state.movieId = "";
            state.date = "";
            state.time = "";
            state.selectedShowtime = null;

            renderMovieOptions();
            renderDateOptions();
            renderTimeOptions();
            renderSeatMap(null);
            $("#Datebtn").prop("disabled", true);
            showDateMessage("");
            resetProgressFrom(1);
        });

        $("#movieselect").on("change", function () {
            state.movieId = $(this).val();
            state.date = "";
            state.time = "";
            state.selectedShowtime = null;

            renderDateOptions();
            renderTimeOptions();
            renderSeatMap(null);
            $("#Datebtn").prop("disabled", true);
            showDateMessage("");
            resetProgressFrom(2);
        });

        $("#dateselect").on("change", function () {
            state.date = $(this).val();
            state.time = "";
            state.selectedShowtime = null;

            renderTimeOptions();
            $("#Datebtn").prop("disabled", true);
            showDateMessage(state.date ? "" : "Please choose a date.");
            resetProgressFrom(3);
        });

        $("#timeselect").on("change", function () {
            state.time = $(this).val();
            syncSelectedShowtime();
            $("#Datebtn").prop("disabled", !state.selectedShowtime);
            resetProgressFrom(3);

            if (!state.selectedShowtime) {
                showDateMessage("Please choose a valid time.");
                return;
            }

            showDateMessage(
                `${state.selectedShowtime.display_time} selected at ${state.selectedShowtime.cinema_name}.`
            );
        });

        $("#Datebtn").on("click", function (event) {
            event.preventDefault();
            syncSelectedShowtime();

            if (!state.selectedShowtime) {
                showDateMessage("Please choose a valid showtime.");
                return;
            }

            renderSeatMap(state.selectedShowtime);
            unlockStep(4);
        });

        $(document).on("click.bookingsDbSummary", ".seat:not(.reserved)", function () {
            setTimeout(updateCheckoutSummary, 0);
        });

        $("#confirmbtn").on("click", function () {
            handleConfirmBooking();
        });

        $(document).on("click", ".showShowTimes-btn", function (event) {
            event.preventDefault();
            event.stopPropagation();

            const card = event.currentTarget.closest(".movie-card");
            const movieId = card?.dataset.movieId;

            if (movieId) {
                prefillFromMovie(movieId);
            }

            if (typeof openMovieModal === "function") {
                openMovieModal(card);
            }
        });
    });
})();
