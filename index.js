const wordList = ['creed', 'trial', 'drink', 'booze', 'crime', 'legal']; // Avaliable Word List

const wordleState = { // Keeps track of board
    word: wordList[Math.floor(Math.random() * wordList.length)],
    grid: Array(6)
        .fill()
        .map(() => Array(5).fill('')), // Creates a 6x5 grid that can be typed in
    currentRow: 0,
    currentCol: 0,
};

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
    } else if (gameOver) {
        alert(`The word was ${wordleState.word}.`);
    }
  }

document.addEventListener('keydown', function(event) { // Event handler for keyboard
    let input = event.key;
    if (input.length === 1 && input.match(/[a-z]/i)) { // If the keyboard input is a letter, display it
        if (wordleState.currentCol === 5) return;
        wordleState.grid[wordleState.currentRow][wordleState.currentCol] = input;
        wordleState.currentCol++;

        updateBoardState();

    } else if (input == 'Backspace') { // If the keyboard input is a backspace, remove letter
        if (wordleState.currentCol === 0) return;
        wordleState.grid[wordleState.currentRow][wordleState.currentCol - 1] = '';
        wordleState.currentCol--;

        updateBoardState();

    } else if (input == 'Enter') {
        if (wordleState.currentCol === 5) {
            if (getCurrentWord() === wordleState.word) {
                checkWord(getCurrentWord());
            } else {
                checkWord(getCurrentWord());
                alert("loser");
            }
        }
        wordleState.currentRow++;
        wordleState.currentCol = 0;
    }
});