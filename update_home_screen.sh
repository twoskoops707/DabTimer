#!/bin/bash

# Update the home screen in index.html
sed -i '/<!-- Home Screen -->/,/<!-- Timer Screen -->/c\
            <!-- Home Screen -->\
            <div id="home-screen" class="tab-content">\
                <div class="setup-container">\
                    <h2>Dab Configuration</h2>\
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
                    \
                    <div class="start-timer-btn-container">\
                        <button id="start-from-home" class="btn-primary">\
                            <i class="fas fa-stopwatch"></i> Start Timer\
                        </button>\
                    </div>\
                </div>\
            </div>' index.html
