import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'                //主界面
import Login from '@/components/Login'              //登录
import order from '@/components/order'              //订单
import customer from '@/components/customer'        //前台用户
import shareholder from '@/components/shareholder'  //股东/经销商
import hospital from '@/components/hospital'        //医院
import repair from '@/components/repair'            //维修人员
import accounting from '@/components/accounting'    //会计
import bedInfo from '@/components/bed/bedInfo'      //床位信息  
import faults from '@/components/aftersale/faults'    //故障
import simpleReport from '@/components/SimpleReport'
import visibleReport from '@/components/VisibleReport'
import saleReport from '@/components/SaleReport'
import echarts from 'echarts'

Vue.prototype.$echarts = echarts
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
          {component:bedInfo,path:"/bed/bedInfo"},
          {component:faults,path:"/aftersale/faults"},
          {component:simpleReport,path:"/simpleReport"},
          {component:visibleReport,path:"/visibleReport"},
          {component:saleReport,path:"/saleReport"},
        ]}
    ]
})