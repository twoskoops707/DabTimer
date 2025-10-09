// Simple timer functionality
function setupTimer() {
    // Home screen start button
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
    
    // Timer screen controls
    const timerStartBtn = document.getElementById('start-timer');
    const timerResetBtn = document.getElementById('reset-timer');
    
    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', function() {
            if (!state.timer || state.timer.timeLeft === 0) {
                initializeTimer();
            }
            startTimer();
        });
    }
    
    if (timerResetBtn) {
        timerResetBtn.addEventListener('click', resetTimer);
    }
}

function initializeTimer() {
    const material = state.settings.material;
    const heater = state.settings.heater;
    const concentrate = state.settings.concentrate;
    
    const heatTime = calculateHeatTime(material, heater, concentrate);
    const coolTime = calculateCoolTime(material, heatTime);
    
    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: heatTime,
        totalTime: heatTime,
        interval: null
    };
    
    updateTimerDisplay();
    updateFormulaDisplay();
}

function startTimer() {
    if (state.timer.isRunning) return;
    
    state.timer.isRunning = true;
    const startBtn = document.getElementById('start-timer');
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    state.timer.interval = setInterval(() => {
        state.timer.timeLeft--;
        updateTimerDisplay();
        
        if (state.timer.timeLeft <= 0) {
            clearInterval(state.timer.interval);
            alert('Timer completed!');
            resetTimer();
        }
    }, 1000);
}

function resetTimer() {
    if (state.timer.interval) clearInterval(state.timer.interval);
    state.timer.isRunning = false;
    const startBtn = document.getElementById('start-timer');
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    initializeTimer();
}

function updateTimerDisplay() {
    const timerElement = document.getElementById('timer');
    if (timerElement && state.timer) {
        const minutes = Math.floor(state.timer.timeLeft / 60);
        const seconds = state.timer.timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}
