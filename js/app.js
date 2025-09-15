// ~/DabTimer/js/app.js
console.log("Dab Timer - Clean Version");

// Constants
const DEBOUNCE_DELAY = 300;
const TIMER_INTERVAL_MS = 1000;
const COMPLETION_COLOR = "#4CAF50";
const COMPLETION_FLASH_DURATION = 2000;
const MIN_HEAT_TIME = 5;
const MAX_HEAT_TIME = 300;
const MIN_COOL_TIME = 5;
const MAX_COOL_TIME = 600;
const BASE_TEMP = 177;
const BASE_TIME = 20;
const MIN_EFFICIENCY_FACTOR = 0.5;
const MAX_EFFICIENCY_FACTOR = 3;

// App Configuration
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
  
  Object.entries(CONFIG.materials).forEach(([key, value]) => {
    if (value.specificHeat <= 0 || value.density <= 0 || value.thicknessFactor <= 0 || value.coolMultiplier <= 0) {
      errors.push(`Invalid material properties for ${key}`);
    }
  });
  
  Object.entries(CONFIG.concentrates).forEach(([key, value]) => {
    if (typeof value.idealTemp !== 'number' || value.idealTemp <= 0) {
      errors.push(`Invalid idealTemp for ${key}`);
    }
  });
  
  Object.entries(CONFIG.heaters).forEach(([key, value]) => {
    if (typeof value.efficiency !== 'number' || value.efficiency <= 0 || value.efficiency > 1) {
      errors.push(`Invalid efficiency for ${key}`);
    }
  });
  
  if (errors.length > 0) {
    console.error('Configuration errors:', errors);
    return false;
  }
  return true;
}

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
    lastUpdate: Date.now()
  },
  clockIntervalId: null,
  lastOptionClick: 0,
  initialized: false
};

// Helper functions
function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function capitalize(string) {
  return typeof string === 'string' && string.length > 0 
    ? string.charAt(0).toUpperCase() + string.slice(1) 
    : '';
}

function getElement(id) {
  const element = document.getElementById(id);
  if (!element) console.warn(`Element not found: ${id}`);
  return element;
}

function safeSetAttribute(element, name, value) {
  if (element) element.setAttribute(name, value);
}

function safeTextContent(element, text) {
  if (element && typeof text !== 'undefined') element.textContent = text;
}

function safeToggleClass(element, className, condition) {
  if (element) element.classList.toggle(className, condition);
}

// RequestAnimationFrame fallback
window.requestAnimationFrame = window.requestAnimationFrame || function(callback) {
  return setTimeout(callback, 16);
};

// Progress updater via rAF
function setProgress(percent) {
  requestAnimationFrame(() => {
    const progressElement = getElement('timer-progress');
    if (progressElement) progressElement.style.width = `${Math.max(0, Math.min(percent, 100))}%`;
  });
}

// Initialization
function initializeApp() {
  if (state.initialized) {
    console.warn('App already initialized');
    return;
  }
  
  if (!validateConfig()) console.error('Invalid configuration - using fallback values');
  
  // Load saved settings first so UI reflects them
  loadSettings();
  updateOptionButtonsUI();
  
  setupTabNavigation();
  setupOptionButtons();
  setupTimer();
  startClock();
  updateAllDisplays();
  
  // Initialize timer with current settings
  initializeTimer();
  
  state.initialized = true;
  console.log('App initialized');
}

// Clock
function updateClock() {
  const clockElement = getElement('current-time');
  if (clockElement) {
    const now = new Date();
    clockElement.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
}

function startClock() {
  if (state.clockIntervalId) clearInterval(state.clockIntervalId);
  updateClock();
  state.clockIntervalId = setInterval(updateClock, 1000);
}

// Tab navigation
function handleTabClick() {
  const tabId = this.dataset.tab;
  if (tabId && getElement(tabId)) switchToTab(tabId);
}

function handleTabKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.click();
  }
}

