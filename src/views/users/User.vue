<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card class="box-card" shadow="never">
      <el-row :gutter="20">
        <el-col :span="18">
            <!-- 绑定查询参数，设置清空可以实现自动更新列表 -->
          <el-input placeholder="请输入内容" class="input-with-select" v-model="paramsObj.query" clearable @clear="getUserList">
            <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="addUserVisible=true">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <!--  :data="tableData"     @current-change="handleCurrentChange"-->
      <el-table :data="usersList" ref="singleTable" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column property="username" label="姓名" width="120"></el-table-column>
        <el-table-column property="email" label="邮箱" width="120"></el-table-column>
        <el-table-column property="mobile" label="电话"></el-table-column>
        <el-table-column property="role_name" label="角色"></el-table-column>
        <el-table-column property="mg_state" label="状态">
            <template slot-scope="scope">
                    <!-- {{scope.row}} -->
                    <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
            </template>
          
        </el-table-column>
        <el-table-column property="role_name" label="操作">
            <template slot-scope="scope">
                <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
            </el-tooltip>
            </template>
      
        </el-table-column>
      </el-table>

      <!--分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="paramsObj.pagenum"
      :page-sizes="[1, 3, 5, 10]"
      :page-size="paramsObj.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="this.total">
    </el-pagination>
    </el-card>

    <!-- 添加对话框  注意使用属性控制对话框的显示和隐藏addUserVisible-->
    <el-dialog
  title="添加用户"
  :visible.sync="addUserVisible"
  width="50%"
   @close="addUserClosed">
  <!-- 内容主体区域 -->
 
 <!-- 添加用户的表单 -->
 <el-form :model="addUserForm" :rules="addUserRules" ref="addUserFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名" prop="username">
    <el-input v-model="addUserForm.username"></el-input>
  </el-form-item>
 <el-form-item label="密码" prop="password">
    <el-input v-model="addUserForm.password"></el-input>
  </el-form-item>
   <el-form-item label="邮箱" prop="email">
    <el-input v-model="addUserForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="addUserForm.mobile"></el-input>
  </el-form-item>

 </el-form>


  <!-- footer 按钮区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="addUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="addUserComfirm">确 定</el-button>
  </span>
</el-dialog>


<!-- 修改用户区域 -->
<el-dialog
  title="修改用户"
  :visible.sync="editUserVisible"
  width="50%"
  @close="editUserClosed"
   >
<!-- 修改用户信息表单 -->
<el-form :model="editUserForm" :rules="addUserRules" ref="editUserFormRef" label-width="100px" class="demo-ruleForm">
  <el-form-item label="用户名"  >
    <el-input v-model="editUserForm.username" disabled></el-input>
  </el-form-item>

   <el-form-item label="邮箱" prop="email">
    <el-input v-model="editUserForm.email"></el-input>
  </el-form-item>
   <el-form-item label="手机" prop="mobile">
    <el-input v-model="editUserForm.mobile"></el-input>
  </el-form-item>

 </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="editUserVisible = false">取 消</el-button>
    <el-button type="primary" @click="editUserConfirm">确 定</el-button>
  </span>
</el-dialog>

  </div>
</template>

