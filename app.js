// ENUMS
const diffOptions = Object.freeze({
                                      HUMAN: 'Human',
                                      EASY: 'AI - Easy',
                                      MEDIUM: 'AI - Medium',
                                      HARD: 'AI - Hard'
                                  });

// MODULES
const details = (() => {
    const inputOne = document.getElementById('inputOne');
    const inputTwo = document.getElementById('inputTwo');
    const diffOne = document.getElementById('diffOne');
    const diffTwo = document.getElementById('diffTwo');
    const sbOne = document.getElementById('sbOne');
    const sbTwo = document.getElementById('sbTwo');
    const btnStart = document.getElementById('btnStart');
    const btnRestart = document.getElementById('btnRestart');

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
        plyrOneName = inputOne.value !== '' ? inputOne.value : "";
        sbOne.textContent = inputOne.value !== '' ? inputOne.value : "Player One";
    });
    inputTwo.addEventListener('blur', () => {
        plyrTwoName = inputTwo.value !== '' ? inputTwo.value : "";
        sbTwo.textContent = inputTwo.value !== '' ? inputTwo.value : "Player Two";
    });
    diffOne.addEventListener('click', updateDiffOne);
    diffTwo.addEventListener('click', updateDiffTwo);
    btnStart.addEventListener('click', () => {
        btnStart.classList.add('hide');
        btnRestart.classList.remove('hide');

        // Start Game Function from Game Module
    });

    // Webpage Init Listener
    document.addEventListener('DOMContentLoaded', () => {
        updateDiffOne();
        updateDiffTwo();
    });

    return {plyrOneName, plyrTwoName, diffOneCtr, diffTwoCtr};
})();

// FACTORIES
