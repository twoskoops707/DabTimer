// Dab Timer Application - Production Ready
console.log("Dab Timer - Production Version");

// Constants
const TIMER_INTERVAL_MS = 1000;
const CLOCK_UPDATE_INTERVAL = 1000; // Update clock every second
const COMPLETION_FLASH_DURATION = 2000;

// App Configuration with validated values
const CONFIG = {
  materials: {
    quartz: { 
      mass: 25, 
      specificHeat: 0.75, 
      hotTemp: 500,
      tau: 45 
    },
    titanium: { 
      mass: 20, 
      specificHeat: 0.52, 
      hotTemp: 550,
      tau: 55 
    },
    ceramic: { 
      mass: 25, 
      specificHeat: 0.84, 
      hotTemp: 500,
      tau: 50 
    }
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
    butane: { power: 350 },
    propane: { power: 500 }
  }
};

// App State
let state = {
  currentTab: 'home-screen',
  settings: {
    material: 'quartz',
    concentrate: 'shatter',
    heater: 'butane'
  },
  timer: {
    isRunning: false,
    mode: 'heat',
    timeLeft: 0,
    heatTime: 0,
    coolTime: 0,
    intervalId: null,
    flashTimeoutId: null
  },
  clockIntervalId: null,
  lastOptionClick: 0
};

// Helper functions
function getElement(id) {
  return document.getElementById(id);
}

function safeTextContent(element, text) {
  if (element && typeof text !== 'undefined') {
    element.textContent = text;
  }
}

function safeToggleClass(element, className, condition) {
  if (element) {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  }
}

function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

// Timer calculations
function calculateHeatTime(material, heater) {
  const materialConfig = CONFIG.materials[material];
  const heaterConfig = CONFIG.heaters[heater];
  
  if (!materialConfig || !heaterConfig) {
    return 20; // default fallback
  }
  
  const mass = materialConfig.mass;
  const specificHeat = materialConfig.specificHeat;
  const hotTemp = materialConfig.hotTemp;
  const power = heaterConfig.power;
  
  const roomTemp = 25;
  const deltaT = hotTemp - roomTemp;
  const energy = mass * specificHeat * deltaT; // in Joules
  const timeSeconds = energy / power;
  
  return Math.max(5, Math.min(30, Math.round(timeSeconds)));
}

function calculateCoolTime(material, concentrate) {
  const materialConfig = CONFIG.materials[material];
  const concentrateConfig = CONFIG.concentrates[concentrate];
  
  if (!materialConfig || !concentrateConfig) {
    return 60; // default fallback
  }
  
  const hotTemp = materialConfig.hotTemp;
  const tau = materialConfig.tau;
  const idealTemp = concentrateConfig.idealTemp;
  const roomTemp = 25;
  
  if (idealTemp <= roomTemp) {
    return 0;
  }
  
  const ratio = (hotTemp - roomTemp) / (idealTemp - roomTemp);
  const timeSeconds = tau * Math.log(ratio);
  
  return Math.max(55, Math.min(100, Math.round(timeSeconds)));
}

// Clock functions
function updateClock() {
  const clockElement = getElement('current-time');
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit'
    });
  }
}

function startClock() {
  updateClock();
  state.clockIntervalId = setInterval(updateClock, CLOCK_UPDATE_INTERVAL);
}

// Tab navigation
function setupTabNavigation() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', function() {
      switchToTab(this.dataset.tab);
    });
  });
}

function switchToTab(tabId) {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.tab === tabId) {
      btn.classList.add('active');
    }
  });

  tabContents.forEach(content => {
    content.classList.remove('active');
    if (content.id === tabId) {
      content.classList.add('active');
    }
  });

  state.currentTab = tabId;
}

// Option buttons with validation
function setupOptionButtons() {
  const options = document.querySelectorAll('.option-btn');
  
  options.forEach(btn => {
    btn.addEventListener('click', function() {
      const now = Date.now();
      if (now - state.lastOptionClick < 300) return;
      state.lastOptionClick = now;

      const settingType = this.dataset.setting;
      const value = this.dataset.value;

      // Validate against CONFIG
      if (settingType && value) {
        if (settingType === 'material' && !CONFIG.materials[value]) return;
        if (settingType === 'concentrate' && !CONFIG.concentrates[value]) return;
        if (settingType === 'heater' && !CONFIG.heaters[value]) return;

        const parent = this.parentElement;
        const siblings = parent.querySelectorAll('.option-btn');
        siblings.forEach(sib => sib.classList.remove('active'));
        
        this.classList.add('active');
        state.settings[settingType] = value;
        updateSettingsDisplay();
      }
    });
  });
}

