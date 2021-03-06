<template>
  <v-container v-if="getPost" class="mt-3"
    flexbox center>

    <!-- post card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>

            <!-- 新增我的最愛按鈕, 有登入才顯示 -->
            <v-btn large icon v-if="user" @click="toggleLikePost">
              <v-icon large :color="checkIfPostLiked(getPost._id) ? 'warning': 'grey'">favorite</v-icon>
            </v-btn>

            <h3 class="ml-3 font-weight-thin">{{getPost.likes}}
              likes</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goBackPage" color="info"
              large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>點擊放大圖片</span>
            <v-img @click="imageToggle" slot="activator"
              :src="getPost.imageUrl" id="post__image"></v-img>
          </v-tooltip>

          <!-- 大圖彈窗 -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl"
                height="80vh" @click="dialog = !dialog"></v-img>
            </v-card>
          </v-dialog>

          <!-- 文章內容 -->
          <v-card-text>
            <span v-for="(category, index) in getPost.categories"
              :key="index">
              <v-chip class="md-3" color="accent"
                text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- 留言輸入框 -->
    <v-layout class="md-3" v-if="user">
      <v-flex xs12>
        <v-form v-model="isFormValid"
          lazy-validation ref="form"
          @submit.prevent="addMessage">
          <v-layout row>
            <v-flex xs12>
              <!-- input -->
              <v-text-field @click:append-outer="addMessage"
                :rules="messageRules" v-model="messageBody"
                clearable :append-outer-icon="messageBody && 'send'"
                label="新增留言" type="text"
                prepend-icon="email" required></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>

    <!-- 留言列表 -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-list subheader two-line>
          <v-subheader>留言
            ({{getPost.messages.length}})</v-subheader>

          <template v-for="message in getPost.messages">
            <v-divider :key="message._id"></v-divider>

            <v-list-tile avatar inset :key="message.title">
              <v-list-tile-avatar>
                <img :src="message.messageUser.avatar">
              </v-list-tile-avatar>

              <v-list-tile-content>
                <v-list-tile-title>
                  {{message.messageBody}}
                </v-list-tile-title>
                <v-list-tile-sub-title>
                  {{message.messageUser.username}}
                  <span class="grey--text text--lighten-1 hidden-xs-only">{{getTimeFromNow(message.messageDate)}}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action class="hidden-xs-only">
                <v-icon :color="checkOwnMessage(message) ? 'third' : 'grey'">chat_bubble</v-icon>
              </v-list-tile-action>

            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import moment from "moment";

import { mapGetters } from "vuex";
import { GET_POST, ADD_POST_MESSAGE, LIKE_POST, UNLIKE_POST } from "../../queries";

export default {
  name: "Post",
  props: {
    postId: String
  },
  data() {
    return {
      postLiked: false,
      dialog: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "不得為空",
        message => message.length < 75 || "留言不得超過75字元"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    // 格式化時間：轉換資料時間到目前時間共間隔了多久
    getTimeFromNow(time) {
      return moment(new Date(time)).fromNow();
    },
    goBackPage() {
      this.$router.go(-1);
    },
    imageToggle() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    addMessage() {
      // 不符表單驗證規則就不執行
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        // 呼叫queries內的ADD_POST_MESSAGE方法
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            // 新增完後同步當前留言資料
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              // 將新增的留言push到最前面
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            // 重置表單
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    // 檢查留言是否為自己
    checkOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    // 檢查此篇文章是否已加入我的喜愛文章內
    checkIfPostLiked(postId) {
      // 如果我的最愛文章內有值，使用array.some()方法歷遍所有喜愛文章，並檢查是否符合
      if (this.userFavorites && this.userFavorites.some(fave => fave._id === postId)) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    },
    toggleLikePost() {
      if (this.postLiked) {
        this.unLikePost();
      } else {
        this.likePost();
      }
    },
    // 新增喜愛文章
    likePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          // 新增完後在前端同步更新like post資料
          update: (cache, { data: { likePost } }) => {
            // 取出當前資訊
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            // 將新增的資訊寫入
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          // 成功添加後，在前端同步更新user喜愛文章的資料
          const updatedUser = { ...this.user, favorites: data.likePost.favorites };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    // 取消喜愛文章
    unLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          // 新增完後在前端同步更新like post資料
          update: (cache, { data: { unlikePost } }) => {
            // 取出當前資訊
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            // 將取消完後的資訊寫入
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          // 成功添加後，在前端同步更新user喜愛文章的資料
          const updatedUser = { ...this.user, favorites: data.unlikePost.favorites };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    }
  }
};
</script>

<style lang="sass" scoped>
#post__image
  height: 400px !important
</style>