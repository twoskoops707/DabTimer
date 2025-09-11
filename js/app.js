console.log("Dab Timer - Clean Start");

// Wait for full DOM readiness
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready, starting app in 100ms...");
    setTimeout(initApp, 100);
});

function initApp() {
    console.log("Initializing app...");
    
    // Check if home screen exists
    const homeScreen = document.getElementById('home-screen');
    if (!homeScreen) {
        console.error("Home screen not found!");
        showError("Home screen not loaded");
        return;
    }
    
    console.log("Home screen found");
    
    // Setup basic functionality
    setupOptions();
    setupStartButton();
    setupTabs();
    startClock();
    
    console.log("App initialized successfully");
}

function setupOptions() {
    const options = document.querySelectorAll('.option-btn');
    console.log("Setting up", options.length, "options");
    
    options.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from siblings
            const parent = this.parentElement;
            const siblings = parent.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
            console.log("Selected:", this.dataset.value);
        });
    });
}

function setupStartButton() {
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            console.log("Starting timer...");
            switchToTab('timer-screen');
        });
    }
}

function setupTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            console.log("Switching to:", tabId);
            
            // Update buttons
            tabBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Update contents
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
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === tabId);
    });
    
    tabContents.forEach(content => {
        content.classList.toggle('active', content.id === tabId);
    });
}

function startClock() {
    const clock = document.getElementById('current-time');
    if (clock) {
        updateClock();
        setInterval(updateClock, 60000); // Update every minute
    }
}

function updateClock() {
    const clock = document.getElementById('current-time');
    if (clock) {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    }
}

function showError(msg) {
    const errorDiv = document.createElement('div');
    errorDiv.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #ff4444;
        color: white;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-family: Arial, sans-serif;
    `;
    errorDiv.textContent = msg;
    document.body.appendChild(errorDiv);
}

// Error handling
window.addEventListener('error', function(e) {
    console.error("Global error:", e.error);
});
