// ENUMS
const diffOptions = Object.freeze({
                                      HUMAN: 'Human',
                                      EASY: 'AI - Easy',
                                      MEDIUM: 'AI - Medium',
                                      HARD: 'AI - Hard'
                                  });

// Constants
const indexAttr = 'data-index';

// FACTORIES
const GameBoard = () => {
    let board = Array.from(Array(9).fill(undefined));

    function addTile(index, value) {
        board[index] = value;
    }

    function emptyBoard() {
        board.fill(undefined);
    }

    function boardLength() {
        return board.length;
    }

    // View the Board on Console
    function printBoard() {
        let boardPrinted = '';

        for (let i = 0; i < boardLength(); i++) {
            if (i % 3 === 0) boardPrinted += '\n';
            boardPrinted += `| ${board[i] === undefined ? '-' : board[i]} | `;
        }
        console.log(boardPrinted);
    }

    return {addTile, emptyBoard, boardLength, printBoard};
};

// MODULES
const DETAILS = (() => {
    const inputOne = document.getElementById('inputOne');
    const inputTwo = document.getElementById('inputTwo');
    const diffOne = document.getElementById('diffOne');
    const diffTwo = document.getElementById('diffTwo');
    const sbOne = document.getElementById('sbOne');
    const sbTwo = document.getElementById('sbTwo');
    const btnGame = document.getElementById('btnGame');

    let plyrOneName = "";
    let plyrTwoName = "";
    let diffOneCtr = 0; // Default = Human
    let diffTwoCtr = 1; // Default = AI - Easy

    function updateDiffOne() {
        diffOne.textContent = Object.values(diffOptions)[diffOneCtr];
        if (++diffOneCtr > 3) diffOneCtr = 0;
    }

    function updateDiffTwo() {
        diffTwo.textContent = Object.values(diffOptions)[diffTwoCtr];
        if (++diffTwoCtr > 3) diffTwoCtr = 0;
    }

    inputOne.addEventListener('blur', () => {
        plyrOneName = inputOne.value !== '' ? inputOne.value : "Player One";
        sbOne.textContent = inputOne.value !== '' ? inputOne.value : "Player One";
    });
    inputTwo.addEventListener('blur', () => {
        plyrTwoName = inputTwo.value !== '' ? inputTwo.value : "Player Two";
        sbTwo.textContent = inputTwo.value !== '' ? inputTwo.value : "Player Two";
    });
    diffOne.addEventListener('click', updateDiffOne);
    diffTwo.addEventListener('click', updateDiffTwo);
    btnGame.addEventListener('click', () => {
        btnGame.textContent = "Restart";

        // Start Game Function from Game Ctrl Module
        GAMECTRL.StartNewGame();
    });

    // Webpage Init Listener
    document.addEventListener('DOMContentLoaded', () => {
        updateDiffOne();
        updateDiffTwo();
    });

    return {plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr};
})();

const GAMECTRL = (() => {
    const gameBoardView = document.getElementById('gameBoardView');

    const activeBoard = GameBoard();

    function resetExistingBoard() {
        activeBoard.emptyBoard();
        gameBoardView.innerHTML = "";
    }

    function displayBoardView() {
        for (let i = 0; i < activeBoard.boardLength(); i++) {
            const boardTile = document.createElement('div');

            boardTile.classList.add('tile');
            boardTile.setAttribute(indexAttr, i.toString());
            boardTile.addEventListener('click', (evt) => {
                turnClick(evt.target);
            });

            gameBoardView.appendChild(boardTile);
        }
    }

    function StartNewGame() {
        resetExistingBoard();

        displayBoardView();
    }

    // Tile is Clicked Event
    function turnClick(target) {
        let clickedIndex = target.getAttribute(indexAttr);
        activeBoard.addTile(clickedIndex, "X");
        target.textContent = "X";
        activeBoard.printBoard();
    }

    return {StartNewGame};
})();

