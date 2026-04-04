let modal = document.getElementById('card-modal');
let modalTrailer = document.getElementById('modal-trailer');
let modalTitle = document.getElementById('modal-title');
let modalText = document.getElementById('modal-text');
let modalClose = document.getElementById('modal-close');
let modalCast = document.getElementById('modal-cast');
let modalGenres = document.getElementById('modal-genres');
let modalThisMovieIs = document.getElementById('modal-this-movie-is');

let TRAILER_URLS = {
  "Barbie": "https://www.youtube.com/embed/pBk4NYhWNMM",
  "It Ends With Us": "https://www.youtube.com/embed/DLET_u31M4M",
  "IT": "https://www.youtube.com/embed/xKJmEC5ieOk",
  "Jurassic World Rebirth": "https://www.youtube.com/embed/jan5CFWs9ic",
  "Split": "https://www.youtube.com/embed/Qsr6SgcKNiM",
  "White Chicks": "https://www.youtube.com/embed/aeVkbNka9HM",
  "SuperMan": "https://www.youtube.com/embed/Ox8ZLF6cGM0",
  "The conjuring 2": "https://www.youtube.com/embed/FSAz556s0fM",
  "Truth or Dare": "https://www.youtube.com/embed/BjRNY3u3bUw",
  "Avengers": "https://www.youtube.com/embed/eOrNdBpGMv8",
  "Countdown": "https://www.youtube.com/embed/t72R6wZ0zQ8",
  "Interstellar": "https://www.youtube.com/embed/zSWdZVtXT7E",
  "Bad Guys": "https://www.youtube.com/embed/TY1lWh20VSw",
  "Avatar": "https://www.youtube.com/embed/nb_fFj_0rq8",
  "Extraction 2": "https://www.youtube.com/embed/Y274jZs5s7s",
  "The Discovery": "https://www.youtube.com/embed/z9j6WcdU-ts",
  "Predator: Badlands": "https://www.youtube.com/embed/43R9l7EkJwE",
  "HardaBasht": "https://www.youtube.com/embed/Z2yUk7IaE9A",
  "Jujutsu Kaisen:Execution": "https://www.youtube.com/embed/oCIgbchrtu4",
  "Playdate": "https://www.youtube.com/embed/ooJ8bJt-Y9A",
  "El Selem W El Thoban": "https://www.youtube.com/embed/NwlRuumdJEA",
  "the litle stranger": "https://www.youtube.com/embed/iPDA7Z1c-Eg",
  "Black Phone2": "https://www.youtube.com/embed/v0kqkRZHqk4",
  "Turno nocturno": "https://www.youtube.com/embed/M7oU0ocIyrc",
  "The Forest": "https://www.youtube.com/embed/lBgKi0XVn4A",
  "Mirrors 2": "https://www.youtube.com/embed/5HZ9WM2W0pg",
  "One Battle After Another": "https://www.youtube.com/embed/feOQFKv2Lw4",
  "Countdown": "https://www.youtube.com/embed/t72R6wZ0zQ8",
  "Sovereign": "https://www.youtube.com/embed/55tuwgvaMHY",
  "Insidious": "https://www.youtube.com/embed/zuZnRUcoWos",
  "Insidious 2": "https://www.youtube.com/embed/fBbi4NeebAk",
  "Insidious 3": "https://www.youtube.com/embed/3HxEXnVSr1w",
  "WorldWar Z": "https://www.youtube.com/embed/Md6Dvxdr0AQ",
  "Damsel": "https://www.youtube.com/embed/iM150ZWovZM",
  "Mr. and Mrs. Smith": "https://www.youtube.com/embed/CZ0B22z22pI",
  "Bullet Train": "https://www.youtube.com/embed/0IOsk2Vlc4o",
  "The Lion King": "https://www.youtube.com/embed/7TavVZMewpY",
  "Frozen": "https://www.youtube.com/embed/FLzfXQSPBOg",
  "Frozen 2": "https://www.youtube.com/embed/bwzLiQZDw2I",
  "Minions: The Rise of Gru": "https://www.youtube.com/embed/--rV9wXzIeE",
  "Toy Story 4": "https://www.youtube.com/embed/wmiIUN-7qhE",
  "Moana": "https://www.youtube.com/embed/LKFuXETZUsI",
  "Coco": "https://www.youtube.com/embed/xlnPHQ3TLX8", // sar working
  "Spider-Man: Into the Spider-Verse": "https://www.youtube.com/embed/g4Hbz2jLxvQ",
  "Encanto": "https://www.youtube.com/embed/CaimKeDcudo",
  "Minions: The Rise of Gru": "https://www.youtube.com/embed/6DxjJzmYsXo",//sar  working
  "The Running Man": "https://www.youtube.com/embed/KD18ddeFuyM",
};

