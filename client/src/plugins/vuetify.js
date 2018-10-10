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
    primary: "#0288D1",
    secondary: "#01579B",
    accent: "#0091EA",
    error: "#F4511E",
    warning: "#F4511E",
    info: "#D1C4E9",
    success: "#689F38"
  }
})
