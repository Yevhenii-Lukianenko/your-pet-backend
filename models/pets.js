const { Schema, model } = require("mongoose");
const Joi = require("joi");

const { dateRegexp } = require("../utils");

const petsSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Set name for pet"],
    },
    dateOfBirth: {
      type: String,
      match: dateRegexp,
      required: [true, "Set birthday for pet"],
    },
    type: {
      type: String,
      required: [true, "Set type for pet"],
    },
    comments: {
      type: String,
      required: true,
    },
    avatarPet: {
      type: String,
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: "user",
    },
  },
  { versionKey: false, timestamps: true }
);

const addSchema = Joi.object({
  name: Joi.string().min(2).max(20).required().messages({
    "string.base": "The name field must be a string.",
    "string.min": "The name must have at least 2 characters.",
    "string.max": "The name must have at most 20 characters.",
    "any.required": "The name field is required.",
  }),
  dateOfBirth: Joi.string().pattern(dateRegexp).required().messages({
    "string.base": "The dateOfBirth field must be a string.",
    "string.pattern.base": "Invalid date format. Use DD-MM-YYYY.",
    "any.required": "The dateOfBirth field is required.",
  }),
  type: Joi.string().required().messages({
    "string.base": "The type field must be a string.",
    "any.required": "The type field is required.",
  }),
  comments: Joi.string().required().messages({
    "string.base": "The comments field must be a string.",
    "any.required": "The comments field is required.",
  }),
});

const schemas = {
  addSchema,
};

const Pets = model("pets", petsSchema);

module.exports = {
  Pets,
  schemas,
};
