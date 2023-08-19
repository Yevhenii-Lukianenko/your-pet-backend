const jimp = require("jimp");

const imageProcessing = async (req, res, next) => {
  const { file } = req;
  const image = await jimp.read(file.path);

  await image.quality(80);

  await image.write(file.path);

  next();
};

module.exports = imageProcessing;