function setupTabNavigation() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  if (tabButtons.length === 0) return;
  
  // Safe cleanup
  tabButtons.forEach(button => {
    button.removeEventListener('click', handleTabClick);
    button.removeEventListener('keydown', handleTabKeydown);
  });
  
  tabButtons.forEach(button => {
    button.setAttribute('role', 'tab');
    if (button.dataset.tab) button.setAttribute('aria-controls', button.dataset.tab);
    button.addEventListener('click', handleTabClick);
    button.addEventListener('keydown', handleTabKeydown);
  });
  
  // Ensure panels have role
  document.querySelectorAll('.tab-content').forEach(panel => panel.setAttribute('role', 'tabpanel'));
}

function switchToTab(tabId) {
  if (!tabId || !getElement(tabId)) return;
  
  document.querySelectorAll('.tab-btn').forEach(button => {
    const isActive = button.dataset.tab === tabId;
    safeToggleClass(button, 'active', isActive);
    safeSetAttribute(button, 'aria-selected', isActive.toString());
  });
  
  document.querySelectorAll('.tab-content').forEach(content => {
    const isActive = content.id === tabId;
    safeToggleClass(content, 'active', isActive);
    safeSetAttribute(content, 'aria-hidden', (!isActive).toString());
  });
  
  state.currentTab = tabId;
  if (tabId === 'timer-screen') updateTimerUI();
}

// Option buttons
function handleOptionClick() {
  const now = Date.now();
  if (now - state.lastOptionClick < DEBOUNCE_DELAY) return;
  state.lastOptionClick = now;
  
  const parent = this.parentElement;
  if (!parent) return;
  
  const settingType = this.dataset.setting;
  const value = this.dataset.value;
  if (!settingType || !value) return;
  if (!isValidSetting(settingType, value)) return;
  
  updateOptionGroupState(parent, this, settingType, value);
  updateAppState(settingType, value);
}

function handleOptionKeydown(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    this.click();
  }
}

function setupOptionButtons() {
  const optionButtons = document.querySelectorAll('.option-btn');
  if (optionButtons.length === 0) return;
  
  optionButtons.forEach(button => {
    button.removeEventListener('click', handleOptionClick);
    button.removeEventListener('keydown', handleOptionKeydown);
  });
  
  optionButtons.forEach(button => {
    button.addEventListener('click', handleOptionClick);
    button.addEventListener('keydown', handleOptionKeydown);
  });
}

function isValidSetting(type, value) {
  switch (type) {
    case 'material': return !!CONFIG.materials[value];
    case 'concentrate': return !!CONFIG.concentrates[value];
    case 'heater': return !!CONFIG.heaters[value];
    default: return false;
  }
}

function updateOptionGroupState(parent, clickedButton, settingType, value) {
  const siblings = parent.querySelectorAll('.option-btn');
  siblings.forEach(sibling => {
    safeToggleClass(sibling, 'active', sibling === clickedButton);
    safeSetAttribute(sibling, 'aria-pressed', (sibling === clickedButton).toString());
  });
}

function updateAppState(settingType, value) {
  state.settings[settingType] = value;
  saveSettings();
  updateAllDisplays();
  // Update timer with new settings if not running
  if (!state.timer.isRunning) initializeTimer();
}

function updateOptionButtonsUI() {
  Object.entries(state.settings).forEach(([settingType, value]) => {
    const buttons = document.querySelectorAll(`.option-btn[data-setting="${settingType}"]`);
    buttons.forEach(button => {
      const isActive = button.dataset.value === value;
      safeToggleClass(button, 'active', isActive);
      safeSetAttribute(button, 'aria-pressed', isActive.toString());
    });
  });
}

// Display & formulas
function updateAllDisplays() {
  updateSettingsDisplay();
  updateFormulaDisplay();
  updateTimerUI();
}

