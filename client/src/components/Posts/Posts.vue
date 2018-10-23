<template>
  <v-container fluid grid-list-xl>

    <!-- post cards -->
    <v-layout row wrap v-if="infiniteScrollPosts">
      <v-flex xs12 sm6 v-for="post in infiniteScrollPosts.posts" :key="post._id">

        <v-card hover @click.native="goToPost(post._id)">
          <v-img :src="post.imageUrl" height="30vh" lazy></v-img>

          <!-- 文章標題、喜歡次數、留言次數 -->
          <v-card-actions>
            <v-card-title primary>
              <div>
                <div class="headline">{{post.title}}</div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn @click.stop="showPostCreator = !showPostCreator" icon>
              <v-icon>{{`keyboard_arrow_${showPostCreator ? 'up' : 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- 作者資訊 -->
          <v-slide-y-transition>
            <v-card-text class="bg" v-show="showPostCreator">
              <!-- 大頭貼 -->
              <v-list-tile avatar>
                <v-list-tile-avatar>
                  <img :src="post.createdBy.avatar">
                </v-list-tile-avatar>

                <!-- 作者名稱、創建日期 -->
                <v-list-tile-content>
                  <v-list-tile-title class="text--primary">{{post.createdBy.username}}</v-list-tile-title>
                  <span class="grey--text u-text-more">創建日期 {{post.createdDate}}</span>
                </v-list-tile-content>

                <v-list-tile-action>
                  <v-btn icon ripple>
                    <v-icon color="grey lighten-1">info</v-icon>
                  </v-btn>
                </v-list-tile-action>

              </v-list-tile>
            </v-card-text>
          </v-slide-y-transition>
        </v-card>
      </v-flex>
    </v-layout>

    <!-- 更多文章 -->
    <v-layout v-if="showMoreEnabled" column>
      <v-flex xs12>
        <v-layout justify-center row>
          <v-btn color="info" @click="showMorePosts">預覽更多</v-btn>
        </v-layout>
      </v-flex>
    </v-layout>

  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../queries";

// 每次載入的文章數量
const pageSize = 2;

export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true,
      showPostCreator: false
    };
  },
  // 直接在本組件內調用apollo資料，不透過vuex
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    goToPost(id) {
      this.$router.push(`/posts/${id}`);
    },
    // 抓取更多文章資訊，並更新資料
    showMorePosts() {
      this.pageNum += 1;
      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        // prevResult：目前文章資料
        // fetchMoreResult：本次新載入的文章資料
        updateQuery: (prevResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;
          return {
            infiniteScrollPosts: {
              __typename: prevResult.infiniteScrollPosts.__typename,
              // 將原本文章跟新載入的文章合併
              posts: [...prevResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    }
  }
};
</script>

<style lang="sass" scoped>
.u-text-more
  overflow: hidden
  white-space: nowrap
  text-overflow: ellipsis
  width: 100%
</style>