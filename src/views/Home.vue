<template>
  
  <!-- 使用element-ui 实现头左右的布局 -->
   <el-container>
  <el-header >
    <!-- 头部区域放logo 和title 以及退出按钮 -->
    <div>
      <img src="../assets/heima.png" alt="">
      <span> 电商管理系统</span>
    </div>
     <el-button type="primary" @click="logout">退出</el-button>
  </el-header>
  <el-container>
     <!-- 左侧导航条区域 -->
     <!-- 根据切换的效果动态改变width  -->
    <el-aside  :width="isCollapse ? '64px':'200px'"> 
      <!-- 实现toggle开关 -->
       <div class="toggle-button" @click="toggle">
        |||
      </div>
     
      <el-menu  :collapse="isCollapse" :collapse-transition="false" router  
      :default-active="activePath"     
      background-color="#333744"
      text-color="#fff"
      active-text-color="#409EFF" v-for="item in menulist" :key="item.id">

      <!-- 一级导航部分 -->
      <el-submenu :index="item.id +''">
        <!-- 一级导航模板 -->
        <template slot="title">
          <!-- 动态绑定图标 -->
          <i :class="iconObjs[item.id]"></i>
          <span>{{item.authName}}</span>
        </template>
         
         <!-- 二级导航 -->
         <!-- 利用index实现路由跳转 -->
          <el-menu-item :index="'/'+subItem.path+''" v-for="subItem in item.children" :key="subItem.id" @click="savePath('/'+subItem.path)">
        <i class="el-icon-menu"></i>
        <span slot="title">{{subItem.authName}}</span>
      </el-menu-item>
      </el-submenu>
      
    </el-menu>

    </el-aside>
    <el-main>
    <router-view></router-view>     
    </el-main>
  </el-container>
</el-container>
   
  
</template>

<script>
// @ is an alias to /src
 

export default {
  data(){
    return{
      menulist:[],
      iconObjs:{
        '125':'iconfont iconusers',
        '103':'iconfont iconshujulifangti',
        '101':'iconfont iconshangpin',
        '102':'iconfont icondanju',
        '145':'iconfont iconjikediancanicon44',
              },
        isCollapse:false,
        activePath:''
    }
  },
  created(){
    this.getlist();
    //一启动的时候就得到activepath的值
    this.activePath=window.sessionStorage.getItem('activepath')
  },
  methods:{
    logout(){
      //清除token
      // 重定向到login页面
      window.sessionStorage.clear();
      this.$router.push('/login')
    },
   async  getlist(){
      const {data:res} = await  this.$http.get('menus')
      this.menulist=res.data
      console.log(res);
      
    },
    //动态绑定属性实现切换效果
    toggle(){
      this.isCollapse=!this.isCollapse;
    },
    savePath(activePath){
      window.sessionStorage.setItem('activepath',activePath)
      //多次点击之后要更新activePath 的值，因此每次点击链接后都要更新
      this.activePath=activePath;

    }
  }
  
}
</script>
<style lang="less" scoped>
.el-container{
  height: 100%;
}
 
.el-header{
  background-color: #373d41;
  // 实现子元素两端对齐
  display: flex;
 justify-content: space-between;
 //上下居中
 align-items: center;
 color:#fff;
 font-size: 20px;
 padding-left: 0;
 //嵌套实现居中 文字图标居中
 > div{
   display: flex;
   align-items: center;
   span{
     margin-left:10px
   }
 }

}
.el-aside{
  background-color: #333744;
}
.el-main{
  background-color: #eaedf1;
}
.el-menu {
    border-right: 0}
.el-submenu i {
  margin-right: 10px;
}
.toggle-button{
  width: 100%;
  height: 45px;
  background-color: rgb(74,80,100);
  color: #fff;
  font-size: 16px;
  line-height: 45px;
  letter-spacing: 0.2em;
  text-align: center;
}

</style>