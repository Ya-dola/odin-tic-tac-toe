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

const ROUNDENDDELAY = Object.freeze(1500);

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

    const getUndefinedTiles = () => board.reduce(
        (a, e, i) => (e === undefined ? a.push(i) : a), []);

    // View the Board on Console
    function printBoard() {
        let boardPrinted = '';

        for (let i = 0; i < boardLength(); i++) {
            if (i % 3 === 0) boardPrinted += '\n';
            boardPrinted += `| ${board[i] === undefined ? '-' : board[i]} | `;
        }
        console.log(boardPrinted);
    }

    return {getBoard, addTile, emptyBoard, boardLength, getUndefinedTiles, printBoard};
})();

const Details = (() => {
    const inputOne = document.getElementById('inputOne');
    const inputTwo = document.getElementById('inputTwo');
    const diffOne = document.getElementById('diffOne');
    const diffTwo = document.getElementById('diffTwo');
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
    });
    inputTwo.addEventListener('blur', () => {
        plyrTwoName = inputTwo.value !== '' ? inputTwo.value : "Player Two";
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
    const sbNameOne = document.getElementById('sbNameOne');
    const sbNameTwo = document.getElementById('sbNameTwo');
    const scoreResult = document.getElementById('scoreResult');
    const sCardRoundNum = document.getElementById('sCardRoundNum');
    const sCardOne = document.getElementById('sCardOne');
    const sCardTwo = document.getElementById('sCardTwo');

    const DEACTIVECLASS = Object.freeze('de-active');
    const VISIBLECLASS = Object.freeze('visible');
    const ERRORCLASS = Object.freeze('error');

    let scorePlyrOne = 0;
    let scorePlyrTwo = 0;
    let roundNum = 1;

    const plyrOneScore = () => scorePlyrOne;
    const plyrTwoScore = () => scorePlyrTwo;

    const setSbNameOne = (name) => sbNameOne.textContent = name;
    const setSbNameTwo = (name) => sbNameTwo.textContent = name;

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
                scoreResult.textContent = `${name} Won the Game !!!\n` +
                                          `Restart to Play Again !`;
                break;
            case 1:
                scoreResult.textContent = `${name} Won Round ${roundNum} !!!`;
                break;
            default:
                scoreResult.textContent = `Round ${roundNum} is a Draw !!!`;
                break;
        }

        scoreResult.classList.add(VISIBLECLASS);

        // Only Hide Result if it was not a Game Win Result
        if (resType !== 2) {
            await delay(ROUNDENDDELAY);
            scoreResult.classList.remove(VISIBLECLASS);
        }
    }

    function displayErrorRes(errMsg) {
        scoreResult.textContent = errMsg;
        scoreResult.classList.add(VISIBLECLASS);
        scoreResult.classList.add(ERRORCLASS);
    }

    function resetScoreResult() {
        scoreResult.textContent = '';
        scoreResult.classList.remove(VISIBLECLASS);
        scoreResult.classList.remove(ERRORCLASS);
    }

    return {
        plyrOneScore, plyrTwoScore, setSbNameOne, setSbNameTwo,
        addSCardOne, addSCardTwo, addSRound, resetScores, resetRounds,
        switchActivePlyr, displayResult, displayErrorRes, resetScoreResult
    };
})();

const aiLogic = (() => {
    let aiDiffPrct = 0;

    const setAiDiffPrct = (amt) => aiDiffPrct = amt;

    function aiTurnIndex() {
        const randPrct = Math.floor(Math.random() * (100 + 1));

        let turnIndex = undefined;

        // Uses Min Max Logic if Rand Percent is Less than the AI Difficulty Percent
        if (randPrct <= aiDiffPrct) {
            turnIndex = minMax(GameCtrl.getAiPlyr()).index;
        }
        else { // Uses Random Placement on remaining Undefined Tiles
            const undefinedTiles = GameBoard.getUndefinedTiles();
            turnIndex = undefinedTiles[Math.floor((Math.random() * undefinedTiles.length))];
        }

        return turnIndex;
    }

    function minMax(player) {
        let undefinedTiles = GameBoard.getUndefinedTiles();
        let aiBoard = GameBoard.getBoard();

        if (undefinedTiles.length === 0) return {score: 0}; // Draw
        else if (GameCtrl.checkRoundWinner(GameCtrl.getHumanPlyr())) return {score: -10}; // Human Wins
        else if (GameCtrl.checkRoundWinner(GameCtrl.getAiPlyr())) return {score: 10}; // AI Wins

        return getBestMove(getPossibleMoves(aiBoard, undefinedTiles, player), player);
    }

    function getPossibleMoves(aiBoard, undefinedTiles, player) {
        let possibleMoves = [];

        // Determine Scores for all Remaining Tiles
        for (let i = 0; i < undefinedTiles.length; i++) {
            let move = {};
            move.index = aiBoard[undefinedTiles[i]];
            aiBoard[undefinedTiles[i]] = player;

            if (player.getSymbol() === GameCtrl.getAiPlyr().getSymbol())
                move.score = minMax(GameCtrl.getHumanPlyr()).score;
            else move.score = minMax(GameCtrl.getAiPlyr()).score;

            aiBoard[undefinedTiles[i]] = move.index;

            possibleMoves.push(move);
        }

        return possibleMoves;
    }

    function getBestMove(possibleMoves, player) {
        let bestMoveIndex = null;
        let bestScore = 0;

        if (player === GameCtrl.getAiPlyr()) {
            bestScore = -10000;
            for (let i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i].score > bestScore) {
                    bestScore = possibleMoves[i].score;
                    bestMoveIndex = i;
                }
            }
        }
        else {
            bestScore = 10000;
            for (let i = 0; i < possibleMoves.length; i++) {
                if (possibleMoves[i].score < bestScore) {
                    bestScore = possibleMoves[i].score;
                    bestMoveIndex = i;
                }
            }
        }

        return possibleMoves[bestMoveIndex];
    }

    return {setAiDiffPrct, aiTurnIndex};
})();

