console.log("Dab Timer - Simple Init");

// Wait for FULL DOM readiness
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded and parsed");
    
    // Initialize with delay to ensure everything is ready
    setTimeout(initializeApp, 100);
});

function initializeApp() {
    console.log("Initializing app...");
    
    // Check if essential elements exist
    const homeScreen = document.getElementById('home-screen');
    if (!homeScreen) {
        console.error("Home screen not found!");
        return;
    }
    
    console.log("Home screen found, setting up...");
    
    // Set up basic functionality
    setupOptionButtons();
    setupStartButton();
    setupTabNavigation();
    updateClock();
    
    console.log("App initialized successfully");
}

function setupOptionButtons() {
    const optionButtons = document.querySelectorAll('.option-btn');
    console.log("Found", optionButtons.length, "option buttons");
    
    optionButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from siblings in same group
            const parent = this.parentElement;
            const siblings = parent.querySelectorAll('.option-btn');
            siblings.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            console.log("Selected:", this.dataset.setting, "=", this.dataset.value);
        });
    });
}

function setupStartButton() {
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log("Start timer clicked");
            switchToTab('timer-screen');
        });
    } else {
        console.error("Start button not found");
    }
}

function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    console.log("Setting up", tabButtons.length, "tab buttons");
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            console.log("Switching to tab:", tabId);
            
            // Update buttons
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
}

function switchToTab(tabId) {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabButtons.forEach(button => {
        if (button.dataset.tab === tabId) {
            button.classList.add('active');
        } else {
            button.classList.remove('active');
        }
    });
    
    tabContents.forEach(content => {
        if (content.id === tabId) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

function updateClock() {
    const clock = document.getElementById('current-time');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString();
        
        // Update every minute instead of every second to reduce load
        setTimeout(updateClock, 60000);
    }
}

// Basic error handling
window.addEventListener('error', function(e) {
    console.error("JavaScript error:", e.error);
});

console.log("Script loaded successfully");
