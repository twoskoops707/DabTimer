// Dab Timer Application - Production Ready
console.log("Dab Timer - Production Version");

// Constants
const TIMER_INTERVAL_MS = 1000;
const CLOCK_UPDATE_INTERVAL = 1000; // Update clock every second
const COMPLETION_FLASH_DURATION = 2000;

// App Configuration with validated values
const CONFIG = {
  materials: {
    quartz: { coolTime: 55 },
    titanium: { coolTime: 68 },
    ceramic: { coolTime: 62 }
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
    torch: { modifier: 1.0 },
    lighter: { modifier: 1.8 },
    enail: { modifier: 0.7 },
    ebanger: { modifier: 0.8 }
  }
};

// App State
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
function calculateHeatTime(material, heater, concentrate) {
  const baseTimes = {
    quartz: { 
      shatter: 18, wax: 20, resin: 22, rosin: 22, 
      budder: 19, diamonds: 23, sauce: 21, crumble: 20 
    },
    titanium: { 
      shatter: 15, wax: 18, resin: 20, rosin: 20, 
      budder: 16, diamonds: 21, sauce: 19, crumble: 17 
    },
    ceramic: { 
      shatter: 16, wax: 18, resin: 20, rosin: 20, 
      budder: 17, diamonds: 21, sauce: 19, crumble: 18 
    }
  };

  const baseTime = baseTimes[material]?.[concentrate] || 20;
  const modifier = CONFIG.heaters[heater]?.modifier || 1.0;
  
  return clamp(Math.round(baseTime * modifier), 5, 300);
}

function calculateCoolTime(material) {
  return CONFIG.materials[material]?.coolTime || 60;
}

// Clock functions
function updateClock() {
  const clockElement = getElement('current-time');
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
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

  const heatTime = calculateHeatTime(material, heater, concentrate);
  const coolTime = calculateCoolTime(material);
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

  const heatTime = calculateHeatTime(material, heater, concentrate);
  const coolTime = calculateCoolTime(material);

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

// Initialize the app
function initializeApp() {
  console.log("Initializing app...");
  startClock();
  setupTabNavigation();
  setupOptionButtons();
  updateSettingsDisplay();
  setupTimer();
  console.log("App initialized");
}

// Cleanup on exit
function cleanup() {
  if (state.timer.intervalId) clearInterval(state.timer.intervalId);
  if (state.timer.flashTimeoutId) clearTimeout(state.timer.flashTimeoutId);
  if (state.clockIntervalId) clearInterval(state.clockIntervalId);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', cleanup);
