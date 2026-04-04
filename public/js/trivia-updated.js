$(function() {
    initializeGames();
});

let currentGame = null;
let currentQuestion = 0;
let score = 0;
let playerName = "";
let gameData = {};
let allGames = [];

// Shuffle array function
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Shuffle options for a question
function shuffleQuestionOptions(question) {
    const originalCorrect = question.correct_answer;
    const options = [...question.options];
    const shuffled = shuffleArray(options);
    const newCorrectIndex = shuffled.indexOf(originalCorrect);
    question.options = shuffled;
    question.correct = newCorrectIndex;
    return question;
}

// Initialize games
function initializeGames() {
    let userData = sessionStorage.getItem('loggedInUser');

    if (userData) {
        $('#gamesContainer').show();
        $('#loginRequired').hide();
        loadAllGames();
        loadLeaderboard(); // Load leaderboard on page load
    } else {
        $('#loginRequired').show();
        $('#gamesContainer').hide();
    }
}

// Load all games from backend
function loadAllGames() {
    fetch('/api/games')
        .then(response => response.json())
        .then(data => {
            // Handle pagination response
            allGames = data.data || data;
            console.log('Games loaded:', allGames);
        })
        .catch(error => console.error('Error loading games:', error));
}

// Start Emoji Challenge game
function startGuessGame() {
    currentGame = 'guess';
    startGame();
}

// Start Character Match game
function startCharacterGame() {
    currentGame = 'character';
    startGame();
}

// Start Movie Quotes game
function startQuotesGame() {
    currentGame = 'quotes';
    startGame();
}

// Start Movie Scenes game
function startScenesGame() {
    currentGame = 'scenes';
    startGame();
}

// Generic function to start game by type
function startGameByType(gameType) {
    currentGame = gameType;
    startGame();
}

// Get game ID by type
function getGameIdByType(gameType) {
    if (!allGames || allGames.length === 0) {
        console.error('allGames is empty');
        return null;
    }
    const game = allGames.find(g => g.game_type === gameType || g.title.toLowerCase().includes(gameType));
    console.log(`Looking for game type: ${gameType}, found:`, game);
    return game ? game.game_id : null;
}

// Start game
function startGame() {
    currentQuestion = 0;
    score = 0;

    let userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    playerName = userData.username;

    const gameId = getGameIdByType(currentGame);

    if (!gameId) {
        alert('Game not found');
        return;
    }

    // Fetch questions from backend
    fetch(`/api/games/${gameId}/questions`)
        .then(response => response.json())
        .then(data => {
            let questions = data.questions || data.data || [];
            
            // Parse options if they're JSON strings
            questions = questions.map(q => {
                if (typeof q.options === 'string') {
                    try {
                        q.options = JSON.parse(q.options);
                    } catch (e) {
                        console.error('Error parsing options:', q.options);
                        q.options = [q.options]; // fallback
                    }
                }
                return q;
            });
            
            gameData[currentGame] = shuffleArray([...questions]);

            // Shuffle options for each question
            gameData[currentGame] = gameData[currentGame].map(question => {
                return shuffleQuestionOptions(question);
            });

            showQuestion();
            $('#triviaModal').addClass('active');
        })
        .catch(error => {
            console.error('Error loading questions:', error);
            alert('Error loading game questions');
        });
}

// Show question
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

