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
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="signinUser">
              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="passwordRules" v-model="password" prepend-icon="extension" label="Password" type="password" required>
                  </v-text-field>
                </v-flex>
              </v-layout>
              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" color="primary" type="submit" :disabled="!isFormValid || loading">登入</v-btn>
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
      isFormValid: true,
      username: "",
      password: "",
      // 命名欄位輸入驗證規則
      usernameRules: [
        username => !!username || "姓名為必填欄位",
        username => username.length < 10 || "姓名不得大於10字元"
      ],
      passwordRules: [
        password => !!password || "密碼為必填欄位",
        password => password.length >= 4 || "密碼須大於4字元"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "loading", "error"])
  },
  watch: {
    user(value) {
      // 監聽vuex中的user值,如果user值改變時(登入成功,從null變成物件),就將頁面倒到首頁
      if (value) this.$router.push("/");
    }
  },
  methods: {
    signinUser() {
      // 若在input都尚未觸發前直接點擊送出, 在此判斷表單驗證
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>

<style>
/* btn loader style */
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>