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
