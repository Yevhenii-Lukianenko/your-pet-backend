const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../utils");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { SECRET_KEY } = process.env;

const register = async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = await User.findOne({ email });

  if (user) {
    throw HttpError(409, "Email in use");
  }

  const hashPassword = await bcrypt.hash(password, 10);

  const newUser = await User.create({
    name,
    email: email.toLowerCase(),
    password: hashPassword,
  });

  res.status(201).json({
    user: {
      email: newUser.email,
    },
  });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY, { expiresIn: "24h" });
  await User.findByIdAndUpdate(user._id, { token });

  res.json({
    token,
    user: { email: user.email },
  });
};

const getCurrent = async (req, res, next) => {
  const { name, email, phone, birthday, city } = req.user;
  res.json({ name, email, phone, birthday, city });
};

const logout = async (req, res, next) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });

  res.status(204).json();
};

const updateProfile = async (req, res, next) => {
  const { _id } = req.user;
  const { name, email, phone, birthday, city } = req.body;

  if (email) {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (user) {
      throw HttpError(409, "Email in use");
    }
  }

  const updates = {};
  if (name !== undefined) updates.name = name;
  if (email !== undefined) updates.email = email.toLowerCase();
  if (phone !== undefined) updates.phone = phone;
  if (birthday !== undefined) updates.birthday = birthday;
  if (city !== undefined) updates.city = city;

  await User.findByIdAndUpdate(_id, updates);

  res.json(updates);
};

const updateAvatar = async (req, res, next) => {
  const { _id, avatarURL } = req.user;
  const { path: tempUpload } = req.file;

  const image = await uploadImageToCloudinary(tempUpload);
  await User.findByIdAndUpdate(_id, { avatarURL: image.url });

  if (avatarURL) {
    const prevAvatarId = avatarURL.split("/").pop().slice(0, -4);
    await deleteImageFromCloudinary(prevAvatarId);
  }

  res.json({ avatarURL: image.url });
};

module.exports = {
  register: ctrlWrapper(register),
  login: ctrlWrapper(login),
  getCurrent: ctrlWrapper(getCurrent),
  logout: ctrlWrapper(logout),
  updateProfile: ctrlWrapper(updateProfile),
  updateAvatar: ctrlWrapper(updateAvatar),
};
