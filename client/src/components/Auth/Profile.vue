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
            <v-btn @click="loadPost(post)" color="primary"
              fab small dark>
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

    <!-- 編輯文章彈窗 -->
    <v-dialog persistent max-width="600px"
      v-model="editPostDialog">
      <v-card>
        <v-card-title class="headline grey lighten-2">編輯文章</v-card-title>

        <v-container>
          <v-form v-model="isFormValid"
            lazy-validation ref="form"
            @submit.prevent="updatePost">

            <!-- 標題 title input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="titleRules"
                  v-model="title" label="標題" type="text"
                  required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- 圖片網址 image url input -->
            <v-layout row>
              <v-flex xs12>
                <v-text-field :rules="imageRules"
                  v-model="imageUrl" label="圖片網址"
                  type="text" required></v-text-field>
              </v-flex>
            </v-layout>

            <!-- 圖片預覽 image preview -->
            <v-layout row>
              <v-flex xs12>
                <img :src="imageUrl" height="300px">
              </v-flex>
            </v-layout>

            <!-- 類別選單 categories select -->
            <v-layout row>
              <v-flex xs12>
                <v-select :rules="categoriesRules"
                  v-model="categories" :items="[
              'Art',
              'Education',
              'news',
              'travel',
              'photography',
              'technology',
              'food'
              ]"
                  multiple label="類別">
                </v-select>
              </v-flex>
            </v-layout>

            <!-- 文章內容 description textarea -->
            <v-layout row>
              <v-flex xs12>
                <v-textarea :rules="descRules"
                  v-model="description" label="文章內容"
                  type="text"></v-textarea>
              </v-flex>
            </v-layout>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn :disabled="!isFormValid"
                @click="updatePost" type="submit"
                color="third" flat>更新</v-btn>
              <v-btn color="error" flat @click="editPostDialog = false">取消</v-btn>
            </v-card-actions>

          </v-form>
        </v-container>

      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "標題不可為空",
        title => title.length < 30 || "標題不可大於30個字元"
      ],
      imageRules: [image => !!image || "圖片網址不可為空"],
      categoriesRules: [categories => !!categories.length >= 1 || "至少要選一個文章類別"],
      descRules: [
        desc => !!desc || "文章內容不可為空",
        desc => desc.length < 500 || "內容不可大於500個字元"
      ]
    };
  },
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
    },
    updatePost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    loadPost({ _id, title, imageUrl, categories, description }) {
      this.editPostDialog = true;
      this.postId = _id;
      this.title = title;
      this.imageUrl = imageUrl;
      this.categories = categories;
      this.description = description;
    }
  },
  created() {
    this.getUserPosts();
  }
};
</script>