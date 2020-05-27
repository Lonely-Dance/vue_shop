import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
//这里也要导入才行
import './plugins/element.js'
import  './plugins/axios.js'
//使用axios 发起请求
import ZkTable from 'vue-table-with-tree-grid'

// 导入富文本编辑组件
import VueQuillEditor from 'vue-quill-editor'

import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme

Vue.use(VueQuillEditor, /* { default global options } */)

Vue.use(ZkTable)
Vue.filter('dateFormat',function(origin){
   const dt=new Date(origin)
   const  y=dt.getFullYear()
   const  m=(dt.getMonth()+1+"").padStart(2,'0')
   const  d=(dt.getDate()+"").padStart(2,'0')
   const  hh=(dt.getHours()+"").padStart(2,'0')
   const  mm=(dt.getMinutes()+"").padStart(2,'0')
   const  ss=(dt.getSeconds()+"").padStart(2,'0')
   return `${y}-${m}-${d} ${hh}:${mm}:${ss}`

})



Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
