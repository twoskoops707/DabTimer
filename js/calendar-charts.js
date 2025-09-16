// Chart Manager for Dab Timer Calendar
console.log("Calendar charts module loaded");

// Chart manager for handling all chart operations
window.ChartManager = {
    usageChart: null,
    preferenceChart: null,
    
    // Update charts with real Chart.js implementation
    updateCharts: function(sessions) {
        // Destroy existing charts if they exist
        this.destroyCharts();
        
        // Create usage frequency chart (bar chart)
        const usageCtx = document.getElementById('usage-frequency-chart');
        if (usageCtx) {
            // Prepare data for usage frequency
            const dailyUsage = this.calculateDailyUsage(sessions);
            
            this.usageChart = new Chart(usageCtx, {
                type: 'bar',
                data: {
                    labels: Object.keys(dailyUsage),
                    datasets: [{
                        label: 'Sessions per Day',
                        data: Object.values(dailyUsage),
                        backgroundColor: 'rgba(76, 175, 80, 0.7)',
                        borderColor: 'rgba(76, 175, 80, 1)',
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
                                color: 'rgba(255, 255, 255, 0.1)'
                            }
                        },
                        x: {
                            ticks: {
                                color: '#ccc'
                            },
                            grid: {
                                color: 'rgba(255, 255, 255, 0.1)'
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
        
        // Create concentrate preference chart (pie chart)
        const preferenceCtx = document.getElementById('concentrate-preference-chart');
        if (preferenceCtx) {
            // Prepare data for concentrate preference
            const concentrateData = this.calculateConcentratePreference(sessions);
            
            this.preferenceChart = new Chart(preferenceCtx, {
                type: 'pie',
                data: {
                    labels: Object.keys(concentrateData),
                    datasets: [{
                        data: Object.values(concentrateData),
                        backgroundColor: [
                            'rgba(76, 175, 80, 0.7)',
                            'rgba(33, 150, 243, 0.7)',
                            'rgba(156, 39, 176, 0.7)',
                            'rgba(255, 152, 0, 0.7)',
                            'rgba(233, 30, 99, 0.7)',
                            'rgba(0, 188, 212, 0.7)',
                            'rgba(96, 125, 139, 0.7)',
                            'rgba(205, 220, 57, 0.7)'
                        ],
                        borderColor: [
                            'rgba(76, 175, 80, 1)',
                            'rgba(33, 150, 243, 1)',
                            'rgba(156, 39, 176, 1)',
                            'rgba(255, 152, 0, 1)',
                            'rgba(233, 30, 99, 1)',
                            'rgba(0, 188, 212, 1)',
                            'rgba(96, 125, 139, 1)',
                            'rgba(205, 220, 57, 1)'
                        ],
                        borderWidth: 1
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
                                font: {
                                    size: 10
                                }
                            }
                        }
                    }
                }
            });
        }
    },
    
    // Destroy existing charts
    destroyCharts: function() {
        if (this.usageChart) {
            this.usageChart.destroy();
            this.usageChart = null;
        }
        if (this.preferenceChart) {
            this.preferenceChart.destroy();
            this.preferenceChart = null;
        }
    },

    // Calculate daily usage for bar chart
    calculateDailyUsage: function(sessions) {
        const dailyUsage = {};
        
        // Initialize with empty values for the last 7 days
        const today = new Date();
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(today.getDate() - i);
            const dateStr = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
            dailyUsage[dateStr] = 0;
        }
        
        // Count sessions per day
        sessions.forEach(session => {
            try {
                const sessionDate = new Date(session.date);
                const dateStr = sessionDate.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
                
                if (dailyUsage[dateStr] !== undefined) {
                    dailyUsage[dateStr]++;
                }
            } catch (error) {
                console.error('Error processing session date:', error);
            }
        });
        
        return dailyUsage;
    },

    // Calculate concentrate preference for pie chart
    calculateConcentratePreference: function(sessions) {
        const concentrateCount = {};
        
        // Initialize with all possible concentrates
        const concentrates = ['shatter', 'wax', 'resin', 'rosin', 'budder', 'diamonds', 'sauce', 'crumble'];
        concentrates.forEach(concentrate => {
            concentrateCount[concentrate] = 0;
        });
        
        // Count sessions by concentrate
        sessions.forEach(session => {
            if (session.concentrate && concentrateCount[session.concentrate] !== undefined) {
                concentrateCount[session.concentrate]++;
            }
        });
        
        // Filter out concentrates with zero sessions
        Object.keys(concentrateCount).forEach(key => {
            if (concentrateCount[key] === 0) {
                delete concentrateCount[key];
            }
        });
        
        return concentrateCount;
    }
};
