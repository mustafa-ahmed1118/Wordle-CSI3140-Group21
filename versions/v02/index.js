//Game Functions
function startGame(result) {
    console.log("test: " + result);
    fetch('http://localhost:3000/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body:  `action=start_game&result=${result}`
    })
    .then(response => response.json())
    .then(data => {
        updateBoard(data.grid);

        //Used for tracking data in console
        console.log(data.word);
        console.log(data.streak);

        // Add items to list
        const trackerList = document.getElementById('tracker-list');
        trackerList.innerHTML = ''
        data.streakValues.forEach(value => {
            const listItem = document.createElement('li');
            listItem.textContent = value;
            trackerList.appendChild(listItem);
        });

        // Used to update streak counter
        const streakCounter = document.getElementById(`streak-counter`);
        streakCounter.textContent = "Streaks: " + data.streak;
    })
    .catch(error => console.error('Error starting game:', error));
}

function getCurrentWord() {
    const currentRow = document.querySelector('.grid-item:not(.right):not(.wrong):not(.empty)').id.charAt(3);
    let currentWord = '';
    for (let col = 0; col < 5; col++) {
        const letter = document.getElementById(`box${currentRow}${col}`).textContent;
        currentWord += letter;
    }
    return currentWord;
}

function typeLetter(letter) {
    fetch('http://localhost:3000/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=type_letter&letter=${letter}`
    })
    .then(response => response.json())
    .then(data => {
        updateBoard(data.grid);
    })
    .catch(error => console.error('Error typing letter:', error));
}

function handleBackspace() {
    fetch('http://localhost:3000/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=backspace'
    })
    .then(response => response.json())
    .then(data => {
        updateBoard(data.grid);
    })
    .catch(error => console.error('Error handling backspace:', error));
}

function submitGuess(guess) {
    fetch('http://localhost:3000/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `action=submit_guess&guess=${guess}`
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error(data.error);
        } else {
            if (data.result === 'win') {
                alert('Congratulations! You guessed the word!');
                startGame(true);
            } else if (data.result === 'lose') {
                alert(`Game over! The word was ${data.word}`);
                startGame(false);
            }
            updateBoard(data.grid);
        }
    })
    .catch(error => console.error('Error submitting guess:', error));
}

function updateBoard(grid) {
    fetch('http://localhost:3000/server.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: 'action=get_game_state'
    })
    .then(response => response.json())
    .then(data => {
        const word = data.word; // Get the correct word from the server
        for (let x = 0; x < grid.length; x++) {
            for (let y = 0; y < grid[x].length; y++) {
                const box = document.getElementById(`box${x}${y}`);
                box.textContent = grid[x][y].letter;
                box.className = "grid-item";
                if (grid[x][y].state === 'empty') {
                    box.classList.add('empty');
                } else if (grid[x][y].state === 'right') {
                    box.classList.add('right');
                } else if (grid[x][y].state === 'wrong') {
                    box.classList.add('wrong');
                }
            }
        }
    })
    .catch(error => console.error('Error fetching game state:', error));
}


//EVENT LISTENSERS
document.addEventListener('DOMContentLoaded', () => {
    startGame(false);
});

document.addEventListener('keydown', function(event) {
    const input = event.key;
    if (input.length === 1 && input.match(/[a-z]/i)) {
        typeLetter(input.toLowerCase());
    } else if (input === 'Enter') {
        const currentWord = getCurrentWord();
        if (currentWord.length === 5) {
            submitGuess(currentWord);
        } else {
            alert('Guess must be 5 letters long.');
        }
    } else if (input === 'Backspace') {
        handleBackspace();
    }
});