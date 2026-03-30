
$(function() {
    initializeGames();
});

let currentGame = null;
let currentQuestion = 0;
let score = 0;
let playerName = "";

// Add this shuffle function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

let gameData = {
    guess: [
        {
            emoji: "👸🎀💖",
            options: ["Barbie", "White Chicks", "The Princess and the Frog", "Frozen"],
            correct: 0,
            hint: "Life in this land is perfect until an existential crisis"
        },
        {
            emoji: "🚀🌌⏰",
            options: ["The Martian", "Avatar", "Interstellar", "Gravity"],
            correct: 2,
            hint: "Explorers travel through a wormhole to save humanity"
        },
        {
            emoji: "🤡🎈😱",
            options: ["IT", "The Conjuring 2", "Truth or Dare", "Split"],
            correct: 0,
            hint: "Ancient evil that emerges every 27 years"
        },
        {
            emoji: "👯‍♀️👸🏼🕵️‍♀️",
            options: ["Barbie", "White Chicks", "Mean Girls", "Split"],
            correct: 1,
            hint: "FBI agents undercover as heiresses"
        },
        {
            emoji: "🦖🌴⚡",
            options: ["The Forest", "Avatar", "Predator: Badlands", "Jurassic World Rebirth"],
            correct: 3,
            hint: "Next chapter in the dinosaur saga"
        },
        {
            emoji: "🦸‍♂️🔴🔵",
            options: ["SuperMan", "Avengers", "Batman", "Iron Man"],
            correct: 0,
            hint: "DC universe with epic action and heart"
        },
        {
            emoji: "👺🦊🔓",
            options: ["Split", "Bad Guys", "Truth or Dare", "The Running Man"],
            correct: 1,
            hint: "Reformed animal outlaws on a globe-trotting heist"
        },
        {
            emoji: "🔢⏰💀",
            options: ["Countdown", "Split", "Truth or Dare", "The Conjuring 2"],
            correct: 0,
            hint: "Mysterious app that counts down to users' deaths"
        }
    ],
    
    character: [
        {
            character: "Pennywise",
            options: ["IT", "The Conjuring 2", "Black Phone2", "Truth or Dare"],
            correct: 0
        },
        {
            character: "Cooper",
            options: ["The Martian", "Avatar", "Interstellar", "Gravity"],
            correct: 2
        },
        {
            character: "Kevin Wendell Crumb",
            options: ["Split", "IT", "Black Phone2", "The Conjuring 2"],
            correct: 0
        },
        {
            character: "Marcus Copeland",
            options: ["Bad Guys","White Chicks", "Split", "Barbie"],
            correct: 1
        },
        {
            character: "Mr. Wolf",
            options: ["Predator: Badlands", "White Chicks", "The Running Man", "Bad Guys"],
            correct: 3
        },
        {
            character: "Barbie",
            options: ["Barbie", "White Chicks", "Mean Girls", "The Princess Diaries"],
            correct: 0
        },
        {
            character: "The Grabber",
            options: ["IT", "Black Phone2", "The Conjuring 2", "Truth or Dare"],
            correct: 1
        },
        {
            character: "Jake Sully",
            options: ["Interstellar", "Avatar", "The Martian", "Predator: Badlands"],
            correct: 0
        }
    ],
    
    quotes: [
        {
            quote: "Life in Barbie Land is to be a perfect being in a perfect place. Unless you have a full-on existential crisis.",
            options: ["The Princess Diaries", "White Chicks", "Mean Girls", "Barbie"],
            correct: 3
        },
        {
            quote: "We used to look up at the sky and wonder at our place in the stars.",
            options: ["Interstellar", "Avatar", "The Martian", "Gravity"],
            correct: 0
        },
        {
            quote: "The broken are the more evolved.",
            options: ["Black Phone2", "IT", "Split", "The Conjuring 2"],
            correct: 2
        },
        {
            quote: "A simple game of truth or dare turns deadly for a group of friends.",
            options: [ "Countdown","Split","Truth or Dare", "The Forest"],
            correct: 2
        },
        {
            quote: "The now reformed Bad Guys get dragged into a globe-trotting heist.",
            options: ["Bad Guys", "White Chicks", "The Running Man", "Predator: Badlands"],
            correct: 0
        },
        {
            quote: "A mysterious app counts down to its users' deaths.",
            options: ["Black Phone2", "Split", "Truth or Dare", "Countdown"],
            correct: 3
        },
        {
            quote: "A young Predator outcast from his clan finds an unlikely ally.",
            options: ["Predator: Badlands", "Avatar", "Interstellar", "The Running Man"],
            correct: 0
        },
        {
            quote: "Ed and Lorraine Warren investigate a terrifying haunting in north London.",
            options: ["IT", "The Conjuring 2", "Black Phone2", "Truth or Dare"],
            correct: 1
        }
    ],
    
    scenes: [
        {
            scene: "A group of kids in a small town face their fears when an ancient evil clown returns to feed on their terror every 27 years.",
            options: ["Truth or Dare", "The Conjuring 2", "IT", "The Forest"],
            correct: 2
        },
        {
            scene: "Two FBI agents go undercover as wealthy white heiresses, leading to hilarious misunderstandings and cultural clashes.",
            options: ["Bad Guys", "White Chicks", "Barbie", "Split"],
            correct: 1
        },
        {
            scene: "A team of explorers travel through a wormhole in search of a new habitable planet to save humanity from extinction.",
            options: ["Interstellar", "Avatar", "The Martian", "Gravity"],
            correct: 0
        },
        {
            scene: "A perfect doll living in a perfect world suddenly starts having thoughts about death and the meaning of existence.",
            options: ["The Princess Diaries", "White Chicks", "Mean Girls", "Barbie"],
            correct: 3
        },
        {
            scene: "A man with 24 distinct personalities kidnaps three teenage girls, each personality having its own agenda and abilities.",
            options: ["IT", "Split", "Black Phone2", "The Conjuring 2"],
            correct: 1
        },
        {
            scene: "Reformed animal criminals are forced back into their old ways when they're framed for a crime they didn't commit.",
            options: ["Predator: Badlands", "White Chicks", "The Running Man", "Bad Guys"],
            correct: 3
        },
        {
            scene: "A marine becomes emotionally connected to the alien world of Pandora and must choose between orders and protecting his new home.",
            options: ["Avatar", "Interstellar", "The Martian", "Predator: Badlands"],
            correct: 0
        },
        {
            scene: "A deadly competition where contestants must survive being hunted on live television for a chance at freedom and riches.",
            options: ["Split", "Countdown", "Truth or Dare", "The Running Man"],
            correct: 3
        }
    ]
};

