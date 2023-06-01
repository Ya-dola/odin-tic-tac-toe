// ENUMS
const DIFFOPTS = Object.freeze({
                                   HUMAN: 'Human',
                                   EASY: 'AI - Easy',
                                   MEDIUM: 'AI - Medium',
                                   HARD: 'AI - Hard'
                               });

const SYMBOLX = 'X';
const SYMBOLO = 'O';

const getDiffVal = (index) => Object.values(DIFFOPTS)[index];

// FACTORIES
const Player = (symbol) => {
    let name = '';
    let type = DIFFOPTS.HUMAN;

    const setName = (newName) => name = newName;
    const getName = () => name;
    const getSymbol = () => symbol;
    const setType = (newType) => type = newType;
    const getType = () => type;

    return {setName, getName, getSymbol, setType, getType};
};

// MODULES
const GameBoard = (() => {
    let board = Array.from(Array(9).fill(undefined));

    const getBoard = () => board;
    const addTile = (index, value) => board[index] = value;
    const emptyBoard = () => board.fill(undefined);
    const boardLength = () => board.length;

    // View the Board on Console
    function printBoard() {
        let boardPrinted = '';

        for (let i = 0; i < boardLength(); i++) {
            if (i % 3 === 0) boardPrinted += '\n';
            boardPrinted += `| ${board[i] === undefined ? '-' : board[i]} | `;
        }
        console.log(boardPrinted);
    }

    return {getBoard, addTile, emptyBoard, boardLength, printBoard};
})();

const Details = (() => {
    const inputOne = document.getElementById('inputOne');
    const inputTwo = document.getElementById('inputTwo');
    const diffOne = document.getElementById('diffOne');
    const diffTwo = document.getElementById('diffTwo');
    const sbOne = document.getElementById('sbOne');
    const sbTwo = document.getElementById('sbTwo');
    const btnGame = document.getElementById('btnGame');

    let plyrOneName = "Player One";
    let plyrTwoName = "Player Two";
    let diffOneCtr = -1; // Default = Human
    let diffTwoCtr = 0; // Default = AI - Easy

    function updateDiffOne() {
        if (++diffOneCtr > 3) diffOneCtr = 0;
        diffOne.textContent = getDiffVal(diffOneCtr);
    }

    function updateDiffTwo() {
        if (++diffTwoCtr > 3) diffTwoCtr = 0;
        diffTwo.textContent = getDiffVal(diffTwoCtr);
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
        GameCtrl.StartNewGame(plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr);
    });

    // Webpage Init Listener
    document.addEventListener('DOMContentLoaded', () => {
        updateDiffOne();
        updateDiffTwo();
    });

    return {plyrOneName, plyrTwoName};
})();

const GameCtrl = (() => {
    const INDEXATTR = Object.freeze('data-index');

    const gameBoardView = document.getElementById('gameBoardView');

    const WINCONDS = Object.freeze([
                                       [0, 1, 2],
                                       [3, 4, 5],
                                       [6, 7, 8],
                                       [0, 3, 6],
                                       [1, 4, 7],
                                       [2, 5, 8],
                                       [0, 4, 8],
                                       [2, 4, 6]
                                   ]);

    const plyrOne = Player(SYMBOLX);
    const plyrTwo = Player(SYMBOLO);

    let currPlayer = plyrOne;

    function resetExistingBoard() {
        GameBoard.emptyBoard();
        gameBoardView.innerHTML = "";
    }

    function displayBoardView() {
        for (let i = 0; i < GameBoard.boardLength(); i++) {
            const boardTile = document.createElement('div');

            boardTile.classList.add('tile');
            boardTile.setAttribute(INDEXATTR, i.toString());
            boardTile.addEventListener('click', (evt) => {
                turnClick(evt.target);
                boardTile.style.pointerEvents = 'none'; // Only Clickable Once
            });

            gameBoardView.appendChild(boardTile);
        }
    }

    function StartNewGame(plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr) {
        resetExistingBoard();
        displayBoardView();

        plyrOne.setName(plyrOneName);
        plyrOne.setType(getDiffVal(diffOneCtr));

        plyrTwo.setName(plyrTwoName);
        plyrTwo.setType(getDiffVal(diffTwoCtr));

        currPlayer = plyrOne;
    }

    // Tile is Clicked Event
    function turnClick(target) {
        let clickedIndex = target.getAttribute(INDEXATTR);
        GameBoard.addTile(clickedIndex, currPlayer.getSymbol());
        target.textContent = currPlayer.getSymbol();

        GameBoard.printBoard();
        finishTurn();
    }

    function switchCurrPlyr() {
        currPlayer = currPlayer.getSymbol() === SYMBOLX ? plyrTwo : plyrOne;
    }

    function finishTurn() {
        checkRoundWin();
        switchCurrPlyr();
    }

    function checkRoundWin() {
        let playedPositions = GameBoard.getBoard().reduce(
            (a, e, i) => (e === currPlayer.getSymbol() ? a.concat(i) : a), []);

        for (let [i, winCond] of WINCONDS.entries()) {
            // Current Player Wins
            if (winCond.every((e) => playedPositions.indexOf(e) > -1)) {
                console.log(`${currPlayer.getName()} wins with symbol ${currPlayer.getSymbol()}`);
                break;
            }
        }

    }

    return {StartNewGame};
})();

