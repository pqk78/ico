const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

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

const deleteFile = async (file) => {
  try {
    let filePath = path.join(global.TMP_DIR, file);
    fs.rmSync(filePath);
  } catch (err) {
    console.error(err);
  }
}

const getAll = () => {
  let files = fs.readdirSync(global.TMP_DIR);
  return {
    path: global.TMP_DIR,
    files: files.map(file => path.parse(file)),
  };
}

module.exports = { convert, deleteFile, getAll };