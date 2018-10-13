const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 創建Token 方法
const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Post"
      });
      return user;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" }) // 依照創建日期排序
        // populate是monogo的方法，用來將createdBy跟User連結
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    }
  },

  Mutation: {
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      // 如果資料庫已經有相同用戶名稱
      if (user) {
        throw new Error("用戶已經註冊");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return { token: createToken(newUser, process.env.TOKEN_SECRET, "1h") };
    },

    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("無此帳號，請重新輸入！");
      }

      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("密碼錯誤，請重新輸入！");
      }
      return { token: createToken(user, process.env.TOKEN_SECRET, "1h") };
    },

    addPost: async (_, { title, imageUrl, categories, description, creatorId }, { Post }) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    }
  }
};
