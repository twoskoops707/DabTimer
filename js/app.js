// App Configuration
const CONFIG = {
    materials: {
        quartz: { 
            thermalConductivity: 1.4,
            specificHeat: 0.75,
            thickness: {
                "1mm": { baseHeat: 15, baseCool: 25 },
                "2mm": { baseHeat: 25, baseCool: 40 },
                "4mm": { baseHeat: 40, baseCool: 60 }
            }
        },
        titanium: { 
            thermalConductivity: 22,
            specificHeat: 0.52,
            baseHeat: 20,
            baseCool: 30
        },
        ceramic: { 
            thermalConductivity: 1.5,
            specificHeat: 0.85,
            baseHeat: 45,
            baseCool: 65
        }
    },
    heatingElements: {
        butane_torch: { 
            modifier: 1.0,
            maxTemp: 1430,
            efficiency: 0.85
        },
        bic_lighter: { 
            modifier: 2.2,
            maxTemp: 850,
            efficiency: 0.45
        },
        acetylene_torch: { 
            modifier: 0.6,
            maxTemp: 2530,
            efficiency: 0.95
        }
    },
    concentrates: {
        shatter: { 
            idealTemp: '315-400°F',
            heatModifier: 1.0,
            description: 'A translucent, glass-like extract that fractures easily. High THC content with preserved terpene profile.',
            thc: '70-90%',
            terpenes: 'Pinene, Myrcene, Limonene'
        },
        wax: { 
            idealTemp: '350-450°F',
            heatModifier: 1.1,
            description: 'Opaque, butter-like consistency. Rich in terpenes with balanced flavor and potency.',
            thc: '60-80%',
            terpenes: 'Caryophyllene, Linalool, Humulene'
        },
        resin: { 
            idealTemp: '400-500°F',
            heatModifier: 1.2,
            description: 'Full-spectrum extract from fresh frozen material. Exceptional terpene preservation and flavor complexity.',
            thc: '65-85%',
            terpenes: 'Terpinolene, Ocimene, Terpineol'
        },
        rosin: { 
            idealTemp: '380-450°F',
            heatModifier: 0.9,
            description: 'Solventless extract using heat and pressure. Purest form with complete cannabinoid profile.',
            thc: '60-80%',
            terpenes: 'Myrcene, Pinene, Caryophyllene'
        },
        budder: { 
            idealTemp: '375-425°F',
            heatModifier: 1.0,
            description: 'Whipped consistency with creamy texture. High terpene content and smooth vaporization.',
            thc: '70-85%',
            terpenes: 'Limonene, Pinene, Myrcene'
        }
    },
    rigTypes: {
        mini_rig: { heatModifier: 0.8, coolModifier: 0.9 },
        standard_rig: { heatModifier: 1.0, coolModifier: 1.0 },
        recycler: { heatModifier: 1.1, coolModifier: 1.2 }
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
        thickness: '2mm',
        concentrate: 'shatter',
        heater: 'butane_torch',
        rigType: 'standard_rig',
        useCustomTimes: false,
        customHeat: 30,
        customCool: 45
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
    getStarted: document.getElementById('get-started'),
    customHeatInput: document.getElementById('custom-heat'),
    customCoolInput: document.getElementById('custom-cool'),
    applyCustomTimes: document.getElementById('apply-custom-times')
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
    
    // Set initial custom time values
    elements.customHeatInput.value = state.settings.customHeat;
    elements.customCoolInput.value = state.settings.customCool;
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
            } else if (group.parentElement.querySelector('h3').textContent === 'Thickness') {
                state.settings.thickness = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Heating Element') {
                state.settings.heater = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Concentrate Type') {
                state.settings.concentrate = button.dataset.value;
            } else if (group.parentElement.querySelector('h3').textContent === 'Rig Type') {
                state.settings.rigType = button.dataset.value;
            }
            
            updateSettingsDisplay();
            saveSettings();
        });
    });
    
    // Rig type buttons
    document.querySelectorAll('.rig-type-btn').forEach(button => {
        button.addEventListener('click', () => {
            const rigType = button.dataset.value;
            
            // Update active state
            document.querySelectorAll('.rig-type-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            button.classList.add('active');
            
            // Update settings
            state.settings.rigType = rigType;
            updateSettingsDisplay();
            saveSettings();
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
    
    // Custom time inputs
    elements.applyCustomTimes.addEventListener('click', () => {
        const customHeat = parseInt(elements.customHeatInput.value);
        const customCool = parseInt(elements.customCoolInput.value);
        
        if (customHeat && customCool && customHeat > 0 && customCool > 0) {
            state.settings.customHeat = customHeat;
            state.settings.customCool = customCool;
            state.settings.useCustomTimes = true;
            
            showNotification('Custom times applied successfully!');
            saveSettings();
        } else {
            showNotification('Please enter valid times (10-180 seconds)');
        }
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
    elements.currentHeater.textContent = state.settings.heater.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    
    // Update science tab based on concentrate
    document.querySelectorAll('.concentrate-info').forEach(info => {
        info.classList.remove('active');
    });
    document.getElementById(`${state.settings.concentrate}-info`).classList.add('active');
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
    const times = calculateTimes();
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = times.heatUpTime;
    state.timer.totalTime = times.heatUpTime;
    
    elements.timerMode.textContent = 'HEAT UP';
    updateTimerDisplay();
    
    // Record usage
    recordUsage();
}

// Calculate times based on settings
function calculateTimes() {
    if (state.settings.useCustomTimes) {
        return {
            heatUpTime: state.settings.customHeat,
            coolDownTime: state.settings.customCool
        };
    }
    
    const material = state.settings.material;
    const thickness = state.settings.thickness;
    const heater = state.settings.heater;
    const concentrate = state.settings.concentrate;
    const rigType = state.settings.rigType;
    
    let baseHeatTime = 0;
    let baseCoolTime = 0;
    
    // Get base times based on material and thickness
    if (material === 'quartz') {
        const materialConfig = CONFIG.materials.quartz.thickness[thickness];
        baseHeatTime = materialConfig.baseHeat;
        baseCoolTime = materialConfig.baseCool;
    } else {
        baseHeatTime = CONFIG.materials[material].baseHeat;
        baseCoolTime = CONFIG.materials[material].baseCool;
    }
    
    // Apply heater modifier
    const heaterModifier = CONFIG.heatingElements[heater].modifier;
    baseHeatTime = Math.round(baseHeatTime * heaterModifier);
    
    // Apply concentrate modifier
    const concentrateModifier = CONFIG.concentrates[concentrate].heatModifier;
    baseHeatTime = Math.round(baseHeatTime * concentrateModifier);
    baseCoolTime = Math.round(baseCoolTime * concentrateModifier);
    
    // Apply rig type modifier
    const rigHeatModifier = CONFIG.rigTypes[rigType].heatModifier;
    const rigCoolModifier = CONFIG.rigTypes[rigType].coolModifier;
    baseHeatTime = Math.round(baseHeatTime * rigHeatModifier);
    baseCoolTime = Math.round(baseCoolTime * rigCoolModifier);
    
    return { 
        heatUpTime: Math.max(10, baseHeatTime),
        coolDownTime: Math.max(15, baseCoolTime)
    };
}

// Switch to cool down mode
function switchToCoolDown() {
    const times = calculateTimes();
    
    state.timer.mode = 'cool';
    state.timer.timeLeft = times.coolDownTime;
    state.timer.totalTime = times.coolDownTime;
    
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
    const audio = new Audio('sounds/alarm.mp3');
    audio.play().catch(e => {
        console.log('Audio play failed:', e);
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: var(--primary-color);
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    `;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
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
