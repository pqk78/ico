const { app, BrowserWindow, ipcMain, Menu, nativeTheme, net, protocol, remote } = require('electron');
const fs = require('node:fs');
const ico = require('./src/utils/ico');
const liquid = require('./src/utils/liquid');
const path = require('node:path');
const rimraf = require('rimraf');
const url = require('node:url');

const { buildTemplate } = require('./src/utils/menu');
const defaultSettings = require('./src/utils/settings.json');

const Storage = require('./src/utils/storage');
const storage = new Storage('settings', defaultSettings);

console.log(global)

global.TMP_DIR = path.join((app || electron.remote.app).getPath('userData'), 'tmp');

console.log(global)

const createTempDir = () => {
  fs.mkdir(global.TMP_DIR, { recursive: true }, err => {
    err && console.error('Problem creating temp dir', err);
  });
}

const updateColorMode = (event, mode) => {
  nativeTheme.themeSource = mode;
}

const systemfileProtocol = "systemfile";
protocol.registerSchemesAsPrivileged([
  {
    scheme: systemfileProtocol,
    privileges: {
      bypassCSP: true
    }
  },
]);

const createWindow = () => {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    },
    protocol: 'file',
    icon: './src/images/logo-dark.svg.1024x1024.png'
  });

  const template = buildTemplate(app, win);
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  nativeTheme.themeSource = storage.get('settings.theme.mode.value');

  ipcMain.on('settings:restore-defaults', storage.restoreDefaults);
  ipcMain.on('settings:update', storage.set);
  ipcMain.on('settings:update-color-mode', updateColorMode);

  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('convert', ico.convert);
  ipcMain.handle('liquid:render', liquid.render);
  protocol.handle(systemfileProtocol, request => {
    const filePath = request.url.slice('systemfile://'.length)
    return net.fetch(`file://${filePath}`);
  })

  createWindow();
  createTempDir();
});

app.on('window-all-closed', () => {
  rimraf.sync(tmpDir, { preserveRoot: true });
  if (process.platform !== 'darwin') {
    app.quit();
  };
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createTempDir();
    createWindow();
  }
});