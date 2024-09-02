// main.js
const { app, BrowserWindow , ipcMain, desktopCapturer} = require('electron');
const path = require('path');
const sharp = require('sharp');
const Tesseract = require('tesseract.js');

function createWindow() {
    const win = new BrowserWindow({
        width: 900,
        height: 1000,
        // transparent: true, // Make window transparent
        // frame: false,      // No frame to give overlay feel
        // alwaysOnTop: true, // Always on top of game window
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // Correct path to preload script
            contextIsolation: true, // Use contextIsolation for security
            enableRemoteModule: false, // Disable remote module for security
          },
    });

    win.loadURL(`file://${path.join(__dirname, 'public/index.html')}`); // Load React App
    win.webContents.openDevTools(); // Open developer tools automatically
}

// IPC listener for image processing
ipcMain.handle('process-image', async (event, base64Image) => {
    try {
        const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, '');

        const imageBuffer = Buffer.from(base64Data, 'base64');
        
        const processedImageBuffer = await sharp(imageBuffer)
        .greyscale()
        .threshold(128)
        .median(3)
        .toBuffer();

        // Perform OCR using Tesseract.js on the processed image buffer
        const result = await Tesseract.recognize(
            processedImageBuffer,
            'eng', // Language for OCR (English)
            {
                logger: (m) => console.log(m), // Optional: log OCR progress
            }
        );

        // Extract and clean up recognized text
        const detectedText = result.data.text.trim();
        const lines = detectedText.split('\n').map(line => line.trim()).filter(line => line);

        // Assuming the item name is in the first line of the recognized text
        const itemName = lines.length > 0 ? lines[0] : null;

        console.log('Detected Item Name:', itemName);
        return itemName;

    } catch (err) {
        console.error('Image processing error:', err);
        return null;
    }
});

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