function updateSettingsDisplay() {
  const { material, concentrate, heater } = state.settings;
  safeTextContent(getElement('current-material'), capitalize(material));
  safeTextContent(getElement('current-concentrate'), capitalize(concentrate));
  safeTextContent(getElement('current-heater'), capitalize(heater));
}

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
  const concentrate = state.settings.concentrate;
  const multiplier = concentrate === "diamonds" ? 1.5 : 2.0;
  const result = Math.round(heatTime * multiplier);
  return clamp(result, MIN_COOL_TIME, MAX_COOL_TIME);
}

function updateFormulaDisplay() {
  const { material, heater, concentrate } = state.settings;
  const heatTime = calculateHeatTime(material, heater, concentrate);
  const coolTime = calculateCoolTime(material, heatTime);
  
  safeTextContent(getElement('formula-material'), capitalize(material));
  safeTextContent(getElement('formula-concentrate'), capitalize(concentrate));
  safeTextContent(getElement('formula-heater'), capitalize(heater));
  safeTextContent(getElement('formula-heat-time'), `${heatTime}s`);
  safeTextContent(getElement('formula-cool-time'), `${coolTime}s`);
  safeTextContent(getElement('formula-total-time'), `${heatTime + coolTime}s`);
}

// Timer
function setupTimer() {
  const startButton = getElement('start-timer-btn');
  const timerStartButton = getElement('start-timer');
  const resetButton = getElement('reset-timer');
  
  if (!startButton || !timerStartButton || !resetButton) return;
  
  // Remove any existing handlers
  startButton.removeEventListener('click', handleStartTimer);
  timerStartButton.removeEventListener('click', handleTimerControl);
  resetButton.removeEventListener('click', handleResetTimer);
  
  startButton.addEventListener('click', handleStartTimer);
  timerStartButton.addEventListener('click', handleTimerControl);
  resetButton.addEventListener('click', handleResetTimer);
  
  // Keyboard support
  [startButton, timerStartButton, resetButton].forEach(button => {
    button.removeEventListener('keydown', keyboardProxy);
    button.addEventListener('keydown', keyboardProxy);
  });
}

function keyboardProxy(event) {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault();
    event.currentTarget.click();
  }
}

function handleStartTimer() {
  switchToTab('timer-screen');
  // Timer is already initialized, just update UI
  updateTimerUI();
}

function handleTimerControl() {
  if (state.timer.isRunning) pauseTimer();
  else startTimer();
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
    intervalId: null,
    lastUpdate: Date.now()
  };
  updateTimerUI();
}

function startTimer() {
  if (state.timer.isRunning) return;
  clearTimerInterval();
  
  state.timer.isRunning = true;
  state.timer.lastUpdate = Date.now();
  updateTimerUI();
  
  state.timer.intervalId = setInterval(timerTick, TIMER_INTERVAL_MS);
}

function timerTick() {
  const now = Date.now();
  const delta = now - state.timer.lastUpdate;
  const elapsedSeconds = Math.floor(delta / 1000);
  
  if (elapsedSeconds < 1) return;
  
  // Move lastUpdate forward to the latest whole-second boundary
  state.timer.lastUpdate = now - (delta % 1000);
  state.timer.timeLeft = Math.max(0, state.timer.timeLeft - elapsedSeconds);
  
  updateTimerUI();
  if (state.timer.timeLeft <= 0) handleTimerCompletion();
}

function handleTimerCompletion() {
  if (state.timer.mode === 'heat') switchToCoolDown();
  else completeTimer();
}

function pauseTimer() {
  clearTimerInterval();
  state.timer.isRunning = false;
  updateTimerUI();
}

