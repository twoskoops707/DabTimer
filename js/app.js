console.log("Dab Timer - Clean Version");

// Constants
const DEBOUNCE_DELAY = 300;
const TIMER_INTERVAL_MS = 1000;
const COMPLETION_COLOR = "#4CAF50";
const COMPLETION_FLASH_DURATION = 2000;
const PROGRESS_RESET_VALUE = "0%";
const MIN_EFFICIENCY_FACTOR = 0.5;
const MAX_EFFICIENCY_FACTOR = 3;
const MIN_EFFICIENCY_FACTOR = 0.5;
const MAX_EFFICIENCY_FACTOR = 3;
const TIMER_INTERVAL = 1000;
const MIN_HEAT_TIME = 5;
const MAX_HEAT_TIME = 300;
const MIN_COOL_TIME = 5;
const MAX_COOL_TIME = 600;
const BASE_TEMP = 177;
const BASE_TIME = 20;

// App Configuration with validation
const CONFIG = {
    materials: {
        quartz: { specificHeat: 0.84, density: 2.65, thicknessFactor: 1.0, coolMultiplier: 1.5 },
        titanium: { specificHeat: 0.52, density: 4.51, thicknessFactor: 0.8, coolMultiplier: 2.2 },
        ceramic: { specificHeat: 1.05, density: 2.5, thicknessFactor: 1.2, coolMultiplier: 1.8 }
    },
    concentrates: {
        shatter: { idealTemp: 157 },
        wax: { idealTemp: 177 },
        resin: { idealTemp: 204 },
        rosin: { idealTemp: 190 },
        budder: { idealTemp: 177 },
        diamonds: { idealTemp: 204 },
        sauce: { idealTemp: 190 },
        crumble: { idealTemp: 182 }
    },
    heaters: {
        torch: { efficiency: 0.85 },
        lighter: { efficiency: 0.45 }
    }
};

// Validate configuration on load
function validateConfig() {
    const errors = [];
    
    // Validate materials
    Object.entries(CONFIG.materials).forEach(([key, value]) => {
        if (value.specificHeat <= 0 || value.density <= 0 || value.thicknessFactor <= 0 || value.coolMultiplier <= 0) {
            errors.push(`Invalid material properties for ${key}`);
        }
    });
    
    // Validate concentrates
    Object.entries(CONFIG.concentrates).forEach(([key, value]) => {
        if (typeof value.idealTemp !== 'number' || value.idealTemp <= 0) {
            errors.push(`Invalid idealTemp for ${key}`);
        }
    });
    
    // Validate heaters
    Object.entries(CONFIG.heaters).forEach(([key, value]) => {
        if (value.efficiency <= 0 || value.efficiency > 1) {
            errors.push(`Invalid efficiency for ${key}`);
        }
    });
    
    if (errors.length > 0) {
        console.error('Configuration errors:', errors);
        return false;
    }
    return true;
}

// App State with validation
let state = {
    currentTab: 'home-screen',
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch'
    },
    timer: {
        isRunning: false,
        mode: 'heat',
        timeLeft: 0,
        heatTime: 0,
        coolTime: 0,
        interval: null,
        lastUpdate: Date.now()
    },
    clockInterval: null,
    lastOptionClick: 0,
    isInitialized: false
};

