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
