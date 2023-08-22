const { Notice } = require("../models/notices");

const { HttpError, ctrlWrapper } = require("../helpers");

const { uploadImageToCloudinary } = require("../utils");

const getAll = async (req, res) => {
  const { category } = req.params;
  const { search = null } = req.query;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let result;

  if (search) {
    result = await Notice.find({ category, title: { $regex: search, $options: "i" } },
      "-createdAt -updatedAt -usersAddToFavorite",
      { skip, limit }
    );
  } else {
    result = await Notice.find({ category }, 
      "-createdAt -updatedAt -usersAddToFavorite", 
      { skip, limit }
    );
  }

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { noticeId } = req.params;
  const result = await Notice.findOne({ _id: noticeId }, 
    "-createdAt -updatedAt -usersAddToFavorite");

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const addToFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const result = await Notice.findByIdAndUpdate(
        noticeId,
        {
          $push: { usersAddToFavorite: {_id} }, 
        },
        { new: true },
      );

    res.status(201).json({userId: _id});
};

const getFavorite = async (req, res) => {
  const {_id} = req.user;
  
  const result = await Notice.find({ usersAddToFavorite: _id },
    "-createdAt -updatedAt")
  .populate('usersAddToFavorite', 'email name phone');

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const removeFromFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const result = await Notice.findByIdAndUpdate(
        noticeId,
        {
          $pull: { usersAddToFavorite: {_id} }, 
        },
        { new: true },
      );

    res.status(201).json({userId: _id});
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const { path } = req.file;

  const image = await uploadImageToCloudinary(path);

  const result = await Notice.create({
    ...req.body,
    owner,
    avatarURL: image.url,
  });
  res.status(201).json(result);
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addToFavorite: ctrlWrapper(addToFavorite),
    getFavorite: ctrlWrapper(getFavorite),
    removeFromFavorite: ctrlWrapper(removeFromFavorite),
    add: ctrlWrapper(add),
};
