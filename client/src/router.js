import Vue from "vue";
import Router from "vue-router";
import Home from "./components/Home.vue";
import Posts from "@/components/Posts/Posts";
import Post from "@/components/Posts/Post";
import AddPost from "@/components/Posts/AddPost";
import Profile from "@/components/Auth/Profile";
import Signin from "@/components/Auth/Signin";
import Signup from "@/components/Auth/Signup";

import AuthGuard from "./AuthGuard";

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: Home
    },
    {
      path: "/posts/:postId",
      name: "Post",
      component: Post,
      props: true
    },
    {
      path: "/posts",
      name: "Posts",
      component: Posts
    },
    {
      path: "/post/add",
      name: "AddPost",
      component: AddPost,
      beforeEnter: AuthGuard
    },
    {
      path: "/profile",
      name: "Profile",
      component: Profile,
      beforeEnter: AuthGuard
    },
    {
      path: "/signin",
      name: "Signin",
      component: Signin
    },
    {
      path: "/signup",
      name: "Signup",
      component: Signup
    }
  ]
});
