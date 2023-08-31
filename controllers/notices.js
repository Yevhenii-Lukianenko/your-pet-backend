const { Notice } = require("../models/notices");

const { HttpError, ctrlWrapper } = require("../helpers");

const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../utils");

const getAll = async (req, res) => {
  const { category } = req.params;
  const { search = null } = req.query;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let result;
  let totalCount;

  if (search) {
    result = await Notice.find(
      { category, title: { $regex: search, $options: "i" } },
      "-createdAt -updatedAt",
      { skip, limit }
    );
    
    totalCount = await Notice.countDocuments({
      category,
      title: { $regex: search, $options: "i" },
    });
  } else {
    result = await Notice.find({ category }, "-createdAt -updatedAt", {
      skip,
      limit,
    });
    
    totalCount = await Notice.countDocuments({ category });
  }

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }

  const totalPages = Math.ceil(totalCount / limit);

  res.json({ totalPages, notices: result });
};

const getById = async (req, res) => {
  const { noticeId } = req.params;
  const notice = await Notice.findOne(
    { _id: noticeId },
    "-createdAt -updatedAt"
  ).populate("owner", "email name phone");

  if (!notice) {
    throw HttpError(404, "Not found");
  }
  notice.views += 1;
  await notice.save();

  res.status(200).json(notice);
};

const updateFavoriteNotice = async (req, res) => {
  const { noticeId } = req.params;
  const { _id } = req.user;

  const notice = await Notice.findById(noticeId);

  if (!notice) {
    throw HttpError(400, `There are no notices with id ${noticeId}`);
  }

  const { usersAddToFavorite } = notice;
  const isUserInFavorite = usersAddToFavorite.some((userId) =>
    userId.equals(_id)
  );

  if (!isUserInFavorite) {
    await Notice.findByIdAndUpdate(
      noticeId,
      {
        $push: { usersAddToFavorite: _id },
      },
      { new: true }
    );
  } else {
    await Notice.findByIdAndUpdate(
      noticeId,
      {
        $pull: { usersAddToFavorite: _id },
      },
      { new: true }
    );
  }

  res.status(201).json({ userId: _id });
};

const getFavorite = async (req, res) => {
  const { _id } = req.user;
  const { search = null } = req.query;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let result;
  let totalCount;

  if (search) {
    result = await Notice.find(
      { usersAddToFavorite: _id, title: { $regex: search, $options: "i" } },
      "-createdAt -updatedAt",
      { skip, limit }
    ).populate("owner", "email name phone");
    
    totalCount = await Notice.countDocuments({
      usersAddToFavorite: _id,
      title: { $regex: search, $options: "i" },
    });
  } else {
    result = await Notice.find(
      { usersAddToFavorite: _id },
      "-createdAt -updatedAt",
      { skip, limit }
    ).populate("owner", "email name phone");
    
    totalCount = await Notice.countDocuments({
      usersAddToFavorite: _id,
    });
  }

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }

  const totalPages = Math.ceil(totalCount / limit);

  res.json({ totalPages, notices: result });
};

const addUserNotice = async (req, res) => {
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

const getUserNotices = async (req, res) => {
  const { _id } = req.user;
  const { search = null } = req.query;
  const { page = 1, limit = 12 } = req.query;
  const skip = (page - 1) * limit;
  let result;
  let totalCount;

  if (search) {
    result = await Notice.find(
      { owner: _id, title: { $regex: search, $options: "i" } },
      "-createdAt -updatedAt",
      { skip, limit }
    ).populate("usersAddToFavorite", "email name phone");
    
    totalCount = await Notice.countDocuments({
      owner: _id,
      title: { $regex: search, $options: "i" },
    });
  } else {
    result = await Notice.find({ owner: _id }, "-createdAt -updatedAt", {
      skip,
      limit,
    }).populate("usersAddToFavorite", "email name phone");
    
    totalCount = await Notice.countDocuments({ owner: _id });
  }

  if (result.length === 0) {
    throw HttpError(404, "Not found");
  }

  const totalPages = Math.ceil(totalCount / limit);

  res.json({ totalPages, notices: result });
};

const removeById = async (req, res) => {
  const { noticeId } = req.params;
  const { _id } = req.user;

  const notice = await Notice.find({ _id: noticeId, owner: _id });

  if (notice.length === 0) {
    throw HttpError(404, "Not found");
  }

  const result = await Notice.findByIdAndRemove(noticeId);
  await deleteImageFromCloudinary(result.avatarURL);

  res.status(200).json({ message: "Notice deleted successfully" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  updateFavoriteNotice: ctrlWrapper(updateFavoriteNotice),
  getFavorite: ctrlWrapper(getFavorite),
  addUserNotice: ctrlWrapper(addUserNotice),
  getUserNotices: ctrlWrapper(getUserNotices),
  removeById: ctrlWrapper(removeById),
};
