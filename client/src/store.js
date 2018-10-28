import Vue from "vue";
import Vuex from "vuex";
import router from "./router";

// 引入Apollo
import { defaultClient as apolloClient } from "./main.js";
import {
  GET_POSTS,
  GET_USER_POSTS,
  SIGNIN_USER,
  SIGNUP_USER,
  GET_CURRENT_USER,
  ADD_POST,
  UPDATE_USER_POST,
  SEARCH_POSTS
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    user: null,
    loading: false,
    error: null,
    authError: null
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    },
    setUserPosts(state, payload) {
      state.userPosts = payload;
    },
    setSearchResults(state, payload) {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setLoading(state, payload) {
      state.loading = payload;
    },
    setError(state, payload) {
      state.error = payload;
    },
    setUser(state, payload) {
      state.user = payload;
    },
    setAuthError(state, payload) {
      state.authError = payload;
    },
    clearUser: state => (state.user = null),
    clearError: state => (state.error = null),
    clearSearchResults: state => (state.searchResults = [])
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
    // 取得用戶建立的文章
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
          console.log(data.getUserPosts);
        })
        .catch(err => console.error(err));
    },
    // 登入，由後端驗證取得token
    signinUser({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signinUser.token);
          // 取得token後重新刷新，讓後端抓取以存放在headers上的token資訊來進行驗證
          // 確保 getCurrentUser 方法有在main.js create階段中呼叫
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
          console.error(err);
        });
    },
    // 註冊
    signupUser({ commit }, payload) {
      commit("setLoading", true);
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload
        })
        .then(({ data }) => {
          commit("setLoading", false);
          localStorage.setItem("token", data.signupUser.token);
          // 取得token後重新刷新，讓後端抓取以存放在headers上的token資訊來進行驗證
          // 確保 getCurrentUser 方法有在main.js create階段中呼叫
          router.go();
        })
        .catch(err => {
          commit("setLoading", false);
          commit("setError", err);
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
    },
    // 新增文章
    addPost: ({ commit }, payload) => {
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          // 更新 Aopplo post資料
          update: (cache, { data: { addPost } }) => {
            // 取得當前get_post內的資料
            const data = cache.readQuery({ query: GET_POSTS });
            // 將本次新增的文章新增到此資料內(unshift: 新增到最前面)
            data.getPosts.unshift(addPost);
            console.log(data);
            // 將更新完的資料寫入query
            cache.writeQuery({
              query: GET_POSTS,
              data
            });
          },
          // 觸發更新UI,opitmisticRespones可確保更新時立即添加數據
          opitmisticRespones: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload
            }
          }
        })
        .then(({ data }) => {
          console.log(data.addPost);
        })
        .catch(err => {
          console.error(err);
        });
    },
    // 更新文章
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload
        })
        .then(({ data }) => {
          // 找出本次更新文章的位置
          const index = state.userPosts.findIndex(post => post._id === data.updateUserPost._id);
          // 將本次更新的文章覆蓋上去
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1)
          ];
          // 同步更新到vuex
          commit("setUserPosts", userPosts);
        })
        .catch(err => console.error(err));
    },
    // 搜尋文章
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload
        })
        .then(({ data }) => {
          console.log(data.searchPosts);
          commit("setSearchResults", data.searchPosts);
        })
        .catch(err => console.error(err));
    }
  },
  getters: {
    posts: state => state.posts,
    userPosts: state => state.userPosts,
    searchResults: state => state.searchResults,
    user: state => state.user,
    userFavorites: state => state.user && state.user.favorites,
    loading: state => state.loading,
    error: state => state.error,
    authError: state => state.authError
  }
});
