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
const modalCloseBtn = document.getElementById('modalClose');
const editGoalBtn = document.getElementById('editGoal');

let currentGoal = '';
let isEditing = false;

function updateButtonStates() {
    // Start button visibility
    startButton.style.display = isRunning ? 'none' : 'block';
    
    // Pause button visibility
    pauseButton.style.display = isRunning ? 'block' : 'none';
    
    // Reset button visibility and state
    resetButton.style.display = (timeLeft !== undefined && timeLeft !== WORK_TIME) || isRunning ? 'block' : 'none';
    resetButton.disabled = false; // Reset button should never be disabled, just hidden when not needed
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

function validateAndStartTimer() {
    const goal = goalInput.value.trim();
    if (goal) {
        currentGoal = goal;
        hideGoalModal();
        updateGoalDisplay();
        if (!isEditing) {
            startTimer();
        }
        isEditing = false;
    } else {
        goalInput.classList.add('error');
        setTimeout(() => goalInput.classList.remove('error'), 820);
    }
}

function showGoalModal(editing = false) {
    isEditing = editing;
    if (editing) {
        goalInput.value = currentGoal;
        startWithGoalBtn.textContent = 'Save Goal';
    } else {
        goalInput.value = '';
        startWithGoalBtn.textContent = 'Start Focus Session';
    }
    goalModal.classList.add('show');
    goalInput.focus();
    document.body.style.overflow = 'hidden';
    startWithGoalBtn.disabled = !goalInput.value.trim();
}

function hideGoalModal() {
    goalModal.classList.remove('show');
    goalInput.value = '';
    document.body.style.overflow = '';
}

function updateGoalDisplay() {
    if (currentGoal) {
        goalDisplay.textContent = `Focus Goal: ${currentGoal}`;
        goalDisplay.classList.add('show');
    } else {
        goalDisplay.classList.remove('show');
    }
}

// Event Listeners
startButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isRunning) {
        // Only show goal modal if we're starting fresh (not paused and at the beginning of a session)
        if (timeLeft === undefined || (timeLeft === WORK_TIME && isWorkTime)) {
            showGoalModal(false);
        } else {
            // Resume from pause
            startTimer();
        }
    }
});

startWithGoalBtn.addEventListener('click', validateAndStartTimer);

editGoalBtn.addEventListener('click', () => {
    showGoalModal(true);
});

cancelGoalBtn.addEventListener('click', () => {
    hideGoalModal();
});

goalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        validateAndStartTimer();
    }
});

goalInput.addEventListener('input', () => {
    startWithGoalBtn.disabled = !goalInput.value.trim();
});

pauseButton.addEventListener('click', pauseTimer);
resetButton.addEventListener('click', resetTimer);

// Add event listener for escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && goalModal.classList.contains('show')) {
        hideGoalModal();
    }
});

// Add event listener for clicking outside modal
goalModal.addEventListener('click', (e) => {
    if (e.target === goalModal) {
        hideGoalModal();
    }
});

// Add event listener for close button
modalCloseBtn.addEventListener('click', hideGoalModal);

// Initialize the display and button states
timeLeft = WORK_TIME;
updateDisplay(WORK_TIME);
updateButtonStates(); 