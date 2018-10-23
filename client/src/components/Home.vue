<template>
  <v-container text-xs-center>
    <v-layout row>
      <v-dialog v-model="loading" persistent fullscreen>
        <v-container fill-height>
          <v-layout row justify-center align-center>
            <v-layout row justify-center align-center>
              <v-progress-circular indeterminate :size="70" :width="7" color="primary"></v-progress-circular>
            </v-layout>
          </v-layout>
        </v-container>
      </v-dialog>
    </v-layout>

    <v-flex xs12>
      <v-carousel v-if="!loading && posts.length > 0" v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item @click.native="goToPost(post._id)" v-for="post in posts" :key="post._id" :lazy-src="post.imageUrl" :src="post.imageUrl">
          <h1 class="carousel-title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Home",
  computed: {
    ...mapGetters(["loading", "posts"])
  },
  methods: {
    // 從vuex取得文章資訊, 傳遞給carousel組件
    getPostData() {
      this.$store.dispatch("getPost");
    },
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    }
  },
  mounted() {
    this.getPostData();
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