<template>
    <div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
<el-card class="box-card">
 
  <el-table
     border stripe
    :data="RightsData"
    highlight-current-row
     
    style="width: 100%">
 
    <el-table-column type="index" width="50" label="#" ></el-table-column>
        <el-table-column property="authName" label="权限名称" width="150px"></el-table-column>
        <el-table-column property="path" label="路径" width="150px"></el-table-column>
        <el-table-column property="level" label="等级" width="150px">
            <template slot-scope="scope">
            <el-tag v-if="scope.row.level === '0'">一级</el-tag>
            <el-tag type="success" v-else-if="scope.row.level === '1'">二级</el-tag>
            <el-tag type="warning" v-else>三级</el-tag>
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
          RightsData:[]
        
      }
    
},
created(){
    this.getRightList()
},
methods:{
    async getRightList(){
       const {data:res}=await  this.$http.get('rights/list');
       console.log(res);
        if (res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败！')
      }

       this.RightsData=res.data;
       
    }
}
}
</script>

<style lang="less" scoped>

</style>