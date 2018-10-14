<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>登入</h1>
      </v-flex>
    </v-layout>

    <!-- error alert -->
    <v-layout v-if="error" row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <form-alert :message="error.message"></form-alert>
      </v-flex>
    </v-layout>

    <!-- form -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <v-card color="secondary" dark>
          <v-container>
            <v-form @submit.prevent="signinUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="username" prepend-icon="face" label="Username" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field v-model="password" prepend-icon="extension" label="Password" type="password" required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn color="primary" type="submit">登入</v-btn>
                  <h3>還沒有帳號？
                    <router-link to="/signup">註冊</router-link>
                  </h3>
                </v-flex>
              </v-layout>
            </v-form>
          </v-container>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapGetters(["user", "error"])
  },
  watch: {
    user(value) {
      // 監聽vuex中的user值,如果user值改變時(登入成功,從null變成物件),就將頁面倒到首頁
      if (value) this.$router.push("/");
    }
  },
  methods: {
    signinUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>