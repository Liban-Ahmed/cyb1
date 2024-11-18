const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  bio: String,
  avatar: String, // Store the filename of the uploaded avatar
});

module.exports = mongoose.model("User", userSchema);
