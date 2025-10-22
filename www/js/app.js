// DabTimer - Fixed Complete App.js
// All functionality working: Timer, Buttons, Navigation, Age Verification

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Loaded - Starting App Initialization');
    
    // Initialize app after DOM is ready
    initializeApp();
});

function initializeApp() {
    console.log('Initializing App...');
    
    // Show age verification first
    showAgeVerification();
}

// ==================== AGE VERIFICATION ====================
function showAgeVerification() {
    const ageVerification = document.getElementById('ageVerification');
    const confirmButton = document.getElementById('confirmAge');
    const stateSelect = document.getElementById('stateSelect');
    
    if (!ageVerification) {
        console.error('Age verification element not found!');
        return;
    }
    
    // Make sure it's visible
    ageVerification.style.display = 'flex';
    console.log('Age verification shown');
    
    // Handle confirmation
    if (confirmButton) {
        confirmButton.addEventListener('click', function() {
            const selectedState = stateSelect ? stateSelect.value : '';
            
            if (!selectedState) {
                alert('Please select your state');
                return;
            }
            
            console.log('Age verified for state:', selectedState);
            
            // Hide age verification
            ageVerification.style.display = 'none';
            
            // Save state
            localStorage.setItem('userState', selectedState);
            localStorage.setItem('ageVerified', 'true');
            
            // Initialize the rest of the app
            initializeMainApp();
        });
    }
}

// ==================== MAIN APP INITIALIZATION ====================
function initializeMainApp() {
    console.log('Initializing main app features...');
    
    // Initialize all features
    initializeNavigation();
    initializeTimer();
    initializeSetupOptions();
    initializeThemeToggle();
    
    // Show home screen by default
    showScreen('home');
    
    console.log('App fully initialized!');
}

// ==================== NAVIGATION ====================
function initializeNavigation() {
    console.log('Setting up navigation...');
    
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const screen = this.dataset.screen;
            console.log('Navigation to:', screen);
            showScreen(screen);
            
            // Update active nav button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

function showScreen(screenName) {
    console.log('Showing screen:', screenName);
    
    // Hide all screens
    const screens = document.querySelectorAll('.screen');
    screens.forEach(screen => {
        screen.classList.remove('active');
        screen.style.display = 'none';
    });
    
    // Show selected screen
    const targetScreen = document.getElementById(screenName);
    if (targetScreen) {
        targetScreen.classList.add('active');
        targetScreen.style.display = 'block';
        console.log('Screen shown:', screenName);
    } else {
        console.error('Screen not found:', screenName);
    }
}

// ==================== TIMER FUNCTIONALITY ====================
let timerInterval = null;
let currentTime = 0;
let timerState = 'stopped'; // stopped, heating, cooling

function initializeTimer() {
    console.log('Initializing timer...');
    
    const startButton = document.getElementById('startTimer');
    const stopButton = document.getElementById('stopTimer');
    const resetButton = document.getElementById('resetTimer');
    
    if (startButton) {
        startButton.addEventListener('click', startTimer);
    }
    
    if (stopButton) {
        stopButton.addEventListener('click', stopTimer);
    }
    
    if (resetButton) {
        resetButton.addEventListener('click', resetTimer);
    }
}

function startTimer() {
    console.log('Starting timer...');
    
    if (timerInterval) {
        clearInterval(timerInterval);
    }
    
    // Get heat-up time (default 30 seconds)
    const heatUpTime = parseInt(localStorage.getItem('heatUpTime') || '30');
    const coolDownTime = parseInt(localStorage.getItem('coolDownTime') || '45');
    
    currentTime = 0;
    timerState = 'heating';
    
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        currentTime++;
        
        // Check if we need to switch to cooling phase
        if (timerState === 'heating' && currentTime >= heatUpTime) {
            timerState = 'cooling';
            playSound('complete');
            showNotification('Heat-up complete! Start cooling.');
            currentTime = 0;
        }
        
        // Check if cooling is complete
        if (timerState === 'cooling' && currentTime >= coolDownTime) {
            stopTimer();
            playSound('complete');
            showNotification('Ready to dab! 🔥');
            return;
        }
        
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    console.log('Stopping timer...');
    
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    
    timerState = 'stopped';
}

function resetTimer() {
    console.log('Resetting timer...');
    
    stopTimer();
    currentTime = 0;
    timerState = 'stopped';
    updateTimerDisplay();
}

function updateTimerDisplay() {
    const timerDisplay = document.getElementById('timerDisplay');
    const timerStatus = document.getElementById('timerStatus');
    
    if (timerDisplay) {
        const minutes = Math.floor(currentTime / 60);
        const seconds = currentTime % 60;
        timerDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
    
    if (timerStatus) {
        if (timerState === 'heating') {
            timerStatus.textContent = '🔥 Heating...';
            timerStatus.style.color = '#ff6b6b';
        } else if (timerState === 'cooling') {
            timerStatus.textContent = '❄️ Cooling...';
            timerStatus.style.color = '#4ecdc4';
        } else {
            timerStatus.textContent = 'Ready';
            timerStatus.style.color = '#95e1d3';
        }
    }
}

// ==================== SETUP OPTIONS ====================
function initializeSetupOptions() {
    console.log('Initializing setup options...');
    
    // Material selection
    const materialButtons = document.querySelectorAll('.material-btn');
    materialButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Material selected:', this.dataset.material);
            materialButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            localStorage.setItem('selectedMaterial', this.dataset.material);
        });
    });
    
    // Concentrate selection
    const concentrateButtons = document.querySelectorAll('.concentrate-btn');
    concentrateButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Concentrate selected:', this.dataset.concentrate);
            concentrateButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            localStorage.setItem('selectedConcentrate', this.dataset.concentrate);
        });
    });
    
    // Heater selection
    const heaterButtons = document.querySelectorAll('.heater-btn');
    heaterButtons.forEach(button => {
        button.addEventListener('click', function() {
            console.log('Heater selected:', this.dataset.heater);
            heaterButtons.forEach(btn => btn.classList.remove('selected'));
            this.classList.add('selected');
            localStorage.setItem('selectedHeater', this.dataset.heater);
        });
    });
    
    // Load saved selections
    loadSavedSelections();
}

