// App Configuration
const CONFIG = {
    materials: {
        quartz: { heatUp: 30, coolDown: 45 },
        titanium: { heatUp: 20, coolDown: 60 },
        ceramic: { heatUp: 45, coolDown: 50 }
    },
    concentrates: {
        shatter: { idealTemp: '315-400°F' },
        wax: { idealTemp: '350-450°F' },
        resin: { idealTemp: '400-500°F' },
        rosin: { idealTemp: '380-450°F' }
    },
    heaters: {
        torch: { modifier: 1.0 },
        enail: { modifier: 0.8 },
        ebanger: { modifier: 0.9 }
    }
};

// App State
let state = {
    currentTab: 'timer-screen',
    timer: {
        isRunning: false,
        mode: 'heat', // 'heat' or 'cool'
        timeLeft: 0,
        totalTime: 0,
        interval: null
    },
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch',
        display: 'digital'
    },
    usage: {}
};

// DOM Elements
const elements = {
    splashScreen: document.getElementById('splash-screen'),
    app: document.getElementById('app'),
    currentTime: document.getElementById('current-time'),
    timerMode: document.getElementById('timer-mode'),
    timer: document.getElementById('timer'),
    timerProgress: document.getElementById('timer-progress'),
    startTimer: document.getElementById('start-timer'),
    resetTimer: document.getElementById('reset-timer'),
    currentMaterial: document.getElementById('current-material'),
    currentConcentrate: document.getElementById('current-concentrate'),
    currentHeater: document.getElementById('current-heater'),
    tabButtons: document.querySelectorAll('.tab-btn'),
    tabContents: document.querySelectorAll('.tab-content'),
    optionButtons: document.querySelectorAll('.option-btn'),
    presetButtons: document.querySelectorAll('.preset-btn'),
    getStarted: document.getElementById('get-started')
};

// Initialize the app
function initApp() {
    updateCurrentTime();
    setInterval(updateCurrentTime, 1000);
    
    // Load saved settings and usage data
    loadSettings();
    loadUsageData();
    
    // Setup event listeners
    setupEventListeners();
    
    // Update UI based on settings
    updateSettingsDisplay();
}

// Update current time display
function updateCurrentTime() {
    const now = new Date();
    elements.currentTime.textContent = now.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
}

// Setup all event listeners
function setupEventListeners() {
    // Tab navigation
    elements.tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            switchTab(button.dataset.tab);
        });
    });
    
    // Option buttons in settings
    elements.optionButtons.forEach(button => {
        button.addEventListener('click', () => {
            const group = button.parentElement;
            const siblings = group.querySelectorAll('.option-btn');
            
            siblings.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            
            // Update settings based on which group this button is in
            if (group.parentElement.querySelector('h3').textContent === 'Material') {
                state.settings.material = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Concentrate Type') {
                state.settings.concentrate = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Heating Element') {
                state.settings.heater = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Timer Display') {
                state.settings.display = button.dataset.value;
            }
            
            updateSettingsDisplay();
            saveSettings();
        });
    });
    
    // Preset buttons
    elements.presetButtons.forEach(button => {
        button.addEventListener('click', () => {
            const preset = button.dataset.preset;
            applyPreset(preset);
        });
    });
    
    // Timer controls
    elements.startTimer.addEventListener('click', toggleTimer);
    elements.resetTimer.addEventListener('click', resetTimer);
    
    // Get started button
    elements.getStarted.addEventListener('click', () => {
        elements.splashScreen.classList.remove('active');
        elements.app.classList.add('active');
        switchTab('setup-screen');
    });
}

// Switch between tabs
function switchTab(tabId) {
    // Update tab buttons
    elements.tabButtons.forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    // Update tab contents
    elements.tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    state.currentTab = tabId;
}

// Update settings display
function updateSettingsDisplay() {
    elements.currentMaterial.textContent = state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1);
    elements.currentConcentrate.textContent = state.settings.concentrate.charAt(0).toUpperCase() + state.settings.concentrate.slice(1);
    elements.currentHeater.textContent = state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1);
    
    // Update science tab based on concentrate
    document.querySelectorAll('.concentrate-info').forEach(info => {
        info.classList.remove('active');
    });
    document.getElementById(`${state.settings.concentrate}-info`).classList.add('active');
}

// Apply a preset configuration
function applyPreset(preset) {
    switch(preset) {
        case 'low':
            state.settings.material = 'quartz';
            state.settings.concentrate = 'shatter';
            state.settings.heater = 'torch';
            break;
        case 'medium':
            state.settings.material = 'titanium';
            state.settings.concentrate = 'wax';
            state.settings.heater = 'enail';
            break;
        case 'high':
            state.settings.material = 'ceramic';
            state.settings.concentrate = 'resin';
            state.settings.heater = 'ebanger';
            break;
    }
    
    // Update UI to reflect new settings
    updateOptionButtons();
    updateSettingsDisplay();
    saveSettings();
}