<script>
export default {
  data() {
    //邮箱验证，其中使用的test函数，以及回调函数必须要调用，注意加括号表示调用
       var checkEmail=(rule,value,cb)=>{
          const emailReg=/^([a-zA-z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
          if(emailReg.test(value)) return cb();
          return cb( new  Error('请输入正确的邮箱'))
      };
      var checkMobile=(rule,value,cb)=>{
          const mobileReg=/^(86|0|17951)?(13[0-9]|15[0-9]|17[678]|18[0-9]14[57])[0-9]{8}$/;
          if(mobileReg.test(value)) return cb();
          return cb( new  Error('请输入正确的号码'))
      };
    return {
      usersList: [],
      paramsObj: {
        query: "",
        //当前是第几页
        pagenum: 1,
        //每页显示的数据数量
        pagesize: 2
      },
      state:"true",
      total:0,
      addUserVisible:false,

    //   添加用户数据
    addUserForm:{
        username:'',
        password:'',
        email:'',
        mobile:''
    },
     // 添加表单的验证规则对象
      addUserRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名的长度在3~10个字符之间',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名的长度在6~15个字符之间',
            trigger: 'blur'
          }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { validator: checkMobile, trigger: 'blur' }
        ]
      },

    //   设置修改用户的对话框是够显示
    editUserVisible:false,
    editUserForm:{}

 
    
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.paramsObj
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.usersList = res.data.users;
      this.total=res.data.total;
      console.log("用户列表：");
      console.log(res);
      
    },

      handleSizeChange(newSize) {
        console.log(`每页 ${newSize} 条`);
        //每页显示数据数量改变时 监听数据发生的变化 更新列表
         this.paramsObj.pagesize = newSize
         this.getUserList()
      },
      //监听当前页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        //更新请求的参数更新列表
        this.paramsObj.pagenum=val
        this.getUserList()
        
        },
        //监听状态的改变
       async changeState(info){
            console.log(info);
            //发起请求向服务器修改数据
       const {data:res} =  await  this.$http.put(`users/${info.id}/state/${info.mg_state}`)

            // console.log(res);
            if(res.meta.status!==200) {
                //失败了要修改状态为原来的状态
                info.mg_state=!info.mg_state;
                return this.$message.error('修改状态失败！');
            }
                return this.$message.success('修改状态成功！');

                },

    //监听到对话框关闭的时候重置添加用户表单
    addUserClosed(){
        this.$refs.addUserFormRef.resetFields()
    },

    //添加用户表单预校验
    addUserComfirm(){
        this.$refs.addUserFormRef.validate(async valid=>{
            if(!valid) return;
            // console.log(valid); //为何不会正确打印？因为邮箱校验部分函数写错了。。。
            //成功之后可以发起添加用户请求
        const {data:res}=await  this.$http.post('users',this.addUserForm)
            // console.log(res);
             if (res.meta.status !== 201) {
          this.$message.error('添加用户失败！')
        }

        this.$message.success('添加用户成功！')
        // 隐藏添加用户的对话框
      this.addUserVisible = false;
        // 重新获取用户列表数据
        this.getUserList()
            
        })
      

    },
    //修改用户数据，要得到当前的选择的用户，需要传递参数id，此时仅仅是显示对话框
       async showEditDialog(id){
        // console.log(id);
        //显示对话框
        this.editUserVisible=true;
        // 根据id查询用户信息
        const {data:res}=await this.$http.put('users/'+id);
        if(res.meta.status!=200) {
            return this.$message.error('查询用户信息失败！')
        }
        this.editUserForm=res.data;
               
    },
    //监听到对话框关闭的时候重置添加用户表单
    editUserClosed(){
        this.$refs.editUserFormRef.resetFields()
    },
    //确认修改用户信息
    editUserConfirm(){
        //对表单信息预校验,所以要先得到表单
        this.$refs.editUserFormRef.validate(async valid=>{
            if(!valid) return;
            //校验成功，更改数据,从之前动态绑定的editUserForm中获取,注意put 方式
            const {data:res}=await this.$http.put(
                'users/'+this.editUserForm.id,{
                email:this.editUserForm.email,
                mobile:this.editUserForm.mobile
            })
             //判断是否请求数据成功
             if(res.meta.status!=200) {
                 return this.$message.error('修改用户信息失败！')
             }
            //隐藏对话框
            this.editUserVisible=false;
            //更新列表
            this.getUserList()
            //提示成功信息
            this.$message.success('修改用户信息成功！')

        })


    },
   async removeUserById(id){
         const confirmRes=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
         if(confirmRes!=='confirm'){
           return this.$message.info('已取消删除！')
         }
         //调用API从数据库删除数据
       
        const { data: res } = await this.$http.delete('users/' + id)
       //记得判断状态
        if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
      this.getUserList()
       
       
     },
    setRole(str){
        console.log(str);

    }
    
  }
};
</script>
<style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
</style>