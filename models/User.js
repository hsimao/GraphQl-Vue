const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // 不能為空
    unique: true, // 不可重複
    trim: true // 自動刪除空白
  },
  email: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  avatar: {
    type: String
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  favorites: {
    type: [mongoose.Schema.Types.ObjectId], // mongoDB內的物件id
    required: true,
    ref: "Post"
  }
});

module.exports = mongoose.model("User", UserSchema);
