import "@babel/polyfill";
import Vue from "vue";
import "./plugins/vuetify";
import App from "./App.vue";
import router from "./router";
import store from "./store";

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
  render: h => h(App)
}).$mount("#app");
