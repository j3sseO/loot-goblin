// main.js
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 900,
        // Make window transparent
        // frame: false,      // No frame to give overlay feel
        // alwaysOnTop: true, // Always on top of game window
    });

    win.loadURL(`file://${path.join(__dirname, 'public/index.html')}`); // Load React App
    win.webContents.openDevTools(); // Open developer tools automatically
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
