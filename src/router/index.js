import Vue from 'vue'
import Router from 'vue-router'
import Main from '@/components/Main'                //主界面
import Login from '@/components/Login'              //登录
import order from '@/components/order/order'              //订单
import customer from '@/components/customer/customer'        //前台用户
import shareholder from '@/components/personnel/shareholder'  //股东/经销商
import hospital from '@/components/personnel/hospital'        //医院
import repair from '@/components/personnel/repair'            //维修人员
import accounting from '@/components/personnel/accounting'    //会计
import bedInfo from '@/components/bed/bedInfo'      //床位信息
import faults from '@/components/aftersale/faults'    //故障
import repairInfo from '@/components/aftersale/repair'    //维修
import simpleReport from '@/components/report/SimpleReport'
import visibleReport from '@/components/report/VisibleReport'
import saleReport from '@/components/report/SaleReport'
import department from '@/components/hospital/Department'
import hospitalinfo from '@/components/hospital/Hospital'
import echarts from 'echarts'
import login2 from '@/components/login2'
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
          {component:order,path:"/order/order"},
          {component:customer,path:"/customer/customer"},
          {component:shareholder,path:"/personnel/shareholder"},
          {component:hospital,path:"/personnel/hospital"},
          {component:repair,path:"/personnel/repair"},
          {component:accounting,path:"/personnel/accounting"},
          {component:bedInfo,path:"/bed/bedInfo"},
          {component:faults,path:"/aftersale/faults"},
          {component:simpleReport,path:"/report/simpleReport"},
          {component:visibleReport,path:"/report/visibleReport"},
          {component:saleReport,path:"/report/saleReport"},
          {component:hospitalinfo,path:"/hospital/Hospital"},
          {component:department,path:"/hospital/Department"},
          {component:repairInfo,path:"/aftersale/repair"},
        ]},
      {path: '/login2', name: ' ', component: login2},
    ]
})
