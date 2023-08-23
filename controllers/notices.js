const { Notice } = require("../models/notices");

const { HttpError, ctrlWrapper } = require("../helpers");

const { uploadImageToCloudinary } = require("../utils");
const { User } = require('../models/user');

const getAll = async (req, res) => {
  const { category } = req.params;
  const { search = null } = req.query;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let result;

  if (search) {
    result = await Notice.find({ category, title: { $regex: search, $options: "i" } },
      "-createdAt -updatedAt",
      { skip, limit }
    );
  } else {
    result = await Notice.find({ category }, 
      "-createdAt -updatedAt", 
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
    "-createdAt -updatedAt")
      .populate('owner', 'email name phone');

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const addToFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const { usersAddToFavorite } = await Notice.findById(noticeId);
    const isUserInFavorite = usersAddToFavorite.some((userId) => userId.equals(_id));

    if (isUserInFavorite) {
      throw HttpError(409, "The notice is already in the list of favorites");
    }
    await Notice.findByIdAndUpdate(
      noticeId,
      {
        $push: { usersAddToFavorite: _id }, 
      },
      { new: true },
    );

    res.status(201).json({userId: _id});
};

const getFavorite = async (req, res) => {
  const {_id} = req.user;
  
  const result = await Notice.find({ usersAddToFavorite: _id },
    "-createdAt -updatedAt")
    .populate('owner', 'email name phone');

  if (!result) {
    throw HttpError(404, "Not found");
  }
  res.status(200).json(result);
};

const removeFromFavorite = async (req, res) => {
    const {noticeId} = req.params;
    const {_id} = req.user;

    const { usersAddToFavorite } = await Notice.findById(noticeId);
    const isUserInFavorite = usersAddToFavorite.some((userId) => userId.equals(_id));

    if (!isUserInFavorite) {
      throw HttpError(409, "The notice is not in the list of favorites");
    }
    await Notice.findByIdAndUpdate(
        noticeId,
        {
          $pull: { usersAddToFavorite: _id }, 
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

const get = async(req, res) => {
    const {_id} = req.user;

    const result = await Notice.find({owner: _id},
      "-createdAt -updatedAt")
      .populate('usersAddToFavorite', 'email name phone');

    if (result.length === 0) {
      throw HttpError(404, "Not found");
    }

    res.status(200).json(result);
};

const removeById = async (req, res) => {
  const {noticeId} = req.params;
  const {_id} = req.user;

  const notice = await Notice.findById(noticeId);

  if(!notice) {
    throw HttpError (404, 'Not found')
  } 
  else {
    if (!notice.owner.equals(_id)) {
      throw HttpError (404, 'Not found')
    }
    else {
      const result = await Notice.findByIdAndRemove(noticeId);
      
      if(!result) {
      throw HttpError (404, 'Not found')
      }

      res.status(200).json({ message: 'Notice deleted successfully' })
    }
  }
};

module.exports = {
    getAll: ctrlWrapper(getAll),
    getById: ctrlWrapper(getById),
    addToFavorite: ctrlWrapper(addToFavorite),
    getFavorite: ctrlWrapper(getFavorite),
    removeFromFavorite: ctrlWrapper(removeFromFavorite),
    add: ctrlWrapper(add),
    get:ctrlWrapper(get),
    removeById: ctrlWrapper(removeById),
};
