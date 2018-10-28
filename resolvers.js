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
    // 取得用戶自己建立的文章
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    // 取得單筆文章資料
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
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
    },
    // 文章搜尋功能
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchterm'
          // 對'searchterm'參數進行搜索
          { $text: { $search: searchTerm } },
          // assign ' searchTerm' a text score to  provide best match
          // 為'searchTerm'指定文本分數以提供最佳匹配
          { score: { $meta: "textScore" } }
        )
          .sort({
            // 根據textScore（以及喜歡的文章）對結果進行排序
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    // 文章列表 (載入更多功能)
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // 如果頁碼大於1(非第一次讀取), 則計算後面接續要抓出的文章資料
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
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
    },

    // 更新文章
    updateUserPost: async (
      _,
      { postId, userId, title, imageUrl, categories, description },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        { _id: postId, createdBy: userId },
        { $set: { title, imageUrl, categories, description } },
        { new: true }
      );
      return post;
    },

    // 刪除文章
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },

    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };
      const post = await Post.findOneAndUpdate(
        // 使用postId找到該篇文章
        { _id: postId },
        // 將新的留言新增到到message陣列最前面
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // 新增完後回傳
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },

    // 新增like文章
    likePost: async (_, { postId, username }, { Post, User }) => {
      // 找到文章，找到like value 添加1
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );

      // 找到用戶，新增文章資訊到我的最愛
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      return { likes: post.likes, favorites: user.favorites };
    },

    // 取消like文章
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // 找到文章，找到like value -1
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );

      // 找到用戶，我的最愛刪除此文章
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });
      return { likes: post.likes, favorites: user.favorites };
    }
  }
};
