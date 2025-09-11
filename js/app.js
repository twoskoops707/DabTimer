console.log("Dab Timer - Clean Start");

// Simple initialization after DOM load
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM ready");
    initializeApp();
});

function initializeApp() {
    console.log("Initializing app...");
    
    // Set up basic functionality
    setupOptions();
    setupStartButton();
    setupTabs();
    startClock();
    
    console.log("App initialized");
}

function setupOptions() {
    const options = document.querySelectorAll('.option-btn');
    options.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active from siblings
            const parent = this.parentElement;
            const siblings = parent.querySelectorAll('.option-btn');
            siblings.forEach(sib => sib.classList.remove('active'));
            
            // Add active to clicked
            this.classList.add('active');
        });
    });
}

function setupStartButton() {
    const startBtn = document.getElementById('start-timer-btn');
    if (startBtn) {
        startBtn.addEventListener('click', function() {
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
    updateClock();
    setInterval(updateClock, 60000);
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

// Error handling
window.addEventListener('error', function(e) {
    console.error("Error:", e.error);
});
