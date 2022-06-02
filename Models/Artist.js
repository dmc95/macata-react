const mongoose = require("mongoose");

//Modèle user
const Artist = mongoose.model("Artist", {
  account: {
    artistName: {
      unique: true,
      required: true,
      type: String,
    },
  },
  email: {
    unique: true,
    required: true,
    type: String,
  },
  token: String,
  hash: String,
  salt: String,
  avatar: { Object },
});

module.exports = Artist;
