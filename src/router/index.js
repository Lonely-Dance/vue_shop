import Vue from 'vue'
import VueRouter from 'vue-router'
 
import Login from '../components/login.vue'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
   
  {
    path:"/login",
    component:Login
  },
  {
    path:"/home",
    component:Home
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
