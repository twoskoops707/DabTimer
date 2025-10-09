// Core Calendar functionality for Dab Timer
console.log("Calendar core module loaded");

// Data storage and analytics functions
const Calendar = {
    currentPeriod: new Date(),
    currentRange: 'week',
    
    // Initialize calendar
    init: function() {
        this.setupCalendarControls();
        this.updateAnalytics();
    },

    // Setup calendar control event listeners
    setupCalendarControls: function() {
        // Remove existing listeners to prevent duplication
        const timeRangeBtns = document.querySelectorAll('.time-range-btn');
        timeRangeBtns.forEach(btn => {
            btn.replaceWith(btn.cloneNode(true));
        });
        
        const prevBtn = document.getElementById('prev-period');
        const nextBtn = document.getElementById('next-period');
        if (prevBtn) prevBtn.replaceWith(prevBtn.cloneNode(true));
        if (nextBtn) nextBtn.replaceWith(nextBtn.cloneNode(true));
        
        // Rebind events
        this.bindCalendarControls();
    },

    // Bind event listeners to controls
    bindCalendarControls: function() {
        // Time range buttons
        const timeRangeBtns = document.querySelectorAll('.time-range-btn');
        timeRangeBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                timeRangeBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                Calendar.currentRange = this.getAttribute("data-range");
                Calendar.updateAnalytics();
            });
        });

        // Date navigation
        const prevBtn = document.getElementById('prev-period');
        const nextBtn = document.getElementById('next-period');
        
        if (prevBtn) {
            prevBtn.addEventListener('click', function() {
                Calendar.navigatePeriod(-1);
            });
        }
        
        if (nextBtn) {
            nextBtn.addEventListener('click', function() {
                Calendar.navigatePeriod(1);
            });
        }
    },

    // Load sessions from localStorage with error handling
    loadSessions: function() {
        try {
            const sessionsJson = localStorage.getItem('dabSessions');
            if (!sessionsJson) return [];
            
            const sessions = JSON.parse(sessionsJson);
            if (!Array.isArray(sessions)) return [];
            
            // Validate each session has required fields
            return sessions.filter(session => 
                session && 
                typeof session === 'object' &&
                session.date &&
                session.material &&
                session.concentrate &&
                session.heater &&
                typeof session.heatTime === 'number' &&
                typeof session.coolTime === 'number'
            );
        } catch (error) {
            console.error('Error loading sessions:', error);
            return [];
        }
    },

    // Save a new session with validation
    saveSession: function(material, concentrate, heater, heatTime, coolTime) {
        // Validate inputs
        if (!material || !concentrate || !heater || 
            typeof heatTime !== 'number' || typeof coolTime !== 'number' ||
            heatTime <= 0 || coolTime <= 0) {
            console.error('Invalid session data');
            return null;
        }
        
        try {
            const sessions = this.loadSessions();
            const newSession = {
                id: Date.now(),
                date: new Date().toISOString(),
                material: material,
                concentrate: concentrate,
                heater: heater,
                heatTime: heatTime,
                coolTime: coolTime,
                totalTime: heatTime + coolTime
            };
            
            sessions.push(newSession);
            localStorage.setItem('dabSessions', JSON.stringify(sessions));
            
            return newSession;
        } catch (error) {
            console.error('Error saving session:', error);
            return null;
        }
    },

    // Get sessions for a specific time period
    getSessionsByPeriod: function(range) {
        if (!range) range = this.currentRange;
        const sessions = this.loadSessions();
        const now = new Date(this.currentPeriod);
        let startDate, endDate;
        
        switch(range) {
            case 'week':
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                endDate = now;
                break;
            case 'month':
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                endDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                break;
            case 'year':
                startDate = new Date(now.getFullYear(), 0, 1);
                endDate = new Date(now.getFullYear(), 11, 31);
                break;
            default:
                startDate = new Date(now);
                startDate.setDate(now.getDate() - 7);
                endDate = now;
        }
        
        return sessions.filter(session => {
            try {
                const sessionDate = new Date(session.date);
                return sessionDate >= startDate && sessionDate <= endDate;
            } catch (error) {
                console.error('Invalid session date:', session.date);
                return false;
            }
        });
    },

    // Calculate days in period for sessions per day calculation
    getDaysInPeriod: function(range) {
        if (!range) range = this.currentRange;
        const now = new Date(this.currentPeriod);
        
        switch(range) {
            case 'week':
                return 7;
            case 'month':
                return new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
            case 'year':
                // Account for leap years
                const year = now.getFullYear();
                return ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) ? 366 : 365;
            default:
                return 7;
        }
    },

    // Update analytics displays
    updateAnalytics: function() {
        const sessions = this.getSessionsByPeriod();
        const daysInPeriod = this.getDaysInPeriod();
        
        // Update period display
        this.updatePeriodDisplay();
        
        // Update stats
        this.updateStats(sessions, daysInPeriod);
        
        // Update charts
        if (window.ChartManager) {
            window.ChartManager.updateCharts(sessions);
        }
        
        // Update history list
        this.updateHistoryList(sessions);
    },

    // Update period display
    updatePeriodDisplay: function() {
        const periodElement = document.getElementById('current-period');
        if (!periodElement) return;
        
        const now = new Date(this.currentPeriod);
        let periodText = '';
        
        switch(this.currentRange) {
            case 'week':
                const weekStart = new Date(now);
                weekStart.setDate(now.getDate() - 6);
                periodText = `${weekStart.toLocaleDateString()} - ${now.toLocaleDateString()}`;
                break;
            case 'month':
                periodText = now.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                break;
            case 'year':
                periodText = now.getFullYear().toString();
                break;
            default:
                periodText = now.toLocaleDateString();
        }
        
        periodElement.textContent = periodText;
    },

    // Update statistics
    updateStats: function(sessions, daysInPeriod) {
        const totalSessions = sessions.length;
        const sessionsPerDay = totalSessions > 0 && daysInPeriod > 0 ? 
            (totalSessions / daysInPeriod).toFixed(1) : '0';
        
        // Find favorite concentrate
        let concentrateCount = {};
        sessions.forEach(session => {
            if (session.concentrate) {
                concentrateCount[session.concentrate] = (concentrateCount[session.concentrate] || 0) + 1;
            }
        });
        
        let favConcentrate = 'None';
        let maxCount = 0;
        for (const [concentrate, count] of Object.entries(concentrateCount)) {
            if (count > maxCount) {
                maxCount = count;
                favConcentrate = concentrate;
            }
        }
        
        // Update DOM elements
        const totalSessionsEl = document.getElementById('total-sessions');
        const sessionsPerDayEl = document.getElementById('sessions-per-day');
        const favConcentrateEl = document.getElementById('fav-concentrate');
        
        if (totalSessionsEl) totalSessionsEl.textContent = totalSessions;
        if (sessionsPerDayEl) sessionsPerDayEl.textContent = sessionsPerDay;
        if (favConcentrateEl) {
            favConcentrateEl.textContent = favConcentrate && favConcentrate !== 'None' ? 
                favConcentrate.charAt(0).toUpperCase() + favConcentrate.slice(1) : 'None';
        }
    },

    // Update history list
    updateHistoryList: function(sessions) {
        const historyList = document.getElementById('history-list');
        if (!historyList) return;
        
        // Clear existing content
        historyList.innerHTML = '';
        
        // Sort sessions by date (newest first) without mutating original
        const sortedSessions = sessions.slice().sort((a, b) => {
            try {
                return new Date(b.date) - new Date(a.date);
            } catch (error) {
                return 0;
            }
        });
        
        // Add sessions to list
        sortedSessions.forEach(session => {
            try {
                const listItem = document.createElement('div');
                listItem.className = 'history-item';
                
                const date = new Date(session.date);
                const formattedDate = date.toLocaleDateString() + ' ' + 
                                     date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
                
                // Format time with proper padding, including hours if needed
                const totalSeconds = session.totalTime;
                const hours = Math.floor(totalSeconds / 3600);
                const minutes = Math.floor((totalSeconds % 3600) / 60);
                const seconds = totalSeconds % 60;
                
                let formattedTime = '';
                if (hours > 0) {
                    formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
                } else {
                    formattedTime = `${minutes}:${seconds.toString().padStart(2, '0')}`;
                }
                
                listItem.innerHTML = `
                    <div class="history-date">${formattedDate}</div>
                    <div class="history-details">
                        ${session.material ? session.material.charAt(0).toUpperCase() + session.material.slice(1) : 'Unknown'} | 
                        ${session.concentrate ? session.concentrate.charAt(0).toUpperCase() + session.concentrate.slice(1) : 'Unknown'} | 
                        ${session.heater ? session.heater.charAt(0).toUpperCase() + session.heater.slice(1) : 'Unknown'}
                    </div>
                    <div class="history-time">${formattedTime}</div>
                `;
                
                historyList.appendChild(listItem);
            } catch (error) {
                console.error('Error rendering session:', error, session);
            }
        });
        
        // Add message if no sessions
        if (sortedSessions.length === 0) {
            historyList.innerHTML = '<div class="no-sessions">No sessions recorded yet</div>';
        }
    },

    // Navigate between periods
    navigatePeriod: function(direction) {
        try {
            const newDate = new Date(this.currentPeriod);
            
            switch(this.currentRange) {
                case 'week':
                    newDate.setDate(newDate.getDate() + (direction * 7));
                    break;
                case 'month':
                    newDate.setMonth(newDate.getMonth() + direction);
                    break;
                case 'year':
                    newDate.setFullYear(newDate.getFullYear() + direction);
                    break;
                default:
                    newDate.setDate(newDate.getDate() + (direction * 7));
            }
            
            this.currentPeriod = newDate;
            this.updateAnalytics();
        } catch (error) {
            console.error('Error navigating period:', error);
        }
    },

    // Clear all sessions (for debugging)
    clearAllSessions: function() {
        try {
            localStorage.removeItem('dabSessions');
            this.updateAnalytics();
            console.log('All sessions cleared');
        } catch (error) {
            console.error('Error clearing sessions:', error);
        }
    }
};

// Initialize calendar when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    Calendar.init();
});

// Attach logDabSession to window instead of global scope
window.logDabSession = function(material, concentrate, heater, heatTime, coolTime) {
    return Calendar.saveSession(material, concentrate, heater, heatTime, coolTime);
};
