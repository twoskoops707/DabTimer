// Dab Timer App - Complete Implementation
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

// Configuration
const CONFIG = {
    materials: {
        quartz: { heatUp: 30, coolDown: 45 },
        titanium: { heatUp: 25, coolDown: 35 },
        ceramic: { heatUp: 35, coolDown: 50 }
    },
    heaters: {
        butane: { modifier: 1.0 },
        propane: { modifier: 0.8 }
    }
};

// Initialize app
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, initializing...');
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
    console.log('App initialized!');
}

// Load Settings
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

// Clock
function updateClock() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const timeDisplay = document.getElementById('current-time');
    if (timeDisplay) timeDisplay.textContent = `${hours}:${minutes}`;
}

// Tab Navigation
function setupTabNavigation() {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            switchToTab(this.getAttribute('data-tab'));
        });
    });
}

function switchToTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const targetTab = document.getElementById(tabId);
    if (targetTab) targetTab.classList.add('active');
}

// Option Buttons
function setupOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            state.settings[setting] = value;
            localStorage.setItem(setting, value);
            
            document.querySelectorAll(`[data-setting="${setting}"]`).forEach(sibling => {
                sibling.classList.remove('active');
            });
            this.classList.add('active');
            
            updateFormulaDisplay();
            console.log(`${setting} = ${value}`);
        });
    });
}

// Theme Buttons
function setupThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            state.settings.theme = theme;
            localStorage.setItem('theme', theme);
            document.body.setAttribute('data-theme', theme);
            
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            console.log(`Theme = ${theme}`);
        });
    });
}

// Timer Controls
function setupTimerControls() {
    const homeStartBtn = document.getElementById('start-timer-btn');
    if (homeStartBtn) {
        homeStartBtn.addEventListener('click', function() {
            console.log('Home start clicked');
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
    
    const timerStartBtn = document.getElementById('start-timer');
    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', function() {
            console.log('Timer start clicked');
            toggleTimer();
        });
    }
    
    const resetBtn = document.getElementById('reset-timer');
    if (resetBtn) {
        resetBtn.addEventListener('click', function() {
            console.log('Reset clicked');
            resetTimer();
        });
    }
}

// Initialize Timer
function initializeTimer() {
    const customHeat = localStorage.getItem('customHeatTime');
    const customCool = localStorage.getItem('customCoolTime');
    
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const heatTime = customHeat ? parseInt(customHeat) : Math.round(material.heatUp * heater.modifier);
    const coolTime = customCool ? parseInt(customCool) : Math.round(material.coolDown * heater.modifier);
    
    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: heatTime,
        totalTime: heatTime,
        heatTime: heatTime,
        coolTime: coolTime,
        interval: null
    };
    
    updateTimerDisplay();
    updateFormulaDisplay();
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
    
    console.log(`Initialized: ${heatTime}s heat, ${coolTime}s cool`);
}

// Toggle Timer
function toggleTimer() {
    if (state.timer.timeLeft === 0) {
        initializeTimer();
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
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
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
    if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
    
    console.log('Timer paused');
}

// Reset Timer
function resetTimer() {
    pauseTimer();
    initializeTimer();
}

// Switch to Cool Down
function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    
    const timerMode = document.getElementById('timer-mode');
    if (timerMode) timerMode.textContent = 'COOL DOWN';
    
    updateTimerDisplay();
    console.log('Switched to cool down');
}

// Complete Timer
function completeTimer() {
    pauseTimer();
    
    if (window.logDabSession) {
        window.logDabSession(
            state.settings.material,
            state.settings.concentrate,
            state.settings.heater,
            state.timer.heatTime,
            state.timer.coolTime
        );
    }
    
    const startBtn = document.getElementById('start-timer');
    if (startBtn) {
        startBtn.innerHTML = '<i class="fas fa-check"></i> Complete!';
        setTimeout(() => {
            startBtn.innerHTML = '<i class="fas fa-play"></i> Start Again';
        }, 3000);
    }
    
    alert('Perfect! Time to dab!');
    console.log('Timer complete!');
}

