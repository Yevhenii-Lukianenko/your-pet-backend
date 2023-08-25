const { Pets } = require("../models/pets");
const { uploadImageToCloudinary } = require("../utils");

const { ctrlWrapper, HttpError } = require("../helpers");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;
  console.log(req.params);
  const { page = 1, limit = 5 } = req.query;
  const skip = (page - 1) * limit;
  const result = await Pets.find({ owner }, "-createAt -updateAt", {
    skip,
    limit,
  });
  res.json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;

  const { path: tempUpload } = req.file;
  const image = await uploadImageToCloudinary(tempUpload);

  const result = await Pets.create({
    ...req.body,
    avatarPet: image.url,
    owner,
  });

  res.status(201).json(result);
};

const remove = async (req, res) => {
  const { id } = req.params;
  const result = await Pets.findByIdAndDelete({ _id: id });
  if (!result) {
    throw HttpError(404, "Not Found");
  }
  res.json({
    message: "Delete success",
  });
};

module.exports = {
  add: ctrlWrapper(add),
  getAll: ctrlWrapper(getAll),
  remove: ctrlWrapper(remove),
};
