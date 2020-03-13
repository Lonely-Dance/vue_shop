<template>
  <div class="login_container">
    <div class="login-box">
        <!-- logo区域 -->
      <div class="logo">
        <img src="../assets/logo.png" alt />
      </div>
      <!-- 提交表单区域 -->
      <!-- 绑定表单提交的数据，使用v-model; 使用校验 ：rules 以及prop  这个属性要放到 form-item上-->
      <!-- ref 绑定元素，以便使用vue对象通过refs属性获得 -->
      <el-form ref="loginFormRef" :model="loginForm"  :rules="rules" label-width="0" class="login_form">
          <!-- 用户名 -->
        <el-form-item prop="username" >
          <el-input  prefix-icon="iconfont icontouxiang"  v-model="loginForm.username" ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item  prop="password" >
          <el-input  prefix-icon="iconfont iconmima"  v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮 -->
         <el-form-item class="btns" >
         <el-button type="primary" @click="login">登录</el-button>
         <!-- 实现重置功能 -->
         <el-button type="info" @click="reset">重置</el-button>
        </el-form-item>

      </el-form>
        
    </div>
  </div>
</template>

<script>
export default {
  data(){
    return{
      loginForm:{
        username:'admin',
        password:'123456'
      },
      rules:{
        username:[
         { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 2, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
        ],
        password:[
         { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 3, max: 15, message: '长度在 6到 15 个字符', trigger: 'blur' }
        ]
      }
    }
  },
  methods:{
    reset(){
      // console.log(this.$refs)
      //重置表单方法
      this.$refs.loginFormRef.resetFields()
    },
    //登录前的预校验 rules校验成功则返回true
    login(){
      this.$refs.loginFormRef.validate ( async(valid)=>{
         if(!valid) return;
          //结构赋值
      const {data:result}=await this.$http.post('login',this.loginForm)
      if(result.meta.status!==200) return  this.$message.error('登录失败！');
      
       
      this.$message({
          message: '登录成功！',
          type: 'success'
        });
        console.log(result.data);
        
        //成功之后保存token到sessionStrorage中。导航跳转到后台地址
       window.sessionStorage.setItem('token',result.data.token)
      this.$router.push('/home')
      
      // 可以使用then处理promise，也可以使用await 结合asyn处理
      // console.log(result)
      // result.then((res)=>{
        // console.log(res.data);
      //         })

      })
     
    }
  }
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login-box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  margin: 0 auto;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.logo {
  width: 130px;
  height: 130px;
  border-radius: 50%;
  border: 1px solid #eee;
  padding: 10px;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;//此时超出父容器
    box-sizing: border-box
}
.btns{
    //使用flex实现盒子中的元素右对齐
    // display: flex;
    // justify-content: flex-end
    float: right//或者直接浮动
}
</style>