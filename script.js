let timeLeft;
let timerId = null;
let isWorkTime = true;
let completedPomodoros = 0;
let failedPomodoros = 0;
let wasPaused = false;

const timerDisplay = document.getElementById('timer');
const startButton = document.getElementById('start');
const pauseButton = document.getElementById('pause');
const resetButton = document.getElementById('reset');
const modeDisplay = document.getElementById('mode');
const messageDisplay = document.getElementById('message');
const completedCount = document.getElementById('completed-count');
const failedCount = document.getElementById('failed-count');

const WORK_TIME = 25 * 60; // 25 minutes in seconds
const BREAK_TIME = 5 * 60; // 5 minutes in seconds

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
        wasPaused = false;
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
                new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg').play();
                
                if (!isWorkTime && !wasPaused) {
                    completedPomodoros++;
                    completedCount.textContent = completedPomodoros;
                }
            }
        }, 1000);
    }
}

function pauseTimer() {
    if (timerId !== null) {
        wasPaused = true;
        clearInterval(timerId);
        timerId = null;
        messageDisplay.textContent = "";
        
        if (isWorkTime && timeLeft < WORK_TIME) {
            failedPomodoros++;
            failedCount.textContent = failedPomodoros;
        }
    }
}

function resetTimer() {
    clearInterval(timerId);
    timerId = null;
    isWorkTime = true;
    timeLeft = WORK_TIME;
    modeDisplay.textContent = 'Work Time';
    messageDisplay.textContent = "";
    updateDisplay(timeLeft);
    
    if (timeLeft < WORK_TIME) {
        failedPomodoros++;
        failedCount.textContent = failedPomodoros;
    }
}

startButton.addEventListener('click', startTimer);
pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Initialize the display
updateDisplay(WORK_TIME); 