<template>
  <v-container v-if="getPosts">
    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="(post, index) in getPosts" :key="index" :src="post.imageUrl">
          <h1 class="carousel-title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
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

<style lang="sass">
.carousel-title
  position: absolute
  width: 100%
  bottom: 50px
  padding: 10px 16px 0 16px
  background-color: rgba(black, 0.5)
  color: white
  text-align: center
</style>