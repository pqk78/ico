const { app, BrowserWindow, ipcMain, nativeTheme } = require('electron');
const fs = require('node:fs');
const path = require('node:path');
const rimraf = require('rimraf');

const convert = require('./utils/convert');

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
    ipcMain.handle('convert', convert);
    createWindow();
});

app.on('window-all-closed', () => {
    rimraf.sync('tmp', {preserveRoot: true});
    if (process.platform !== 'darwin') { 
        app.quit();
    };
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow()
	}
});