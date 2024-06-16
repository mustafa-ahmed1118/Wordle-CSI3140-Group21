const wordleState = { // Keeps track of board
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
        wordleState.currentRow++;
        wordleState.currentCol = 0;
    }
});