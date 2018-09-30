module.exports = {
  Query: {
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
      return newUser;
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
