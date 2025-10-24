// DabTimer - MINIMAL WORKING VERSION
console.log('🔥 DabTimer Starting...');

const state = {
    settings: { material: 'quartz', concentrate: 'shatter', heater: 'butane', theme: 'green', useCustomTimer: false },
    timer: { isRunning: false, mode: 'heat', timeLeft: 0, totalTime: 0, heatTime: 0, coolTime: 0, interval: null }
};

const CONFIG = {
    materials: { quartz: { heatUp: 12, coolDown: 60 }, titanium: { heatUp: 10, coolDown: 50 }, ceramic: { heatUp: 15, coolDown: 75 } },
    heaters: { butane: { heatModifier: 1.0, coolModifier: 1.0 }, propane: { heatModifier: 0.8, coolModifier: 0.85 } },
    concentrates: { shatter: { coolModifier: 1.0 }, wax: { coolModifier: 0.97 }, resin: { coolModifier: 1.05 }, rosin: { coolModifier: 1.0 }, budder: { coolModifier: 0.97 }, diamonds: { coolModifier: 1.10 }, sauce: { coolModifier: 1.05 }, crumble: { coolModifier: 0.97 } }
};

// DOM Ready
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

// Age Verification
function calculateAge(birthdate) {
    const today = new Date();
    const birth = new Date(birthdate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) age--;
    return age;
}

function showError(message) {
    const errorDiv = document.getElementById('age-error');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => errorDiv.classList.remove('show'), 5000);
    } else {
        alert(message);
    }
}

function setupAgeVerification() {
    console.log('📋 Setting up age verification...');
    const yesBtn = document.getElementById('verify-yes');
    const noBtn = document.getElementById('verify-no');
    const stateSelect = document.getElementById('user-state');
    const birthdateInput = document.getElementById('user-birthdate');

    console.log('Elements found:', {
        yesBtn: !!yesBtn,
        noBtn: !!noBtn,
        stateSelect: !!stateSelect,
        birthdateInput: !!birthdateInput
    });

    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            console.log('✅ Verify button clicked!');
            const selectedState = stateSelect ? stateSelect.value : '';
            const birthdate = birthdateInput ? birthdateInput.value : '';

            console.log('Values:', { selectedState, birthdate });

            if (!selectedState) {
                console.log('❌ No state selected');
                showError('Please select your state');
                return;
            }
            if (!birthdate) {
                console.log('❌ No birthdate entered');
                showError('Please enter your date of birth');
                return;
            }

            const age = calculateAge(birthdate);
            console.log('Calculated age:', age);

            if (age < 21) {
                console.log('❌ Under 21');
                showError('You must be 21 or older');
                return;
            }

            console.log('✅ Verification passed! Hiding screen...');
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('userState', selectedState);

            const ageScreen = document.getElementById('age-verification');
            if (ageScreen) {
                ageScreen.style.display = 'none';
                console.log('✅ Age screen hidden');
            }
            initializeApp();
        });
    } else {
        console.error('❌ Verify button not found!');
    }

    if (noBtn) {
        noBtn.addEventListener('click', () => {
            console.log('❌ User clicked "Under 21"');
            showError('You must be 21 or older');
        });
    }
}

