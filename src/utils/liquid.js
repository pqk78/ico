const { Liquid } = require('liquidjs');
const path = require('node:path');
const Storage = require('./storage');

const defaultSettings = require('./settings.json');
const storage = new Storage('settings', defaultSettings);

const render = async (event, file, options = storage.getAll) => {
  const engine = new Liquid({
    root: [
      process.resourcesPath,
      path.join(process.cwd(), 'src/templates'),
    ],
    extname: '.liquid',
    jsTruthy: true,
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

module.exports = { render }