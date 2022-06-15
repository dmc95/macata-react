const mongoose = require("mongoose");

const Track = mongoose.model("Track", {
  track_name: {
    String,
    required: true,
  },
  path: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
    required: true,
  },
  listenerCount: Number,
  track_like: {
    Number,
    ref: "User",
    ref: "Artist",
  },
  track_dislike: {
    Number,
    ref: "User",
    ref: "Artist",
  },
  date: {
    type: Date,
    default: Date.now,
  },
  track_image: {
    type: mongoose.Schema.Types.Mixed,
    default: {},
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
  },
  track_category: {
    type: mongoose.Schema.Types.String,
    ref: "Category",
  },
});

module.exports = Track;
