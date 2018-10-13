import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

// 引入Apollo
import { defaultClient as apolloClient } from "./main.js";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    user: null,
    loading: false
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    clearUser: state => (state.user = null)
  },
  actions: {
    getPost({ commit }) {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_POSTS
        })
        .then(({ data }) => {
          commit("setPosts", data.getPosts);
          commit("setLoading", false);
        })
        .catch(err => {
          console.log(err);
          commit("setLoading", false);
        });
    },
    // 登入，由後端驗證取得token
    signinUser({ commit }, payload) {
      // 登入前先清空token, 避免error
      localStorage.setItem("token", "");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
          // 取得token後重新刷新，讓後端抓取以存放在headers上的token資訊來進行驗證
          // 確保 getCurrentUser 方法有在main.js create階段中呼叫
          router.go();
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 取得當前用戶資料, 並儲存到state
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("setLoading", false);
          commit("setUser", data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    },
    // 登出
    signoutUser: async ({ commit }) => {
      // 清空state user
      commit("clearUser");
      // 清空localStorage中的token
      localStorage.setItem("token", "");
      // 清空 session
      await apolloClient.resetStore();
      // 導回首頁
      router.push("/");
    }
  },
  getters: {
    posts: state => state.posts,
    user: state => state.user,
    loading: state => state.loading
  }
});