// Helper functions
function capitalize(str) {
    return typeof str === 'string' && str.length > 0 ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

function getElement(id) {
    const element = document.getElementById(id);
    if (!element) {
        console.warn(`Element not found: ${id}`);
    }
    return element;
}

function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

// Safe DOM operations
function safeTextContent(element, text) {
    if (element && typeof text !== 'undefined') {
        element.textContent = text;
    }
}

function safeSetAttribute(element, attr, value) {
    if (element) {
        element.setAttribute(attr, value);
    }
}

function safeToggleClass(element, className, condition) {
    if (element) {
        element.classList.toggle(className, condition);
    }
}

// Initialize the app
function initializeApp() {
    updateOptionButtonsUI();
    if (state.isInitialized) {
        console.warn('App already initialized');
        return;
    }
    
    console.log("Initializing app...");
    
    if (!validateConfig()) {
        console.error('Invalid configuration - using fallback values');
    }
    
    startClock();
    setupTabNavigation();
    setupOptionButtons();
    setupTimer();
    loadSettings();
    updateAllDisplays();
    
    state.isInitialized = true;
    console.log("App initialized");
}

// Clock functions
function updateClock() {
    const clockElement = getElement('current-time');
    if (clockElement) {
        const now = new Date();
        clockElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
}

function startClock() {
    if (state.clockInterval) {
        clearInterval(state.clockInterval);
    }
    updateClock();
    state.clockInterval = setInterval(updateClock, 1000);
}

// Tab navigation
function setupTabNavigation() {
    // Remove existing listeners to prevent duplicates
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.removeEventListener('click', handleTabClick);
        btn.removeEventListener('keydown', handleTabKeydown);
    });
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.removeEventListener('click', handleOptionClick);
        btn.removeEventListener('keydown', handleOptionKeydown);
    });
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length === 0) return;
    
    tabBtns.forEach(btn => {
        // Remove existing listeners to prevent duplicates
    });
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', handleTabClick);
        // Add aria-controls for accessibility
        if (btn.dataset.tab) {
        }
        // Add aria-controls for accessibility
        if (btn.dataset.tab) {
        }
        btn.addEventListener('keydown', handleTabKeydown);
    });
}

function handleTabClick() {
    const tabId = this.dataset.tab;
    if (tabId && getElement(tabId)) {
        switchToTab(tabId);
    }
}

function handleTabKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
    }
}

function switchToTab(tabId) {
    if (!tabId || !getElement(tabId)) return;
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const isActive = btn.dataset.tab === tabId;
        safeToggleClass(btn, 'active', isActive);
        safeSetAttribute(btn, 'aria-selected', isActive.toString());
    });

    document.querySelectorAll('.tab-content').forEach(content => {
        const isActive = content.id === tabId;
        safeToggleClass(content, 'active', isActive);
        safeSetAttribute(content, 'aria-hidden', (!isActive).toString());
    });

    state.currentTab = tabId;
    
    if (tabId === 'timer-screen') {
        updateTimerDisplay();
    }
}

// Option buttons
function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    if (optionButtons.length === 0) return;
    
    optionButtons.forEach(btn => {
        btn.addEventListener('click', handleOptionClick);
        btn.addEventListener('keydown', handleOptionKeydown);
    });
}

function handleOptionClick() {
    const now = Date.now();
    if (now - state.lastOptionClick < DEBOUNCE_DELAY) return;
    state.lastOptionClick = now;
    
    const parent = this.parentElement;
    if (!parent) return;
    
    const settingType = this.dataset.setting;
    const value = this.dataset.value;
    
    if (!settingType || !value) return;
    
    // Validate against CONFIG
    if (!isValidSetting(settingType, value)) return;

    updateOptionGroupState(parent, this, settingType, value);
    updateAppState(settingType, value);
}

function handleOptionKeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.click();
    }
}

function isValidSetting(type, value) {
    switch(type) {
        case 'material': return !!CONFIG.materials[value];
        case 'concentrate': return !!CONFIG.concentrates[value];
        case 'heater': return !!CONFIG.heaters[value];
        default: return false;
    }
}

function updateOptionGroupState(parent, clickedBtn, settingType, value) {
    const siblings = parent.querySelectorAll('.option-btn');
    siblings.forEach(sib => {
        safeToggleClass(sib, 'active', sib === clickedBtn);
        safeSetAttribute(sib, 'aria-pressed', (sib === clickedBtn).toString());
    });
}

function updateAppState(settingType, value) {
    state.settings[settingType] = value;
    saveSettings();
    updateAllDisplays();
    
    if (!state.timer.isRunning && state.currentTab === 'timer-screen') {
        initializeTimer();
    }
}

function updateAllDisplays() {
    updateSettingsDisplay();
    updateFormulaDisplay();
}

function updateSettingsDisplay() {
    const { material, concentrate, heater } = state.settings;
    
    safeTextContent(getElement('current-material'), capitalize(material));
    safeTextContent(getElement('current-concentrate'), capitalize(concentrate));
    safeTextContent(getElement('current-heater'), capitalize(heater));
}

