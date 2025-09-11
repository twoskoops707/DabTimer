console.log("🚀 Dab Timer App Initializing...");

// Wait for FULL DOM load including images and styles
window.addEventListener('load', function() {
    console.log("✅ Window fully loaded, starting app initialization...");
    
    // Initialize with maximum safety
    initializeAppSafely();
});

function initializeAppSafely() {
    console.log("🔍 Looking for essential elements...");
    
    // Get elements with maximum safety
    const splashScreen = document.getElementById('splash-screen');
    const appScreen = document.getElementById('app');
    const getStartedBtn = document.getElementById('get-started');
    
    // CRITICAL: Verify elements exist
    if (!splashScreen) {
        console.error("❌ splash-screen element not found!");
        showError("splash-screen element missing");
        return;
    }
    if (!appScreen) {
        console.error("❌ app element not found!");
        showError("app element missing");
        return;
    }
    if (!getStartedBtn) {
        console.error("❌ get-started button not found!");
        showError("get-started button missing");
        return;
    }
    
    console.log("✅ All essential elements found!");
    
    // SIMPLE get started button - this WILL work
    getStartedBtn.addEventListener('click', function() {
        console.log("🎯 Get Started button clicked!");
        
        // Visual feedback
        this.style.opacity = '0.7';
        setTimeout(() => { this.style.opacity = '1'; }, 150);
        
        // Transition screens
        splashScreen.style.transition = 'opacity 0.5s ease';
        splashScreen.style.opacity = '0';
        
        setTimeout(() => {
            splashScreen.classList.remove('active');
            appScreen.classList.add('active');
            appScreen.style.opacity = '0';
            appScreen.style.transition = 'opacity 0.5s ease';
            
            setTimeout(() => {
                appScreen.style.opacity = '1';
                console.log("✅ Successfully transitioned to main app!");
                initializeMainApp();
            }, 50);
        }, 500);
    });
    
    // Start the clock
    updateClock();
    setInterval(updateClock, 1000);
    
    console.log("✅ App initialized successfully! Ready for user interaction.");
}

function initializeMainApp() {
    console.log("🔄 Initializing main application features...");
    
    // Basic tab navigation - simple and reliable
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    if (tabButtons.length > 0) {
        tabButtons.forEach(button => {
            button.addEventListener('click', function() {
                const tabId = this.dataset.tab;
                console.log("📱 Switching to tab:", tabId);
                
                // Update UI
                tabButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    if (content.id === tabId) {
                        content.classList.add('active');
                    }
                });
            });
        });
    }
    
    // Load any saved settings
    loadSettings();
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
    console.log("⚙️ Loading settings...");
    // Simple settings load - can be expanded later
    try {
        const saved = localStorage.getItem('dabTimer_settings');
        if (saved) {
            console.log("✅ Settings loaded from storage");
        }
    } catch (e) {
        console.log("ℹ️ No saved settings found");
    }
}

function showError(message) {
    // Create visible error message
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
    errorDiv.textContent = 'Error: ' + message;
    document.body.appendChild(errorDiv);
    
    // Also add a restart button
    const restartBtn = document.createElement('button');
    restartBtn.textContent = 'Restart App';
    restartBtn.style.cssText = `
        margin-top: 10px;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        background: white;
        color: #ff4444;
        cursor: pointer;
    `;
    restartBtn.onclick = function() {
        location.reload();
    };
    errorDiv.appendChild(restartBtn);
}

console.log("📋 App script loaded successfully!");