function normalizeTrailerUrl(rawValue) {
  if (!rawValue) return "";
  if (rawValue.includes("youtube.com/embed/")) return rawValue;

  let match = rawValue.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  if (match) {
    return `https://www.youtube.com/embed/${match[1]}`;
  }

  if (/^[\w-]{11}$/.test(rawValue)) {
    return `https://www.youtube.com/embed/${rawValue}`;
  }

  return rawValue;
}

function renderModalShowtimes(card) {
  let showtimesContainer = document.getElementById("modal-showtimes");
  if (!showtimesContainer) return;

  let showtimesLabel = document.querySelector(".movieshowtime");
  let rawShowtimes = card.dataset.showtimes || card.getAttribute("data-showtimes") || "[]";
  let parsedShowtimes = [];

  try {
    parsedShowtimes = JSON.parse(rawShowtimes);
  } catch (error) {
    parsedShowtimes = [];
  }

  showtimesContainer.innerHTML = "";

  if (!Array.isArray(parsedShowtimes) || !parsedShowtimes.length) {
    if (showtimesLabel) showtimesLabel.style.display = "none";
    showtimesContainer.style.display = "none";
    return;
  }

  if (showtimesLabel) showtimesLabel.style.display = "";
  showtimesContainer.style.display = "";

  parsedShowtimes.forEach((showtime) => {
    let pill = document.createElement("span");
    pill.className = "showtime-pill";
    pill.textContent = showtime;
    showtimesContainer.appendChild(pill);
  });
}



document.querySelectorAll(".movie-card").forEach(card => {
    let rating = card.dataset.rating || "N/A";
    let description = card.dataset.description || "N/A";
    let overlay = document.createElement("span");
    overlay.className = "rating-overlay";
    // overlay.textContent = `${description} `;
    // overlay.textContent = `${rating} / 5 ★`;

    card.appendChild(overlay);
});
function closeModal() {
  if (modal) {
    modal.classList.remove('open');
  }
  document.body.style.overflow = '';
  if (modalTrailer) {
    modalTrailer.src = '';
  }
}
let movieContainer = document.getElementById('movie');
if (modalClose) {
  modalClose.onclick = closeModal;
}
if (modal) {
  modal.onclick = function (event) {
    if (event.target === modal || event.target.hasAttribute('data-close-modal')) {
      closeModal();
    }
  };
}

