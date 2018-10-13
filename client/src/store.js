import Vue from "vue";
import Vuex from "vuex";

// 引入Apollo
import { defaultClient as apolloClient } from "./main.js";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setLoading(state, payload) {
      state.loading = payload;
    }
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
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          localStorage.setItem("token", data.signinUser.token);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 從後端驗證並取得當前用戶資料
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER
        })
        .then(({ data }) => {
          commit("setLoading", false);
          console.log(data.getCurrentUser);
        })
        .catch(err => {
          commit("setLoading", false);
          console.error(err);
        });
    }
  },
  getters: {
    posts: state => state.posts,
    loading: state => state.loading
  }
});
