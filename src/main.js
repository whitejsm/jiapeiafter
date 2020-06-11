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

axios.defaults.withCredentials=true;

Vue.use(ElementUI)
Vue.use(vueaxios, axios)

axios.defaults.baseURL= 'http://localhost:9000'
Vue.config.productionTip = false

// Vue.filter('dateFormat',function(value){
//   const dt = new Date(value)
//   const y = dt.getFullYear()
//   const m = (dt.getMonth()+1+"").padStart(2,'0')
//   const d = (dt.getDate()+"").padStart(2,'0')
//   const hh = (dt.getHours()+'').padStart(2,'0')
//   const mm = (dt.getMinutes()+'').padStart(2,'0')
//   const ss = (dt.getSeconds()+'').padStart(2,'0')
//   return '${y}-${m}-${d} ${hh}:${mm}:${ss}'
// })

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>',
  store
})