//for the welcome box to active the btns set indicator and trnsform to the next img every 3 sec
let heroBox = document.getElementById("heroBox");
let heroImages = [
  "imgs/welcome page.png",
  "imgs/Premiere.png",
  "imgs/theatre.png"
];
let heroIndex = 0;
let autoAdvanceInterval;
let isTransitioning = false;
if(heroBox){

  // Create indicator container and circles
  let indicatorsContainer = document.createElement('div');
  indicatorsContainer.className = 'carousel-indicators';
  heroBox.appendChild(indicatorsContainer);

  // Create indicators
  heroImages.forEach((_, index) => {
    let indicator = document.createElement('div');
    indicator.className = 'indicator';
    if (index === 0) indicator.classList.add('active');
    indicator.addEventListener('click', () => setHero(index));
    indicatorsContainer.appendChild(indicator);
  });
  //initialize
  setHero(0);
  startAutoAdvance();
  //pasue when hover
  heroBox.addEventListener('mouseenter', () => {
    clearInterval(autoAdvanceInterval);
  });
  //resume when no hover
  heroBox.addEventListener('mouseleave', () => {
    startAutoAdvance();
  });
}
function setHero(i) {
  if(!heroBox) return; //la2an mafee hero box ella b index.html
  if (isTransitioning) return;

  isTransitioning = true;
  heroIndex = (i + heroImages.length) % heroImages.length;
  heroBox.style.backgroundImage = `url("${heroImages[heroIndex]}")`;
  // Update active indicator
  document.querySelectorAll('.indicator').forEach((indicator, index) => {
    indicator.classList.toggle('active', index === heroIndex);
  });
  // Update hero slide text (sync text with image)
  document.querySelectorAll('#heroBox .hero-slide').forEach((slide, index) => {
    slide.classList.toggle('active', index === heroIndex);
  });
  // Reset transitioning flag after transition completes
  setTimeout(() => {
    isTransitioning = false;
  }, 800);
}
function nextImage() { 
  setHero(heroIndex + 1); 
}
function prevImage() { 
  setHero(heroIndex - 1); 
}
// Start auto-advancing every 3 seconds
function startAutoAdvance() {
  if(!heroBox) return; //la2an mafee hero box ella b index.html
  autoAdvanceInterval = setInterval(() => {
    if (!isTransitioning) {
      nextImage();
    }
  }, 3000);
}

//render comments
function renderCommentsForMovie(title) {
    let commentsContainer = document.getElementById("comments-list");
  if (!commentsContainer) return;

  commentsContainer.innerHTML = "";

  //comments from movies.json
  let baseComments =
    (window.movieComments && window.movieComments[title]) || [];

  // Extra comments users added (localStorage)
let extraStore = JSON.parse(localStorage.getItem("movieCommentsExtra")) || {};
  let extraForMovie = extraStore[title] || [];

  // jam3 el comments mn movies.json w el extra
let allComments = [...baseComments, ...extraForMovie];

let uniqueComments = [];
let userMap = new Map();
allComments.reverse().forEach(c => {
    if (!userMap.has(c.user)) {
        userMap.set(c.user, c);
        uniqueComments.unshift(c); // Add to beginning to maintain order
    }
});

  if (!uniqueComments.length) {
    commentsContainer.innerHTML =
      `<p class="no-comments">No comments yet.</p>`;
    return;
  }

  uniqueComments.forEach(c => {
  let div = document.createElement("div");
    div.className = "comment";

  let rating = c.rating || 0;
  let stars =
      "★".repeat(rating) + "☆".repeat(5 - rating);

    div.innerHTML = `
      <div class="comment-header">
        <span class="comment-user">${c.user}</span>
        <span class="comment-rating">${stars}</span>
      </div>
      <p class="comment-text">${c.text}</p>
    `;
    commentsContainer.appendChild(div);
  });
}

