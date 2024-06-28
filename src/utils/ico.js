const path = require('node:path');
const sharp = require('sharp');

const convert = async (event, image, options) => {
  let outmeta = {};

  let imagePath = outmeta.path = path.parse(image);

  let ext = options.format == 'auto' ? imagePath.ext : `.${options.format}`;

  if (options.resize) {
    let suffix = options.resize.length == 1 ? `.${options.resize[0]}w` : `.${options.resize.join('x')}`;
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${suffix}${ext}`;
    let outFilePath = outmeta.filePath = path.join(global.TMP_DIR, outFileName);
    outmeta.info = await sharp(image)
      .resize(...options.resize)
      .toFile(outFilePath);
  }
  else {
    let outFileName = outmeta.fileName = `${imagePath.name}${imagePath.ext}${ext}`;
    let outFilePath = outmeta.filePath = path.join(global.TMP_DIR, outFileName);
    outmeta.info = await sharp(image).toFile(outFilePath);
  }

  return outmeta;
}

module.exports = { convert }