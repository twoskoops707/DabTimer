// DabTimer - Complete Working Application
console.log('🔥 DabTimer Loading...');

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

// Configuration - NEW TIMINGS per requirements
const CONFIG = {
    materials: {
        quartz: { heatUp: 13, coolDown: 70 },
        titanium: { heatUp: 14, coolDown: 63 },
        ceramic: { heatUp: 15, coolDown: 80 }
    },
    heaters: {
        butane: { heatModifier: 1.0, coolModifier: 1.0 },
        propane: { heatModifier: 0.8, coolModifier: 0.85 }
    },
    concentrates: {
        shatter: { coolModifier: 1.0 },
        wax: { coolModifier: 0.97 },
        resin: { coolModifier: 1.05 },
        rosin: { coolModifier: 1.0 },
        budder: { coolModifier: 0.97 },
        diamonds: { coolModifier: 1.10 },
        sauce: { coolModifier: 1.05 },
        crumble: { coolModifier: 0.97 }
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('✓ DOM Ready');
    initializeApp();
});

function initializeApp() {
    console.log('Initializing DabTimer...');
    
    loadSettings();
    updateClock();
    setInterval(updateClock, 1000);
    setupTabNavigation();
    setupOptionButtons();
    setupTimerControls();
    setupThemeButtons();
    setupCustomTimeInputs();
    updateFormulaDisplay();
    
    console.log('✓ App Initialized Successfully');
}

// Load saved settings from localStorage
function loadSettings() {
    const saved = {
        material: localStorage.getItem('material'),
        concentrate: localStorage.getItem('concentrate'),
        heater: localStorage.getItem('heater'),
        theme: localStorage.getItem('theme')
    };
    
    if (saved.material) state.settings.material = saved.material;
    if (saved.concentrate) state.settings.concentrate = saved.concentrate;
    if (saved.heater) state.settings.heater = saved.heater;
    if (saved.theme) {
        state.settings.theme = saved.theme;
        document.body.setAttribute('data-theme', saved.theme);
    }
    
    setActiveButton('material', state.settings.material);
    setActiveButton('concentrate', state.settings.concentrate);
    setActiveButton('heater', state.settings.heater);
    setActiveTheme(state.settings.theme);
}

function setActiveButton(setting, value) {
    document.querySelectorAll(`[data-setting="${setting}"]`).forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-value') === value);
    });
}

function setActiveTheme(theme) {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-theme') === theme);
    });
}

// Clock Update
function updateClock() {
    const now = new Date();
    const h = now.getHours().toString().padStart(2, '0');
    const m = now.getMinutes().toString().padStart(2, '0');
    const el = document.getElementById('current-time');
    if (el) el.textContent = `${h}:${m}`;
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
    console.log(`Switching to: ${tabId}`);
    
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}