function initializeGames() {
    // Check login 
    let userData = sessionStorage.getItem('loggedInUser');
    if (!userData && window.authUser) {
        userData = JSON.stringify(window.authUser);
    }

    if (userData) {
        // User is logged in - show games
        $('#gamesContainer').show();
        $('#loginRequired').hide();
        loadLeaderboard();
    } else {
        // User is not logged in - show login message 
        $('#gamesContainer').hide();
        $('#loginRequired').show();
    }
}
//guess game
function startGuessGame() {
    currentGame = 'guess';
    startGame();
}
//character game
function startCharacterGame() {
   currentGame = 'character';
    startGame();
}
//quotes game
function startQuotesGame() {
   currentGame = 'quotes';
    startGame();
}
//scenes game
function startScenesGame() {
    currentGame = 'scenes';
    startGame();
}



function startGame() {
    currentQuestion = 0;
    score = 0;
    
    // Get player name
    let userData = window.authUser || JSON.parse(sessionStorage.getItem('loggedInUser'));
    playerName = userData.username;
    // Shuffle questions for this game
    gameData[currentGame] = shuffleArray([...gameData[currentGame]]);
    
    // Also shuffle options for each question
    gameData[currentGame] = gameData[currentGame].map(question => {
        let options = [...question.options];
        let correctAnswer = options[question.correct];
        
        // Shuffle options
        options = shuffleArray(options);
        
        // Find new correct index
        let newCorrect = options.indexOf(correctAnswer);
        
        return {
            ...question,
            options: options,
            correct: newCorrect
        };
    });
    
    
    showQuestion();
    $('#triviaModal').addClass('active');
}

