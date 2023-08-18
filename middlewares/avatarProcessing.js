const jimp = require("jimp");

const avatarProcessing = async (req, res, next) => {
  const { file } = req;
  const image = await jimp.read(file.path);

  await image.resize(182, 182).quality(75);

  await image.write(file.path);

  next();
};

module.exports = avatarProcessing;
