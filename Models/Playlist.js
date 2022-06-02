const mongoose = require("mongoose");

const Playlist = mongoose.model("Track", {
  playlist_track: {
    track_name: {
      String,
      required: true,
    },

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artist",
    },

    track_image: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },

    path: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Artist",
    ref: "User",
  },
});

module.exports = Playlist;
