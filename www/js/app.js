// Dab Timer App - Fixed Implementation
console.log('DabTimer App Loading...');

// Application State
const state = {
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'butane',
        theme: 'green'
    },
    timer: {
        isRunning: false,
        mode: 'heat',
        timeLeft: 0,
        totalTime: 0,
        heatTime: 0,
        coolTime: 0,
        interval: null
    }
};

// Configuration for materials and heaters
const CONFIG = {
    materials: {
        quartz: { heatUp: 30, coolDown: 45, modifier: 1.0 },
        titanium: { heatUp: 25, coolDown: 35, modifier: 1.0 },
        ceramic: { heatUp: 35, coolDown: 50, modifier: 1.0 }
    },
    heaters: {
        butane: { modifier: 1.0 },
        propane: { modifier: 0.8 }
    }
};

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing app...');
    initializeApp();
});

function initializeApp() {
    loadSettings();
    updateClock();
    setInterval(updateClock, 1000);
    setupTabNavigation();
    setupOptionButtons();
    setupTimerControls();
    setupThemeButtons();
    setupCustomTimeInputs();
    updateFormulaDisplay();
    console.log('App initialized successfully');
}

// Load saved settings from localStorage
function loadSettings() {
    const savedMaterial = localStorage.getItem('material');
    const savedConcentrate = localStorage.getItem('concentrate');
    const savedHeater = localStorage.getItem('heater');
    const savedTheme = localStorage.getItem('theme');
    
    if (savedMaterial) state.settings.material = savedMaterial;
    if (savedConcentrate) state.settings.concentrate = savedConcentrate;
    if (savedHeater) state.settings.heater = savedHeater;
    if (savedTheme) {
        state.settings.theme = savedTheme;
        document.body.setAttribute('data-theme', savedTheme);
    }
    
    // Set active states on buttons
    setActiveButton('material', state.settings.material);
    setActiveButton('concentrate', state.settings.concentrate);
    setActiveButton('heater', state.settings.heater);
    setActiveTheme(state.settings.theme);
}

function setActiveButton(setting, value) {
    const buttons = document.querySelectorAll(`[data-setting="${setting}"]`);
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-value') === value);
    });
}

function setActiveTheme(theme) {
    const buttons = document.querySelectorAll('.theme-btn');
    buttons.forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
}

// Update clock display
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) {
        timeDisplay.textContent = `${hours}:${minutes}`;
    }
}

// Tab Navigation Setup
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            switchToTab(tabId);
        });
    });
}

function switchToTab(tabId) {
    // Update tab buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    // Update tab content
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
}

// Option Buttons (Material, Concentrate, Heater) Setup
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    optionButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            // Update state and save
            state.settings[setting] = value;
            localStorage.setItem(setting, value);
            
            // Update UI
            const siblings = document.querySelectorAll(`[data-setting="${setting}"]`);
            siblings.forEach(sibling => sibling.classList.remove('active'));
            this.classList.add('active');
            
            // Update formula display
            updateFormulaDisplay();
            
            console.log(`${setting} changed to ${value}`);
        });
    });
}

// Theme Selection Setup
function setupThemeButtons() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    themeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            
            // Update state and storage
            state.settings.theme = theme;
            localStorage.setItem('theme', theme);
            
            // Update UI
            document.body.setAttribute('data-theme', theme);
            themeButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            console.log(`Theme changed to ${theme}`);
        });
    });
}

// Timer Controls Setup
function setupTimerControls() {
    // Home screen start button
    const homeStartBtn = document.getElementById('start-timer-btn');
    if (homeStartBtn) {
        homeStartBtn.addEventListener('click', function() {
            console.log('Starting timer from home screen');
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
    
    // Timer screen start/pause button
    const timerStartBtn = document.getElementById('start-timer');
    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', function() {
            console.log('Timer button clicked');
            toggleTimer();
        });
    }
    
    // Timer screen reset button
    const resetBtn = document.getElementById('reset-timer');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset button clicked');
            resetTimer();
        });
    }
}

// Calculate times based on user selections
function calculateTimes() {
    // Check for custom times first
    const customHeat = localStorage.getItem('customHeatTime');
    const customCool = localStorage.getItem('customCoolTime');
    
    if (customHeat && customCool) {
        return {
            heatTime: parseInt(customHeat),
            coolTime: parseInt(customCool)
        };
    }
    
    // Use formula based on selections
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const heatTime = Math.round(material.heatUp * heater.modifier);
    const coolTime = Math.round(material.coolDown * heater.modifier);
    
    return { heatTime, coolTime };
}

// Initialize Timer
function initializeTimer() {
    const times = calculateTimes();
    
    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: times.heatTime,
        totalTime: times.heatTime,
        heatTime: times.heatTime,
        coolTime: times.coolTime,
        interval: null
    };
    
    updateTimerDisplay();
    updateFormulaDisplay();
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    }
    
    console.log(`Timer initialized: ${times.heatTime}s heat, ${times.coolTime}s cool`);
}