// Initialize App
function initializeApp() {
    console.log('🚀 Initializing App...');

    // Create mock sessions for testing/debugging
    createMockSessions();

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

// CREATE 100 MOCK SESSIONS - ALWAYS RUN
function createMockSessions() {
    console.log('📊 Creating mock sessions...');
    
    const materials = ['quartz', 'titanium', 'ceramic'];
    const concentrates = ['shatter', 'wax', 'resin', 'rosin', 'budder', 'diamonds', 'sauce', 'crumble'];
    const heaters = ['butane', 'propane'];
    const sessions = [];
    const now = Date.now();
    
    for (let i = 0; i < 100; i++) {
        const daysAgo = Math.floor(Math.random() * 180);
        const hoursOffset = Math.floor(Math.random() * 24);
        const sessionTime = now - (daysAgo * 86400000) - (hoursOffset * 3600000);
        
        const material = materials[Math.floor(Math.random() * materials.length)];
        const concentrate = concentrates[Math.floor(Math.random() * concentrates.length)];
        const heater = heaters[Math.floor(Math.random() * heaters.length)];
        const heatTime = Math.floor(Math.random() * 6) + 8;
        const coolTime = Math.floor(Math.random() * 30) + 50;
        
        sessions.push({
            id: sessionTime + i,
            date: new Date(sessionTime).toISOString(),
            material, concentrate, heater, heatTime, coolTime,
            totalTime: heatTime + coolTime
        });
    }
    
    sessions.sort((a, b) => new Date(b.date) - new Date(a.date));
    localStorage.setItem('dabSessions', JSON.stringify(sessions));
    
    console.log('✅ 100 sessions created!');
    console.log('Sessions:', sessions.length);
}

// LOG DAB SESSION
window.logDabSession = function(material, concentrate, heater, heatTime, coolTime) {
    console.log('📝 Logging session:', { material, concentrate, heater, heatTime, coolTime });
    
    const sessions = JSON.parse(localStorage.getItem('dabSessions') || '[]');
    const newSession = {
        id: Date.now(),
        date: new Date().toISOString(),
        material, concentrate, heater, heatTime, coolTime,
        totalTime: heatTime + coolTime
    };
    
    sessions.unshift(newSession);
    localStorage.setItem('dabSessions', JSON.stringify(sessions));
    
    console.log('✅ Logged! Total:', sessions.length);
    
    if (window.updateCalendarData) window.updateCalendarData();
};

// Settings
function loadSettings() {
    const saved = {
        material: localStorage.getItem('material'),
        concentrate: localStorage.getItem('concentrate'),
        heater: localStorage.getItem('heater'),
        theme: localStorage.getItem('theme'),
        useCustomTimer: localStorage.getItem('useCustomTimer') === 'true'
    };
    
    if (saved.material) state.settings.material = saved.material;
    if (saved.concentrate) state.settings.concentrate = saved.concentrate;
    if (saved.heater) state.settings.heater = saved.heater;
    if (saved.theme) {
        state.settings.theme = saved.theme;
        document.body.setAttribute('data-theme', saved.theme);
    }
    state.settings.useCustomTimer = saved.useCustomTimer;
    
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
            const tabId = this.getAttribute('data-tab');
            switchToTab(tabId);
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
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    
    // Update calendar when switching
    if (tabId === 'calendar-screen' && window.updateCalendarData) {
        console.log('📅 Updating calendar...');
        window.updateCalendarData();
    }
}

// Option Buttons
function setupOptionButtons() {
    document.querySelectorAll('.option-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const setting = this.getAttribute('data-setting');
            const value = this.getAttribute('data-value');
            
            state.settings[setting] = value;
            localStorage.setItem(setting, value);
            
            document.querySelectorAll(`[data-setting="${setting}"]`).forEach(b => b.classList.remove('active'));
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
            switchToTab('timer-screen');
            initializeTimer();
            startTimer();
        });
    }
    
    if (timerStart) timerStart.addEventListener('click', toggleTimer);
    if (reset) reset.addEventListener('click', resetTimer);
}

// Calculate Times
function calculateTimes() {
    if (state.settings.useCustomTimer) {
        const customHeat = localStorage.getItem('customHeatTime');
        const customCool = localStorage.getItem('customCoolTime');
        if (customHeat && customCool) {
            return { heatTime: parseInt(customHeat), coolTime: parseInt(customCool) };
        }
    }
    
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    const concentrate = CONFIG.concentrates[state.settings.concentrate];
    
    let heatTime = Math.round(material.heatUp * heater.heatModifier);
    let coolTime = Math.round(material.coolDown * heater.coolModifier * concentrate.coolModifier);
    
    return { heatTime: Math.min(heatTime, 15), coolTime: Math.max(coolTime, 50) };
}

// Timer Functions
function initializeTimer() {
    const times = calculateTimes();
    state.timer = {
        isRunning: false, mode: 'heat',
        timeLeft: times.heatTime, totalTime: times.heatTime,
        heatTime: times.heatTime, coolTime: times.coolTime, interval: null
    };
    updateTimerDisplay();
    updateFormulaDisplay();
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Start';
}

function toggleTimer() {
    if (state.timer.timeLeft === 0) { initializeTimer(); return; }
    state.timer.isRunning ? pauseTimer() : startTimer();
}

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

function pauseTimer() {
    state.timer.isRunning = false;
    if (state.timer.interval) {
        clearInterval(state.timer.interval);
        state.timer.interval = null;
    }
    const btn = document.getElementById('start-timer');
    if (btn) btn.innerHTML = '<i class="fas fa-play"></i> Resume';
}

