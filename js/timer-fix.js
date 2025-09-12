// Timer functionality
function setupStartButton() {
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
}

function initializeTimer() {
    const material = state.settings.material;
    const heater = state.settings.heater;
    const concentrate = state.settings.concentrate;
    
    const heatTime = calculateHeatTime(material, heater, concentrate);
    const coolTime = calculateCoolTime(material, heatTime);
    
    // Set timer values based on scientific calculations
    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: heatTime,
        totalTime: heatTime,
        heatTime: heatTime,
        coolTime: coolTime
    };
    
    // Update timer display
    updateTimerDisplay();
    
    console.log("Timer initialized with:", heatTime + "s heat", coolTime + "s cool");
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    const timerModeElement = document.getElementById('timer-mode');
    const progressElement = document.getElementById('timer-progress');
    
    if (timerElement && state.timer) {
        const minutes = Math.floor(state.timer.timeLeft / 60);
        const seconds = state.timer.timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (timerModeElement && state.timer) {
        timerModeElement.textContent = state.timer.mode.toUpperCase();
    }
    
    if (progressElement && state.timer && state.timer.totalTime > 0) {
        const progress = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        progressElement.style.width = `${progress}%`;
    }
}

// Add timer to state
state.timer = {
    isRunning: false,
    mode: 'heat',
    timeLeft: 0,
    totalTime: 0,
    heatTime: 0,
    coolTime: 0
};

// Add to initializeApp
function initializeApp() {
    console.log("Initializing app...");
    updateClock();
    setupTabNavigation();
    setupOptionButtons();
    setupStartButton(); // Add this line
    console.log("App initialized");
}
