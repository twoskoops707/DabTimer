console.log("Dab Timer App Starting...");

// Wait for full load to ensure everything is ready
window.addEventListener('load', function() {
    console.log("Window fully loaded, initializing app...");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing application...");
    
    // Set up tab navigation
    setupTabNavigation();
    
    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
    
    // Load settings
    loadSettings();
    
    console.log("App initialized successfully!");
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length === 0 || tabContents.length === 0) {
        console.log("No tabs found");
        return;
    }
    
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
                }
            });
        });
    });
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

function loadSettings() {
    try {
        const saved = localStorage.getItem('dabTimer_settings');
        if (saved) {
            console.log("Settings loaded from storage");
        }
    } catch (e) {
        console.log("No saved settings found");
    }
}

// Simple timer functionality
let timerInterval = null;
let timerSeconds = 0;

function startTimer(seconds) {
    stopTimer();
    timerSeconds = seconds;
    
    const timerElement = document.getElementById('timer');
    if (timerElement) {
        timerInterval = setInterval(() => {
            timerSeconds--;
            if (timerSeconds <= 0) {
                stopTimer();
                timerElement.textContent = "Done!";
            } else {
                const mins = Math.floor(timerSeconds / 60);
                const secs = timerSeconds % 60;
                timerElement.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
            }
        }, 1000);
    }
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

console.log("App script loaded");
