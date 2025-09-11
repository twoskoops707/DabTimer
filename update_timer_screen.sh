#!/bin/bash

# Update the timer screen in index.html
sed -i '/<!-- Timer Screen -->/,/<!-- Home Screen -->/c\
            <!-- Timer Screen -->\
            <div id="timer-screen" class="tab-content active">\
                <div class="timer-container">\
                    <div class="timer-display">\
                        <div id="timer-mode">HEAT UP</div>\
                        <div id="timer" class="digital">0:30</div>\
                        <div class="progress-container">\
                            <div id="timer-progress" class="progress-bar"></div>\
                        </div>\
                        <div class="enjoy-message" id="enjoy-message">Enjoy</div>\
                    </div>\
                    <div class="timer-controls">\
                        <button id="start-timer" class="btn-primary">\
                            <i class="fas fa-play"></i> Start\
                        </button>\
                        <button id="reset-timer" class="btn-secondary">\
                            <i class="fas fa-redo"></i> Reset\
                        </button>\
                    </div>\
                    <div class="current-settings">\
                        <h3>Current Settings</h3>\
                        <div class="settings-display">\
                            <p>Material: <span id="current-material">Quartz</span></p>\
                            <p>Concentrate: <span id="current-concentrate">Shatter</span></p>\
                            <p>Heater: <span id="current-heater">Torch</span></p>\
                        </div>\
                    </div>\
                    <div class="formula-explanation" id="formula-explanation">\
                        <div class="formula-title">Precision Timing Formula</div>\
                        <div class="formula-content" id="formula-content">\
                            Calculating optimal heat and cool times based on material properties and concentrate characteristics.\
                        </div>\
                    </div>\
                    <div class="custom-time-section">\
                        <h3>Custom Times</h3>\
                        <div class="custom-time-inputs">\
                            <div class="input-group">\
                                <label for="custom-heat">Heat Time (s):</label>\
                                <input type="number" id="custom-heat" min="10" max="180" value="30">\
                            </div>\
                            <div class="input-group">\
                                <label for="custom-cool">Cool Time (s):</label>\
                                <input type="number" id="custom-cool" min="10" max="180" value="45">\
                            </div>\
                            <div class="custom-time-toggle">\
                                <label class="toggle-switch">\
                                    <input type="checkbox" id="lock-custom-times">\
                                    <span class="toggle-slider"></span>\
                                </label>\
                                <span class="toggle-label">Lock Custom Times</span>\
                            </div>\
                            <button id="apply-custom-times" class="btn-secondary">Apply Custom Times</button>\
                        </div>\
                    </div>\
                </div>\
            </div>' index.html
