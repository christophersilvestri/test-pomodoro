let timeLeft;
let timerId = null;
let isWorkTime = true;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeDisplay = document.getElementById('mode');
const messageDisplay = document.getElementById('message');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

const goalModal = document.getElementById('goalModal');
const goalInput = document.getElementById('goalInput');
const goalDisplay = document.getElementById('goalDisplay');
const startWithGoalBtn = document.getElementById('startWithGoal');
const cancelGoalBtn = document.getElementById('cancelGoal');

let currentGoal = '';

function updateButtonStates() {
    // Start button visibility
    startButton.style.display = isRunning ? 'none' : 'block';
    
    // Pause button visibility
    pauseButton.style.display = isRunning ? 'block' : 'none';
    
    // Reset button state
    resetButton.disabled = !isRunning && timeLeft === WORK_TIME;
}

function updateDisplay(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

function startTimer() {
    if (timerId === null) {
        if (timeLeft === undefined) {
            timeLeft = WORK_TIME;
        }
        isRunning = true;
        updateButtonStates();
        messageDisplay.textContent = isWorkTime ? "Do the fucking work, bitch" : "";
        
        timerId = setInterval(() => {
            timeLeft--;
            updateDisplay(timeLeft);

            if (timeLeft === 0) {
                clearInterval(timerId);
                timerId = null;
                isWorkTime = !isWorkTime;
                timeLeft = isWorkTime ? WORK_TIME : BREAK_TIME;
                modeDisplay.textContent = isWorkTime ? 'Work Time' : 'Break Time';
                messageDisplay.textContent = isWorkTime ? "Do the fucking work, bitch" : "";
                updateDisplay(timeLeft);
                updateButtonStates();
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (timerId !== null) {
        clearInterval(timerId);
        timerId = null;
        isRunning = false;
        messageDisplay.textContent = "";
        updateButtonStates();
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isRunning = false;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeDisplay.textContent = 'Work Time';
    messageDisplay.textContent = "";
    currentGoal = '';
    updateGoalDisplay();
    updateDisplay(timeLeft);
    updateButtonStates();
}

function showGoalModal() {
    goalModal.classList.add('show');
    goalInput.focus();
    updateStartWithGoalButton();
}

function hideGoalModal() {
    goalModal.classList.remove('show');
    goalInput.value = '';
}

function updateGoalDisplay() {
    if (currentGoal) {
        goalDisplay.textContent = `Focus Goal: ${currentGoal}`;
        goalDisplay.classList.add('show');
    } else {
        goalDisplay.classList.remove('show');
    }
}

function updateStartWithGoalButton() {
    startWithGoalBtn.disabled = !goalInput.value.trim();
}

// Event Listeners
startButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isRunning) {
        showGoalModal();
    }
});

startWithGoalBtn.addEventListener('click', () => {
    const goal = goalInput.value.trim();
    if (goal) {
        currentGoal = goal;
        hideGoalModal();
        updateGoalDisplay();
        startTimer();
    }
});

cancelGoalBtn.addEventListener('click', () => {
    hideGoalModal();
});

goalInput.addEventListener('input', updateStartWithGoalButton);

pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize the display and button states
updateDisplay(WORK_TIME);
updateButtonStates(); 