function updateSettingsDisplay() {
  const materialEl = getElement('current-material');
  const concentrateEl = getElement('current-concentrate');
  const heaterEl = getElement('current-heater');

  if (materialEl) {
    materialEl.textContent = state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1);
  }
  if (concentrateEl) {
    concentrateEl.textContent = state.settings.concentrate.charAt(0).toUpperCase() + state.settings.concentrate.slice(1);
  }
  if (heaterEl) {
    heaterEl.textContent = state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1);
  }

  updateFormulaDisplay();
}

function updateFormulaDisplay() {
  const material = state.settings.material;
  const heater = state.settings.heater;
  const concentrate = state.settings.concentrate;

  const heatTime = calculateHeatTime(material, heater);
  const coolTime = calculateCoolTime(material, concentrate);
  const totalTime = heatTime + coolTime;

  safeTextContent(getElement('formula-material'), material.charAt(0).toUpperCase() + material.slice(1));
  safeTextContent(getElement('formula-concentrate'), concentrate.charAt(0).toUpperCase() + concentrate.slice(1));
  safeTextContent(getElement('formula-heater'), heater.charAt(0).toUpperCase() + heater.slice(1));
  safeTextContent(getElement('formula-heat-time'), `${heatTime}s`);
  safeTextContent(getElement('formula-cool-time'), `${coolTime}s`);
  safeTextContent(getElement('formula-total-time'), `${totalTime}s`);
}

// Timer functionality
function setupTimer() {
  const startBtn = getElement('start-timer-btn');
  if (startBtn) {
    startBtn.addEventListener('click', function() {
      switchToTab('timer-screen');
      initializeTimer();
    });
  }

  const timerStartBtn = getElement('start-timer');
  const timerResetBtn = getElement('reset-timer');

  if (timerStartBtn) {
    timerStartBtn.addEventListener('click', function() {
      if (!state.timer.isRunning) {
        if (state.timer.timeLeft === 0) {
          initializeTimer();
        }
        startTimer();
      } else {
        pauseTimer();
      }
    });
  }

  if (timerResetBtn) {
    timerResetBtn.addEventListener('click', resetTimer);
  }
}

function initializeTimer() {
  // Clear any existing timers
  pauseTimer();
  clearFlash();
  
  const material = state.settings.material;
  const heater = state.settings.heater;
  const concentrate = state.settings.concentrate;

  const heatTime = calculateHeatTime(material, heater);
  const coolTime = calculateCoolTime(material, concentrate);

  state.timer = {
    isRunning: false,
    mode: 'heat',
    timeLeft: heatTime,
    heatTime: heatTime,
    coolTime: coolTime,
    intervalId: null,
    flashTimeoutId: null
  };

  updateTimerDisplay();
  updateFormulaDisplay();
  updateProgressBar(0);
  resetProgressBarColor();
}

function startTimer() {
  if (state.timer.isRunning) return;

  state.timer.isRunning = true;
  const startBtn = getElement('start-timer');
  if (startBtn) startBtn.innerHTML = '<i class="fas fa-pause"></i> Pause';

  state.timer.intervalId = setInterval(() => {
    state.timer.timeLeft--;

  if (state.timer.timeLeft <= 0) {
      if (state.timer.mode === 'heat') {
        // Switch to cool mode
        state.timer.mode = 'cool';
        state.timer.timeLeft = state.timer.coolTime;
        updateTimerDisplay();
        updateProgressBar(0);
      } else {
        // Timer completed
        completeTimer();
        return;
      }
    }

    updateTimerDisplay();
    updateProgressBar();
  }, TIMER_INTERVAL_MS);
}

function pauseTimer() {
  if (!state.timer.isRunning) return;

  state.timer.isRunning = false;
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
  }

  const startBtn = getElement('start-timer');
  if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Resume';
}

function resetTimer() {
  pauseTimer();
  clearFlash();
  resetProgressBarColor();
  initializeTimer();
}