// Create Emoji Challenge Question
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
            <div class="emoji-clue">${question.emoji || ''}</div>
            <div class="game-question">Which movie is represented by these emojis?</div>
            ${question.hint ? `<div class="hint-text">Hint: ${question.hint}</div>` : ''}
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Create Character Match Question
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
            <div class="game-question">Which movie features the character <strong>"${question.character || ''}"</strong>?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Create Movie Quotes Question
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
            <div class="quote-text">"${question.quote || ''}"</div>
            <div class="game-question">Which movie is this from?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Create Movie Scenes Question
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
            <div class="scene-text">${question.scene || ''}</div>
            <div class="game-question">Which movie features this scene?</div>
            <div class="options-grid">
                ${question.options.map((option, index) => 
                    `<button class="option-btn" onclick="checkAnswer(${index})">${option}</button>`
                ).join('')}
            </div>
        </div>
    `;
}

// Check answer
function checkAnswer(selectedIndex) {
    let questions = gameData[currentGame];
    let question = questions[currentQuestion];
    let $options = $('.option-btn');

    $options.prop('disabled', true);

    if (selectedIndex === question.correct) {
        score += 10;
        $($options[selectedIndex]).addClass('correct');
        showToast('Correct!', 'success');
    } else {
        $($options[selectedIndex]).addClass('incorrect');
        $($options[question.correct]).addClass('correct');
        showToast('Incorrect!', 'error');
    }

    setTimeout(() => {
        currentQuestion++;
        showQuestion();
    }, 1000);
}

// End game
function endGame() {
    let totalQuestions = gameData[currentGame].length;
    let percentage = (score / (totalQuestions * 10)) * 100;

    let message = '';
    if (percentage >= 80) {
        message = 'Outstanding! You\'re a true movie buff!';
    } else if (percentage >= 60) {
        message = 'Great job! You know your movies!';
    } else if (percentage >= 40) {
        message = 'Not bad! Keep studying those movies!';
    } else {
        message = 'Better luck next time!';
    }

    let resultsHTML = `
        <div class="results-screen">
            <h2 class="game-title">Game Complete!</h2>
            <div class="final-score">${score} Points</div>
            <div class="results-message">${message}</div>
            <p>You got ${Math.round(score / 10)} out of ${totalQuestions} questions correct!</p>
            <div class="results-buttons">
                <button class="play-btn" onclick="startGame()">Play Again</button>
                <button class="play-btn" onclick="closeGame()">Try Another Game</button>
                <button class="play-btn" onclick="goToMovies()">Browse Movies</button>
            </div>
        </div>
    `;

    $('#game-content').html(resultsHTML);

    // Save to backend
    saveGameRound(score);
}

// Close game
function closeGame() {
    $('#triviaModal').removeClass('active');
    loadLeaderboard();
}

// Go to movies
function goToMovies() {
    window.location.href = "../../index.html";
}

// Save game round to backend
function saveGameRound(score) {
    const gameId = getGameIdByType(currentGame);
    const userData = JSON.parse(sessionStorage.getItem('loggedInUser'));
    const userId = userData.user_id || userData.id;

    console.log('Saving game round with score:', score, 'gameId:', gameId, 'userId:', userId);

    fetch('/api/game-rounds', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
        },
        body: JSON.stringify({
            game_id: gameId,
            user_id: userId,
            score: parseInt(score) // Ensure score is an integer
        })
    })
    .then(response => {
        console.log('Save response status:', response.status);
        return response.json();
    })
    .then(data => {
        console.log('Game round saved:', data);
        showToast('Score saved! (' + score + ' pts)', 'success');
        // Wait a moment then refresh leaderboard
        setTimeout(() => {
            loadLeaderboard();
        }, 500);
    })
    .catch(error => {
        console.error('Error saving game round:', error);
        showToast('Could not save score', 'error');
    });
}

// Load leaderboard from backend
function loadLeaderboard() {
    fetch('/api/game-rounds/leaderboard')
        .then(response => {
            console.log('Leaderboard response status:', response.status);
            return response.json();
        })
        .then(leaderboard => {
            console.log('Leaderboard data:', leaderboard);
            let leaderboardHTML = leaderboard.map((entry, index) => {
                return `
                    <div class="leaderboard-item">
                        <span class="rank">#${entry.rank}</span>
                        <span class="player">${entry.player_name}</span>
                        <span class="score">${entry.score} pts</span>
                    </div>
                `;
            }).join('');

            $('#leaderboard').html(leaderboardHTML || '<p>No scores yet. Be the first to play!</p>');
        })
        .catch(error => {
            console.error('Error loading leaderboard:', error);
            $('#leaderboard').html('<p>Error loading leaderboard</p>');
        });
}

// Show toast notification
function showToast(message, type) {
    $('.toast').remove();
    
    const toastHTML = `
        <div class="toast toast-${type}">
            ${message}
        </div>
    `;

    $('body').append(toastHTML);

    const $toast = $('.toast').last();
    $toast.fadeIn(300);

    setTimeout(() => {
        $toast.fadeOut(300, function() {
            $(this).remove();
        });
    }, 2000);
}
