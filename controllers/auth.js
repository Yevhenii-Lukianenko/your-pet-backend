const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const path = require("path");
const fs = require("fs/promises");

const { User } = require("../models/user");
const { HttpError } = require("../helpers");
const { schema } = require("../models/user");

const { SECRET_KEY } = process.env;
const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const register = async (req, res, next) => {
  try {
    const validationRequest = schema.registerSchema.validate(req.body);
    if (validationRequest.error) {
      throw HttpError(400, validationRequest.error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      throw HttpError(409, "Email in use");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      ...req.body,
      password: hashPassword,
    });

    res.status(201).json({
      user: {
        email: newUser.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const validationRequest = schema.loginSchema.validate(req.body);
    if (validationRequest.error) {
      throw HttpError(400, validationRequest.error.message);
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

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
  } catch (error) {
    next(error);
  }
};

const getCurrent = async (req, res, next) => {
  try {
    const { email } = req.user;
    res.json({ email });
  } catch (error) {
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    const { _id } = req.user;
    await User.findByIdAndUpdate(_id, { token: "" });

    res.status(204).json();
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const validationRequest = schema.updateSchema.validate(req.body);
    if (validationRequest.error) {
      throw HttpError(400, validationRequest.error.message);
    }

    const { _id } = req.user;
    const { name, email, phone, birthday, city } = req.body;

    const updates = {};
    if (name !== undefined) updates.name = name;
    if (email !== undefined) updates.email = email;
    if (phone !== undefined) updates.phone = phone;
    if (birthday !== undefined) updates.birthday = birthday;
    if (city !== undefined) updates.city = city;

    await User.findByIdAndUpdate(_id, updates);

    res.json();
  } catch (error) {
    next(error);
  }
};

const updateAvatar = async (req, res, next) => {
  try {
    const { _id } = req.user;
    const { path: tempUpload, originalname } = req.file;
    const filename = `${_id}_${originalname}`;
    const resultUpload = path.join(avatarsDir, filename);
    await fs.rename(tempUpload, resultUpload);
    const avatarURL = path.join("avatars", filename);
    await User.findByIdAndUpdate(_id, { avatarURL });

    res.json({ avatarURL });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  getCurrent,
  logout,
  updateProfile,
  updateAvatar,
};
