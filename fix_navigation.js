// Simple tab navigation fix
function setupTabs() {
    console.log("Setting up tabs...");
    
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const tabId = this.dataset.tab;
            console.log("Switching to tab:", tabId);
            
            // Update tab buttons
            tabBtns.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Update tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
                if (content.id === tabId) {
                    content.classList.add('active');
                }
            });
        });
    });
    
    console.log("Tabs setup complete");
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM loaded - initializing navigation");
    setTimeout(setupTabs, 100);
});
