<template>
  <v-container v-if="getPost" class="mt-3" flexbox center>

    <!-- post card -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-card hover>
          <v-card-title>
            <h1>{{getPost.title}}</h1>

            <!-- 新增我的最愛按鈕, 有登入才顯示 -->
            <v-btn large icon v-if="user">
              <v-icon large color="grey">favorite</v-icon>
            </v-btn>

            <h3 class="ml-3 font-weight-thin">{{getPost.likes}} likes</h3>
            <v-spacer></v-spacer>
            <v-icon @click="goBackPage" color="info" large>arrow_back</v-icon>
          </v-card-title>

          <v-tooltip right>
            <span>點擊放大圖片</span>
            <v-img @click="imageToggle" slot="activator" :src="getPost.imageUrl" id="post__image"></v-img>
          </v-tooltip>

          <!-- 大圖彈窗 -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img :src="getPost.imageUrl" height="80vh" @click="dialog = !dialog"></v-img>
            </v-card>
          </v-dialog>

          <!-- 文章內容 -->
          <v-card-text>
            <span v-for="(category, index) in getPost.categories" :key="index">
              <v-chip class="md-3" color="accent" text-color="white">{{category}}</v-chip>
            </span>
            <h3>{{getPost.description}}</h3>
          </v-card-text>

        </v-card>
      </v-flex>
    </v-layout>

    <!-- 留言輸入框 -->
    <v-layout class="md-3" v-if="user">
      <v-flex xs12>
        <v-form>
          <v-layout row>
            <v-flex xs12>
              <v-text-field clearable append-outer-icon="send" label="新增留言" type="text" prepend-icon="email" required></v-text-field>
            </v-flex>
          </v-layout>
        </v-form>
      </v-flex>
    </v-layout>

    <!-- 留言列表 -->
    <v-layout row wrap>
      <v-flex xs12>
        <v-list subheader two-line>
          <v-subheader>留言 ({{getPost.messages.length}})</v-subheader>

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
                  <span class="grey--text text--lighten-1 hidden-xs-only">{{message.messageDate}}</span>
                </v-list-tile-sub-title>
              </v-list-tile-content>

              <v-list-tile-action class="hidden-xs-only">
                <v-icon color="grey">chat_bubble</v-icon>
              </v-list-tile-action>

            </v-list-tile>
          </template>
        </v-list>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import { GET_POST } from "../../queries";

export default {
  name: "Post",
  props: {
    postId: String
  },
  data() {
    return {
      dialog: false
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
    ...mapGetters(["user"])
  },
  methods: {
    goBackPage() {
      this.$router.go(-1);
    },
    imageToggle() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    }
  }
};
</script>

<style lang="sass" scoped>
#post__image
  height: 400px !important
</style>