function showQuestion() {
    let questions = gameData[currentGame];
    if (currentQuestion >= questions.length) {
        endGame();
        return;
    }
    let question = questions[currentQuestion];
    let gameContent = '';
    switch(currentGame) {
        case 'guess':
            gameContent = createGuessQuestion(question);
            break;
        case 'character':
            gameContent = createCharacterQuestion(question);
            break;
        case 'quotes':
            gameContent = createQuotesQuestion(question);
            break;
        case 'scenes':
            gameContent = createScenesQuestion(question);
            break;
    }
    
    $('#game-content').html(gameContent);
}

function createGuessQuestion(question) {
    return `
        <div class="game-screen">
            <h2 class="game-title">Emoji Challenge</h2>
            <div class="game-stats">
                <span>Score: <span class="score-display">${score}</span></span>
                <span>Question: ${currentQuestion + 1}/${gameData[currentGame].length}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / gameData[currentGame].length) * 100}%"></div>
            </div>
            <div class="emoji-clue">${question.emoji}</div>
            <div class="game-question">Which ReelTime movie is represented by these emojis?</div>
            ${question.hint ? `<div class="hint-text"> Hint: ${question.hint}</div>` : ''}
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createCharacterQuestion(question) {
    return `
        <div class="game-screen">
            <h2 class="game-title">Character Match</h2>
            <div class="game-stats">
                <span>Score: <span class="score-display">${score}</span></span>
                <span>Question: ${currentQuestion + 1}/${gameData[currentGame].length}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / gameData[currentGame].length) * 100}%"></div>
            </div>
            <div class="game-question">Which ReelTime movie features the character <strong>"${question.character}"</strong>?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createQuotesQuestion(question) {
    return `
        <div class="game-screen">
            <h2 class="game-title">Movie Quotes</h2>
            <div class="game-stats">
                <span>Score: <span class="score-display">${score}</span></span>
                <span>Question: ${currentQuestion + 1}/${gameData[currentGame].length}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / gameData[currentGame].length) * 100}%"></div>
            </div>
            <div class="quote-text">"${question.quote}"</div>
            <div class="game-question">Which ReelTime movie is this from?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

function createScenesQuestion(question) {
    return `
        <div class="game-screen">
            <h2 class="game-title">Movie Scenes</h2>
            <div class="game-stats">
                <span>Score: <span class="score-display">${score}</span></span>
                <span>Question: ${currentQuestion + 1}/${gameData[currentGame].length}</span>
            </div>
            <div class="progress-bar">
                <div class="progress-fill" style="width: ${((currentQuestion + 1) / gameData[currentGame].length) * 100}%"></div>
            </div>
            <div class="scene-text">${question.scene}</div>
            <div class="game-question">Which ReelTime movie features this scene?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

function checkAnswer(selectedIndex) {
    let questions = gameData[currentGame];
    let question = questions[currentQuestion];
    let $options = $('.option-btn');
    
    // Disable all buttons
    $options.prop('disabled', true);
    
    // Show correct/incorrect
    if (selectedIndex === question.correct) {
        $options.eq(selectedIndex).addClass('correct');
        score += 10;
        showToast('Correct! +10 points', 'success');
    } else {
        $options.eq(selectedIndex).addClass('incorrect');
        $options.eq(question.correct).addClass('correct');
        showToast('Wrong answer!', 'error');
    }
    
    // Move to next question after delay
    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}

function endGame() {
    let totalQuestions = gameData[currentGame].length;
    let percentage = (score / (totalQuestions * 10)) * 100;
    
    let message = '';
    if (percentage >= 80) message = " Movie Master! You're a ReelTime expert!";
    else if (percentage >= 60) message = " Great job! You know your ReelTime movies!";
    else if (percentage >= 40) message = " Good effort! Time to watch more movies!";
    else message = " Keep exploring ReelTime movies!";
    
    let resultsHTML = `
        <div class="results-screen">
            <h2 class="game-title">Game Complete!</h2>
            <div class="final-score">${score} Points</div>
            <div class="results-message">${message}</div>
            <p>You got ${score/10} out of ${totalQuestions} questions correct!</p>
            <div class="results-buttons">
                <button class="play-btn" onclick="startGame()">Play Again</button>
                <button class="play-btn" onclick="closeGame()">Try Another Game</button>
                <button class="play-btn" onclick="goToMovies()">Browse Movies</button>
            </div>
            
        </div>
    `;
    
    $('#game-content').html(resultsHTML);
    
    // Save to leaderboard
    saveToLeaderboard(score);
}

function closeGame() {
    $('#triviaModal').removeClass('active');
    loadLeaderboard();
}

function goToMovies() {
    window.location.href = window.routes?.home || "/";
}

function saveToLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('movieGamesLeaderboard')) || [];
    
    // Check if player already exists (any game)
    let existingPlayerIndex = leaderboard.findIndex(entry => entry.name === playerName);
    
    if (existingPlayerIndex !== -1) {
        // Player exists - update their total score
        leaderboard[existingPlayerIndex].totalScore = (leaderboard[existingPlayerIndex].totalScore || 0) + score;
        
        // Store individual game scores
        if (!leaderboard[existingPlayerIndex].games) {
            leaderboard[existingPlayerIndex].games = {};
        }
        
        // Add or update the game score (keep highest score for each game)
        if (!leaderboard[existingPlayerIndex].games[currentGame] || 
            score > leaderboard[existingPlayerIndex].games[currentGame]) {
            leaderboard[existingPlayerIndex].games[currentGame] = score;
        }
        
        leaderboard[existingPlayerIndex].lastPlayed = new Date().toISOString();
    } else {
        // New player
        leaderboard.push({
            name: playerName,
            totalScore: score,
            games: {
                [currentGame]: score
            },
            lastPlayed: new Date().toISOString()
        });
    }
    
    // Sort by totalScore (descending) and keep top 10
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    leaderboard = leaderboard.slice(0, 10);
    
    localStorage.setItem('movieGamesLeaderboard', JSON.stringify(leaderboard));
}

