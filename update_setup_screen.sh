#!/bin/bash

# Update the setup screen in index.html
sed -i '/<!-- Setup Screen -->/,/<!-- Tab Navigation -->/c\
            <!-- Setup Screen -->\
            <div id="setup-screen" class="tab-content">\
                <div class="setup-container">\
                    <h2>Configuration</h2>\
                    \
                    <div class="setting-group">\
                        <h3>Material</h3>\
                        <div class="option-buttons">\
                            <button class="option-btn active" data-value="quartz">Quartz</button>\
                            <button class="option-btn" data-value="titanium">Titanium</button>\
                            <button class="option-btn" data-value="ceramic">Ceramic</button>\
                        </div>\
                    </div>\
                    \
                    <div class="setting-group" id="thickness-group">\
                        <h3>Thickness</h3>\
                        <div class="option-buttons">\
                            <button class="option-btn active" data-value="1mm">1mm</button>\
                            <button class="option-btn" data-value="2mm">2mm</button>\
                            <button class="option-btn" data-value="4mm">4mm</button>\
                        </div>\
                    </div>\
                    \
                    <div class="setting-group">\
                        <h3>Rig Type</h3>\
                        <div class="rig-type-buttons">\
                            <button class="rig-type-btn active" data-value="mini_rig">\
                                <i class="fas fa-compress-alt"></i>\
                                <span>Mini Rig</span>\
                            </button>\
                            <button class="rig-type-btn" data-value="standard_rig">\
                                <i class="fas fa-glass-whiskey"></i>\
                                <span>Standard</span>\
                            </button>\
                            <button class="rig-type-btn" data-value="recycler">\
                                <i class="fas fa-recycle"></i>\
                                <span>Recycler</span>\
                            </button>\
                        </div>\
                    </div>\
                    \
                    <div class="setting-group">\
                        <h3>Heating Element</h3>\
                        <div class="option-buttons">\
                            <button class="option-btn active" data-value="butane_torch">Butane Torch</button>\
                            <button class="option-btn" data-value="bic_lighter">Bic Lighter</button>\
                            <button class="option-btn" data-value="acetylene_torch">Acetylene Torch</button>\
                        </div>\
                    </div>\
                    \
                    <div class="setting-group">\
                        <h3>Concentrate Type</h3>\
                        <div class="option-buttons">\
                            <button class="option-btn active" data-value="shatter">Shatter</button>\
                            <button class="option-btn" data-value="wax">Wax</button>\
                            <button class="option-btn" data-value="resin">Live Resin</button>\
                            <button class="option-btn" data-value="rosin">Rosin</button>\
                            <button class="option-btn" data-value="budder">Budder</button>\
                        </div>\
                    </div>\
                </div>\
            </div>\
        </main>\
\
        <!-- Tab Navigation -->\
        <nav class="tab-bar">\
            <button class="tab-btn active" data-tab="timer-screen">\
                <i class="fas fa-clock"></i>\
                <span>Timer</span>\
            </button>\
            <button class="tab-btn" data-tab="science-screen">\
                <i class="fas fa-flask"></i>\
                <span>Science</span>\
            </button>\
            <button class="tab-btn" data-tab="calendar-screen">\
                <i class="fas fa-calendar"></i>\
                <span>Calendar</span>\
            </button>\
            <button class="tab-btn" data-tab="setup-screen">\
                <i class="fas fa-cog"></i>\
                <span>Setup</span>\
            </button>\
        </nav>\
    </div>' index.html
