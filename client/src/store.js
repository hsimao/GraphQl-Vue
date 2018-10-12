import Vue from "vue";
import Vuex from "vuex";

// 引入Apollo
import { defaultClient as apolloClient } from "./main.js";
import { gql } from "apollo-boost";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: []
  },
  mutations: {
    setPosts(state, payload) {
      state.posts = payload;
    }
  },
  actions: {
    getPost({ commit }) {
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `
        })
        .then(({ data }) => {
          commit("setPosts", data.getPosts);
        })
        .catch(err => {
          console.log(err);
        });
    }
  },
  getters: {
    posts: state => state.posts
  }
});
