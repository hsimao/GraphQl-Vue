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

  # 查詢
  type Query {
    getTodos: [Todo]
  }

  # 新增
  type Mutation {
    addTodo(task: String, completed: Boolean): Todo
  }
`;

const resolvers = {
  // 查詢返回結果
  Query: {
    getTodos: () => todos
  },
  // 新增資料fn
  Mutation: {
    addTodo: (_, { task, completed }) => {
      const todo = { task, completed };
      todos.push(todo);
      return todo;
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers
});

server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
