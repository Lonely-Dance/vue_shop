<template>
  <div class="home">
   <el-button type="primary" @click="logout">退出</el-button>

  </div>
</template>

<script>
// @ is an alias to /src
 

export default {
  methods:{
    logout(){
      //清除token
      // 重定向到login页面
      window.sessionStorage.clear();
      this.$router.push('/login')
    }
  }
  
}
</script>
