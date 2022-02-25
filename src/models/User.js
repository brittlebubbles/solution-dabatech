const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = Schema({
  name: {
    type: String,
    // required: true,
  },
  username: {
    type: String,
    // required: true,
  },
  bio: {
    type: String,
    // required: true,
  },
  phoneNumber: {
    type: String,
    // required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("User", UserSchema);
