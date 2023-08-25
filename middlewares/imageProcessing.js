const jimp = require("jimp");
const { HttpError } = require("../helpers");

const imageProcessing = async (req, res, next) => {
  const { file } = req;
  if (!file) {
    next(HttpError(400, "No added image"));
  } else {
    const image = await jimp.read(file.path);
    image.quality(80);
    image.write(file.path);
    next();
  }
};

module.exports = imageProcessing;