function clearTimerInterval() {
  if (state.timer.intervalId) {
    clearInterval(state.timer.intervalId);
    state.timer.intervalId = null;
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
  setProgress(0);
  updateTimerUI();
}

function completeTimer() {
  pauseTimer();
  state.timer.timeLeft = 0;
  updateTimerUI();
  
  // Visual completion indicator
  const timerElement = getElement('timer');
  if (timerElement) {
    timerElement.style.color = COMPLETION_COLOR;
    setTimeout(() => { timerElement.style.color = ''; }, COMPLETION_FLASH_DURATION);
  }
}

function updateTimerUI() {
  const timerElement = getElement('timer');
  const timerModeElement = getElement('timer-mode');
  
  if (timerElement) {
    const minutes = Math.floor(state.timer.timeLeft / 60);
    const seconds = state.timer.timeLeft % 60;
    timerElement.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  
  safeTextContent(timerModeElement, state.timer.mode.toUpperCase());
  
  const progressElement = getElement('timer-progress');
  if (progressElement && state.timer.heatTime > 0) {
    const totalTime = (state.timer.mode === 'heat') ? state.timer.heatTime : state.timer.coolTime;
    const progress = totalTime > 0 ? clamp(((totalTime - state.timer.timeLeft) / totalTime) * 100, 0, 100) : 0;
    setProgress(progress);
    safeSetAttribute(progressElement, 'aria-valuenow', Math.round(progress).toString());
  } else {
    setProgress(0);
  }
  
  updateTimerButtons();
}

function updateTimerButtons() {
  const startButton = getElement('start-timer');
  const resetButton = getElement('reset-timer');
  
  if (startButton) {
    startButton.disabled = false;
    startButton.innerHTML = state.timer.isRunning 
      ? '<i class="fas fa-pause"></i> Pause' 
      : '<i class="fas fa-play"></i> Start';
    safeSetAttribute(startButton, 'aria-label', state.timer.isRunning ? 'Pause timer' : 'Start timer');
  }
  
  if (resetButton) {
    resetButton.disabled = false;
    safeSetAttribute(resetButton, 'aria-disabled', 'false');
  }
}

// Persistence
function saveSettings() {
  try {
    localStorage.setItem('dabTimerSettings', JSON.stringify(state.settings));
  } catch (error) {
    console.warn('Could not save settings to localStorage:', error);
  }
}

function loadSettings() {
  try {
    const saved = localStorage.getItem('dabTimerSettings');
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed && typeof parsed === 'object') {
        if (isValidSetting('material', parsed.material)) state.settings.material = parsed.material;
        if (isValidSetting('concentrate', parsed.concentrate)) state.settings.concentrate = parsed.concentrate;
        if (isValidSetting('heater', parsed.heater)) state.settings.heater = parsed.heater;
      }
    }
  } catch (error) {
    console.warn('Could not load settings from localStorage:', error);
  }
}

// Cleanup
function cleanupApp() {
  clearTimerInterval();
  if (state.clockIntervalId) {
    clearInterval(state.clockIntervalId);
    state.clockIntervalId = null;
  }
  
  // Remove event listeners
  document.querySelectorAll('.tab-btn').forEach(button => {
    button.removeEventListener('click', handleTabClick);
    button.removeEventListener('keydown', handleTabKeydown);
  });
  
  document.querySelectorAll('.option-btn').forEach(button => {
    button.removeEventListener('click', handleOptionClick);
    button.removeEventListener('keydown', handleOptionKeydown);
  });
  
  const startButton = getElement('start-timer-btn');
  const timerStartButton = getElement('start-timer');
  const resetButton = getElement('reset-timer');
  
  if (startButton) {
    startButton.removeEventListener('click', handleStartTimer);
    startButton.removeEventListener('keydown', keyboardProxy);
  }
  
  if (timerStartButton) {
    timerStartButton.removeEventListener('click', handleTimerControl);
    timerStartButton.removeEventListener('keydown', keyboardProxy);
  }
  
  if (resetButton) {
    resetButton.removeEventListener('click', handleResetTimer);
    resetButton.removeEventListener('keydown', keyboardProxy);
  }
  
  state.initialized = false;
}

// Event listeners
document.addEventListener('DOMContentLoaded', initializeApp);
window.addEventListener('beforeunload', cleanupApp);
window.addEventListener('unload', cleanupApp);

// Expose for debugging
window.__DabTimer = {
  state,
  CONFIG,
  calculateHeatTime,
  calculateCoolTime,
  startTimer,
  pauseTimer,
  resetTimer
};
