const { ApolloServer, gql } = require("apollo-server");

// 資料設定
const todos = [
  { task: "Wash car", completed: false },
  { task: "Clean room", completed: true }
];

// 資料型別設置
const typeDefs = gql`
  type Todo {
    task: String
    completed: Boolean
  }

  # 查詢設置
  type Query {
    getTodos: [Todo]
  }
`;

// 查詢結果綁定
const resolvers = {
  Query: {
    getTodos: () => todos
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
