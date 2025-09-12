console.log("Dab Timer - Clean Version");

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
        rosin: { idealTemp: '380-450°F' },
        budder: { idealTemp: '350-420°F' },
        diamonds: { idealTemp: '400-500°F' },
        sauce: { idealTemp: '380-450°F' },
        crumble: { idealTemp: '360-430°F' }
    },
    heaters: {
        torch: { modifier: 1.0 },
        lighter: { modifier: 2.0 }
    }
};

// App State
let state = {
    currentTab: 'home-screen',
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch'
    }
};

// Initialize the app
function initializeApp() {
    console.log("Initializing app...");
    updateClock();
    setupTabNavigation();
    setupOptionButtons();
    console.log("App initialized");
}

// Clock functions
function updateClock() {
    const clockElement = document.getElementById('current-time');
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
    setInterval(updateClock, 30000);
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
        if (btn.dataset.tab === tabId) btn.classList.add('active');
    });
    
    tabContents.forEach(content => {
        content.classList.remove('active');
        if (content.id === tabId) content.classList.add('active');
    });
    
    state.currentTab = tabId;
}

// Option buttons


// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initializeApp);

// Fix option selection to update displayed values
function setupOptionButtons() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.addEventListener('click', function() {
            const settingType = this.dataset.setting;
            const value = this.dataset.value;
            
            if (settingType && value) {
                // Remove active class from siblings
                const parent = this.parentElement;
                const siblings = parent.querySelectorAll('.option-btn');
                siblings.forEach(sib => sib.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update state
                state.settings[settingType] = value;
                
                // Update displayed values
                updateSettingsDisplay();
                
                console.log("Setting changed:", settingType, "=", value);
            }
        });
    });
}

function updateSettingsDisplay() {
    // Update current settings display
    const materialEl = document.getElementById('current-material');
    const concentrateEl = document.getElementById('current-concentrate');
    const heaterEl = document.getElementById('current-heater');
    
    if (materialEl) materialEl.textContent = state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1);
    if (concentrateEl) concentrateEl.textContent = state.settings.concentrate.charAt(0).toUpperCase() + state.settings.concentrate.slice(1);
    if (heaterEl) heaterEl.textContent = state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1);
}

// Scientific calculations for dab timing
function calculateHeatTime(material, heater, concentrate) {
    const baseTimes = {
        quartz: { 
            shatter: 30, wax: 35, resin: 40, rosin: 38, 
            budder: 36, diamonds: 42, sauce: 39, crumble: 37
        },
        titanium: { 
            shatter: 20, wax: 25, resin: 30, rosin: 28,
            budder: 26, diamonds: 32, sauce: 29, crumble: 27
        },
        ceramic: { 
            shatter: 45, wax: 50, resin: 55, rosin: 53,
            budder: 51, diamonds: 57, sauce: 54, crumble: 52
        }
    };
    
    const heaterModifiers = {
        torch: 1.0,
        lighter: 2.0,
        enail: 0.8,
        ebanger: 0.9
    };
    
    const baseTime = baseTimes[material]?.[concentrate] || 30;
    const modifier = heaterModifiers[heater] || 1.0;
    
    return Math.round(baseTime * modifier);
}

function calculateCoolTime(material, heatTime) {
    const coolMultipliers = {
        quartz: 1.5,
        titanium: 3.0,
        ceramic: 1.2
    };
    
    const multiplier = coolMultipliers[material] || 1.5;
    return Math.round(heatTime * multiplier);
}

function updateFormulaDisplay() {
    const material = state.settings.material;
    const heater = state.settings.heater;
    const concentrate = state.settings.concentrate;
    
    const heatTime = calculateHeatTime(material, heater, concentrate);
    const coolTime = calculateCoolTime(material, heatTime);
    const totalTime = heatTime + coolTime;
    
    // Update formula display
    document.getElementById('formula-material').textContent = material.charAt(0).toUpperCase() + material.slice(1);
    document.getElementById('formula-concentrate').textContent = concentrate.charAt(0).toUpperCase() + concentrate.slice(1);
    document.getElementById('formula-heater').textContent = heater.charAt(0).toUpperCase() + heater.slice(1);
    document.getElementById('formula-heat-time').textContent = `${heatTime}s`;
    document.getElementById('formula-cool-time').textContent = `${coolTime}s`;
    document.getElementById('formula-total-time').textContent = `${totalTime}s`;
}

// Update formula when settings change
function updateSettingsDisplay() {
    // Update current settings display
    const materialEl = document.getElementById('current-material');
    const concentrateEl = document.getElementById('current-concentrate');
    const heaterEl = document.getElementById('current-heater');
    
    if (materialEl) materialEl.textContent = state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1);
    if (concentrateEl) concentrateEl.textContent = state.settings.concentrate.charAt(0).toUpperCase() + state.settings.concentrate.slice(1);
    if (heaterEl) heaterEl.textContent = state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1);
    
    // Update formula display
    updateFormulaDisplay();
}
