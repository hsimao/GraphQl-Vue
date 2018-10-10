<template>
  <v-container>

    <h1>Home</h1>
    <h2 v-if="$apollo.loading">Loading...</h2>
    <ul v-else v-for="(post, index) in getPosts" :key="index">
      <li>{{post.title}}</li>
      <li>{{post.description}}</li>
      <li>{{post.likes}}</li>
    </ul>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";

export default {
  name: "Home",
  data() {
    return {
      posts: []
    };
  },
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            title
            imageUrl
            description
            likes
          }
        }
      `,
      // 回傳資訊，可回傳loading, data, 如要將資料傳到其他地方，例如vue 的data,可以在此操作
      result(args) {
        console.dir(args);
        if (!args.loading) {
          this.posts = args.data.getPosts;
        }
      },
      error(err) {
        console.log("Error", err);
      }
    }
  }
};
</script>