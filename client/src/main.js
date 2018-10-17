import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

// 引入Alert組件，並註冊全域
import FormAlert from "./components/Shared/FormAlert";
Vue.component("form-alert", FormAlert);

// 引入 Apollo
import ApolloClient from "apollo-boost";
import VueApollo from "vue-apollo";

Vue.use(VueApollo);

// 設置Apollo
export const defaultClient = new ApolloClient({
  uri: "http://localhost:4000/graphql",
  // 將token跟請求送到後端
  fetchOptions: {
    credentials: "include"
  },
  request: operation => {
    // 如果localStorage沒有token, 將給空白字串, 預防報錯
    if (!localStorage.token) {
      localStorage.setItem("token", "");
    }

    // 將token添加到header來取得授權
    operation.setContext({
      headers: {
        authorization: localStorage.getItem("token")
      }
    });
  },
  onError: ({ graphQLErrors, networkError }) => {
    if (networkError) {
      console.log("[網路異常]", networkError);
    }
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        console.dir(err);

        // 如果是驗證錯誤(例如token期限到期), 更新提示訊息, 並觸發登出方法來清空舊狀態
        if (err.name === "AuthenticationError") {
          // 設定驗證錯誤訊息到state, 來顯示提窗
          store.commit("setAuthError", err);
          // 調用登出方法,清空舊狀態
          store.dispatch("signoutUser");
        }
      }
    }
  }
});

const apolloProvider = new VueApollo({ defaultClient });

Vue.config.productionTip = false;

new Vue({
  provide: apolloProvider.provide(),
  router,
  store,
  render: h => h(App),
  created() {
    // 調用Vuex 取得當前用戶資料
    this.$store.dispatch("getCurrentUser");
  }
}).$mount("#app");
