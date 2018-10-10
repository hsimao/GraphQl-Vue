import Vue from 'vue'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import zhHant from 'vuetify/es5/locale/zh-Hant'

Vue.use(Vuetify, {
  iconfont: 'md',
  lang: {
    locales: { zhHant },
    current: 'zh-Hant'
  },
  theme: {
    primary: "#1e3148",
    primaryDark: "#0f1924",
    primaryLight: "#2d496c",
    secondary: "#9e6f6d",
    secondaryDark: "#825856",
    secondaryLight: "#b28d8c",
    third: "#43b14b",
    thirdDark: "#358c3b",
    thirdLight: "#6fc976",
    accent: "#1e3148",
    error: "#F4511E",
    warning: "#F4511E",
    info: "#2d496c",
    success: "#43b14b",
    bg: "#e3e3e3"
  }
})