const GameCtrl = (() => {
    const INDEXATTR = Object.freeze('data-index');
    const MAXSCORE = Object.freeze(3);

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

    let humanPlyr = plyrOne;
    let aiPlyr = plyrTwo;

    const getHumanPlyr = () => humanPlyr;
    const getAiPlyr = () => aiPlyr;

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
        ScoreBoard.resetScores();
        ScoreBoard.resetRounds();
        ScoreBoard.resetScoreResult();
        allowTilesClick = true;
        moveCounter.reset();

        plyrOne.setName(plyrOneName);
        plyrOne.setType(getDiffVal(diffOneCtr));
        ScoreBoard.setSbNameOne(plyrOneName);

        plyrTwo.setName(plyrTwoName);
        plyrTwo.setType(getDiffVal(diffTwoCtr));
        ScoreBoard.setSbNameTwo(plyrTwoName);

        // TODO - Determining Bot Logic
        // Either One of the Players Need to Be Human
        if (!(plyrOne.getType() === getDiffVal(0) ||
              plyrTwo.getType() === getDiffVal(0))) {
            ScoreBoard.displayErrorRes(`${plyrOneName} or ${plyrTwoName} Needs to be Human!`);
        }
        else {
            if (plyrOne.getType() === getDiffVal(0)) {
                humanPlyr = plyrOne;
                aiPlyr = plyrTwo;
            }
            else {
                humanPlyr = plyrTwo;
                aiPlyr = plyrOne;
            }

            displayBoardView();
            currPlayer = plyrOne;
            ScoreBoard.switchActivePlyr(currPlayer.getSymbol());
        }
    }

    function switchCurrPlyr() {
        currPlayer = currPlayer.getSymbol() === SYMBOLX ? plyrTwo : plyrOne;
        ScoreBoard.switchActivePlyr(currPlayer.getSymbol());

        // TODO - AI Turn Logic Here
        // if (aiPlyr === currPlayer) {
        //     finishTurn();
        // }
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

        // If currPlayer wins the Round
        if (checkRoundWinner(currPlayer)) {
            updateRoundWinner(currPlayer);

            // If currPlayer wins the Game
            if (checkGameWinner(currPlayer)) {
                displayResult(currPlayer, 2);
                disableTileClicks();
            }
            else {
                displayResult(currPlayer, 1);
                disableTileClicksTemp().then();
                NewRound().then();
            }
        }
        // If Round is a Draw
        else if (moveCounter.count() >= 9) {
            ScoreBoard.displayResult('', 0).then();
            NewRound().then();
        }
        // Switch Instantly After Turn
        else switchCurrPlyr();
    }

    function checkRoundWinner(player) {
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

    function checkGameWinner(player) {
        let result;

        if (player.getSymbol() === SYMBOLX)
            ScoreBoard.plyrOneScore() >= MAXSCORE ? result = true : result = false;
        else
            ScoreBoard.plyrTwoScore() >= MAXSCORE ? result = true : result = false;

        return result;
    }

    function updateRoundWinner(player) {
        // Update the Score Accordingly
        player.getSymbol() === SYMBOLX ? ScoreBoard.addSCardOne() : ScoreBoard.addSCardTwo();
    }

    function displayResult(player, resType) {
        // Display the Result
        ScoreBoard.displayResult(player.getName(), resType).then();
    }

    return {getHumanPlyr, getAiPlyr, StartNewGame, checkRoundWinner};
})();