function loadLeaderboard() {
    let leaderboard = JSON.parse(localStorage.getItem('movieGamesLeaderboard')) || [];
    
    // Sort by totalScore (descending)
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);
    
    let leaderboardHTML = leaderboard.map((entry, index) => {
        // Create game badges string
        let gamesBadges = '';
        
        
        return `
            <div class="leaderboard-item">
                <span class="leaderboard-rank">#${index + 1}</span>
                <span class="leaderboard-name">${entry.name}</span>
                <span class="leaderboard-score">${entry.totalScore} pts</span>
                <div class="leaderboard-games">${gamesBadges}</div>
            </div>
        `;
    }).join('');
    
    $('#leaderboard').html(leaderboardHTML || '<p>No scores yet. Be the first to play!</p>');
}

function showToast(message, type) {
  
    $('.toast').remove();
    
    
    let $toast = $('<div>').addClass(`toast toast-${type}`).text(message).css({
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        background: type === 'success' ? '#4CAF50' : '#f44336',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        maxWidth: '300px'
    });
    
    $('body').append($toast);
    
    
    setTimeout(() => {
        $toast.css('transform', 'translateX(0)');
    }, 10);
    
    // Remove toast after delay
    setTimeout(() => {
        $toast.css('transform', 'translateX(100%)');
        setTimeout(() => {
            $toast.remove();
        }, 300);
    }, 3000);
}
