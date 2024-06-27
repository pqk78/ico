const { app, BrowserWindow, ipcMain, Menu, nativeTheme, net, protocol, remote } = require('electron');
const fs = require('node:fs');
const { Liquid } = require('liquidjs');
const path = require('node:path');
const rimraf = require('rimraf');
const sharp = require('sharp');
const url = require('node:url');

const Storage = require('./src/utils/storage');

const tmpDir = path.join((app || electron.remote.app).getPath('userData'), 'tmp');

const storage = new Storage();

const convert = async (event, image, options) => {
  let outmeta = {};

  let imagePath = outmeta.path = path.parse(image);

  let ext = options.format == 'auto' ? imagePath.ext : `.${options.format}`;

  if (options.resize) {
    let suffix = options.resize.length == 1 ? `.${options.resize[0]}w` : `.${options.resize.join('x')}`;
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${suffix}${ext}`;
    let outFilePath = outmeta.filePath = path.join(tmpDir, outFileName);
    outmeta.info = await sharp(image)
      .resize(...options.resize)
      .toFile(outFilePath);
  }
  else {
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${ext}`;
    let outFilePath = outmeta.filePath = path.join(tmpDir, outFileName);
    outmeta.info = await sharp(image).toFile(outFilePath);
  }

  return outmeta;
}

const liquid = async (event, file, options = storage.getAll()) => {
  const engine = new Liquid({
    root: [
      process.resourcesPath,
      path.join(process.cwd(), 'src/templates'),
    ],
    extname: '.liquid'
  });

  engine.registerFilter('formatsize', (bytes) => {
    if (!+bytes) return '0 Bytes'

    const k = 1024;
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    const dm = i < 2 ? 0 : 1;
    const sizes = ['Bytes', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`
  });

  return await engine.renderFile(file, { options, base_path: process.cwd() });
}

const updateSettings = (event, key, value) => {
  storage.set(key, value);
}

const createTempDir = () => {
  fs.mkdir(tmpDir, { recursive: true }, err => {
    console.error('e 51:', err);
  })
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

  const isMac = process.platform === 'darwin'

  const template = [
    ...(isMac
      ? [{
        label: app.name,
        submenu: [
          { role: 'about' },
          { type: 'separator' },
          {
            label: 'Settings',
            click: () => {
              win.loadFile('./src/settings.html')
            },
          },
          { type: 'separator' },
          { role: 'hide' },
          { role: 'hideOthers' },
          { role: 'unhide' },
          { type: 'separator' },
          { role: 'quit' }
        ]
      }]
      : []),
    ...(isMac
      ? [{
        label: 'Edit',
        submenu: [
          ...(isMac
            ? [
              {
                label: 'Speech',
                submenu: [
                  { role: 'startSpeaking' },
                  { role: 'stopSpeaking' }
                ]
              }
            ]
            : [])
        ]
      }] : []
    ),
    { role: 'viewMenu' },
    { role: 'windowMenu' },
    {
      role: 'help',
      submenu: [
        {
          label: 'ICO Help',
          click: () => {
            win.loadFile('./src/help.html')
          },
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu);

  nativeTheme.themeSource = storage.get('settings.theme.mode.value');

  ipcMain.on('update-settings', updateSettings);

  ipcMain.on('update-color-mode', (event, mode) => {
    nativeTheme.themeSource = mode;
  })

  win.loadFile('./src/index.html');
}

app.whenReady().then(() => {
  ipcMain.handle('convert', convert);
  ipcMain.handle('liquid', liquid);
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