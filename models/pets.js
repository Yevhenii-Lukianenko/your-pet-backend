const {Schema, model} = require("mongoose");
const Joi = require('joi');

const dateReg = /^\d{2}-\d{2}-\d{4}$/;

const petsSchema = new Schema({
    name: {
        type: String,
        required: [true, "Set name for pet"],
    },
    dateOfBirth: {
        type: String,
        match: dateReg,
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
    avatarURL : {
        type: String,
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
      },
   
},{ versionKey: false, timestamps: true});


const addSchema = Joi.object({
    name: Joi.string()
    .min(2)
    .max(20)
    .required()
    .messages({ "any.required": "missing required fields" }),
    dateOfBirth: Joi.string()
    .pattern(dateReg)
    .required()
    .messages({ "any.required": "missing required fields" }),

    type: Joi.string()
    .required()
    .messages({ "any.required": "missing required fields" }),

    comments: Joi.string()
    .required()
    .messages({ "any.required": "missing required fields" })
    ,
});

const schemas = {
    addSchema
};

const Pets = model('pets', petsSchema);

module.exports = {
    Pets,
    schemas,
}