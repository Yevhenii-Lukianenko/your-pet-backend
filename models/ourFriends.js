const { Schema, model } = require("mongoose");

const { workScheduleRegexp } = require("../utils");

const friendsSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  addressUrl: {
    type: String,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  worksDays: [
    {
      isOpen: {
        type: Boolean,
      },
      from: {
        type: String,
        match: workScheduleRegexp,
      },
      to: {
        type: String,
        match: workScheduleRegexp,
      },
    },
  ],
  phone: {
    type: String,
  },
  email: {
    type: String,
  },
});

const Friends = model("friends", friendsSchema);

module.exports = {
  Friends,
};