function clearFlash() {
  if (state.timer.flashTimeoutId) {
    clearTimeout(state.timer.flashTimeoutId);
    state.timer.flashTimeoutId = null;
  }
}

function resetProgressBarColor() {
  const progressElement = getElement('timer-progress');
  if (progressElement) {
    progressElement.style.backgroundColor = '';
  }
}

function updateTimerDisplay() {
  const timerElement = getElement('timer');
  const timerModeElement = getElement('timer-mode');
  
  if (timerElement) {
    timerElement.textContent = formatTime(state.timer.timeLeft);
  }
  
  if (timerModeElement) {
    timerModeElement.textContent = state.timer.mode.toUpperCase();
  }
}

function updateProgressBar(percent) {
  const progressElement = getElement('timer-progress');
  if (!progressElement) return;

  let progressPercent;
  if (typeof percent === 'number') {
    progressPercent = clamp(percent, 0, 100);
  } else {
    const totalTime = state.timer.mode === 'heat' ? state.timer.heatTime : state.timer.coolTime;
    if (totalTime <= 0) {
      progressPercent = 0;
    } else {
      const progress = ((totalTime - state.timer.timeLeft) / totalTime) * 100;
      progressPercent = clamp(progress, 0, 100);
    }
  }
  
  progressElement.style.width = `${progressPercent}%`;
}

// Cleanup on exit
function cleanup() {
  if (state.timer.intervalId) clearInterval(state.timer.intervalId);
  if (state.timer.flashTimeoutId) clearTimeout(state.timer.flashTimeoutId);
  if (state.clockIntervalId) clearInterval(state.clockIntervalId);
}

function applyCustomTimes(heatTime, coolTime) {
    // Update the timer with custom times
    pauseTimer();
    clearFlash();
    
    state.timer = {
        isRunning: false,
        mode: 'heat',
        timeLeft: heatTime,
        heatTime: heatTime,
        coolTime: coolTime,
        intervalId: null,
        flashTimeoutId: null
    };
    
    updateTimerDisplay();
    updateFormulaDisplay();
    updateProgressBar(0);
    resetProgressBarColor();
    
    // Update formula display with custom times
    safeTextContent(getElement('formula-heat-time'), `${heatTime}s`);
    safeTextContent(getElement('formula-cool-time'), `${coolTime}s`);
    safeTextContent(getElement('formula-total-time'), `${heatTime + coolTime}s`);
}

// Completion animation functions
function showCompletionAnimation() {
    const animation = document.getElementById('completion-animation');
    if (animation) {
        animation.className = 'completion-visible';
        
        // Hide animation after 3 seconds
        setTimeout(() => {
            hideCompletionAnimation();
        }, 3000);
    }
}

function hideCompletionAnimation() {
    const animation = document.getElementById('completion-animation');
    if (animation) {
        animation.className = 'completion-hidden';
    }
}

// Update the completeTimer function to show animation
function completeTimer() {
    pauseTimer();
    updateProgressBar(100);
    
    // Visual feedback
    const progressElement = getElement('timer-progress');
    if (progressElement) {
        progressElement.style.backgroundColor = '#4CAF50';
        state.timer.flashTimeoutId = setTimeout(() => {
            progressElement.style.backgroundColor = '';
            state.timer.flashTimeoutId = null;
        }, COMPLETION_FLASH_DURATION);
    }
    
    // Show completion animation
    showCompletionAnimation();
    
    // Log the completed session
    if (typeof logDabSession === "function") {
        const session = logDabSession(
            state.settings.material,
            state.settings.concentrate,
            state.settings.heater,
            state.timer.heatTime,
            state.timer.coolTime
        );
        console.log("Session logged:", session);
    } else {
        console.log("Calendar module not loaded - session not logged");
    }
}

// Custom Timer Inputs Functionality
function setupCustomTimerInputs() {
    const applyBtn = getElement('apply-custom-times');
    
    if (applyBtn) {
        applyBtn.addEventListener('click', function() {
            const heatInput = getElement('custom-heat-time');
            const coolInput = getElement('custom-cool-time');

            const heatTime = parseInt(heatInput.value, 10);
            const coolTime = parseInt(coolInput.value, 10);

            if (isNaN(heatTime) || isNaN(coolTime) || heatTime < 5 || heatTime > 300 || coolTime < 30 || coolTime > 120) {
                alert('Please enter valid times: Heat (5-300s), Cool (30-120s)');
                return;
            }

            applyCustomTimes(heatTime, coolTime);
            alert('Custom times have been applied!');
        });
    }
}

