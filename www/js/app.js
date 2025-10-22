// DabTimer - CLEAN WORKING VERSION WITH BIRTHDAY VERIFICATION
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
    
    // Check for age verification
    const isVerified = localStorage.getItem('ageVerified');
    const ageScreen = document.getElementById('age-verification');
    
    if (isVerified === 'true' || !ageScreen) {
        // Already verified or no verification screen
        if (ageScreen) ageScreen.style.display = 'none';
        initializeApp();
    } else {
        // Show age verification
        setupAgeVerification();
    }
});

// Setup age verification with birthday check
function setupAgeVerification() {
    const yesBtn = document.getElementById('verify-yes');
    const noBtn = document.getElementById('verify-no');
    const stateSelect = document.getElementById('user-state');
    const birthdateInput = document.getElementById('user-birthdate');
    const errorDiv = document.getElementById('age-error');
    
    if (yesBtn) {
        yesBtn.addEventListener('click', function() {
            const selectedState = stateSelect ? stateSelect.value : '';
            const birthdate = birthdateInput ? birthdateInput.value : '';
            
            console.log('Verification attempt:', { state: selectedState, birthdate: birthdate });
            
            // Validate inputs
            if (!selectedState) {
                showError('Please select your state');
                return;
            }
            
            if (!birthdate) {
                showError('Please enter your date of birth');
                return;
            }
            
            // Calculate age
            const age = calculateAge(birthdate);
            console.log('Calculated age:', age);
            
            if (age < 21) {
                showError('You must be 21 or older to use this app');
                return;
            }
            
            // Success - hide error and proceed
            if (errorDiv) errorDiv.classList.remove('show');
            
            localStorage.setItem('ageVerified', 'true');
            localStorage.setItem('userState', selectedState);
            localStorage.setItem('userBirthdate', birthdate);
            
            const ageScreen = document.getElementById('age-verification');
            if (ageScreen) {
                ageScreen.style.opacity = '0';
                ageScreen.style.transition = 'opacity 0.5s ease';
                setTimeout(() => {
                    ageScreen.style.display = 'none';
                    initializeApp();
                }, 500);
            } else {
                initializeApp();
            }
        });
    }
    
    if (noBtn) {
        noBtn.addEventListener('click', function() {
            showError('You must be 21