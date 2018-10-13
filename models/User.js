const mongoose = require("mongoose");
const md5 = require("md5");
const bcrypt = require("bcrypt");

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

// 創建大頭貼：使用gravatar網站隨機產生頭像,並用md5產生亂碼網址
UserSchema.pre("save", function(next) {
  this.avatar = `http://gravatar.com/avatar/${md5(this.username)}?d=identicon`;
  next();
});

// 用戶密碼加密：使用 bcrypt hash
UserSchema.pre("save", function(next) {
  // 如果密碼沒有更動就直接返回
  if (!this.isModified("password")) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    if (err) return next(err);
    bcrypt.hash(this.password, salt, (err, hash) => {
      if (err) return next(err);
      this.password = hash;
      next();
    });
  });
});

module.exports = mongoose.model("User", UserSchema);
