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
import qs from 'qs'
import VueParticles from 'vue-particles'
Vue.use(VueParticles);
axios.defaults.withCredentials=true;
// Vueaxios.defaults.baseURL="http://localhost:9000"
Vue.use(ElementUI);
Vue.use(vueaxios, axios);
Vue.prototype.$qs = qs;

Vue.config.productionTip = false;


/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store,
})
