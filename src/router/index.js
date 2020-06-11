import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'
import Login from '@/components/Login'
import order from '@/components/order'
import customer from '@/components/customer'
import shareholder from '@/components/shareholder'
import hospital from '@/components/hospital'
import repair from '@/components/repair'
import accounting from '@/components/accounting'
import bedInfo from '@/components/bed/bedInfo'
Vue.use(Router);

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
};

export default new Router({
    routes: [
      {path: '/', name: ' ', component: Login},
      {path: '/Main', name: 'main', component: Main,
        children:[
          {component:order,path:"/order"},
          {component:customer,path:"/customer"},
          {component:shareholder,path:"/shareholder"},
          {component:hospital,path:"/hospital"},
          {component:repair,path:"/repair"},
          {component:accounting,path:"/accounting"},
          {component:bedInfo,path:"/bed/bedInfo"}

        ]}
    ]
})