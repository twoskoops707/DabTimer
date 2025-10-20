const TIMER_INTERVAL_MS = 1000;
const CLOCK_UPDATE_INTERVAL = 1000;
const COMPLETION_FLASH_DURATION = 2000;

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

let state = {
  currentTab: 'home-screen',
  settings: {
    material: 'quartz',
    concentrate: 'shatter',
    heater: 'butane',
    customHeatTime: 0,
    customCoolTime: 0,
    useCustomTimes: false
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
  lastOptionClick: 0,
  userName: 'User'
};

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

function calculateHeatTime(material, heater) {
  const materialConfig = CONFIG.materials[material];
  const heaterConfig = CONFIG.heaters[heater];
  
  if (!materialConfig || !heaterConfig) {
    return 30; // Default fallback time
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
    return 45; // Default fallback time
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
  updateCombinedInfoDisplay();
}

function setupOptionButtons() {
  const options = document.querySelectorAll('.option-btn');
  
  options.forEach(btn => {
    btn.addEventListener('click', function() {
      const now = Date.now();
      if (now - state.lastOptionClick < 300) return;
      state.lastOptionClick = now;

      const settingType = this.dataset.setting;
      const value = this.dataset.value;

      if (settingType && value) {
        if (settingType === 'material' && !CONFIG.materials[value]) return;
        if (settingType === 'concentrate' && !CONFIG.concentrates[value]) return;
        if (settingType === 'heater' && !CONFIG.heaters[value]) return;

        const parent = this.parentElement;
        const siblings = parent.querySelectorAll('.option-btn');
        siblings.forEach(sib => sib.classList.remove('active'));
        
        this.classList.add('active');
        state.settings[settingType] = value;
        updateCombinedInfoDisplay();
      }
    });
  });
}

function updateCombinedInfoDisplay() {
  const material = state.settings.material;
  const heater = state.settings.heater;
  const concentrate = state.settings.concentrate;

  let heatTime = calculateHeatTime(material, heater);
  let coolTime = calculateCoolTime(material, concentrate);

  if (state.settings.useCustomTimes && state.settings.customHeatTime > 0) {
    heatTime = state.settings.customHeatTime;
  }
  if (state.settings.useCustomTimes && state.settings.customCoolTime > 0) {
    coolTime = state.settings.customCoolTime;
  }
  const totalTime = heatTime + coolTime;

  safeTextContent(getElement('home-material'), material.charAt(0).toUpperCase() + material.slice(1));
  safeTextContent(getElement('home-concentrate'), concentrate.charAt(0).toUpperCase() + concentrate.slice(1));
  safeTextContent(getElement('home-heater'), heater.charAt(0).toUpperCase() + heater.slice(1));
  safeTextContent(getElement('home-heat-time'), `${heatTime}s`);
  safeTextContent(getElement('home-cool-time'), `${coolTime}s`);
  safeTextContent(getElement('home-total-time'), `${totalTime}s`);

  safeTextContent(getElement('formula-material'), material.charAt(0).toUpperCase() + material.slice(1));
  safeTextContent(getElement('formula-concentrate'), concentrate.charAt(0).toUpperCase() + concentrate.slice(1));
  safeTextContent(getElement('formula-heater'), heater.charAt(0).toUpperCase() + heater.slice(1));
  safeTextContent(getElement('formula-heat-time'), `${heatTime}s`);
  safeTextContent(getElement('formula-cool-time'), `${coolTime}s`);
  safeTextContent(getElement('formula-total-time'), `${totalTime}s`);
}

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
  pauseTimer();
  clearFlash();
  
  const material = state.settings.material;
  const heater = state.settings.heater;
  const concentrate = state.settings.concentrate;

  let heatTime = calculateHeatTime(material, heater);
  let coolTime = calculateCoolTime(material, concentrate);

  if (state.settings.useCustomTimes && state.settings.customHeatTime > 0) {
    heatTime = state.settings.customHeatTime;
  }
  if (state.settings.useCustomTimes && state.settings.customCoolTime > 0) {
    coolTime = state.settings.customCoolTime;
  }

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
        const completionMessage = getElement('completion-message');
        if (completionMessage) {
          completionMessage.textContent = 'FLAME OFF';
          completionMessage.classList.remove('hidden');
          
          setTimeout(() => {
            completionMessage.classList.add('hidden');
          }, 2000);
        }
        
        state.timer.mode = 'cool';
        state.timer.timeLeft = state.timer.coolTime;
        updateTimerDisplay();
        updateProgressBar(0);
      } else {
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
  clearInterval(state.timer.intervalId);
  const startBtn = getElement('start-timer');
  if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
}

function resetTimer() {
  pauseTimer();
  clearFlash();
  initializeTimer();
  const startBtn = getElement('start-timer');
  if (startBtn) startBtn.innerHTML = '<i class="fas fa-play"></i> Start';
}

function updateTimerDisplay() {
  const timerElement = getElement('timer');
  if (timerElement) {
    timerElement.textContent = formatTime(state.timer.timeLeft);
  }
  const timerModeElement = getElement('timer-mode');
  if (timerModeElement) {
    timerModeElement.textContent = state.timer.mode === 'heat' ? 'HEAT UP' : 'COOL DOWN';
  }
}

function updateProgressBar() {
  const progressBar = getElement('timer-progress');
  if (progressBar) {
    let progress = 0;
    if (state.timer.mode === 'heat') {
      progress = ((state.timer.heatTime - state.timer.timeLeft) / state.timer.heatTime) * 100;
    } else {
      progress = ((state.timer.coolTime - state.timer.timeLeft) / state.timer.coolTime) * 100;
    }
    progressBar.style.width = `${progress}%`;
  }
}

function resetProgressBarColor() {
  const progressBar = getElement('timer-progress');
  if (progressBar) {
    progressBar.style.backgroundColor = ''; // Reset to default CSS gradient
  }
}

function clearFlash() {
  const completionMessage = getElement('completion-message');
  if (completionMessage) {
    completionMessage.classList.add('hidden');
  }
  const completionLeaf = getElement('completion-leaf');
  if (completionLeaf) {
    completionLeaf.classList.add('hidden');
    completionLeaf.classList.remove('animate');
  }
  if (state.timer.flashTimeoutId) {
    clearTimeout(state.timer.flashTimeoutId);
    state.timer.flashTimeoutId = null;
  }
}

function completeTimer() {
  pauseTimer();
  const completionMessage = getElement('completion-message');
  if (completionMessage) {
    completionMessage.textContent = 'ENJOY!';
    completionMessage.classList.remove('hidden');
    const completionLeaf = getElement('completion-leaf');
    if (completionLeaf) {
        completionLeaf.classList.remove('hidden');
        completionLeaf.classList.add('animate');
        
        setTimeout(() => {
            completionMessage.classList.add('hidden');
            completionLeaf.classList.remove('animate');
            completionLeaf.classList.add('hidden');
        }, 3000);
    }
  }
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

function applyCustomTimes(newHeatTime, newCoolTime) {
  state.settings.customHeatTime = newHeatTime;
  state.settings.customCoolTime = newCoolTime;
  state.settings.useCustomTimes = true;
  updateCombinedInfoDisplay();
  initializeTimer();
}

function resetCustomTimes() {
  state.settings.customHeatTime = 0;
  state.settings.customCoolTime = 0;
  state.settings.useCustomTimes = false;
  updateCombinedInfoDisplay();
  initializeTimer();
}

function setupSettingsCustomTimerInputs() {
  const heatTimeInput = getElement('settings-heat-time');
  const coolTimeInput = getElement('settings-cool-time');
  const applyBtn = getElement('apply-settings-times');
  const useCalculatedBtn = getElement('use-calculated-times');

  if (heatTimeInput && coolTimeInput && applyBtn) {
    heatTimeInput.value = state.settings.customHeatTime > 0 ? state.settings.customHeatTime : '';
    coolTimeInput.value = state.settings.customCoolTime > 0 ? state.settings.customCoolTime : '';

    applyBtn.addEventListener('click', () => {
      const newHeatTime = parseInt(heatTimeInput.value);
      const newCoolTime = parseInt(coolTimeInput.value);

      if (!isNaN(newHeatTime) && !isNaN(newCoolTime) && newHeatTime >= 5 && newHeatTime <= 300 && newCoolTime >= 30 && newCoolTime <= 120) {
        applyCustomTimes(newHeatTime, newCoolTime);
        alert('Custom times applied successfully!');
      } else {
        alert('Please enter valid heat and cool times.');
      }
    });
  }

  if (useCalculatedBtn) {
    useCalculatedBtn.addEventListener('click', () => {
      resetCustomTimes();
      heatTimeInput.value = '';
      coolTimeInput.value = '';
      alert('Reverted to calculated times!');
    });
  }
}

function setupColorTheme() {
  const themeOptions = document.querySelectorAll('.theme-btn');
  themeOptions.forEach(btn => {
    btn.addEventListener('click', function() {
      const theme = this.dataset.theme;
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem('selectedTheme', theme);
      themeOptions.forEach(b => b.classList.remove('active'));
      this.classList.add('active');
    });
  });

  let currentTheme = localStorage.getItem('selectedTheme');
  if (!currentTheme) {
    currentTheme = 'green';
    localStorage.setItem('selectedTheme', currentTheme);
  }
  document.documentElement.setAttribute('data-theme', currentTheme);
  const activeBtn = document.querySelector(`.theme-btn[data-theme="${currentTheme}"]`);
  if (activeBtn) {
    themeOptions.forEach(b => b.classList.remove('active'));
    activeBtn.classList.add('active');
  }
}

function setupUserName() {
  const userNameElement = getElement('user-name');
  if (userNameElement) {
    userNameElement.textContent = state.userName;
  }
}

document.addEventListener('DOMContentLoaded', function() {
  startClock();
  setupTabNavigation();
  setupOptionButtons();
  setupSettingsCustomTimerInputs();
  setupColorTheme();
  setupUserName();
  initializeTimer();
  updateCombinedInfoDisplay();
});

window.addEventListener('beforeunload', cleanup);

function logDabSession(material, concentrate, heater, heatTime, coolTime) {
  return {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    material: material,
    concentrate: concentrate,
    heater: heater,
    heatTime: heatTime,
    coolTime: coolTime,
    totalTime: heatTime + coolTime
  };
}