// Scientific calculations
function calculateHeatTime(material, heater, concentrate) {
    const materialProps = CONFIG.materials[material] || CONFIG.materials.quartz;
    const concentrateTemp = (CONFIG.concentrates[concentrate] || CONFIG.concentrates.shatter).idealTemp;
    const heaterEff = (CONFIG.heaters[heater] || CONFIG.heaters.torch).efficiency;

    const materialFactor = (materialProps.specificHeat * materialProps.density * materialProps.thicknessFactor) / 
                          (CONFIG.materials.quartz.specificHeat * CONFIG.materials.quartz.density * CONFIG.materials.quartz.thicknessFactor);
    const tempFactor = concentrateTemp / BASE_TEMP;
    const efficiencyFactor = clamp(heaterEff > 0 ? CONFIG.heaters.torch.efficiency / heaterEff : 1, MIN_EFFICIENCY_FACTOR, MAX_EFFICIENCY_FACTOR);

    const result = Math.round(BASE_TIME * materialFactor * tempFactor * efficiencyFactor);
    return clamp(result, MIN_HEAT_TIME, MAX_HEAT_TIME);
}

function calculateCoolTime(material, heatTime) {
    const materialProps = CONFIG.materials[material] || CONFIG.materials.quartz;
    const result = Math.round(heatTime * materialProps.coolMultiplier);
    return clamp(result, MIN_COOL_TIME, MAX_COOL_TIME);
}

function updateFormulaDisplay() {
    const { material, heater, concentrate } = state.settings;
    const heatTime = calculateHeatTime(material, heater, concentrate);
    const coolTime = calculateCoolTime(material, heatTime);

    const elements = {
        material: getElement('formula-material'),
        concentrate: getElement('formula-concentrate'),
        heater: getElement('formula-heater'),
        heatTime: getElement('formula-heat-time'),
        coolTime: getElement('formula-cool-time'),
        totalTime: getElement('formula-total-time')
    };

    safeTextContent(elements.material, capitalize(material));
    safeTextContent(elements.concentrate, capitalize(concentrate));
    safeTextContent(elements.heater, capitalize(heater));
    safeTextContent(elements.heatTime, `${heatTime}s`);
    safeTextContent(elements.coolTime, `${coolTime}s`);
    safeTextContent(elements.totalTime, `${heatTime + coolTime}s`);
}

// Timer functionality
function setupTimer() {
    const startBtn = getElement('start-timer-btn');
    const timerStartBtn = getElement('start-timer');
    const resetBtn = getElement('reset-timer');
    
    if (!startBtn || !timerStartBtn || !resetBtn) return;
    
    startBtn.addEventListener('click', handleStartTimer);
    timerStartBtn.addEventListener('click', handleTimerControl);
    resetBtn.addEventListener('click', handleResetTimer);
    
    // Keyboard support
    [startBtn, timerStartBtn, resetBtn].forEach(btn => {
        btn.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                btn.click();
            }
        });
    });
}

function handleStartTimer() {
    switchToTab('timer-screen');
    initializeTimer();
}

function handleTimerControl() {
    toggleTimer();
}

function handleResetTimer() {
    resetTimer();
}

function initializeTimer() {
    const heatTime = calculateHeatTime(state.settings.material, state.settings.heater, state.settings.concentrate);
    const coolTime = calculateCoolTime(state.settings.material, heatTime);

    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: heatTime,
        heatTime: heatTime,
        coolTime: coolTime,
        interval: null,
        lastUpdate: Date.now()
    };
    updateTimerDisplay();
    updateTimerButtons();
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
    
    clearTimerInterval();
    
    state.timer.isRunning = true;
    state.timer.lastUpdate = Date.now();
    updateTimerButtons();

    state.timer.interval = setInterval(updateTimerTick, TIMER_INTERVAL_MS);
}

function updateTimerTick() {
    const now = Date.now();
    const delta = now - state.timer.lastUpdate;
        const elapsedSeconds = Math.max(1, Math.floor(delta / 1000));
        state.timer.lastUpdate = now - (delta % 1000);  // Compensate for drift
    
    if (elapsedSeconds > 0) {
        state.timer.timeLeft = Math.max(0, state.timer.timeLeft - elapsedSeconds);
        state.timer.lastUpdate = now;
        updateTimerDisplay();

        if (state.timer.timeLeft <= 0) {
            handleTimerCompletion();
        }
    }
}

function handleTimerCompletion() {
    if (state.timer.mode === 'heat') {
        switchToCoolDown();
    } else {
        completeTimer();
    }
}

function pauseTimer() {
    clearTimerInterval();
    state.timer.isRunning = false;
    updateTimerButtons();
}

