import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
//这里也要导入才行
import './plugins/element.js'
import  './plugins/axios.js'
//使用axios 发起请求




Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
