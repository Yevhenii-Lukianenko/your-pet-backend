const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { dateRegexp, locationRegexp } = require("../utils");

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
      match: dateRegexp,
    },
    type: {
      type: String,
      required: [true, "Set type of pet"],
    },
    comment: {
      type: String,
    },
    avatarURL: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: [true, "Set location for pet"],
      match: locationRegexp,
    },
    sex: {
      type: String,
      enum: ["female", "male"],
      required: true,
    },
    price: {
      type: Number,
      required: function () {
        return this.category === "sell";
      },
      validate: {
        validator: function (value) {
          return value > 0;
        },
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
    usersAddToFavorite: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  category: Joi.string()
    .valid("sell", "lost-found", "in-good-hands")
    .required()
    .messages({
      "string.base": "The category field must be a string.",
      "any.required": "The category field is required.",
      "string.valid":
        "The category field must have a value of 'sell', 'lost-found', or 'in-good-hands'.",
    }),
  title: Joi.string().required().messages({
    "string.base": "The title field must be a string.",
    "any.required": "The title field is required.",
  }),
  name: Joi.string().min(2).max(16).required().messages({
    "string.base": "The name field must be a string.",
    "string.min": "The name must have at least 2 characters.",
    "string.max": "The name must have at most 16 characters.",
    "any.required": "The name field is required.",
  }),
  birthday: Joi.string().pattern(dateRegexp).required().messages({
    "string.base": "The birthday field must be a string.",
    "any.required": "The birthday field is required.",
    "string.pattern.base": "Date of birth must be in the format DD-MM-YYYY",
  }),
  type: Joi.string().required().messages({
    "string.base": "The type field must be a string.",
    "any.required": "The type field is required.",
  }),
  location: Joi.string().pattern(locationRegexp).required().messages({
    "string.base": "The location field must be a string.",
    "any.required": "The location field is required.",
    "string.pattern.base": 'The city must be in the format "City"',
  }),
  sex: Joi.string().valid("female", "male").required().messages({
    "string.base": "The sex field must be a string.",
    "string.valid": "The sex field must have a value of 'female', 'male'.",
    "any.required": "The sex field is required.",
  }),
  comment: Joi.string().max(120).messages({
    "string.base": "The comment field must be a string.",
    "string.max": "The comment field must not exceed 120 characters.",
  }),
  price: Joi.number()
    .integer()
    .min(1)
    .when("category", {
      is: "sell",
      then: Joi.number().integer().min(1).required().messages({
        "number.base": "The price field must be a number.",
        "number.integer": "The price field must be an integer.",
        "number.min": "The number must be greater than 0",
        "any.required": "The price field is required for 'sell' category.",
      }),
      otherwise: Joi.number().integer().min(1).messages({
        "number.base": "The price field must be a number.",
        "number.integer": "The price field must be an integer.",
        "number.min": "The number must be greater than 0",
      }),
    }),
});

const schemas = {
  addSchema,
};

const Notice = model("notice", noticeSchema);

module.exports = { Notice, schemas };
