const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

// 獲取資料庫URI
require("dotenv").config({ path: "variables.env" });

// 資料Schema
const User = require("./models/User");
const Post = require("./models/Post");

// mongo DB連結
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

const server = new ApolloServer({
  typeDefs,
  context: {
    User,
    Post
  }
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
