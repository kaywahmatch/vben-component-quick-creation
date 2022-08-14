// const { app, BrowserWindow } = require("electron");
import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
// const path = require("path");
console.log(process.env.MODE);
// const loadUrl = process.env.MODE === "devlopment" ? "http://localhost:3000/" : path.join(__dirname, "../src/index.html");
const loadUrl =
  process.env.MODE === 'development'
    ? 'http://localhost:3157/'
    : `file://${path.join(__dirname, '../dist/index.html')}`;

function createWindow() {
  const win = new BrowserWindow({
    width: 1366,
    height: 768,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  win.loadURL(loadUrl);

  // 打开开发工具
  if (process.env.MODE === 'development') {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  ipcMain.on('update-counter', (_event, value) => {
    console.log(value); // will print value to Node console
  });

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
