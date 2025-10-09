// Fix for calendar range selection
document.addEventListener('DOMContentLoaded', function() {
    // Re-bind calendar controls after a short delay to ensure DOM is fully loaded
    setTimeout(function() {
        if (typeof Calendar !== 'undefined') {
            Calendar.setupCalendarControls();
        }
    }, 500);
});
