const { Schema, model } = require("mongoose");

const newsSchema = new Schema({
  imgUrl: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
});

const News = model("news", newsSchema);

module.exports = {
  News,
};
