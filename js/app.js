// Simple initialization that won't freeze
console.log("Dab Timer app loading...");

// Wait for full DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM fully loaded, initializing app...");
    
    // Get essential elements
    const splashScreen = document.getElementById('splash-screen');
    const appScreen = document.getElementById('app');
    const getStartedBtn = document.getElementById('get-started');
    
    // Check if elements exist
    if (!splashScreen || !appScreen || !getStartedBtn) {
        console.error("Critical elements not found!");
        return;
    }
    
    console.log("Essential elements found, setting up event listeners...");
    
    // Simple get started button functionality
    getStartedBtn.addEventListener('click', function() {
        console.log("Get Started button clicked");
        splashScreen.classList.remove('active');
        appScreen.classList.add('active');
        
        // Initialize the rest of the app after transition
        setTimeout(initializeFullApp, 100);
    });
    
    // Initialize clock
    updateClock();
    setInterval(updateClock, 1000);
});

// Simple clock function
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

// Initialize the full app after the start screen
function initializeFullApp() {
    console.log("Initializing full application...");
    
    // This will load the rest of the functionality
    // For now, just ensure basic navigation works
    
    // Set up tab navigation
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0 && tabContents.length > 0) {
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
    
    console.log("Basic navigation setup complete");
}

// Basic state object
const state = {
    currentTab: 'home-screen',
    settings: {
        material: 'quartz',
        concentrate: 'shatter',
        heater: 'torch'
    }
};

console.log("App initialization functions defined");
