<template>
  <v-container v-if="posts.length > 0">
    <v-flex xs12>
      <v-carousel v-bind="{ 'cycle': true }" interval="3000">
        <v-carousel-item v-for="post in posts" :key="post._id" :src="post.imageUrl">
          <h1 class="carousel-title">{{post.title}}</h1>
        </v-carousel-item>
      </v-carousel>
    </v-flex>
  </v-container>
</template>

<script>
export default {
  name: "Home",
  computed: {
    posts() {
      return this.$store.getters.posts;
    }
  },
  methods: {
    // 從vuex取得文章資訊, 傳遞給carousel組件
    getPostData() {
      this.$store.dispatch("getPost");
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