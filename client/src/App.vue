<template>
  <v-app id="app"
         style="background: #e3e3e3">

    <!-- side navbar -->
    <v-navigation-drawer fixed
                         app
                         temporary
                         v-model="sideNav">
      <v-toolbar color="secondaryDark"
                 dark
                 flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/"
                     tag="span"
                     style="cursor: pointer">
          <h1 class="title pl-3">{{appTitle}}</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- links -->
      <v-list>
        <v-list-tile ripple
                     v-for="item in navItems"
                     :key="item.title"
                     :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>

        <!-- 帳號 -->
        <v-list-tile v-if="user"
                     to="/profile">
          <v-list-tile-action>
            <v-icon>account_box</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>帳號</v-list-tile-content>
        </v-list-tile>

        <!-- 登出 -->
        <v-list-tile v-if="user"
                     @click="signout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>登出</v-list-tile-content>
        </v-list-tile>

      </v-list>
    </v-navigation-drawer>

    <!-- navbar -->
    <v-toolbar fixed
               dark
               color="primary">
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/"
                     tag="span"
                     style="cursor: pointer">{{appTitle}}</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field flex
                    prepend-icon="search"
                    placeholder="Search posts"
                    color="secondary"
                    single-line
                    hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat
               v-for="item in navItems"
               :key="item.title"
               :to="item.link">
          <v-icon left
                  class="hidden-sm-only">{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- 帳號 -->
        <v-btn v-if="user"
               flat
               to="/profile">
          <v-icon class="hidden-sm-only"
                  left>account_box</v-icon>
          <v-badge right
                   color="third"
                   :class="{'bounce': badgeAnimated}">
            <span v-if="userFavorites.length"
                  slot="badge">{{userFavorites.length}}</span>
            帳號
          </v-badge>
        </v-btn>

        <!-- 登出 -->
        <v-btn v-if="user"
               flat
               @click="signout">
          <v-icon class="hidden-sm-only"
                  left>exit_to_app</v-icon>
          登出
        </v-btn>

      </v-toolbar-items>

    </v-toolbar>

    <!-- app content -->
    <main>
      <v-container class="mt-4">
        <transition name="fade"
                    mode="out-in">
          <router-view />
        </transition>

        <!-- 登入提示窗 Snackbar -->
        <v-snackbar v-model="authSnackbar"
                    color="success"
                    :timeout="5000"
                    bottom
                    left>
          <v-icon class="mr-3">check</v-icon>
          <h3>{{authSnackbarTitle}}</h3>
          <v-btn flat
                 @click="authSnackbar = false">關閉</v-btn>
        </v-snackbar>

        <!-- auth錯誤提示窗 Snackbar -->
        <v-snackbar v-if="authError"
                    v-model="authErrorSnackbar"
                    color="error"
                    :timeout="10000"
                    bottom
                    left>
          <v-icon class="mr-3">cancel</v-icon>
          <h3>{{authError.message}}</h3>
          <v-btn flat
                 to="/signin">登入</v-btn>
        </v-snackbar>

      </v-container>
    </main>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      appTitle: "VueShare",
      authSnackbar: false,
      authSnackbarTitle: "",
      authErrorSnackbar: false,
      badgeAnimated: false
    };
  },
  watch: {
    // 監聽會員資料，依照改變狀況給予不同提示訊息
    user(newValue, oldValue) {
      this.authSnackbar = false;
      if (!oldValue) {
        this.authSnackbarTitle = `${newValue.username} 已登入！`;
        this.authSnackbar = true;
      }
      if (!newValue) {
        this.authSnackbarTitle = `${oldValue.username} 已經登出！`;
        this.authSnackbar = true;
      }
    },
    // 監聽驗證錯誤訊息，如果有訊息就調用auth錯誤提示窗
    authError(value) {
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    // 監聽我的最愛文章資料, 如改變就添加動畫效果
    userFavorites(value) {
      if (value) {
        this.badgeAnimated = true;
        // 1秒後移除動畫
        setTimeout(() => {
          this.badgeAnimated = false;
        }, 1000);
      }
    }
  },
  computed: {
    ...mapGetters(["authError", "user", "userFavorites"]),
    navItems() {
      let items = [
        { icon: "chat", title: "文章", link: "/posts" },
        { icon: "lock_open", title: "登入", link: "/signin" },
        { icon: "create", title: "註冊", link: "/signup" }
      ];

      if (this.user) {
        items = [
          { icon: "chat", title: "文章", link: "/posts" },
          { icon: "stars", title: "新增", link: "/post/add" }
        ];
      }
      return items;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    signout() {
      this.$store.dispatch("signoutUser");
    }
  }
};
</script>

<style lang="sass">
.fade-enter-active,
.fade-leave-active
  transition: all 0.3s

.fade-enter,
.fade-leave-active
  opacity: 0
  transform: translate(-25px)


// 新增我的最愛 彈跳動畫
.bounce
  transition: all 1s
  animation: bounce 1s both

@keyframes bounce
  0%, 20%, 53%, 80%, 100%
    transform: translate3d(0, 0, 0)
  40%, 43%
    transform: translate3d(0, -20px, 0)
  70%
    transform: translate3d(0, -10px, 0)
  90%
    transform: translate3d(0, -4px, 0)

</style>
