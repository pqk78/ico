const { Liquid, tagToken, remainTokens } = require('liquidjs');
const md = require('markdown-it');
const path = require('node:path');
const Storage = require('./storage');

const defaultSettings = require('./settings.json');
const storage = new Storage('settings', defaultSettings);

const render = async (file, options = storage.getAll()) => {
  const engine = new Liquid({
    root: [
      process.resourcesPath,
      path.join(process.cwd(), 'src/templates'),
    ],
    cache: false,
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

  engine.registerTag('markdown', {
    parse(tagToken, remainTokens) {
      this.tpls = [];
      let closed = false;
      while(remainTokens.length) {
        let token = remainTokens.shift();
        if (token.name === 'endmarkdown') {
          closed = true;
          break;
        }
        let tpl = this.liquid.parser.parseToken(token, remainTokens);
        this.tpls.push(tpl);
      }
      if (!closed) throw new Error(`tag ${tagToken.getText()} not closed`);
    },
    * render(context, emitter) {
      let out = [];
      this.tpls.forEach(tpl => {
        emitter.write(md().render(tpl.str));
      })
    }
  })
  

  return await engine.renderFile(file, { options, base_path: process.cwd() });
}

module.exports = { render }