#!/bin/bash

# Update the tab navigation
sed -i '/<!-- Tab Navigation -->/,/<\/nav>/c\
        <!-- Tab Navigation -->\
        <nav class="tab-bar">\
            <button class="tab-btn" data-tab="home-screen">\
                <i class="fas fa-home"></i>\
                <span>Home</span>\
            </button>\
            <button class="tab-btn active" data-tab="timer-screen">\
                <i class="fas fa-stopwatch"></i>\
                <span>Timer</span>\
            </button>\
            <button class="tab-btn" data-tab="calendar-screen">\
                <i class="fas fa-calendar"></i>\
                <span>Calendar</span>\
            </button>\
        </nav>' index.html

# Rename setup screen to home screen
sed -i 's/id="setup-screen"/id="home-screen"/g' index.html
sed -i 's/data-tab="setup-screen"/data-tab="home-screen"/g' index.html
