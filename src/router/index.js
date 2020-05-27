import Vue from 'vue'
import VueRouter from 'vue-router'
 
import Login from '../components/login.vue'
import Home from '../views/Home.vue'
import Welcome from '../views/Welcome'
import User from '../views/users/User'
import Right from '../views/power/Right'
import Role from '../views/power/Role'
import GoodsCate from '../views/goods/GoodsCate'
import  Params from '../views/goods/Params'
import List from '../views/goods/List'
import Add from '../views/goods/Add'
import Order from "../views/order/Order"
Vue.use(VueRouter)

const routes = [
   
  {
    path:"/login",
    component:Login
  },
  {
    // 在home页嵌套子路由，自动定向到welcome页
    path:"/home",
    component:Home,
    redirect:'/welcome',
    children:[
      {path:'/welcome',component:Welcome},
      {path:'/users',component:User},
      {path:'/rights',component:Right},
      {path:'/roles',component:Role},
      {path:'/categories',component:GoodsCate},
      {path:'/params',component:Params},
      {path:'/goods',component:List},
      {path:'/goods/add',component:Add},
      {path:'/orders',component:Order},
    ]
  },
  {path:"/",redirect:"/login"}


  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  routes
})

//实现路由守卫
router.beforeEach((to,from,next)=>{
if(to.path==='/login') return next()
const tokenstr=window.sessionStorage.getItem('token')
if(!tokenstr) return next('/login')
next()
})
export default router