// Initialize the app
function initializeApp() {
    console.log("Initializing app...");
    startClock();
    setupTabNavigation();
    setupOptionButtons();
    updateSettingsDisplay();
    setupTimer();
    setupCustomTimerInputs();
    setupSettings();
    updateHomeDisplay();
    console.log("App initialized");
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', cleanup);


// Settings functionality
function setupSettings() {
    // Custom timer from settings
    const applySettingsBtn = getElement('apply-settings-times');
    if (applySettingsBtn) {
        applySettingsBtn.addEventListener('click', function() {
            const heatInput = getElement('settings-heat-time');
            const coolInput = getElement('settings-cool-time');

            const heatTime = parseInt(heatInput.value, 10);
            const coolTime = parseInt(coolInput.value, 10);

            if (isNaN(heatTime) || isNaN(coolTime) || heatTime < 5 || heatTime > 300 || coolTime < 30 || coolTime > 120) {
                alert('Please enter valid times: Heat (5-300s), Cool (30-120s)');
                return;
            }

            applyCustomTimes(heatTime, coolTime);
            updateHomeDisplay();
            alert('Custom times have been applied!');
        });
    }

    // Theme switching
    const themeBtns = document.querySelectorAll('.theme-btn');
    themeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const theme = this.dataset.theme;
            applyTheme(theme);
            
            // Update active state
            themeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Save theme preference
            localStorage.setItem('dabTimerTheme', theme);
        });
    });

    // Load saved theme
    const savedTheme = localStorage.getItem('dabTimerTheme');
    if (savedTheme) {
        applyTheme(savedTheme);
        themeBtns.forEach(btn => {
            if (btn.dataset.theme === savedTheme) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }
}

// Apply color theme
function applyTheme(theme) {
    const root = document.documentElement;
    
    const themes = {
        green: {
            primary: '#00E676',
            primaryDark: '#00C853',
            secondary: '#00BFA5'
        },
        blue: {
            primary: '#2196F3',
            primaryDark: '#1976D2',
            secondary: '#00BCD4'
        },
        purple: {
            primary: '#9C27B0',
            primaryDark: '#7B1FA2',
            secondary: '#7C4DFF'
        },
        orange: {
            primary: '#FF9800',
            primaryDark: '#F57C00',
            secondary: '#FF5722'
        },
        pink: {
            primary: '#E91E63',
            primaryDark: '#C2185B',
            secondary: '#F06292'
        },
        teal: {
            primary: '#009688',
            primaryDark: '#00796B',
            secondary: '#26A69A'
        }
    };

    const selectedTheme = themes[theme];
    if (selectedTheme) {
        root.style.setProperty('--primary-color', selectedTheme.primary);
        root.style.setProperty('--primary-dark', selectedTheme.primaryDark);
        root.style.setProperty('--secondary-color', selectedTheme.secondary);
    }
}

// Update home display with current settings
function updateHomeDisplay() {
    const material = state.settings.material;
    const concentrate = state.settings.concentrate;
    const heater = state.settings.heater;
    
    const heatTime = state.timer.heatTime || calculateHeatTime(material, heater);
    const coolTime = state.timer.coolTime || calculateCoolTime(material, concentrate);
    const totalTime = heatTime + coolTime;

    // Update home screen display
    safeTextContent(getElement('home-material'), material.charAt(0).toUpperCase() + material.slice(1));
    safeTextContent(getElement('home-concentrate'), concentrate.charAt(0).toUpperCase() + concentrate.slice(1));
    safeTextContent(getElement('home-heater'), heater.charAt(0).toUpperCase() + heater.slice(1));
    safeTextContent(getElement('home-heat-time'), `${heatTime}s`);
    safeTextContent(getElement('home-cool-time'), `${coolTime}s`);
    safeTextContent(getElement('home-total-time'), `${totalTime}s`);
}

// Override updateSettingsDisplay to also update home
const originalUpdateSettingsDisplay = updateSettingsDisplay;
updateSettingsDisplay = function() {
    originalUpdateSettingsDisplay();
    updateHomeDisplay();
};

