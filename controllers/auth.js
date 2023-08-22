const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} = require("../utils");

const { User } = require("../models/user");
const { HttpError, ctrlWrapper } = require("../helpers");

const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = process.env;

const register = async (req, res) => {
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

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email: email.toLowerCase() });

  if (!user) {
    throw HttpError(401, "Email or password is wrong");
  }

  const passwordCompare = await bcrypt.compare(password, user.password);

  if (!passwordCompare) {
    throw HttpError(401, "Email or password is wrong");
  }

  const payload = { id: user._id };
  const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
    expiresIn: "5m",
  });
  const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
    expiresIn: "7D",
  });

  await User.findByIdAndUpdate(user._id, { accessToken, refreshToken });

  res.json({
    accessToken,
    refreshToken,
    user: { email: user.email },
  });
};

const refresh = async (req, res) => {
  const { refreshToken: token } = req.body;
  try {
    const { id } = jwt.verify(token, REFRESH_SECRET_KEY);
    const isExist = await User.findOne({ refreshToken: token });
    if (!isExist) {
      throw HttpError(403, "Token invalid");
    }

    const payload = { id };
    const accessToken = jwt.sign(payload, ACCESS_SECRET_KEY, {
      expiresIn: "5m",
    });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET_KEY, {
      expiresIn: "7D",
    });

    await User.findByIdAndUpdate(isExist._id, { accessToken, refreshToken });

    res.json({ accessToken, refreshToken });
  } catch (error) {
    throw HttpError(403, error.message);
  }
};

const getCurrent = async (req, res) => {
  const { name, email, phone, birthday, city } = req.user;
  res.json({ name, email, phone, birthday, city });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { accessToken: "", refreshToken: "" });

  res.status(204).json();
};

const updateProfile = async (req, res) => {
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

const updateAvatar = async (req, res) => {
  const { _id, avatarURL } = req.user;

  const { path } = req.file;

  const image = await uploadImageToCloudinary(path);
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
  refresh: ctrlWrapper(refresh),
};