// Toggle Timer (Start/Pause)
function toggleTimer() {
    // If timer is at 0, reinitialize
    if (state.timer.timeLeft === 0) {
        initializeTimer();
        return;
    }
    
    if (state.timer.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

// Start Timer
function startTimer() {
    if (state.timer.isRunning) return;
    
    state.timer.isRunning = true;
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    }
    
    state.timer.interval = setInterval(() => {
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
    
    console.log('Timer started');
}

// Pause Timer
function pauseTimer() {
    if (!state.timer.isRunning) return;
    
    state.timer.isRunning = false;
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
    
    console.log('Timer paused');
}

// Reset Timer
function resetTimer() {
    pauseTimer();
    initializeTimer();
    console.log('Timer reset');
}

// Switch to Cool Down Phase
function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    
    const timerMode = document.getElementById('timer-mode');
    if (timerMode) {
        timerMode.textContent = 'COOL DOWN';
    }
    
    updateTimerDisplay();
    console.log('Switched to cool down phase');
}

// Complete Timer
function completeTimer() {
    pauseTimer();
    
    // Log the session to calendar
    if (window.logDabSession) {
        window.logDabSession(
            state.settings.material,
            state.settings.concentrate,
            state.settings.heater,
            state.timer.heatTime,
            state.timer.coolTime
        );
    }
    
    // Update button
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-check"></i> Complete!';
        
        setTimeout(() => {
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Again';
        }, 3000);
    }
    
    // Show completion message
    const completionMsg = document.getElementById('completion-message');
    if (completionMsg) {
        completionMsg.textContent = '🔥 Perfect! Time to dab! 🔥';
        completionMsg.classList.remove('hidden');
        
        setTimeout(() => {
            completionMsg.classList.add('hidden');
        }, 5000);
    }
    
    console.log('Timer completed!');
}

// Update Timer Display
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
        timerModeElement.textContent = state.timer.mode === 'heat' ? 'HEAT UP' : 'COOL DOWN';
    }
    
    if (progressElement && state.timer && state.timer.totalTime > 0) {
        const progress = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        progressElement.style.width = `${progress}%`;
    }
}

// Update Formula Display on Timer Screen
function updateFormulaDisplay() {
    const times = calculateTimes();
    
    // Update formula display elements
    const materialEl = document.getElementById('formula-material');
    const concentrateEl = document.getElementById('formula-concentrate');
    const heaterEl = document.getElementById('formula-heater');
    const heatTimeEl = document.getElementById('formula-heat-time');
    const coolTimeEl = document.getElementById('formula-cool-time');
    const totalTimeEl = document.getElementById('formula-total-time');
    
    if (materialEl) materialEl.textContent = capitalize(state.settings.material);
    if (concentrateEl) concentrateEl.textContent = capitalize(state.settings.concentrate);
    if (heaterEl) heaterEl.textContent = capitalize(state.settings.heater);
    if (heatTimeEl) heatTimeEl.textContent = `${times.heatTime}s`;
    if (coolTimeEl) coolTimeEl.textContent = `${times.coolTime}s`;
    if (totalTimeEl) totalTimeEl.textContent = `${times.heatTime + times.coolTime}s`;
}

// Custom Time Inputs Setup (Settings Page Only)
function setupCustomTimeInputs() {
    const savedHeat = localStorage.getItem('customHeatTime');
    const savedCool = localStorage.getItem('customCoolTime');
    
    const settingsHeatInput = document.getElementById('settings-heat-time');
    const settingsCoolInput = document.getElementById('settings-cool-time');
    const settingsApplyBtn = document.getElementById('apply-settings-times');
    
    // Load saved custom times into settings page
    if (settingsHeatInput && savedHeat) settingsHeatInput.value = savedHeat;
    if (settingsCoolInput && savedCool) settingsCoolInput.value = savedCool;
    
    // Settings page apply button
    if (settingsApplyBtn) {
        settingsApplyBtn.addEventListener('click', function() {
            const heatTime = parseInt(settingsHeatInput.value);
            const coolTime = parseInt(settingsCoolInput.value);
            
            if (heatTime > 0 && coolTime > 0) {
                localStorage.setItem('customHeatTime', heatTime);
                localStorage.setItem('customCoolTime', coolTime);
                updateFormulaDisplay();
                alert('Custom times saved! Start the timer to use them.');
                console.log(`Custom times set: ${heatTime}s heat, ${coolTime}s cool`);
            } else {
                alert('Please enter valid times (greater than 0)');
            }
        });
    }
}

// Helper function to capitalize strings
function capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
}

console.log('DabTimer App Loaded Successfully!');