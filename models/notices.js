const { Schema, model } = require("mongoose");
const Joi = require("joi");

const noticeSchema = new Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["sell", "lost-found", "in-good-hands"],
    },
    title: {
      type: String,
      required: [true, "Set title for notice"],
    },
    name: {
      type: String,
      required: [true, "Set name for pet"],
    },
    birthday: {
      type: String,
      required: [true, "Set birthday for pet"],
      match: /^\d{2}-\d{2}-\d{4}$/,
      message: "Date of birth must be in the format DD-MM-YYYY",
    },
    type: {
      type: String,
      required: [true, "Set type for pet"],
    },
    comment: {
      type: String,
    },
    avatarURL: {
      type: String,
    },
    location: {
      type: String,
      required: [true, "Set location for pet"],
      match: /^[A-Z][a-z]+$/,
      message: 'The city must be in the format "City"',
    },
    sex: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "The number must be greater than 0",
      },
    },
    views: {
      type: Number,
      default: 0,
      required: true,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
    usersAddToFavorite: [{
      type: Schema.Types.ObjectId,
      ref: "user"
    }],
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  category: Joi.string().required(),
  title: Joi.string().required(),
  name: Joi.string()
    .min(2)
    .max(16)
    .required()
    .messages({ "any.required": "missing required fields" }),
  birthday: Joi.string()
    .pattern(/^\d{2}-\d{2}-\d{4}$/)
    .required(),
  type: Joi.string().required(),
  location: Joi.string()
    .pattern(/^[A-Z][a-z]+$/)
    .required(),
  sex: Joi.string().required(),
  comment: Joi.string().max(120),
  price: Joi.number().integer().min(1),
});

const schemas = {
    addSchema,
};

const Notice = model("notice", noticeSchema);

module.exports = { Notice, schemas };
