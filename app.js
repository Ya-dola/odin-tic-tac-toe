// ENUMS
const DIFFOPTS = Object.freeze({
                                   HUMAN: 'Human',
                                   EASY: 'AI - Easy',
                                   MEDIUM: 'AI - Medium',
                                   HARD: 'AI - Hard'
                               });

// CONSTANTS
const SYMBOLX = 'X';
const SYMBOLO = 'O';

const getDiffVal = (index) => Object.values(DIFFOPTS)[index];

const delay = (time) => new Promise(resolve => setTimeout(resolve, time));

const ROUNDENDDELAY = Object.freeze(2000);

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

const Counter = () => {
    let counter = 0;

    const plus = () => counter++;

    const reset = () => counter = 0;
    const count = () => counter;

    return {plus, reset, count};
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

        GameCtrl.StartNewGame(plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr);
    });

    // Webpage Init Listener
    document.addEventListener('DOMContentLoaded', () => {
        updateDiffOne();
        updateDiffTwo();
    });

    return {};
})();

const ScoreBoard = (() => {
    const cardOne = document.getElementById('cardOne');
    const cardTwo = document.getElementById('cardTwo');
    const scoreResult = document.getElementById('scoreResult');
    const sCardRoundNum = document.getElementById('sCardRoundNum');
    const sCardOne = document.getElementById('sCardOne');
    const sCardTwo = document.getElementById('sCardTwo');

    const DEACTIVECLASS = Object.freeze('de-active');

    let scorePlyrOne = 0;
    let scorePlyrTwo = 0;
    let roundNum = 1;

    const updateSCardOne = (score) => sCardOne.textContent = score;
    const updateSCardTwo = (score) => sCardTwo.textContent = score;
    const updateSRoundNum = (num) => sCardRoundNum.textContent = num;

    const addSCardOne = () => updateSCardOne(++scorePlyrOne);
    const addSCardTwo = () => updateSCardTwo(++scorePlyrTwo);
    const addSRound = () => updateSRoundNum(++roundNum);

    function resetScores() {
        scorePlyrOne = 0;
        scorePlyrTwo = 0;

        updateSCardOne(scorePlyrOne);
        updateSCardTwo(scorePlyrTwo);
    }

    function resetRounds() {
        roundNum = 1;

        updateSRoundNum(roundNum);
    }

    function switchActivePlyr(activeSymbol) {
        if (activeSymbol === SYMBOLX) {
            cardTwo.classList.add(DEACTIVECLASS);
            cardOne.classList.remove(DEACTIVECLASS);
        }
        else {
            cardOne.classList.add(DEACTIVECLASS);
            cardTwo.classList.remove(DEACTIVECLASS);
        }
    }

    async function displayResult(name, resType) {
        switch (resType) {
            case 2:
                scoreResult.textContent = `${name} Won the Game !!!`;
                break;
            case 1:
                scoreResult.textContent = `${name} Won Round ${roundNum} !!!`;
                break;
            default:
                scoreResult.textContent = `Round ${roundNum} is a Draw !!!`;
                break;
        }

        scoreResult.classList.add('visible');

        await delay(ROUNDENDDELAY);

        scoreResult.classList.remove('visible');
    }

    return {
        addSCardOne, addSCardTwo, addSRound, resetScores,
        resetRounds, switchActivePlyr, displayResult
    };
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

    let allowTilesClick = true;
    const moveCounter = Counter(0);

    async function disableTileClicksTemp() {
        allowTilesClick = false;
        await delay(ROUNDENDDELAY);
        allowTilesClick = true;
    }

    const disableTileClicks = () => allowTilesClick = false;

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
                if (allowTilesClick) {
                    turnClick(evt.target);
                    boardTile.style.pointerEvents = 'none'; // Only Clickable Once
                }
            });

            gameBoardView.appendChild(boardTile);
        }
    }

    function StartNewGame(plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr) {
        resetExistingBoard();
        displayBoardView();

        ScoreBoard.resetScores();
        ScoreBoard.resetRounds();
        allowTilesClick = true;
        moveCounter.reset();

        plyrOne.setName(plyrOneName);
        plyrOne.setType(getDiffVal(diffOneCtr));

        plyrTwo.setName(plyrTwoName);
        plyrTwo.setType(getDiffVal(diffTwoCtr));

        currPlayer = plyrOne;

        ScoreBoard.switchActivePlyr(currPlayer.getSymbol());
    }

    function switchCurrPlyr() {
        currPlayer = currPlayer.getSymbol() === SYMBOLX ? plyrTwo : plyrOne;
        ScoreBoard.switchActivePlyr(currPlayer.getSymbol());
    }

    async function NewRound() {
        moveCounter.reset();

        await delay(ROUNDENDDELAY);

        ScoreBoard.addSRound();

        resetExistingBoard();
        displayBoardView();

        // Switch After a Delay on New Round
        switchCurrPlyr();
    }

    // Tile is Clicked Event
    function turnClick(target) {
        let clickedIndex = target.getAttribute(INDEXATTR);
        GameBoard.addTile(clickedIndex, currPlayer.getSymbol());
        target.textContent = currPlayer.getSymbol();

        // TODO - DEBUG
        // GameBoard.printBoard();
        finishTurn();
    }

    function finishTurn() {
        moveCounter.plus();

        // If Curr Player wins the Round
        if (checkRoundWin(currPlayer)) {
            updateRoundWinner(currPlayer);
            disableTileClicksTemp().then();
            NewRound().then();
        }
        // If Round is a Draw
        else if (moveCounter.count() >= 9) {
            ScoreBoard.displayResult('', 0).then();
            NewRound().then();
        }
        // Switch Instantly After Turn
        else switchCurrPlyr();
    }

    function checkRoundWin(player) {
        // Get Index Positions Played by the Current Player's Symbol
        let playedPositions = GameBoard.getBoard().reduce(
            (a, e, i) => (e === player.getSymbol() ? a.concat(i) : a), []);

        // Checks Each Possible Win Condition and if that combination exists in playedPositions
        for (let [i, winCond] of WINCONDS.entries()) {

            // Current Player Wins the Round
            if (winCond.every((e) => playedPositions.indexOf(e) > -1)) return true;
        }
        return false;
    }

    function updateRoundWinner(player) {
        ScoreBoard.displayResult(player.getName(), 1).then();

        // Update the Score Accordingly
        player.getSymbol() === SYMBOLX ? ScoreBoard.addSCardOne() : ScoreBoard.addSCardTwo();
    }

    return {StartNewGame, disableTileClicks};
})();

