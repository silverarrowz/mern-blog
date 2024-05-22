const mongoose = require("mongoose");
const { Schema, model } = mongoose;
const validator = require("validator");

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  password: { type: String, required: true },
  about: {
    type: String,
    max: 100,
    default: "Tell a little bit about yourself",
  },
  avatar: {
    type: String,
    default: "uploads/978b08fc09bf9bf123181193ecff1e83.jpg",
  },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
