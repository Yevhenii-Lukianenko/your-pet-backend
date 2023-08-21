const cloudinary = require("cloudinary").v2;
const { HttpError } = require("../helpers");
const fs = require("fs/promises");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadImageToCloudinary = async (file) =>
  await cloudinary.uploader.upload(file, (error, result) => {
    if (error) {
      throw HttpError(400, error.message);
    }
    fs.unlink(file);
    return result;
  });

const deleteImageFromCloudinary = async (id) =>
  await cloudinary.uploader.destroy(id);

module.exports = { uploadImageToCloudinary, deleteImageFromCloudinary };
