// Universal timer functionality
function setupTimerButtons() {
    // Home screen start button
    const homeStartBtn = document.getElementById('start-timer-btn');
    if (homeStartBtn) {
        homeStartBtn.addEventListener('click', function() {
            switchToTab('timer-screen');
            initializeTimer();
        });
    }
    
    // Timer screen start button
    const timerStartBtn = document.getElementById('start-timer');
    if (timerStartBtn) {
        timerStartBtn.addEventListener('click', function() {
            if (!state.timer || state.timer.timeLeft === 0) {
                initializeTimer();
            }
            toggleTimer();
        });
    }
    
    // Timer screen reset button
    const resetBtn = document.getElementById('reset-timer');
    if (resetBtn) {
        resetBtn.addEventListener('click', resetTimer);
    }
}

// Update initializeApp to use the universal setup
function initializeApp() {
    console.log("Initializing app...");
    updateClock();
    setupTabNavigation();
    setupOptionButtons();
    setupTimerButtons(); // Use universal timer setup
    updateSettingsDisplay(); // Initialize formula display
    console.log("App initialized");
}
