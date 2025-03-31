const cells = document.querySelectorAll('.cell');
const status = document.getElementById('status');
const resetBtn = document.getElementById('resetBtn');
const modeSelector = document.getElementById('modeSelector');

let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;
let vsComputer = false;

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

function handleCellClick(e) {
    if (!gameActive || (vsComputer && currentPlayer === 'O')) return;

    const cell = e.target;
    const cellIndex = parseInt(cell.getAttribute('data-index'));

    if (gameBoard[cellIndex] !== '') return;

    makeMove(cellIndex);

    if (vsComputer && gameActive) {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    gameBoard[index] = currentPlayer;
    cells[index].textContent = currentPlayer;
    cells[index].classList.add(currentPlayer.toLowerCase());

    if (checkWin()) {
        status.textContent = `Player ${currentPlayer} wins!`;
        gameActive = false;
        highlightWinningCombination();
        return;
    }

    if (checkDraw()) {
        status.textContent = "Game ended in a draw!";
        gameActive = false;
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    status.textContent = vsComputer && currentPlayer === 'O' 
        ? "Computer's turn" 
        : `Player ${currentPlayer}'s turn`;
}

function computerMove() {
    if (!gameActive) return;

    const emptyCells = gameBoard
        .map((cell, index) => cell === '' ? index : null)
        .filter(cell => cell !== null);

    const randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
    
    if (randomIndex !== undefined) {
        makeMove(randomIndex);
    }
}

function checkWin() {
    return winningCombinations.some(combination => {
        return combination.every(index => gameBoard[index] === currentPlayer);
    });
}

function checkDraw() {
    return gameBoard.every(cell => cell !== '');
}

function highlightWinningCombination() {
    winningCombinations.forEach(combination => {
        if (combination.every(index => gameBoard[index] === currentPlayer)) {
            combination.forEach(index => {
                cells[index].classList.add('winning-cell');
            });
        }
    });
}

function resetGame() {
    currentPlayer = 'X';
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    vsComputer = modeSelector.value === 'computer';
    status.textContent = vsComputer 
        ? "Player X's turn" 
        : `Player ${currentPlayer}'s turn`;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winning-cell');
    });
}

cells.forEach(cell => {
    cell.addEventListener('click', handleCellClick);
});

resetBtn.addEventListener('click', resetGame);
modeSelector.addEventListener('change', resetGame);