function resetTimer() {
    pauseTimer();
    initializeTimer();
}

function switchToCoolDown() {
    state.timer.mode = 'cool';
    state.timer.timeLeft = state.timer.coolTime;
    state.timer.totalTime = state.timer.coolTime;
    const mode = document.getElementById('timer-mode');
    if (mode) mode.textContent = 'COOL DOWN';
    updateTimerDisplay();
}

function completeTimer() {
    pauseTimer();
    
    // LOG SESSION
    window.logDabSession(
        state.settings.material,
        state.settings.concentrate,
        state.settings.heater,
        state.timer.heatTime,
        state.timer.coolTime
    );
    
    const btn = document.getElementById('start-timer');
    if (btn) {
        btn.innerHTML = '<i class="fas fa-check"></i> Complete!';
        setTimeout(() => btn.innerHTML = '<i class="fas fa-play"></i> Start Again', 3000);
    }
    
    const msg = document.getElementById('completion-message');
    if (msg) {
        msg.innerHTML = '<div class="spinning-leaf"><i class="fas fa-cannabis"></i></div><div>enjoy!</div>';
        msg.classList.remove('hidden');
        setTimeout(() => msg.classList.add('hidden'), 5000);
    }
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timer');
    const modeEl = document.getElementById('timer-mode');
    const progressEl = document.getElementById('timer-progress');
    
    if (timerEl) {
        const m = Math.floor(state.timer.timeLeft / 60);
        const s = state.timer.timeLeft % 60;
        timerEl.textContent = `${m}:${s.toString().padStart(2, '0')}`;
    }
    
    if (modeEl) modeEl.textContent = state.timer.mode === 'heat' ? 'HEAT UP' : 'COOL DOWN';
    
    if (progressEl && state.timer.totalTime > 0) {
        const percent = ((state.timer.totalTime - state.timer.timeLeft) / state.timer.totalTime) * 100;
        progressEl.style.width = `${percent}%`;
    }
}

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

// Custom Timer
function setupCustomTimeInputs() {
    const toggle = document.getElementById('custom-timer-toggle');
    const customInputs = document.getElementById('custom-timer-inputs');
    const heat = document.getElementById('settings-heat-time');
    const cool = document.getElementById('settings-cool-time');
    const apply = document.getElementById('apply-settings-times');
    const reset = document.getElementById('reset-custom-times');
    
    const savedHeat = localStorage.getItem('customHeatTime');
    const savedCool = localStorage.getItem('customCoolTime');
    const useCustom = localStorage.getItem('useCustomTimer') === 'true';
    
    if (heat && savedHeat) heat.value = savedHeat;
    if (cool && savedCool) cool.value = savedCool;
    
    if (toggle) {
        toggle.checked = useCustom;
        if (customInputs) customInputs.style.display = useCustom ? 'block' : 'none';
        
        toggle.addEventListener('change', function() {
            const isEnabled = this.checked;
            state.settings.useCustomTimer = isEnabled;
            localStorage.setItem('useCustomTimer', isEnabled);
            if (customInputs) customInputs.style.display = isEnabled ? 'block' : 'none';
            updateFormulaDisplay();
        });
    }
    
    if (apply) {
        apply.addEventListener('click', function() {
            const h = parseInt(heat.value);
            const c = parseInt(cool.value);
            if (h > 0 && c > 0) {
                localStorage.setItem('customHeatTime', h);
                localStorage.setItem('customCoolTime', c);
                updateFormulaDisplay();
                alert('✓ Custom times saved!');
            }
        });
    }
    
    if (reset) {
        reset.addEventListener('click', function() {
            localStorage.removeItem('customHeatTime');
            localStorage.removeItem('customCoolTime');
            localStorage.setItem('useCustomTimer', 'false');
            state.settings.useCustomTimer = false;
            if (heat) heat.value = '';
            if (cool) cool.value = '';
            if (toggle) toggle.checked = false;
            if (customInputs) customInputs.style.display = 'none';
            updateFormulaDisplay();
            alert('✓ Reset to formula!');
        });
    }
}

function cap(str) {
    return str ? str.charAt(0).toUpperCase() + str.slice(1) : '';
}

console.log('✅ DabTimer Loaded!');