// DabTimer - COMPLETE WORKING VERSION WITH BIRTHDAY VERIFICATION
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

// Configuration
const CONFIG = {
    materials: {
        quartz: { heatUp: 12, coolDown: 60 },
        titanium: { heatUp: 10, coolDown: 50 },
        ceramic: { heatUp: 15, coolDown: 75 }
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
    
    const isVerified = localStorage.getItem('ageVerified');
    const ageScreen = document.getElementById('age-verification');
    
    if (isVerified === 'true' || !ageScreen) {
        if (ageScreen) ageScreen.style.display = 'none';
        initializeApp();
    } else {
        setupAgeVerification();
    }
});

// Calculate age from birthdate
function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
    }
    
    return age;
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('age-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => {
            errorDiv.classList.remove('show');
        }, 5000);
    } else {
        alert(message);
    }
}

// Setup age verification
function setupAgeVerification() {
    const yesBtn = document.getElementById('verify-yes');
    const noBtn = document.getElementById('verify-no');
    const stateSelect = document.getElementById('user-state');
    const birthdateInput = document.getElementById('user-birthdate');
    
    console.log('Setting up age verification');
    
    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            const selectedState = stateSelect ? stateSelect.value : '';
            const birthdate = birthdateInput ? birthdateInput.value : '';
            
            console.log('Verify clicked:', { state: selectedState, birthdate: birthdate });
            
            if (!selectedState) {
                showError('Please select your state');
                return;
            }
            
            if (!birthdate) {
                showError('Please enter your date of birth');
                return;
            }
            
            const age = calculateAge(birthdate);
            console.log('Age:', age);
            
            if (age < 21) {
                showError('You must be 21 or older to use this app');
                return;
            }
            
            // Success!
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('userState', selectedState);
            localStorage.setItem('userBirthdate', birthdate);
            
            const ageScreen = document.getElementById('age-verification');
            if (ageScreen) {
                ageScreen.style.display = 'none';
            }
            
            initializeApp();
        });
    }
    
    if (noBtn) {
        noBtn.addEventListener('click', function() {
            showError('You must be 21 or older to use this app');
        });
    }
}

// ============ MAIN APP INITIALIZATION ============
function initializeApp() {
    console.log('🚀 Initializing DabTimer...');
    
    addSampleDataIfNeeded();
    loadSettings();
    updateClock();
    setInterval(updateClock, 1000);
    setupTabNavigation();
    setupOptionButtons();
    setupTimerControls();
    setupThemeButtons();
    setupCustomTimeInputs();
    updateFormulaDisplay();
    
    console.log('✅ App Ready!');
}

// Add sample data
function addSampleDataIfNeeded() {
    const existing = localStorage.getItem('dabSessions');
    if (!existing || JSON.parse(existing).length === 0) {
        const sampleData = [
            { id: Date.now() - 432000000, date: new Date(Date.now() - 432000000).toISOString(), material: "quartz", concentrate: "shatter", heater: "butane", heatTime: 12, coolTime: 60, totalTime: 72 },
            { id: Date.now() - 86400000, date: new Date(Date.now() - 86400000).toISOString(), material: "titanium", concentrate: "wax", heater: "butane", heatTime: 10, coolTime: 50, totalTime: 60 }
        ];
        localStorage.setItem('dabSessions', JSON.stringify(sampleData));
        console.log('✓ Sample data added');
    }
}

// Load settings
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

// Clock
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
    console.log('✓ Navigation ready');
}

function switchToTab(tabId) {
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
}

// Option Buttons
function setupOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            state.settings[setting] = value;
            localStorage.setItem(setting, value);
            
            document.querySelectorAll(`[data-setting="${setting}"]`).forEach(b => {
                b.classList.remove('active');
            });
            this.classList.add('active');
            
            updateFormulaDisplay();
        });
    });
    console.log('✓ Buttons ready');
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
        });
    });
    console.log('✓ Themes ready');
}

// Timer Controls
function setupTimerControls() {
    const homeStart = document.getElementById('start-timer-btn');
    const timerStart = document.getElementById('start-timer');
    const reset = document.getElementById('reset-timer');
    
    if (homeStart) {
        homeStart.addEventListener('click', function() {
            switchToTab('timer-screen');
            initializeTimer();
            startTimer();
        });
    }
    
    if (timerStart) {
        timerStart.addEventListener('click', toggleTimer);
    }
    
    if (reset) {
        reset.addEventListener('click', resetTimer);
    }
    
    console.log('✓ Timer controls ready');
}

// Calculate Times
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
    
    let heatTime = Math.round(material.heatUp * heater.heatModifier);
    let coolTime = Math.round(material.coolDown * heater.coolModifier * concentrate.coolModifier);
    
    heatTime = Math.min(heatTime, 15);
    coolTime = Math.max(coolTime, 50);
    
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
    
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start';
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
    pauseTimer();
    initializeTimer();
}

// Switch to Cool Down
function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    
    const mode = document.getElementById('timer-mode');
    if (mode) mode.textContent = 'COOL DOWN';
    
    updateTimerDisplay();
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
    
    const btn = document.getElementById('start-timer');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Complete!';
        setTimeout(() => {
            btn.innerHTML = '<i class="fas fa-play"></i> Start Again';
        }, 3000);
    }
    
    const msg = document.getElementById('completion-message');
    if (msg) {
        msg.innerHTML = '<div class="spinning-leaf"><i class="fas fa-cannabis"></i></div><div class="enjoy-text">enjoy!</div>';
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
            } else {
                alert('Please enter valid times');
            }
        });
    }
    console.log('✓ Custom times ready');
}

// Helper
function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

console.log('✅ DabTimer Ready!');