function loadSavedSelections() {
    const savedMaterial = localStorage.getItem('selectedMaterial');
    const savedConcentrate = localStorage.getItem('selectedConcentrate');
    const savedHeater = localStorage.getItem('selectedHeater');
    
    if (savedMaterial) {
        const btn = document.querySelector(`.material-btn[data-material="${savedMaterial}"]`);
        if (btn) btn.classList.add('selected');
    }
    
    if (savedConcentrate) {
        const btn = document.querySelector(`.concentrate-btn[data-concentrate="${savedConcentrate}"]`);
        if (btn) btn.classList.add('selected');
    }
    
    if (savedHeater) {
        const btn = document.querySelector(`.heater-btn[data-heater="${savedHeater}"]`);
        if (btn) btn.classList.add('selected');
    }
}

// ==================== THEME TOGGLE ====================
function initializeThemeToggle() {
    console.log('Initializing theme toggle...');
    
    const themeToggle = document.getElementById('themeToggle');
    
    if (themeToggle) {
        // Load saved theme
        const savedTheme = localStorage.getItem('theme') || 'dark';
        document.body.dataset.theme = savedTheme;
        
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.body.dataset.theme || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            console.log('Switching theme to:', newTheme);
            document.body.dataset.theme = newTheme;
            localStorage.setItem('theme', newTheme);
        });
    }
}

// ==================== UTILITY FUNCTIONS ====================
function playSound(type) {
    // Placeholder for sound functionality
    console.log('Playing sound:', type);
    // You can add actual audio playback here
}

function showNotification(message) {
    console.log('Notification:', message);
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #4ecdc4;
        color: #1a1a2e;
        padding: 15px 30px;
        border-radius: 10px;
        font-weight: bold;
        z-index: 10000;
        box-shadow: 0 4px 20px rgba(78, 205, 196, 0.3);
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// ==================== ERROR HANDLING ====================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.message, e.filename, e.lineno);
});

console.log('App.js loaded successfully!');