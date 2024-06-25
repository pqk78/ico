const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('node:fs');
const { Liquid } = require('liquidjs');
const path = require('node:path');
const rimraf = require('rimraf');
const sharp = require('sharp');
const { tmpdir } = require('node:os');

const tmpDir = path.join(tmpdir(), 'com.panqike/ico');

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

const liquid = async (event, file, options = {}) => {
    const engine = new Liquid({
        root: [
            process.resourcesPath,
            path.join(process.cwd(), 'src/templates'),
            path.join(process.cwd(), 'src/templates/layouts'),
            path.join(process.cwd(), 'src/templates/partials'),
        ],
        extname: '.liquid'
    });

    return await engine.renderFile(file, { options, base_path: process.cwd() });
}

const createTempDir = () => {
    console.log(tmpDir);
    fs.mkdir(tmpDir, {recursive: true}, err => {
        console.error('e 51:', err);
    })
}

const createWindow = () => {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        protocol: 'file',
        icon: './src/images/ico-logo.png'
    });

    win.loadFile('./src/index.html');

}

app.whenReady().then(() => {
    ipcMain.handle('convert', convert);
    ipcMain.handle('liquid', liquid);
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