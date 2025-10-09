document.addEventListener('DOMContentLoaded', function() {
    console.log('DabTimer App Loaded');
    // Initialize from js files
    if (typeof initNavigation === 'function') initNavigation();
    showScreen('home');
});

function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    const screen = document.getElementById(screenId);
    if (screen) screen.classList.add('active');
}