// Update Timer Display
function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    const modeEl = document.getElementById('timer-mode');
    const progressEl = document.getElementById('timer-progress');
    
    if (timerEl) {
        const mins = Math.floor(state.timer.timeLeft / 60);
        const secs = state.timer.timeLeft % 60;
        timerEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    if (modeEl) {
        modeEl.textContent = state.timer.mode === 'heat' ? 'HEAT UP' : 'COOL DOWN';
    }
    
    if (progressEl && state.timer.totalTime > 0) {
        const progress = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        progressEl.style.width = `${progress}%`;
    }
}

// Update Formula Display
function updateFormulaDisplay() {
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const customHeat = localStorage.getItem('customHeatTime');
    const customCool = localStorage.getItem('customCoolTime');
    
    const heatTime = customHeat ? parseInt(customHeat) : Math.round(material.heatUp * heater.modifier);
    const coolTime = customCool ? parseInt(customCool) : Math.round(material.coolDown * heater.modifier);
    
    const els = {
        material: document.getElementById('formula-material'),
        concentrate: document.getElementById('formula-concentrate'),
        heater: document.getElementById('formula-heater'),
        heatTime: document.getElementById('formula-heat-time'),
        coolTime: document.getElementById('formula-cool-time'),
        totalTime: document.getElementById('formula-total-time')
    };
    
    if (els.material) els.material.textContent = capitalize(state.settings.material);
    if (els.concentrate) els.concentrate.textContent = capitalize(state.settings.concentrate);
    if (els.heater) els.heater.textContent = capitalize(state.settings.heater);
    if (els.heatTime) els.heatTime.textContent = `${heatTime}s`;
    if (els.coolTime) els.coolTime.textContent = `${coolTime}s`;
    if (els.totalTime) els.totalTime.textContent = `${heatTime + coolTime}s`;
}

// Custom Time Inputs
function setupCustomTimeInputs() {
    const savedHeat = localStorage.getItem('customHeatTime');
    const savedCool = localStorage.getItem('customCoolTime');
    
    const timerHeat = document.getElementById('custom-heat-time');
    const timerCool = document.getElementById('custom-cool-time');
    const timerApply = document.getElementById('apply-custom-times');
    
    const settingsHeat = document.getElementById('settings-heat-time');
    const settingsCool = document.getElementById('settings-cool-time');
    const settingsApply = document.getElementById('apply-settings-times');
    
    if (timerHeat && savedHeat) timerHeat.value = savedHeat;
    if (timerCool && savedCool) timerCool.value = savedCool;
    if (settingsHeat && savedHeat) settingsHeat.value = savedHeat;
    if (settingsCool && savedCool) settingsCool.value = savedCool;
    
    if (timerApply) {
        timerApply.addEventListener('click', function() {
            const heat = parseInt(timerHeat.value);
            const cool = parseInt(timerCool.value);
            
            if (heat > 0 && cool > 0) {
                localStorage.setItem('customHeatTime', heat);
                localStorage.setItem('customCoolTime', cool);
                initializeTimer();
                alert('Custom times applied!');
            }
        });
    }
    
    if (settingsApply) {
        settingsApply.addEventListener('click', function() {
            const heat = parseInt(settingsHeat.value);
            const cool = parseInt(settingsCool.value);
            
            if (heat > 0 && cool > 0) {
                localStorage.setItem('customHeatTime', heat);
                localStorage.setItem('customCoolTime', cool);
                
                if (timerHeat) timerHeat.value = heat;
                if (timerCool) timerCool.value = cool;
                
                updateFormulaDisplay();
                alert('Custom times saved!');
            }
        });
    }
}

// Helper
function capitalize(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

console.log('DabTimer Loaded!');