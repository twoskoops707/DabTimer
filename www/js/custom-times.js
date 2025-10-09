// Custom Time Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('custom-time-modal');
    const customTimeBtn = document.getElementById('custom-time-btn');
    const closeModal = document.querySelector('.close-modal');
    const applyBtn = document.getElementById('apply-custom-times');
    
    if (customTimeBtn && modal) {
        customTimeBtn.addEventListener('click', function() {
            modal.style.display = 'block';
        });
        
        closeModal.addEventListener('click', function() {
            modal.style.display = 'none';
        });
        
        applyBtn.addEventListener('click', function() {
            const heatTime = parseInt(document.getElementById('custom-heat-time').value);
            const coolTime = parseInt(document.getElementById('custom-cool-time').value);
            
            if (heatTime && coolTime) {
                // Store custom times
                localStorage.setItem('custom_heat_time', heatTime);
                localStorage.setItem('custom_cool_time', coolTime);
                
                modal.style.display = 'none';
                alert('Custom times saved successfully!');
            }
        });
        
        // Close modal if clicked outside
        window.addEventListener('click', function(event) {
            if (event.target === modal) {
                modal.style.display = 'none';
            }
        });
    }
});

// Function to get custom times with fallback to defaults
function getCustomTimes() {
    const customHeat = localStorage.getItem('custom_heat_time');
    const customCool = localStorage.getItem('custom_cool_time');
    
    return {
        heatTime: customHeat ? parseInt(customHeat) : null,
        coolTime: customCool ? parseInt(customCool) : null
    };
}

// Update timer initialization to use custom times
const originalInitializeTimer = initializeTimer;
initializeTimer = function() {
    const customTimes = getCustomTimes();
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    // Use custom times if set, otherwise use configured times
    const heatUpTime = customTimes.heatTime || Math.round(material.heatUp * heater.modifier);
    const coolDownTime = customTimes.coolTime || Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = heatUpTime;
    state.timer.totalTime = heatUpTime;
    
    if (elements.timerMode) elements.timerMode.textContent = 'HEAT UP';
    updateTimerDisplay();
    
    recordUsage();
};

// Update formula display with actual values
function updateFormulaDisplay(heatTime, coolTime, material, heater) {
    const formulaDisplay = document.querySelector('.formula-display');
    if (!formulaDisplay) return;
    
    // Calculate the actual values used
    const actualHeatTime = heatTime || Math.round(material.heatUp * heater.modifier);
    const actualCoolTime = coolTime || Math.round(material.coolDown * heater.modifier);
    
    formulaDisplay.innerHTML = `
        <h4>Heating Formula</h4>
        <div class="formula-line">t = (m × c × ΔT) / P</div>
        <div class="formula-line">Material: ${state.settings.material.charAt(0).toUpperCase() + state.settings.material.slice(1)}</div>
        <div class="formula-line">Heater: ${state.settings.heater.charAt(0).toUpperCase() + state.settings.heater.slice(1)}</div>
        <div class="formula-line">Heat Up: ${actualHeatTime}s (${material.heatUp}s × ${heater.modifier})</div>
        <div class="formula-line">Cool Down: ${actualCoolTime}s (${material.coolDown}s × ${heater.modifier})</div>
        <div class="formula-line">Total Cycle: ${actualHeatTime + actualCoolTime}s</div>
    `;
}

// Update the timer initialization to show formula
const originalInitializeTimer = initializeTimer;
initializeTimer = function() {
    const customTimes = getCustomTimes();
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    // Use custom times if set, otherwise use configured times
    const heatUpTime = customTimes.heatTime || Math.round(material.heatUp * heater.modifier);
    const coolDownTime = customTimes.coolTime || Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'heat';
    state.timer.timeLeft = heatUpTime;
    state.timer.totalTime = heatUpTime;
    
    if (elements.timerMode) elements.timerMode.textContent = 'HEAT UP';
    updateTimerDisplay();
    
    // Update formula with actual values
    updateFormulaDisplay(customTimes.heatTime, customTimes.coolTime, material, heater);
    
    recordUsage();
};

// Update the cool down function to show formula
const originalSwitchToCoolDown = switchToCoolDown;
switchToCoolDown = function() {
    const customTimes = getCustomTimes();
    const material = CONFIG.materials[state.settings.material];
    const heater = CONFIG.heaters[state.settings.heater];
    
    const coolDownTime = customTimes.coolTime || Math.round(material.coolDown * heater.modifier);
    
    state.timer.mode = 'cool';
    state.timer.timeLeft = coolDownTime;
    state.timer.totalTime = coolDownTime;
    
    if (elements.timerMode) elements.timerMode.textContent = 'COOL DOWN';
    updateTimerDisplay();
    
    // Update formula to show cool down time
    updateFormulaDisplay(customTimes.heatTime, customTimes.coolTime, material, heater);
};
