// Chart.js implementations for analytics
let usageChart = null;
let preferenceChart = null;

function initializeCharts() {
    createUsageChart();
    createPreferenceChart();
}

function createUsageChart() {
    const ctx = document.getElementById('usage-frequency-chart').getContext('2d');
    const data = getUsageChartData();
    
    usageChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'Sessions',
                data: data.values,
                backgroundColor: '#4CAF50',
                borderColor: '#388E3C',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        color: '#ccc'
                    },
                    grid: {
                        color: '#444'
                    }
                },
                x: {
                    ticks: {
                        color: '#ccc'
                    },
                    grid: {
                        color: '#444'
                    }
                }
            },
            plugins: {
                legend: {
                    labels: {
                        color: '#ccc'
                    }
                }
            }
        }
    });
}

function createPreferenceChart() {
    const ctx = document.getElementById('concentrate-preference-chart').getContext('2d');
    const data = getPreferenceChartData();
    
    preferenceChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: data.labels,
            datasets: [{
                data: data.values,
                backgroundColor: [
                    '#4CAF50', '#2196F3', '#FF9800', '#E91E63', 
                    '#9C27B0', '#607D8B', '#795548'
                ],
                borderColor: '#2a2a2a',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#ccc',
                        padding: 15
                    }
                }
            }
        }
    });
}

function getUsageChartData() {
    // Generate sample data for last 7 days
    const labels = [];
    const values = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        
        labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
        values.push(state.usage[dateStr] ? state.usage[dateStr].count : 0);
    }
    
    return { labels, values };
}

function getPreferenceChartData() {
    const concentrateCount = {};
    
    // Count concentrate usage
    for (const date in state.usage) {
        for (const conc in state.usage[date].concentrates) {
            concentrateCount[conc] = (concentrateCount[conc] || 0) + state.usage[date].concentrates[conc];
        }
    }
    
    const labels = [];
    const values = [];
    
    for (const conc in concentrateCount) {
        labels.push(conc.charAt(0).toUpperCase() + conc.slice(1));
        values.push(concentrateCount[conc]);
    }
    
    return { labels, values };
}

function updateCharts() {
    if (usageChart) {
        const usageData = getUsageChartData();
        usageChart.data.labels = usageData.labels;
        usageChart.data.datasets[0].data = usageData.values;
        usageChart.update();
    }
    
    if (preferenceChart) {
        const preferenceData = getPreferenceChartData();
        preferenceChart.data.labels = preferenceData.labels;
        preferenceChart.data.datasets[0].data = preferenceData.values;
        preferenceChart.update();
    }
}

// Update the calendar setup to initialize charts
function setupCalendar() {
    // Setup time range buttons
    const timeRangeBtns = document.querySelectorAll('.time-range-btn');
    timeRangeBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const range = this.dataset.range;
            timeRangeBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            updateCalendarDisplay(range);
        });
    });

    // Setup date navigation
    const prevBtn = document.getElementById('prev-period');
    const nextBtn = document.getElementById('next-period');
    
    if (prevBtn) prevBtn.addEventListener('click', () => navigatePeriod(-1));
    if (nextBtn) nextBtn.addEventListener('click', () => navigatePeriod(1));

    // Initialize charts
    initializeCharts();

    // Initial calendar update
    updateCalendarDisplay('week');
}
