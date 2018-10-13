import { gql } from "apollo-boost";

// 取得文章資料
export const GET_POSTS = gql`
  query {
    getPosts {
      _id
      title
      imageUrl
    }
  }
`;

// user queries 查詢用戶資料
export const GET_CURRENT_USER = gql`
  query {
    getCurrentUser {
      _id
      username
      email
      password
      avatar
      joinDate
      favorites {
        _id
        title
        imageUrl
      }
    }
  }
`;

// user signin 用戶登入, 調用後端Apollo方法：signinUser驗證帳密，若符合回傳token
export const SIGNIN_USER = gql`
  mutation($username: String!, $password: String!) {
    signinUser(username: $username, password: $password) {
      token
    }
  }
`;

// user signup 用戶註冊
export const SIGNUP_USER = gql`
  mutation($username: String!, $email: String!, $password: String!) {
    signupUser(username: $username, email: $email, password: $password) {
      token
    }
  }
`;
