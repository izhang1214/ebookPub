import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import i18n from './lang/index';
import "./assets/styles/icon.css";
import "./assets/fonts/daysOne.css"; //引入web字体
import "./assets/styles/global.scss";

// console.log(process.env.VUE_APP_RESOURCE_URL, i18n)
Vue.config.productionTip = false

const vue = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

// console.log(vue);