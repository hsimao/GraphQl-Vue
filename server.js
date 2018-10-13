const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// 引入GQL typeDefs跟resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// 獲取資料庫URI
require("dotenv").config({ path: "variables.env" });

// 引入User、Post資料Schema
const User = require("./models/User");
const Post = require("./models/Post");

// 連結mongo資料庫
mongoose
  .connect(
    process.env.MONGO_URI,
    {
      useNewUrlParser: true,
      useCreateIndex: true
    }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// 驗證從client傳過來的token
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.TOKEN_SECRET);
    } catch (err) {
      throw new AuthenticationError("您的登入狀態已失效，請重新登入");
      // console.error(err);
    }
  }
};

// 建立 Apollo / GraphQl Server, 使用typeDefs, resolvers, content物件
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    // 取得token, 調用getUser方法驗證token
    const token = req.headers["authorization"];
    return { User, Post, currentUser: await getUser(token) };
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
