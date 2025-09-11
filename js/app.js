console.log("Dab Timer - Full Functionality");

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
        lighter: { modifier: 2.0 }
    }
};

// App State
let state = {
    currentTab: 'home-screen',
    timer: {
        isRunning: false,
        mode: 'heat',
        timeLeft: 0,
        totalTime: 0,
        interval: null
    },
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch'
    },
    usage: {}
};

// DOM Elements
let elements = {};

document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready - initializing full app");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing full application...");
    
    // Initialize elements
    elements = {
        currentTime: document.getElementById('current-time'),
        timerMode: document.getElementById('timer-mode'),
        timer: document.getElementById('timer'),
        timerProgress: document.getElementById('timer-progress'),
        startTimer: document.getElementById('start-timer'),
        resetTimer: document.getElementById('reset-timer'),
        currentMaterial: document.getElementById('current-material'),
        currentConcentrate: document.getElementById('current-concentrate'),
        currentHeater: document.getElementById('current-heater')
    };
    
    // Setup functionality
    setupOptions();
    setupStartButton();
    setupTabs();
    setupTimerControls();
    startClock();
    
    // Load saved data
    loadSettings();
    loadUsageData();
    
    console.log("Full app initialized");
}

function setupOptions() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.addEventListener('click', function() {
            const settingType = this.dataset.setting;
            const value = this.dataset.value;
            
            if (settingType && value) {
                // Remove active from siblings
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll('.option-btn');
                siblings.forEach(sib => sib.classList.remove('active'));
                
                // Add active to clicked
                this.classList.add('active');
                
                // Update state
                state.settings[settingType] = value;
                updateSettingsDisplay();
                saveSettings();
                
                console.log("Setting changed:", settingType, "=", value);
            }
        });
    });
}

function setupStartButton() {
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
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

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            switchToTab(tabId);
        });
    });
}

function switchToTab(tabId) {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
    
    state.currentTab = tabId;
}

function updateSettingsDisplay() {
    if (elements.currentMaterial) {
        elements.currentMaterial.textContent = state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1);
    }
    if (elements.currentConcentrate) {
        elements.currentConcentrate.textContent = state.settings.concentrate.charAt(0).toUpperCase() + state.settings.concentrate.slice(1);
    }
    if (elements.currentHeater) {
        elements.currentHeater.textContent = state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1);
    }
}

function initializeTimer() {
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const heatUpTime = Math.round(material.heatUp * heater.modifier);
    const coolDownTime = Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = heatUpTime;
    state.timer.totalTime = heatUpTime;
    
    if (elements.timerMode) elements.timerMode.textContent = 'HEAT UP';
    updateTimerDisplay();
    
    // Record usage
    recordUsage();
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
    
    if (state.timer.timeLeft === 0) {
        initializeTimer();
    }
    
    state.timer.isRunning = true;
    if (elements.startTimer) {
        elements.startTimer.innerHTML = '<i class="fas fa-pause"></i> Pause';
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
}

function pauseTimer() {
    if (!state.timer.isRunning) return;
    
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    if (elements.startTimer) {
        elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Resume';
    }
}

function resetTimer() {
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = 0;
    state.timer.totalTime = 0;
    
    if (elements.timerMode) elements.timerMode.textContent = 'HEAT UP';
    if (elements.timer) elements.timer.textContent = '0:00';
    if (elements.timerProgress) elements.timerProgress.style.width = '0%';
    if (elements.startTimer) elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Start';
}

function switchToCoolDown() {
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const coolDownTime = Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'cool';
    state.timer.timeLeft = coolDownTime;
    state.timer.totalTime = coolDownTime;
    
    if (elements.timerMode) elements.timerMode.textContent = 'COOL DOWN';
    updateTimerDisplay();
}

function completeTimer() {
    state.timer.isRunning = false;
    clearInterval(state.timer.interval);
    
    if (elements.startTimer) {
        elements.startTimer.innerHTML = '<i class="fas fa-play"></i> Start Again';
    }
    
    // Play sound and show notification
    playAlarmSound();
    showNotification('Dab time! Your concentrate is at the perfect temperature.');
}

function updateTimerDisplay() {
    if (elements.timer) {
        const minutes = Math.floor(state.timer.timeLeft / 60);
        const seconds = state.timer.timeLeft % 60;
        elements.timer.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (elements.timerProgress && state.timer.totalTime > 0) {
        const progress = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        elements.timerProgress.style.width = `${progress}%`;
    }
}

function playAlarmSound() {
    // Would play actual sound file in production
    console.log("Alarm sound should play here");
}

function showNotification(message) {
    // Create a simple notification
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

function recordUsage() {
    const today = new Date().toISOString().split('T')[0];
    
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
}

function startClock() {
    updateClock();
    setInterval(updateClock, 60000);
}

function updateClock() {
    if (elements.currentTime) {
        const now = new Date();
        elements.currentTime.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

function loadSettings() {
    const saved = localStorage.getItem('dabTimer_settings');
    if (saved) {
        state.settings = JSON.parse(saved);
        updateSettingsDisplay();
        updateOptionButtons();
    }
}

function saveSettings() {
    localStorage.setItem('dabTimer_settings', JSON.stringify(state.settings));
}

function loadUsageData() {
    const saved = localStorage.getItem('dabTimer_usage');
    if (saved) {
        state.usage = JSON.parse(saved);
    }
}

function saveUsageData() {
    localStorage.setItem('dabTimer_usage', JSON.stringify(state.usage));
}

function updateOptionButtons() {
    // Update button states based on current settings
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        const settingType = btn.dataset.setting;
        const value = btn.dataset.value;
        
        if (settingType && value && state.settings[settingType] === value) {
            btn.classList.add('active');
        }
    });
}
