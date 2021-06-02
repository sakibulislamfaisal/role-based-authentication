const mongoose = require("mongoose");
const { Schema } = mongoose;
const userSchema = new Schema({
  username: {
    type: String,
    trim: true,
    required: true,
  },

  email: {
    type: String,
    trim: true,
    required: true,
  },
  password: {
    type: String,
    trim: true,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  profileImage: {
    type: String,
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
});

// const User = mongoose.model("User", userSchema);
module.exports = userSchema;
