const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const JsZip = require("jszip");

const cleanTmpFiles = async age => {
  age = parseInt(age)
  if (age < 0) {
    return;
  }
  if (age === 0) {
    fs.rmSync(global.TMP_DIR, {recursive: true});
    return;
  }
  let files = fs.readdirSync(global.TMP_DIR);
  let date = new Date();
  date.setDate(date.getDate() - parseInt(age));
  files.forEach(file => {
    let stat = fs.statSync(path.join(global.TMP_DIR, file));
    let mtime = new Date(stat.mtime);
    if (date > mtime) {
      fs.rmSync(path.join(global.TMP_DIR, file));
    }
  })
}

const convert = async (image, options) => {
  let outmeta = {};

  let imagePath = outmeta.path = path.parse(image);

  let ext = options.format == 'auto' ? imagePath.ext : `.${options.format}`;

  if (options.resize) {
    let suffix = options.resize.length == 1 ? `.${options.resize[0]}w` : `.${options.resize.join('x')}`;
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${suffix}${ext}`;
    let outFilePath = outmeta.filePath = path.join(global.TMP_DIR, outFileName);
    let data = {
      width: options.resize[0],
      fit: options.fit,
      position: options.position == 'entropy' ? sharp.strategy.entropy : options.position == 'attention' ? sharp.strategy.attention : options.position,
      background: options.background
    };
    if (options.resize.length > 1) {
      data.height = options.resize[1];
    }
    outmeta.info = await sharp(image)
      .resize(data)
      .toFile(outFilePath);
  }
  else {
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${ext}`;
    let outFilePath = outmeta.filePath = path.join(global.TMP_DIR, outFileName);
    outmeta.info = await sharp(image).toFile(outFilePath);
  }

  return outmeta;
}

const deleteFile = async file => {
  try {
    let filePath = path.join(global.TMP_DIR, file);
    fs.rmSync(filePath);
  } catch (err) {
    console.error(err);
  }
}

const getAll = () => {
  let files = fs.readdirSync(global.TMP_DIR).reduce((out, file) => {
    console.log(out)
    if (!file.includes('.zip')) {
      out.push(path.parse(file));
    }
    return out;
  }, []);
  return {
    path: global.TMP_DIR,
    files,
  };
}

const zip = async paths => {
  let zip = new JsZip();
  let folder = zip.folder('ICO Images');

  paths.forEach(path => {
    folder.file(path.fileName, fs.readFileSync(path.filePath), {
      base64: true,
    });
  })

  let zipFile = await zip.generateAsync({ type: 'nodebuffer'});

  fs.writeFileSync(path.join(global.TMP_DIR, 'ICO_images.zip'), zipFile);

  return path.join(global.TMP_DIR, 'ICO_images.zip');
}

module.exports = { cleanTmpFiles, convert, deleteFile, getAll, zip };