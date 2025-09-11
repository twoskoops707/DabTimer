#!/bin/bash

# Update the calendar screen in index.html
sed -i '/<!-- Calendar Screen -->/,/<!-- Setup Screen -->/c\
            <!-- Calendar Screen -->\
            <div id="calendar-screen" class="tab-content">\
                <div class="calendar-container">\
                    <h2>Usage Calendar</h2>\
                    \
                    <div class="calendar-controls">\
                        <div class="time-range-selector">\
                            <button class="time-range-btn active" data-range="week">Week</button>\
                            <button class="time-range-btn" data-range="month">Month</button>\
                            <button class="time-range-btn" data-range="year">Year</button>\
                            <button class="time-range-btn" data-range="custom">Custom</button>\
                        </div>\
                        \
                        <div class="date-navigation">\
                            <button id="prev-period"><i class="fas fa-chevron-left"></i></button>\
                            <h3 id="current-period">September 2023</h3>\
                            <button id="next-period"><i class="fas fa-chevron-right"></i></button>\
                        </div>\
                        \
                        <div class="custom-date-selector" id="custom-date-selector" style="display: none;">\
                            <input type="date" id="custom-start-date">\
                            <span>to</span>\
                            <input type="date" id="custom-end-date">\
                            <button id="apply-custom-dates">Apply</button>\
                        </div>\
                    </div>\
                    \
                    <div class="calendar-visualization">\
                        <div class="usage-chart" id="usage-chart">\
                            <!-- Chart will be generated here -->\
                        </div>\
                        \
                        <div class="usage-stats">\
                            <h3>Usage Statistics</h3>\
                            <div class="stats-grid">\
                                <div class="stat">\
                                    <span class="stat-value" id="total-sessions">0</span>\
                                    <span class="stat-label">Total Sessions</span>\
                                </div>\
                                <div class="stat">\
                                    <span class="stat-value" id="fav-concentrate">None</span>\
                                    <span class="stat-label">Favorite Concentrate</span>\
                                </div>\
                                <div class="stat">\
                                    <span class="stat-value" id="avg-per-day">0</span>\
                                    <span class="stat-label">Avg per Day</span>\
                                </div>\
                            </div>\
                        </div>\
                    </div>\
                    \
                    <div class="usage-history">\
                        <h3>Recent Activity</h3>\
                        <div class="history-list" id="history-list">\
                            <!-- History items will be generated here -->\
                        </div>\
                    </div>\
                </div>\
            </div>' index.html
