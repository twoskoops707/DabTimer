// Audio functionality for dab timer
let alarmSound = null;

function initializeAudio() {
    // Create audio context for modern browsers
    try {
        if (window.AudioContext || window.webkitAudioContext) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const audioContext = new AudioContext();
            
            // Create a simple beep alarm sound
            function createBeepSound() {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(880, audioContext.currentTime);
                gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
                
                return {
                    play: function() {
                        oscillator.start();
                        oscillator.stop(audioContext.currentTime + 0.5);
                    }
                };
            }
            
            alarmSound = createBeepSound();
        }
    } catch (error) {
        console.log("Audio context not supported:", error);
    }
}

function playAlarmSound() {
    // Try to play the beep sound
    if (alarmSound) {
        try {
            alarmSound.play();
        } catch (error) {
            console.log("Could not play alarm sound:", error);
            fallbackAlarm();
        }
    } else {
        fallbackAlarm();
    }
}

function fallbackAlarm() {
    // Fallback: Use browser's Audio if available
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hWFApGn+DxwIIuCB5tw/LTgTMKGFu56fSwXBgMSqHk9sCINQoaZrzt87hkHAtFoeT3wIg2ChpmvO3zuGQcC0Wh5PfAiDYKGma87fO4ZBwLRaHk98CINgoaZrzt87hkHAtFoeT3wIg2ChpmvO3zuGQcC0Wh5PfAiDYKGma87fO4ZBw==');
        audio.volume = 0.3;
        audio.play().catch(() => {
            // Final fallback: vibration if available
            if (navigator.vibrate) {
                navigator.vibrate([200, 100, 200]);
            }
        });
    } catch (error) {
        // Final fallback: vibration if available
        if (navigator.vibrate) {
            navigator.vibrate([200, 100, 200]);
        }
    }
}

// Initialize audio when app starts
document.addEventListener('DOMContentLoaded', function() {
    initializeAudio();
});
