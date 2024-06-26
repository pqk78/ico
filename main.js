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

global.TMP_DIR = path.join((app || electron.remote.app).getPath('userData'), 'tmp');

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

  ipcMain.on('settings:restore-defaults', (event) => { storage.restoreDefaults() });
  ipcMain.on('settings:unset', (event, key) => { storage.unset(key) })
  ipcMain.on('settings:update', (event, key, value) => { storage.set(key, value) });
  ipcMain.on('settings:update-color-mode', updateColorMode);

  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('ico:convert', (event, image, options) => ico.convert(image, options));
  ipcMain.handle('liquid:render', (event, file, options) => liquid.render(file, options));
  ipcMain.handle('settings:get-all', () => storage.getAll() );
  protocol.handle(systemfileProtocol, request => {
    const filePath = request.url.slice('systemfile://'.length)
    return net.fetch(`file://${filePath}`);
  })

  createWindow();
  createTempDir();
});

app.on('window-all-closed', () => {
  rimraf.sync(global.TMP_DIR, { preserveRoot: true });
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