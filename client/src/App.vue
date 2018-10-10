<template>
  <v-app id="app" style="background: #e3e3e3">

    <!-- side navbar -->
    <v-navigation-drawer fixed app temporary v-model="sideNav">
      <v-toolbar color="secondaryDark" dark flat>
        <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
        <router-link to="/" tag="span" style="cursor: pointer">
          <h1 class="title pl-3">{{appTitle}}</h1>
        </router-link>
      </v-toolbar>

      <v-divider></v-divider>

      <!-- links -->
      <v-list>
        <v-list-tile ripple v-for="item in navItems" :key="item.title" :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            {{item.title}}
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>

    <!-- navbar -->
    <v-toolbar fixed dark color="primary">
      <v-toolbar-side-icon @click="toggleSideNav"></v-toolbar-side-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link to="/" tag="span"
          style="cursor: pointer">{{appTitle}}</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        flex prepend-icon="search"
        placeholder="Search posts"
        color="secondary"
        single-line
        hide-details></v-text-field>

      <v-spacer></v-spacer>

      <!-- links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in navItems"
          :key="item.title"
          :to="item.link">
          <v-icon left class="hidden-sm-only">{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
      </v-toolbar-items>

    </v-toolbar>

    <!-- app content -->
    <main>
      <v-container class="mt-4">
        <router-view />
      </v-container>
    </main>
  </v-app>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      appTitle: 'VueShare'
    }
  },
  computed: {
    navItems() {
      return [
        { icon: 'chat', title: '文章', link: '/posts'},
        { icon: 'lock_open', title: '登入', link: '/signin'},
        { icon: 'create', title: '註冊', link: '/signup'},
      ]
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav
    }
  }
}
</script>

<style lang="sass">
</style>
