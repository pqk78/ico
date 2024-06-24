const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const { Liquid } = require('liquidjs');
const path = require('node:path');
const sharp = require('sharp');
const rimraf = require('rimraf');

const convert = async (event, image, options) => {
    let dir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
    }

    let outmeta = {};

    let imagePath = outmeta.path = path.parse(image);

    let ext = options.format == 'auto' ? imagePath.ext : `.${options.format}`;

    if (options.resize) {
        let suffix = options.resize.length == 1 ? `.${options.resize[0]}w` : `.${options.resize.join('x')}`;
        let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${suffix}${ext}`;
        let outFilePath = outmeta.filePath = path.join(dir, outFileName);
        outmeta.info = await sharp(image)
            .resize(...options.resize)
            .toFile(outFilePath);
    }
    else {
        let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${ext}`;
        let outFilePath = outmeta.filePath = path.join(dir, outFileName);
        outmeta.info = await sharp(image).toFile(outFilePath);
    }

    return outmeta;
}

const liquid = async (event, file, options = {}) => {
    const engine = new Liquid({
        root: ['./src/templates', './src/templates/layouts', './src/templates/partials'],
        extname: '.liquid'
    });

    console.log(file, options);

    return await engine.renderFile(file, { options });
}

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
    ipcMain.handle('liquid', liquid);
    createWindow();
});

app.on('window-all-closed', () => {
    rimraf.sync('tmp', { preserveRoot: true });
    if (process.platform !== 'darwin') {
        app.quit();
    };
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});