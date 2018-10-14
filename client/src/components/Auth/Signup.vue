<template>
  <v-container text-xs-center mt-5 pt-5>
    <!-- title -->
    <v-layout row wrap>
      <v-flex xs12 sm6 offset-sm3>
        <h1>註冊</h1>
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
        <v-card color="secondaryDark" dark>
          <v-container>
            <v-form v-model="isFormValid" lazy-validation ref="form" @submit.prevent="signupUser">

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="usernameRules" v-model="username" prepend-icon="face" label="Username" type="text" required>
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-text-field :rules="emailRules" v-model="email" prepend-icon="email" label="Email" type="email" required>
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
                  <v-text-field :rules="passwordRules" v-model="passwordConfirmation" prepend-icon="gavel" label="Confirm Password" type="password" required>
                  </v-text-field>
                </v-flex>
              </v-layout>

              <v-layout row>
                <v-flex xs12>
                  <v-btn :loading="loading" color="primary" type="submit" :disabled="!isFormValid || loading">註冊</v-btn>
                  <h3>已經有帳號了？
                    <router-link to="/signin">登入</router-link>
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
      email: "",
      passwordConfirmation: "",
      // 姓名驗證
      usernameRules: [
        username => !!username || "姓名為必填欄位",
        username => username.length < 10 || "姓名不得大於10字元"
      ],
      // email驗證
      emailRules: [
        email => !!email || "信箱為必填欄位",
        email =>
          /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
            email
          ) || "請輸入正確的Email格式"
      ],
      passwordRules: [
        password => !!password || "密碼為必填欄位",
        password => password.length > 4 || "密碼須大於4字元",
        confirmation => confirmation === this.password || "密碼不符合"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "loading", "error"])
  },
  watch: {
    // 如果user值有改變(註冊成功)，就將頁面導至首頁
    user(value) {
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    signupUser() {
      // 若在input都尚未觸發前直接點擊送出, 在此判斷表單驗證
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          email: this.email,
          password: this.password
        });
      }
    }
  }
};
</script>
