// Simple clock implementation
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

// Initialize clock when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    updateClock();
    setInterval(updateClock, 60000); // Update every minute
});
