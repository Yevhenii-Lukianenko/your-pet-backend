const cloudinary = require("cloudinary").v2;
const { HttpError } = require("../helpers");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file) =>
  await cloudinary.uploader.upload(file, (error, result) => {
    if (error) {
      console.error(error);
      throw HttpError(400, error.message);
    }
    return result;
  });

module.exports = uploadImageToCloudinary;