function clearTimerInterval() {
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
}

function resetTimer() {
    pauseTimer();
    initializeTimer();
}

function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.lastUpdate = Date.now();
    updateTimerDisplay();
    updateTimerButtons();
}

function completeTimer() {
    pauseTimer();
    state.timer.timeLeft = 0;
    updateTimerDisplay();
    updateTimerButtons();
    // Visual completion indicator
    }
    // Visual completion indicator
    }
}

function updateTimerDisplay() {
function updateProgressBar(progress) {
    requestAnimationFrame(() => {
        const progressElement = document.getElementById("timer-progress");
        if (progressElement) {
            updateProgressBar(progress);
        }
    });
}

    const timerElement = getElement('timer');
    const timerModeElement = getElement('timer-mode');
    const progressElement = getElement('timer-progress');

    if (timerElement) {
        const minutes = Math.floor(state.timer.timeLeft / 60);
        const seconds = state.timer.timeLeft % 60;
        timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    safeTextContent(timerModeElement, state.timer.mode.toUpperCase());

    if (progressElement && state.timer.heatTime > 0) {
        const totalTime = state.timer.mode === 'heat' ? state.timer.heatTime : state.timer.coolTime;
        const progress = totalTime > 0 ? clamp(((totalTime - state.timer.timeLeft) / totalTime) * 100, 0, 100) : 0;
        updateProgressBar(progress);
        safeSetAttribute(progressElement, 'aria-valuenow', Math.round(progress).toString());
    }
}

function updateTimerButtons() {
    const startBtn = getElement('start-timer');
    const resetBtn = getElement('reset-timer');
    
    if (startBtn) {
        startBtn.disabled = false;
        startBtn.innerHTML = state.timer.isRunning ? 
            '<i class="fas fa-pause"></i> Pause' : 
            '<i class="fas fa-play"></i> Start';
        safeSetAttribute(startBtn, 'aria-label', state.timer.isRunning ? 'Pause timer' : 'Start timer');
    }
    
    if (resetBtn) {
        resetBtn.disabled = false;
        safeSetAttribute(resetBtn, 'aria-disabled', 'false');
    }
}

// Settings persistence
function saveSettings() {
    try {
        localStorage.setItem('dabTimerSettings', JSON.stringify(state.settings));
    } catch (e) {
        console.warn('Could not save settings to localStorage');
        // Optional: Add visual feedback for storage errors
        console.warn('LocalStorage unavailable - settings not saved');
}
    }
}

function loadSettings() {
    try {
        const saved = localStorage.getItem('dabTimerSettings');
        if (saved) {
            const parsed = JSON.parse(saved);
            
            // Validate loaded settings
            if (isValidSetting('material', parsed.material)) {
                state.settings.material = parsed.material;
            }
            if (isValidSetting('concentrate', parsed.concentrate)) {
                state.settings.concentrate = parsed.concentrate;
            }
            if (isValidSetting('heater', parsed.heater)) {
                state.settings.heater = parsed.heater;
            }
            
            updateOptionButtonsUI();
        }
    } catch (e) {
        console.warn('Could not load settings from localStorage');
    }
}

function updateOptionButtonsUI() {
    Object.entries(state.settings).forEach(([settingType, value]) => {
        const buttons = document.querySelectorAll(`.option-btn[data-setting="${settingType}"]`);
        buttons.forEach(btn => {
            const isActive = btn.dataset.value === value;
            safeToggleClass(btn, 'active', isActive);
            safeSetAttribute(btn, 'aria-pressed', isActive.toString());
        });
    });
}

// Cleanup function
function cleanupApp() {
    clearTimerInterval();
    if (state.clockInterval) {
        clearInterval(state.clockInterval);
        state.clockInterval = null;
    }
    
    // Remove event listeners
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.removeEventListener('click', handleTabClick);
        btn.removeEventListener('keydown', handleTabKeydown);
    });
    
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.removeEventListener('click', handleOptionClick);
        btn.removeEventListener('keydown', handleOptionKeydown);
    });
    
    state.isInitialized = false;
}

// Handle page visibility
document.addEventListener('visibilitychange', function() {
    if (document.hidden && state.timer.isRunning) {
        state.timer.lastUpdate = Date.now();
    }
});

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Handle page unload
window.addEventListener('beforeunload', cleanupApp);
window.addEventListener('unload', cleanupApp);
