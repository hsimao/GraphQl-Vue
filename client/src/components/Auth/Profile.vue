<template>
  <v-container class="text-xs-center">
    <!-- 用戶詳細資訊 -->
    <v-flex sm8 offset-sm2>
      <v-card class="white--text" color="secondary">
        <v-layout align-center>
          <v-flex xs5>
            <v-avatar slot="activator" size="100px">
              <img :src="user.avatar" alt="Avatar">
              <!-- <v-icon v-else :color="message.color"
                v-text="message.icon"></v-icon> -->
            </v-avatar>
          </v-flex>
          <v-flex xs7>
            <v-card-title primary-title>
              <div>
                <div class="headline">{{user.username}}</div>
                <div>加入時間：{{user.joinDate}}</div>
                <div class="hidden-xs-only font-weight-thin">{{user.favorites.length}}
                  篇喜愛文章</div>
                <div class="hidden-xs-only font-weight-thin">已創作
                  {{userPosts.length}} 篇文章</div>
              </div>
            </v-card-title>
          </v-flex>
        </v-layout>
      </v-card>
    </v-flex>

    <!-- 喜愛文章列表 -->
    <v-container v-if="!userFavorites.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2 class="font-weight-regular">你目前還沒添加喜歡的文章</h2>
        </v-flex>
      </v-layout>
    </v-container>
    <v-container class="mt-3" v-else>
      <v-flex xs12>
        <h2 class="font-weight-regular">喜歡的文章
          <span class="font-weight-regular">({{userFavorites.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 lg4 v-for="favorite in userFavorites"
          :key="favorite._id" @click="goToPost(favorite._id)">
          <v-card class="text-xs-left mt-3 ml-1 mr-2"
            hover>
            <v-img height="30vh" :src="favorite.imageUrl"></v-img>
            <v-card-text>
              <h3 class="font-weight-regular">{{favorite.title}}</h3>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>

    <!-- 用戶自己建立的文章列表 -->
    <v-container v-if="!userPosts.length">
      <v-layout row wrap>
        <v-flex xs12>
          <h2>您尚未建立文章</h2>
        </v-flex>
      </v-layout>
    </v-container>

    <v-container v-else class="mt-3">
      <v-flex xs12>
        <h2 class="font-weight-regular">建立的文章
          <span class="font-weight-regular">({{userPosts.length}})</span>
        </h2>
      </v-flex>
      <v-layout row wrap>
        <v-flex xs12 sm6 v-for="post in userPosts"
          :key="post._id">
          <v-card class="text-xs-left mt-3 ml-1 mr-2"
            hover>
            <!-- 編輯按鈕 -->
            <v-btn color="primary" fab small dark>
              <v-icon>edit</v-icon>
            </v-btn>
            <v-btn color="error" fab small dark>
              <v-icon>delete</v-icon>
            </v-btn>

            <v-img height="30vh" :src="post.imageUrl"></v-img>
            <v-card-text>
              <h3 class="font-weight-regular">{{post.title}}</h3>
            </v-card-text>
          </v-card>

        </v-flex>
      </v-layout>
    </v-container>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts"])
  },
  methods: {
    getUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  },
  created() {
    this.getUserPosts();
  }
};
</script>