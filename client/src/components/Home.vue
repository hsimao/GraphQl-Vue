<template>
  <v-container>
    <h1>Home</h1>
    <ul v-for="(post, index) in getPosts" :key="index">
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
      `
    }
  }
};
</script>