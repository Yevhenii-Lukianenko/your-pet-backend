const jimp = require("jimp");

const imageProcessing = async (req, res, next) => {
  const { file } = req;
  const image = await jimp.read(file.path);
  image.quality(80);
  image.write(file.path);
  next();
};

module.exports = imageProcessing;
