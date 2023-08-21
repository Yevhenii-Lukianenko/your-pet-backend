const { Schema, model } = require("mongoose");
const joi = require("joi");

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for user"],
    },
    password: {
      type: String,
      required: [true, "Set password for user"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
    },
    token: String,
    avatarURL: String,
    birthday: String,
    phone: String,
    city: String,
  },
  { versionKey: false, timestamps: true }
);

const registerSchema = joi.object({
  name: joi
    .string()
    .min(2)
    .max(30)
    .pattern(/^[\p{L}'-]+$/u)
    .required(),
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
});

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi.string().min(8).max(30).required(),
});

const updateSchema = joi
  .object({
    name: joi
      .string()
      .min(2)
      .max(30)
      .pattern(/^[\p{L}'-]+$/u),
    email: joi.string().email(),
    birthday: joi.string().pattern(/^\d{2}-\d{2}-\d{4}$/),
    phone: joi.string().pattern(/^(\+38)?0\d{9}$/),
    city: joi.string().pattern(/^[\p{L} ,.'-]+$/u),
  })
  .or("name", "email", "birthday", "phone", "city");

const User = model("user", userSchema);

const schemas = { registerSchema, loginSchema, updateSchema };

module.exports = { User, schemas };
