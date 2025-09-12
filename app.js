// Dab Timer Application
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 450,
    height: 700,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, 'icon.png') // Optional: add an icon if you have one
  });

  mainWindow.loadFile('index.html');
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// Timer logic
let timerInterval = null;

ipcMain.on('start-timer', (event, timeInSeconds) => {
  // Clear any existing timer
  if (timerInterval) {
    clearInterval(timerInterval);
  }
  
  let timeRemaining = timeInSeconds;
  
  timerInterval = setInterval(() => {
    timeRemaining--;
    
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      event.reply('timer-end');
    } else {
      event.reply('timer-update', timeRemaining);
    }
  }, 1000);
});

ipcMain.on('stop-timer', () => {
  if (timerInterval) {
    clearInterval(timerInterval);
    timerInterval = null;
  }
});
