const { app, BrowserWindow, ipcMain, Menu, nativeTheme, net, protocol, shell } = require('electron');
const fs = require('node:fs');
const ico = require('./src/utils/ico');
const liquid = require('./src/utils/liquid');
const path = require('node:path');

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

const openLink = link => {
  shell.openExternal(link);
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
  let defaultBounds = storage.get('settings.window');
  const win = new BrowserWindow({
    width: defaultBounds.width,
    height: defaultBounds.height,
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

  ipcMain.on('ico:delete-file', (event, file) => { ico.deleteFile(file) });
  ipcMain.on('ico:open-link', (event, link) => { openLink(link) });
  ipcMain.on('storage:restore-defaults', event => { storage.restoreDefaults() });
  ipcMain.on('storage:unset', (event, key) => { storage.unset(key) });
  ipcMain.on('storage:update', (event, key, value) => { storage.set(key, value) });
  ipcMain.on('storage:update-color-mode', updateColorMode);

  win.on('resized', () => {
    let bounds = win.getBounds();
    storage.set('settings.window.width', bounds.width);
    storage.set('settings.window.height', bounds.height);
  })

  win.loadFile('./src/index.html');
}

app.setAboutPanelOptions({
  applicationName: 'Image Converter and Optimizer',
  applicationVersion: '0.1.0',
  copyright: `Copyright (c) 2024 Maz Planchak`,
  iconPath: './src/images/logo.svg',
});

app.whenReady().then(() => {
  ipcMain.handle('ico:convert', (event, image, options) => ico.convert(image, options));
  ipcMain.handle('ico:get-all', event => ico.getAll());
  ipcMain.handle('ico:zip', (event, paths) => ico.zip(paths));
  ipcMain.handle('liquid:render', (event, file, options) => liquid.render(file, options));
  ipcMain.handle('storage:get', (event, key) => storage.get(key));
  ipcMain.handle('storage:get-all', () => storage.getAll() );
  protocol.handle(systemfileProtocol, request => {
    const filePath = request.url.slice('systemfile://'.length)
    return net.fetch(`file://${filePath}`);
  });

  createWindow();
  createTempDir();
});

app.on('window-all-closed', () => {
  let age = storage.get('settings.temp_files.schedule.value');
  ico.cleanTmpFiles(age);
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