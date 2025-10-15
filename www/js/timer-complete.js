// Complete timer functionality
let timerInterval = null;

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
    
    // Setup timer controls
    setupTimerControls();
    
    console.log("Timer initialized:", heatTime + "s heat", coolTime + "s cool");
}

function setupTimerControls() {
    const startBtn = document.getElementById('start-timer');
    const resetBtn = document.getElementById('reset-timer');
    
    if (startBtn) {
        startBtn.addEventListener('click', toggleTimer);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
}

function toggleTimer() {
    if (state.timer.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

function startTimer() {
    if (state.timer.isRunning) return;
    
    state.timer.isRunning = true;
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
    
    timerInterval = setInterval(() => {
        state.timer.timeLeft--;
        updateTimerDisplay();
        
        if (state.timer.timeLeft <= 0) {
            if (state.timer.mode === 'heat') {
                switchToCoolDown();
            } else {
                completeTimer();
            }
        }
    }, 1000);
}

function pauseTimer() {
    if (!state.timer.isRunning) return;
    
    state.timer.isRunning = false;
    clearInterval(timerInterval);
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function resetTimer() {
    pauseTimer();
    initializeTimer();
}

function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    
    const timerMode = document.getElementById('timer-mode');
    if (timerMode) {
        timerMode.textContent = 'COOL DOWN';
    }
    
    updateTimerDisplay();
}

function completeTimer() {
    pauseTimer();
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start Again';
    }
    
    // Play sound and show notification
    playAlarmSound();
    showNotification('Dab time! Your concentrate is at the perfect temperature.');
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

// Stub functions for audio and notifications
function playAlarmSound() {
    console.log("Playing alarm sound");
}

function showNotification(message) {
    console.log("Notification:", message);
    alert(message);
}
