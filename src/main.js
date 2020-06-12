// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/common/element.js'
import '@/assets/fonts/iconfont.css'
import vueaxios from 'vue-axios'
import axios from 'axios'
import store from '@/store.js'
import Qs from 'qs'
axios.defaults.withCredentials=true;

Vue.use(ElementUI)
Vue.use(vueaxios, axios)


Vue.config.productionTip = false


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
  Qs
})
