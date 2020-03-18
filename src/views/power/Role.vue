<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<el-card class="box-card">
<!-- 新建一行放按钮 -->
  <el-row>       
         <el-col >
             <el-button type="primary" class="addrole" >添加角色  </el-button>          

         </el-col>  
     </el-row>
  <el-table
     border stripe
    :data="RolesData"
    highlight-current-row
     
    style="width: 100%">
    <!-- 扩展行 -->
 <el-table-column type="expand">  
     <template slot-scope="scope">
     <el-row v-for="(item1,i1) in scope.row.children" :key="i1" :class="['bottomB',i1===0? 'topB':'','vcenter']" >                              
         <!-- 渲染一级图标 -->
         <el-col :span="9" >          
              <!-- 使用if-else实现不同的样式显示 -->
            <el-tag  closable     @close="removeRoleById(scope.row,item1.id)">
                {{item1.authName}}
                
            </el-tag>
            <i class="el-icon-caret-right"></i>
           </el-col>
           <!-- 渲染二级图标 -->
         <el-col :span="15">
             <el-row v-for="(item2,i2) in item1.children" :key="i2" :class="[i2===0?'':'topB','vcenter']">
                 <el-col :span="12">
                      <el-tag  type="success"  closable  @close="removeRoleById(scope.row,item2.id)">
                           <i class="el-icon-caret-right"></i>
                {{item2.authName}}
            </el-tag>
                 </el-col>
                 <el-col :span="12">
                  <el-tag  type="warning" v-for="(item3,i3) in item2.children" :key="i3"  closable  @close="removeRoleById(scope.row,item3.id)">
                             {{item3.authName}} 
            </el-tag>
                 </el-col>                 
             </el-row>
         </el-col>
     </el-row>


<!-- 添加对话框 实现点击权限管理时的弹框-->
 <el-dialog
  title="分配权限"
  :visible.sync="setRolesDialogVisible"
  width="50%"
  @close="clearDefaultKeys"
   >
  <!-- 内容主体区域 -->
 <el-tree :data="rolesTree" :props="treeConfig"  show-checkbox  default-expand-all="true"
  node-key="id" :default-checked-keys="defaultKeys" ref="rolesTreeRef"></el-tree>
 
   <!-- footer 按钮区域 -->
  <span slot="footer" class="dialog-footer">
    <el-button @click="setRolesDialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="setRolesComfirm">确 定</el-button>
  </span>
</el-dialog>
     </template>    
     
 </el-table-column> 
    <el-table-column type="index" width="50" label="#" ></el-table-column>
        <el-table-column property="roleName" label="角色名称" width="150px"></el-table-column>
        <el-table-column property="roleDesc" label="角色描述" width="150px">
        </el-table-column> 
        <el-table-column  label="操作">
            <template slot-scope="scope">
                <!-- 修改按钮 -->
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <!-- 删除按钮 -->
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)">删除</el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip effect="dark" content="分配权限" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)">分配权限</el-button>
            </el-tooltip>
            </template>
        </el-table-column>
  </el-table>
  
 
</el-card>


    </div>
</template>

<script>
export default {
    data() {
      return {
          RolesData:[],
          setRolesDialogVisible:false,
          rolesTree:[],
          treeConfig:{
              children:'children',
              label:'authName'
          },
          //保存默认选择的项
          defaultKeys:[],
          //保存角色id,方便后续修改权限时使用
          roleId:''


        
      }
    
},
created(){
    this.getRolesList()
},
methods:{
    async getRolesList(){
       const {data:res}=await  this.$http.get('roles');
       console.log(res);
        if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

       this.RolesData=res.data;
    // console.log("角色列表");
    
    // console.log(res.data); 
    },
    async removeRoleById(role,rightId){
         const confirmRes=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
         if(confirmRes!=='confirm'){
           return this.$message.info('已取消删除！')
         }
         //调用API从数据库删除数据
       
        const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
       //记得判断状态
        if (res.meta.status !== 200) {
        return this.$message.error('删除用户失败！')
      }

      this.$message.success('删除用户成功！')
    //   this.getUserList()   这么写会渲染整体列表，效果不好
    role.children=res.data; 
       
     },
     //获得三级权限下的子节点
    getChilds(node,arr){
        if(!node.children){
        return  arr.push(node.id)
        }else{
            node.children.forEach(item=>this.getChilds(item,arr))
        }   

    },
    async setRole(role){
           const { data: res } = await this.$http.get(`rights/tree`)
       //记得判断状态
        if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }
      this.rolesTree=res.data;
      //保存roleId
      this.roleId=role.id;
      
      this.getChilds(role,this.defaultKeys)
      console.log(this.defaultKeys);
      
     this.$message.success('获取权限列表成功！')

        this.setRolesDialogVisible=true;

    },
    //关闭设置权限的对话框时，自动情况已选择的项，避免出现不断的选，为不同的角色添加了很多不必要的权限
    clearDefaultKeys(){
        this.defaultKeys=[];
    },
    //点击确定的时候，实现接口数据的更新。将结果保存到数据库
   
  async setRolesComfirm(){

    //得到tree组件的已经选择的和版选择的选项id(通过ref的引用)
    const arr1=this.$refs.rolesTreeRef.getCheckedKeys()
    const arr2=this.$refs.rolesTreeRef.getHalfCheckedKeys()
    //使用展开运算符实现浅拷贝，再转换成接口数据形式需要的字符串
    const checkedKeys=[...arr1,...arr2].join(',');
    //调用接口方法,rolesId需要自己定义，在一打开分配权限的对话框时就保存roleId，在data里定义
   const {data:res}=await this.$http.post(`roles/${this.roleId}/rights`,{rids:checkedKeys})
        //判断时候更新成功
        if(res.meta.status!=200) {
            return this.$message.error('分配权限失败！')
        }else{
            this.$message.success('分配权限成功！')
            //更新列表
            this.getRolesList()
            //关闭对话框
            this.setRolesDialogVisible=false;
        }

    }
    
    }
}
</script>

<style lang="less" scoped>
.addrole{
    margin-bottom: 10px;
}
.el-tag{
    margin:5px;
}
.topB{
    border-top: 1px solid #eee;
}
.bottomB{
    border-bottom: 1px solid #eee;

}
.vcenter{
    display: flex;
    align-items: center;
    
}
</style>                        