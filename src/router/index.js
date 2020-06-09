import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import ht from '@/components/ht'
import order from '@/components/order'
import FindALL from '@/components/customer/FindAll'
import bedInfo from '@/components/bed/bedInfo'
Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
    routes: [
      {path: '/', name: 'login', component: Login},
      {path: '/Main', name: 'main', component: Main,
        children:[
          {component:ht,path:"/ht"},
          {component:order,path:"/order1111"},
          {component:FindALL,path:"/customer/FindALL"},
          {component:bedInfo,path:"/bed/bedInfo"}
        ]}
    ]
})