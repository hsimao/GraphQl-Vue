const { ApolloServer, gql } = require("apollo-server");
const mongoose = require("mongoose");

// 獲取資料庫URI
require("dotenv").config({ path: "variables.env" });

// mongo DB連結
mongoose
  .connect(
    process.env.MONGO_URI,
    { useNewUrlParser: true }
  )
  .then(() => console.log("DB connected"))
  .catch(err => console.error(err));

// 資料型別設置
const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  # 查詢
  type Query {
    getTodos: [Todo]
  }
`;

const server = new ApolloServer({
  typeDefs
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
