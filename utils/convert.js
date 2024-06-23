const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

convert = async (event, image, options) => {

    let dir = path.join(process.cwd(), 'tmp');
    if (!fs.existsSync(dir)){
        fs.mkdirSync(dir);
    }

    let imagePath = path.parse(image);
    let imageName = `${imagePath.name}-300w.${imagePath.ext}`

    sharp(image)
  .resize(300, 200)
  .toFile(path.join(dir, imageName), function(err) {
    // output.jpg is a 300 pixels wide and 200 pixels high image
    // containing a scaled and cropped version of input.jpg
  });
}

module.exports = convert;