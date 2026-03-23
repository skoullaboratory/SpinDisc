const { app, BrowserWindow, screen, ipcMain } = require('electron');
const path = require('path');
const { fork } = require('child_process');

app.disableHardwareAcceleration();
// Set a unique user data path for this app to avoid "Access denied" cache errors
app.setPath('userData', path.join(app.getPath('userData'), 'SpinDisc-PiP'));

let win;
let lastMoveTime = 0;

function createWindow() {
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width: screenWidth, height: screenHeight } = primaryDisplay.workAreaSize;
  const winWidth = 160;
  const winHeight = 160;

  win = new BrowserWindow({
    icon: path.join(__dirname, 'img', 'SpinDiscLogo.png'),
    width: winWidth,
    height: winHeight,
    x: screenWidth - winWidth - 30,
    y: screenHeight - winHeight - 30,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    resizable: true,
    minWidth: 60,
    minHeight: 60,
    movable: true,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    hasShadow: false,
    skipTaskbar: true, // PiP style, no need for taskbar icon
  });

  win.setAspectRatio(1.0);
  win.loadFile('index.html');

  // High-priority always-on-top
  win.setAlwaysOnTop(true, 'screen-saver', 1);
  win.setVisibleOnAllWorkspaces(true, { visibleOnFullScreen: true });

  win.on('move', () => {
    lastMoveTime = Date.now();
  });

  // Reinforce top and visibility on focus/blur
  win.on('blur', () => {
    if (win && !win.isDestroyed()) {
      win.setAlwaysOnTop(true, 'screen-saver', 1);
    }
  });
}

let isMonitoringStarted = false;

function startMediaMonitoring() {
  if (isMonitoringStarted) return;
  isMonitoringStarted = true;

  const workerPath = path.join(__dirname, 'smtc-worker.js');
  let worker = null;

  function spawnWorker() {
    worker = fork(workerPath, [], { stdio: ['pipe', 'pipe', 'pipe', 'ipc'] });

    worker.on('message', (msg) => {
      if (!win || win.isDestroyed()) return;

      if (msg.type === 'thumbnail') {
        win.webContents.send('media-thumbnail', msg.base64);
      } else if (msg.type === 'status') {
        win.webContents.send('media-status', msg.playing);
      }
    });

    worker.on('exit', () => {
      // The worker crashed natively! Restart it stealthily in 5 seconds without crashing the main app!
      setTimeout(spawnWorker, 5000);
    });

    worker.on('error', () => { }); // Ignore spawn errors
  }

  spawnWorker();
}

ipcMain.on('zoom-window', (event, delta) => {
  const window = BrowserWindow.fromWebContents(event.sender);
  if (window && !window.isDestroyed()) {
    const [width, height] = window.getSize();
    const step = 40;
    const newSize = Math.max(60, Math.min(600, width + (delta * step)));
    window.setSize(newSize, newSize);
  }
});

ipcMain.on('toggle-playback', () => {
  const { exec } = require('child_process');
  // Robust PowerShell command using User32 keybd_event to toggle play/pause correctly
  const psCommand = `powershell -Command "Add-Type -TypeDefinition 'using System.Runtime.InteropServices; public class Media { [DllImport(\\\"user32.dll\\\")] public static extern void keybd_event(byte v, byte s, uint f, int e); }'; [Media]::keybd_event(0xB3, 0, 0, 0); [Media]::keybd_event(0xB3, 0, 2, 0);"`;
  exec(psCommand);
});

app.whenReady().then(() => {
  createWindow();
  startMediaMonitoring();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});