// Update option buttons based on current settings
function updateOptionButtons() {
    elements.optionButtons.forEach(button => {
        const group = button.parentElement;
        const settingType = group.parentElement.querySelector('h3').textContent;
        
        let currentValue;
        switch(settingType) {
            case 'Material':
                currentValue = state.settings.material;
                break;
            case 'Concentrate Type':
                currentValue = state.settings.concentrate;
                break;
            case 'Heating Element':
                currentValue = state.settings.heater;
                break;
            case 'Timer Display':
                currentValue = state.settings.display;
                break;
        }
        
        if (button.dataset.value === currentValue) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
}

// Toggle timer between running and paused
function toggleTimer() {
    if (state.timer.isRunning) {
        pauseTimer();
    } else {
        startTimer();
    }
}

// Start the timer
function startTimer() {
    if (state.timer.isRunning) return;
    
    // If timer is at 0, initialize it
    if (state.timer.timeLeft === 0) {
        initializeTimer();
    }
    
    state.timer.isRunning = true;
    elements.startTimer.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
    state.timer.interval = setInterval(() => {
        state.timer.timeLeft--;
        
        // Update display
        updateTimerDisplay();
        
        // Check if time is up
        if (state.timer.timeLeft <= 0) {
            if (state.timer.mode === 'heat') {
                // Switch to cool down mode
                switchToCoolDown();
            } else {
                // Timer complete
                completeTimer();
            }
        }
    }, 1000);
}

// Pause the timer
function pauseTimer() {
    if (!state.timer.isRunning) return;
    
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Resume';
}

// Reset the timer
function resetTimer() {
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = 0;
    state.timer.totalTime = 0;
    
    elements.timerMode.textContent = 'HEAT UP';
    elements.timer.textContent = '0:00';
    elements.timerProgress.style.width = '0%';
    elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Start';
}

// Initialize timer based on current settings
function initializeTimer() {
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    // Calculate times with heater modifier
    const heatUpTime = Math.round(material.heatUp * heater.modifier);
    const coolDownTime = Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = heatUpTime;
    state.timer.totalTime = heatUpTime;
    
    elements.timerMode.textContent = 'HEAT UP';
    updateTimerDisplay();
    
    // Record usage
    recordUsage();
}

// Switch to cool down mode
function switchToCoolDown() {
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const coolDownTime = Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'cool';
    state.timer.timeLeft = coolDownTime;
    state.timer.totalTime = coolDownTime;
    
    elements.timerMode.textContent = 'COOL DOWN';
    updateTimerDisplay();
}

// Complete the timer
function completeTimer() {
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    
    elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Start Again';
    
    // Play sound
    playAlarmSound();
    
    // Show notification
    showNotification('Dab time! Your concentrate is at the perfect temperature.');
}

// Update timer display
function updateTimerDisplay() {
    const minutes = Math.floor(state.timer.timeLeft / 60);
    const seconds = state.timer.timeLeft % 60;
    
    elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    
    // Update progress bar
    const progress = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
    elements.timerProgress.style.width = `${progress}%`;
}

// Play alarm sound
function playAlarmSound() {
    // In a real app, this would play an actual sound file
    console.log('Playing alarm sound');
}

// Show notification
function showNotification(message) {
    // In a real app, this would show a system notification
    console.log('Notification:', message);
}

// Record usage in calendar
function recordUsage() {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    
    if (!state.usage[today]) {
        state.usage[today] = {
            count: 0,
            concentrates: {}
        };
    }
    
    state.usage[today].count++;
    
    const concentrate = state.settings.concentrate;
    if (!state.usage[today].concentrates[concentrate]) {
        state.usage[today].concentrates[concentrate] = 0;
    }
    state.usage[today].concentrates[concentrate]++;
    
    saveUsageData();
    updateCalendarDisplay();
}

// Update calendar display
function updateCalendarDisplay() {
    // This would update the calendar view with usage data
    console.log('Updating calendar display');
}

// Load settings from localStorage
function loadSettings() {
    const savedSettings = localStorage.getItem('dabTimer_settings');
    if (savedSettings) {
        state.settings = { ...state.settings, ...JSON.parse(savedSettings) };
    }
}

// Save settings to localStorage
function saveSettings() {
    localStorage.setItem('dabTimer_settings', JSON.stringify(state.settings));
}

// Load usage data from localStorage
function loadUsageData() {
    const savedUsage = localStorage.getItem('dabTimer_usage');
    if (savedUsage) {
        state.usage = JSON.parse(savedUsage);
    }
}

// Save usage data to localStorage
function saveUsageData() {
    localStorage.setItem('dabTimer_usage', JSON.stringify(state.usage));
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);
