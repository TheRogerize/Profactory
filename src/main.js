import Vue from 'vue'
import './plugins/vuetify'
import AsyncComputed from 'vue-async-computed'
import App from './App.vue'
import router from './router'
import store from './store'
import Vuelidate from 'vuelidate'
import axios from 'axios'
import VueAxios from 'vue-axios'
import money from 'v-money'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
window.axios = require('axios');

Vue.use( Vuelidate, VueAxios, axios );
Vue.use( AsyncComputed )
Vue.use(money, {precision: 4})

Vue.config.productionTip = false;

/* eslint-disable */
new Vue({
  router,
  store,
  axios,
  render: h => h(App),
  components: { App },
  created() {
    this.$store.dispatch('checkLogin');
  }
//<script src="https://www.gstatic.com/firebasejs/6.0.2/firebase-app.js"></script>
}).$mount('#app')
