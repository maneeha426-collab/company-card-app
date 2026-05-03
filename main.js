// main.js (Electron main process)
const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const { SerialPort } = require('serialport');
const Avrgirl = require('avrgirl-arduino');

let mainWindow;
let port;

// 👨‍💻 Create the main window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // if using
      nodeIntegration: true, // or contextIsolation: false
    },
  });

  mainWindow.loadURL('http://localhost:5173'); // Vite dev server
}

// 🔌 Setup serial communication
ipcMain.handle('connect-serial', async (event, portName) => {
  port = new SerialPort({
    path: portName,
    baudRate: 9600,
  });

  port.on('data', (data) => {
    mainWindow.webContents.send('serial-data', data.toString());
  });

  return 'Serial connected';
});

// ✍️ Send message to Arduino
ipcMain.handle('send-serial', (event, message) => {
  if (port && port.isOpen) {
    port.write(message + '\n');
    return 'Message sent';
  }
  return 'Port not open';
});

// ⚡ Flash code to Arduino
ipcMain.handle('flash-arduino', async (event, hexFilePath) => {
  const avrgirl = new Avrgirl({
    board: 'uno',
    port: port?.path || '/dev/ttyUSB0',
  });

  return new Promise((resolve, reject) => {
    avrgirl.flash(hexFilePath, (err) => {
      if (err) reject('Flashing failed: ' + err);
      else resolve('Flashing successful!');
    });
  });
});

mainWindow = new BrowserWindow({
  width: 800,
  height: 600,
  webPreferences: {
    contextIsolation: true, // Enable context isolation
    preload: path.join(__dirname, 'preload.js'),
    nodeIntegration: false  // Prevent unsafe Node access
  }
});

// 🧠 Start app
app.whenReady().then(createWindow);
