// const jimp = require("jimp");

const imageProcessing = async (req, res, next) => {
  const { file } = req;
  // const image = await jimp.read(file.path);
  // image.quality(80);
  // image.write(file.path);

  if (!file) {
    return res.status(400).send('The file was not uploaded');
  }

  if (file.size > 1 * 1024 * 1024) {
    return res.status(400).send('The file exceeds the maximum size of 3 MB');
  }
  next();
};

module.exports = imageProcessing;
