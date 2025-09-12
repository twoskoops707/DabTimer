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
