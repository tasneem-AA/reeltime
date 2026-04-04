
$(function() {
    $(function() {
    // Only initialize if user is logged in
    if (sessionStorage.getItem('loggedInUser')) {
        initializeWatchlist();
    }
    setupWatchlistEventHandlers();  
});
    setupWatchlistEventHandlers();
});

function initializeWatchlist() {
    const userData = sessionStorage.getItem('loggedInUser');
    
    
    if (!userData) {
        return;
    }
    
    try {
        const user = JSON.parse(userData);
        
        
        if (!user) {
           return;
        }
        
        if (!user.watchlist) {
            const saved = JSON.parse(localStorage.getItem('watchlist')) || [];
            user.watchlist = saved.filter(movie => movie.username === user.username);
            sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        }
    } catch (error) {
        console.error('Error parsing user data:', error);
    }
}

function setupWatchlistEventHandlers() {
   
   
    $(document).off('click', '.add-watchlist-btn').on('click', '.add-watchlist-btn', function(event) {
        event.preventDefault();
        event.stopPropagation();
        handleWatchlistAdd($(this));
        window.dispatchEvent(new CustomEvent('watchlist-updated'));   
    });
     $(document).off('click', '.watch-flag').on('click', '.watch-flag', function (event) {
          event.preventDefault();
          event.stopPropagation();
          handleWatchlistToggleFromCard($(this));
      });
}

function handleWatchlistAdd($button) {
   
    // Check if user is logged in
    let userData;
        userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
         let movieTitle = '';
         if (!userData) {
       return;
    }
   
        movieTitle = $('#modal-title').text().trim();
       
       
let movieImage = '';

    const $modalImage = $('.modal__media img');
    if ($modalImage.length) {
        // DOM property absolute URL
        movieImage = $modalImage[0].src || '';
    }

    if (!movieImage) {
        const cardImg = $(`.movie-card[data-title="${movieTitle}"] img`).get(0);
        if (cardImg) {
            movieImage = cardImg.src;  // absolute URL, works from any page
        } else {
            movieImage = 'imgs/default-movie.jpg';
        }
    }
    // Get movie rating
    let movieRating = '0';
    
        const $movieCard = $(`.movie-card[data-title="${movieTitle}"]`).first();
        movieRating = $movieCard.attr('data-rating') || '0';
   

    // Get current watchlist
    let saved = [];
    
        saved = JSON.parse(localStorage.getItem('watchlist')) || [];
       

    // Check if movie is already in watchlist
    const alreadyAdded = saved.some(m => m.title === movieTitle && m.username === userData.username);
   
        if (alreadyAdded) {
            // REMOVE from watchlist
            saved = saved.filter(m => !(m.title === movieTitle && m.username === userData.username));
            $button.text('+ Add to Watchlist').removeClass('added');
            $button.css('background', '');
           } else {
            // ADD to watchlist
            const newMovie = {
                username: userData.username,
                title: movieTitle,
                image: movieImage,
                rating: movieRating,
                dateAdded: new Date().toISOString()
            };
            saved.push(newMovie);
            $button.text('Remove from Watchlist').addClass('added');
           }

        // Save to localStorage
        localStorage.setItem('watchlist', JSON.stringify(saved));
       
        // Update user data in sessionStorage
        userData.watchlist = saved.filter(m => m.username === userData.username);
        sessionStorage.setItem('loggedInUser', JSON.stringify(userData));
       
        // Refresh profile if we're on profile page
        if (typeof loadModernWatchlist === 'function') {
            loadModernWatchlist(userData);
        }

    } 
function handleWatchlistToggleFromCard($flag) {
    const userDataRaw = sessionStorage.getItem('loggedInUser');
    if (!userDataRaw) {
        alert('Please log in to use your watchlist.');
        return;
    }
    const userData = JSON.parse(userDataRaw);

    // 2) Get movie title, image, rating from the card
    const $card = $flag.closest('.movie-card');
    const movieTitle = $flag.data('title') || $card.data('title') || '';

    if (!movieTitle) {
        console.warn('No movie title found for watch-flag click.');
        return;
    }

    // Image
    let movieImage = '';
    const cardImg = $card.find('img').get(0);
    if (cardImg) {
        movieImage = cardImg.src;  // absolute URL
    } else {
        movieImage = 'imgs/default-movie.jpg';
    }

    // Rating from data-rating on figure
    const movieRating = $card.attr('data-rating') || '0';

    // 3) Load existing watchlist
    let saved = JSON.parse(localStorage.getItem('watchlist')) || [];

    const alreadyAdded = saved.some(
        m => m.title === movieTitle && m.username === userData.username
    );

    if (alreadyAdded) {
        // REMOVE
        saved = saved.filter(
            m => !(m.title === movieTitle && m.username === userData.username)
        );

        $flag.removeClass('in-watchlist');
        $flag.find('.fa-heart')
             .removeClass('fa-solid')
             .addClass('fa-regular');

    } else {
        // ADD
        const newMovie = {
            username: userData.username,
            title: movieTitle,
            image: movieImage,
            rating: movieRating,
            dateAdded: new Date().toISOString()
        };
        saved.push(newMovie);

        $flag.addClass('in-watchlist');
        $flag.find('.fa-heart')
             .removeClass('fa-regular')
             .addClass('fa-solid');
    }

    // 4) Save to storage
    localStorage.setItem('watchlist', JSON.stringify(saved));

    // Update userData in sessionStorage
    userData.watchlist = saved.filter(m => m.username === userData.username);
    sessionStorage.setItem('loggedInUser', JSON.stringify(userData));

    // 5) Notify others (search / header / profile)
    window.dispatchEvent(new CustomEvent('watchlist-updated'));
}
