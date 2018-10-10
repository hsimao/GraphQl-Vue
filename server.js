const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

// 建立 Apollo / GraphQl Server, 使用typeDefs, resolvers, content物件
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
