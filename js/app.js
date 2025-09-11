console.log("Dab Timer App Starting...");

// Simple state management
const state = {
    currentTab: 'home-screen',
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch'
    }
};

// Wait for full load
window.addEventListener('load', function() {
    console.log("Window fully loaded");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing application...");
    
    // Set up basic functionality
    setupOptionButtons();
    setupTabNavigation();
    setupStartButton();
    
    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
    
    console.log("App initialized successfully!");
}

function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const value = this.dataset.value;
            const group = this.closest('.setting-group');
            
            if (group) {
                // Remove active class from siblings
                const siblings = group.querySelectorAll('.option-btn');
                siblings.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Update state based on setting group
                const groupTitle = group.querySelector('h3');
                if (groupTitle) {
                    const title = groupTitle.textContent;
                    if (title.includes('Material')) {
                        state.settings.material = value;
                    } else if (title.includes('Concentrate')) {
                        state.settings.concentrate = value;
                    } else if (title.includes('Heating')) {
                        state.settings.heater = value;
                    }
                    console.log("Settings updated:", state.settings);
                }
            }
        });
    });
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            console.log("Switching to tab:", tabId);
            
            // Update active tab button
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update active tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                    state.currentTab = tabId;
                }
            });
        });
    });
}

function setupStartButton() {
    const startButton = document.getElementById('start-timer-from-home');
    if (startButton) {
        startButton.addEventListener('click', function() {
            console.log("Starting timer with settings:", state.settings);
            // Switch to timer tab
            switchToTab('timer-screen');
            
            // Start a basic timer (60 seconds for testing)
            startBasicTimer(60);
        });
    }
}

function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Update active tab button
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabId) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    // Update active tab content
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
    
    state.currentTab = tabId;
}

function startBasicTimer(seconds) {
    const timerElement = document.getElementById('timer');
    if (!timerElement) return;
    
    let timeLeft = seconds;
    
    // Update timer display immediately
    updateTimerDisplay(timeLeft);
    
    // Start countdown
    const interval = setInterval(() => {
        timeLeft--;
        
        if (timeLeft <= 0) {
            clearInterval(interval);
            timerElement.textContent = "Done!";
            timerElement.style.color = "var(--primary-color)";
        } else {
            updateTimerDisplay(timeLeft);
        }
    }, 1000);
}

function updateTimerDisplay(seconds) {
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        timerElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
        timerElement.style.color = "var(--text-primary)";
    }
}

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

console.log("App script loaded");
