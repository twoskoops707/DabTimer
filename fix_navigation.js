function fixNav() {
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('tab-btn')) {
            e.preventDefault();
            const tab = e.target.dataset.tab;
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        }
    });
}
document.addEventListener('DOMContentLoaded', fixNav);
