const wordList = [
    "house", "apple", "bread", "earth", "beach",
    "radio", "river", "tiger", "green", "clock",
    "train", "shirt", "storm", "flame", "plane",
    "money", "dance", "music", "photo", "phone",
    "creed", "trial", "drink", "booze", "crime", "legal"
]; // Avaliable Word List

const wordleState = { // Keeps track of board
    word: wordList[Math.floor(Math.random() * wordList.length)], 
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')), // Creates a 6x5 grid that can be typed in
    currentRow: 0,
    currentCol: 0,
};

//initialize game board
wordleState.grid[0][0] = "_";
updateBoardState();

function resetGame(state, wordList) {
    state.word = wordList[Math.floor(Math.random() * wordList.length)];//new word
    state.grid = Array(6).fill().map(() => Array(5).fill('')); //new empty game board
    state.currentRow = -1;
    state.currentCol = 0;

    //reset the boxes to empty
    for (let x = 0; x < wordleState.grid.length; x ++) {
        for (let y = 0; y < wordleState.grid[x].length; y++) {
            const box = document.getElementById(`box${x}${y}`);
            box.className = "grid-item"
        }
    }
    wordleState.grid[0][0] = '_';
}

function updateBoardState() { // Function displays changes to the board
    for (let x = 0; x < wordleState.grid.length; x ++) {
        for (let y = 0; y < wordleState.grid[x].length; y++) {
            const box = document.getElementById(`box${x}${y}`);
            box.textContent = wordleState.grid[x][y];
        }
    }
}

function getCurrentWord() {
    return wordleState.grid[wordleState.currentRow].reduce((previous, current) => previous + current); // combine letters in column to 1 word
}

function getNumberOfOccurrencesInWord(word, letter) {
    let counter = 0;
    for (let x = 0; x < word.length; x++) { // checks how many times current letter in column appears in word
        if (word[x] === letter) {
            counter++;
        }
    }
    return counter;
}
  
function getPositionOfOccurrence(word, letter, position) {
    let index = 0;
    for (let x = 0; x <= position; x++) { // checks where the letter is in the word
        if (word[x] === letter) {
            index++;
        }
    }
    return index; // position of the word
}
  

function checkWord(guess) {
    const row = wordleState.currentRow;
  
    for (let x = 0; x < 5; x++) { // Checks each letter in the word
        const currentBox = document.getElementById(`box${row}${x}`);
        const letter = currentBox.textContent;
        const numberOfOccurrencesSecret = getNumberOfOccurrencesInWord(wordleState.word, letter);
        const numberOfOccurrencesGuess = getNumberOfOccurrencesInWord(guess, letter);
        const letterPosition = getPositionOfOccurrence(guess, letter, x);
        const correctWord = wordleState.word[x];
  
        if (numberOfOccurrencesGuess > numberOfOccurrencesSecret && letterPosition > numberOfOccurrencesSecret) {
            currentBox.classList.add('empty');
        } else {
            if (letter === correctWord) {
                currentBox.classList.add('right');
            } else if (wordleState.word.includes(letter)) {
                currentBox.classList.add('wrong');
            } else {
                currentBox.classList.add('empty');
            }
        }
    }
  
    const winner = wordleState.word === guess;
    const gameOver = wordleState.currentRow === 5;
  
    if (winner) {
        alert('Congratulations!');
        resetGame(wordleState, wordList);
        updateBoardState();

    } else if (gameOver) {
        alert(`The word was ${wordleState.word}.`);
        resetGame(wordleState, wordList);
        updateBoardState();
    }
  }

  document.addEventListener('keydown', function(event) {
    let input = event.key;

    // If no row is active, initialize the first row with an underscore
    if (wordleState.currentRow === -1) {
        wordleState.currentRow = 0;
        wordleState.grid[wordleState.currentRow][0] = '_';
        wordleState.currentCol = 0;
        updateBoardState();
        return;
    }

    // Handle letter input
    if (input.length === 1 && input.match(/[a-z]/i)) {
        if (wordleState.currentCol === 5) return; // If we are at the end of the row, do nothing

        // Place the letter and move the underscore
        wordleState.grid[wordleState.currentRow][wordleState.currentCol] = input.toLowerCase();
        if (wordleState.currentCol < 4) {
            wordleState.currentCol++;
            wordleState.grid[wordleState.currentRow][wordleState.currentCol] = '_';
        } else {
            wordleState.currentCol++;
        }
        updateBoardState();

    // Handle Backspace input
    } else if (input == 'Backspace') {
        if (wordleState.currentCol === 0) return; // If we are at the start of the row, do nothing

        // Remove the letter and move the underscore back
        if (wordleState.grid[wordleState.currentRow][wordleState.currentCol] === '_') {
            wordleState.grid[wordleState.currentRow][wordleState.currentCol] = '';
            wordleState.currentCol--;
        } else {
            wordleState.currentCol--; // Bug fix so backspace with full letter column would have underscore after one button press
        }
        wordleState.grid[wordleState.currentRow][wordleState.currentCol] = '_';
        updateBoardState();

    // Handle Enter input
    } else if (input == 'Enter') {
        if (wordleState.currentCol === 5) {
            if (getCurrentWord() === wordleState.word) {
                checkWord(getCurrentWord());
            } else {
                checkWord(getCurrentWord());
            }
            wordleState.currentRow++;
            wordleState.currentCol = 0;
            if (wordleState.currentRow < 6) {
                wordleState.grid[wordleState.currentRow][0] = '_'; // Initialize the new row with an underscore
            }
            updateBoardState();
        } else if (wordleState.currentCol < 5) {
            alert("Guess 5 letters before entering!");
        }
    }
});