// Option Buttons (Material, Concentrate, Heater)
function setupOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            console.log(`${setting} → ${value}`);
            
            state.settings[setting] = value;
            localStorage.setItem(setting, value);
            
            document.querySelectorAll(`[data-setting="${setting}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            updateFormulaDisplay();
        });
    });
}

// Theme Buttons
function setupThemeButtons() {
    document.querySelectorAll('.theme-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.getAttribute('data-theme');
            console.log(`Theme → ${theme}`);
            
            state.settings.theme = theme;
            localStorage.setItem('theme', theme);
            document.body.setAttribute('data-theme', theme);
            
            document.querySelectorAll('.theme-btn').forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Timer Controls
function setupTimerControls() {
    const homeStart = document.getElementById('start-timer-btn');
    const timerStart = document.getElementById('start-timer');
    const reset = document.getElementById('reset-timer');
    
    if (homeStart) {
        homeStart.addEventListener('click', function() {
            console.log('🚀 Starting timer from home');
            switchToTab('timer-screen');
            initializeTimer();
            startTimer();
        });
    }
    
    if (timerStart) {
        timerStart.addEventListener('click', function() {
            console.log('Timer control clicked');
            toggleTimer();
        });
    }
    
    if (reset) {
        reset.addEventListener('click', function() {
            console.log('Reset clicked');
            resetTimer();
        });
    }
}

// Calculate Times with NEW FORMULA
function calculateTimes() {
    const customHeat = localStorage.getItem('customHeatTime');
    const customCool = localStorage.getItem('customCoolTime');
    
    if (customHeat && customCool) {
        return {
            heatTime: parseInt(customHeat),
            coolTime: parseInt(customCool)
        };
    }
    
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    const concentrate = CONFIG.concentrates[state.settings.concentrate];
    
    // Apply modifiers
    let heatTime = Math.round(material.heatUp * heater.heatModifier);
    let coolTime = Math.round(material.coolDown * heater.coolModifier * concentrate.coolModifier);
    
    // Enforce limits: Heat MAX 18s, Cool MIN 50s
    heatTime = Math.min(heatTime, 18);
    coolTime = Math.max(coolTime, 50);
    
    return { heatTime, coolTime };
}

// Initialize Timer
function initializeTimer() {
    const times = calculateTimes();
    
    state.timer = {
        isRunning: false,
        mode: 'heat up',
        timeLeft: times.heatTime,
        totalTime: times.heatTime,
        heatTime: times.heatTime,
        coolTime: times.coolTime,
        interval: null
    };
    
    updateTimerDisplay();
    updateFormulaDisplay();
    
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start';
    
    console.log(`Timer ready: ${times.heatTime}s heat / ${times.coolTime}s cool`);
}

// Toggle Timer
function toggleTimer() {
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
    
    console.log('▶️ Timer started');
    state.timer.isRunning = true;
    
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-pause"></i> Pause';
    
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

// Pause Timer
function pauseTimer() {
    console.log('⏸️ Timer paused');
    state.timer.isRunning = false;
    
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
    
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Resume';
}

// Reset Timer
function resetTimer() {
    console.log('🔄 Timer reset');
    pauseTimer();
    initializeTimer();
}

// Switch to Cool Down
function switchToCoolDown() {
    console.log('❄️ Cool down phase');
    
    state.timer.mode = 'cool down';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    
    const mode = document.getElementById('timer-mode');
    if (mode) mode.textContent = 'COOL DOWN';
    
    updateTimerDisplay();
}

// Complete Timer
function completeTimer() {
    console.log('✅ Timer complete!');
    pauseTimer();
    
    // Log session
    if (window.logDabSession) {
        window.logDabSession(
            state.settings.material,
            state.settings.concentrate,
            state.settings.heater,
            state.timer.heatTime,
            state.timer.coolTime
        );
    }
    
    // Update UI
    const btn = document.getElementById('start-timer');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Complete!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-play"></i> Start Again';
        }, 3000);
    }
    
    // Show message
    const msg = document.getElementById('completion-message');
    if (msg) {
        msg.textContent = 'enjoy';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 5000);
    }
}

// Update Timer Display
function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    const modeEl = document.getElementById('timer-mode');
    const progressEl = document.getElementById('timer-progress');
    
    if (timerEl) {
        const m = Math.floor(state.timer.timeLeft / 60);
        const s = state.timer.timeLeft % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    if (modeEl) {
        modeEl.textContent = state.timer.mode === 'heat' ? 'HEAT UP' : 'COOL DOWN';
    }
    
    if (progressEl && state.timer.totalTime > 0) {
        const percent = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        progressEl.style.width = `${percent}%`;
    }
}

// Update Formula Display
function updateFormulaDisplay() {
    const times = calculateTimes();
    
    const els = {
        material: document.getElementById('formula-material'),
        concentrate: document.getElementById('formula-concentrate'),
        heater: document.getElementById('formula-heater'),
        heatTime: document.getElementById('formula-heat-time'),
        coolTime: document.getElementById('formula-cool-time'),
        totalTime: document.getElementById('formula-total-time')
    };
    
    if (els.material) els.material.textContent = cap(state.settings.material);
    if (els.concentrate) els.concentrate.textContent = cap(state.settings.concentrate);
    if (els.heater) els.heater.textContent = cap(state.settings.heater);
    if (els.heatTime) els.heatTime.textContent = `${times.heatTime}s`;
    if (els.coolTime) els.coolTime.textContent = `${times.coolTime}s`;
    if (els.totalTime) els.totalTime.textContent = `${times.heatTime + times.coolTime}s`;
}

// Custom Time Inputs
function setupCustomTimeInputs() {
    const heat = document.getElementById('settings-heat-time');
    const cool = document.getElementById('settings-cool-time');
    const apply = document.getElementById('apply-settings-times');
    
    const savedHeat = localStorage.getItem('customHeatTime');
    const savedCool = localStorage.getItem('customCoolTime');
    
    if (heat && savedHeat) heat.value = savedHeat;
    if (cool && savedCool) cool.value = savedCool;
    
    if (apply) {
        apply.addEventListener('click', function() {
            const h = parseInt(heat.value);
            const c = parseInt(cool.value);
            
            if (h > 0 && c > 0) {
                localStorage.setItem('customHeatTime', h);
                localStorage.setItem('customCoolTime', c);
                updateFormulaDisplay();
                alert('✓ Custom times saved!');
                console.log(`Custom: ${h}s / ${c}s`);
            } else {
                alert('Please enter valid times');
            }
        });
    }
}

// Helper
function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

console.log('✓ DabTimer Loaded');