// MAIN FUNCTION TO OPEN MODAL
function openMovieModal(cardElement) {
  let card = cardElement?.closest?.('figure.movie-card, .movie-card') || cardElement;
  if (!card) return;

  let h3 = card.querySelector('h3');
  let title = (h3 && h3.textContent.trim()) || card.dataset.title || card.getAttribute('data-title') || '';
  let text = card.dataset.description || card.getAttribute('data-description') || 'No movie description available yet.';

  let rating = card.dataset.rating || card.getAttribute('data-rating') || 'N/A';

  let cast = card.dataset.cast || card.getAttribute('data-cast') || 'N/A';

  let genres = card.dataset.genres || card.getAttribute('data-genres') || 'N/A';

  let thisMovieIs = card.dataset.thisMovieIs || card.getAttribute('data-this-movie-is') || 'N/A';

  let trailerFromCard = card.dataset.trailerUrl || card.getAttribute('data-trailer-url') || '';
  let youtubeEmbedUrl = normalizeTrailerUrl(trailerFromCard) || normalizeTrailerUrl(TRAILER_URLS[title] || '');
  if (modalTitle) modalTitle.textContent = title;
  if (modalText) modalText.textContent = text;
  if (modalCast) modalCast.textContent = cast;
  if (modalGenres) modalGenres.textContent = genres;
  if (modalThisMovieIs) modalThisMovieIs.textContent = thisMovieIs;
  renderModalShowtimes(card);
  
  if (youtubeEmbedUrl && modalTrailer) {
    let params = "?autoplay=1&mute=1&rel=0&playsinline=1&modestbranding=1";
    modalTrailer.src = youtubeEmbedUrl + params;
    modalTrailer.style.display = 'block';
  } else if (modalTrailer) {
    modalTrailer.src = '';
    modalTrailer.style.display = 'none';
  }
  
  renderCommentsForMovie(title);
  updateWatchlistButton(title);

  if (modal) {
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}

function updateWatchlistButton(movieTitle) {
    let watchlistBtn = document.querySelector('.add-watchlist-btn');
    if (!watchlistBtn) return;
    
    let newWatchlistBtn = watchlistBtn.cloneNode(true);
    watchlistBtn.parentNode.replaceChild(newWatchlistBtn, watchlistBtn);

    let userData;
    
        userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
   

    let saved = [];
    if (!userData) {
        // User not logged in
        newWatchlistBtn.textContent = "Login to Add to Watchlist";
        newWatchlistBtn.classList.add('login-required');
        newWatchlistBtn.disabled = false;
        newWatchlistBtn.style.opacity = "1";
        newWatchlistBtn.style.background = "#6c757d";
        newWatchlistBtn.style.cursor = "pointer";
        return;
    }
        saved = JSON.parse(localStorage.getItem('watchlist')) || [];
    

    let inList = saved.some(m => m.title === movieTitle && m.username === userData.username);

    if (inList) {
        newWatchlistBtn.textContent = " Remove from Watchlist";
        newWatchlistBtn.classList.add('added');
        newWatchlistBtn.classList.remove('login-required');
    } else {
        newWatchlistBtn.textContent = "+ Add to Watchlist";
        newWatchlistBtn.classList.remove('added', 'login-required');
    }
    newWatchlistBtn.disabled = false;
    newWatchlistBtn.style.opacity = "1";

  }
// Event listeners
document.addEventListener("click", (e) => {
  let card = e.target.closest(".movie-card");
  if (!card) return;
  if ($(e.target).closest('.watch-flag').length) {
        return;
    }
  openMovieModal(card);
});


  

//for modal to be responsive
function repositionModalTitle() {
  let modalTitle = document.getElementById("modal-title");
  let modalMedia = document.querySelector(".modal__media");
  let modalBody  = document.querySelector(".modal__body");
  let movieInfo  = document.getElementById("movieinfo");

  if (!modalTitle || !modalMedia || !modalBody) return;

  if (window.innerWidth <= 974) {
    if (modalTitle.parentElement !== modalMedia) {
      // hatet l title after the trailer, before cast info
      modalMedia.insertBefore(modalTitle, movieInfo);
    }
  } else {
    // hatet l title metel ma kenet(old layout)
    if (modalTitle.parentElement !== modalBody) {
      modalBody.insertBefore(modalTitle, modalBody.firstChild);
    }
  }
}

// Run once on load w kel ma l window resizes
window.addEventListener("load", repositionModalTitle);
window.addEventListener("resize", repositionModalTitle);
window.openMovieModal = openMovieModal;