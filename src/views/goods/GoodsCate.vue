<template>
  <div>
    <!-- 开头的面包屑导航栏 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片展示主体区域 -->
    <el-card class="box-card" shadow="never">
      <!-- 用一行放置开头的按钮 -->
      <el-row>
        <el-col>
          <el-button class="addCate" type="primary" @click="showAddCateDialog">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 使用  第三方树形表格显示商品分类-->
      <zk-table
        ref="table"
        index-text="#"
        :data="GoodsCateList"
        :columns="columns"
        :stripe="true"
        :border=" true"
        :show-row-hover="true"
        :tree-type="true"
        :expand-type="false"
        :selection-type="false"
        :show-index="true"
      >
        <!-- 定义一个插槽，接受第二列的数据 -->
        <template v-slot:isOK="scope">
          <!--使用if-else就有连个组件 -->
          <i class="el-icon-success" v-if="scope.row.cat_deleted===true" style="color:lightgreen"></i>
          <i class="el-icon-error" v-else style="color:red"></i>
        </template>
        <template v-slot:level="scope">
          <!-- 使用if-else实现不同的样式显示 -->
          <el-tag v-if="scope.row.cat_level === '0'">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === '1'">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <template v-slot:operate="scope">
          <!-- 修改按钮 -->
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="showEditDialog(scope.row.cat_id)"
          ></el-button>
          <!-- 删除按钮 -->
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="removeUserById(scope.row.cat_id)"
          ></el-button>
        </template>
      </zk-table>

      <!--分页 
        监听当前页码值和每页显示数据值的改变，刷新列表。当前页为接口中的pagenum，
        自定义sizes的值，当前每页显示的条数和用户选择有关，需要绑定到自定义的数据中，
        total也是要记录的
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="paramsObj.pagenum"
        :page-sizes="[1, 3, 5, 10]"
        :page-size="paramsObj.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
      ></el-pagination>
    </el-card>

    <!-- 添加对话框  注意使用属性控制对话框的显示和隐藏addUserVisible-->
    <el-dialog title="添加分类" :visible.sync="addCateVisible" width="50%" @close="addCateClosed">
      <!-- 添加用户的表单 -->
      <el-form
        :model="addCateForm"
        :rules="addCateRules"
        ref="addCateFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="分类名称" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级名称">
          <!-- 级联选择器 设置高度必须在全局样式中设置？-->
          <el-cascader class=".el-cascader-panel "
          change-on-select  
        clearable v-model="selectKeys" 
        :options="cateParentsList"
        :props="selectedProps"
         @change="handleChange" 

    >   </el-cascader>
        </el-form-item>
      </el-form>
      <!-- footer 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCateComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {       
      GoodsCateList: [],
      paramsObj: {
        query: "",
        //当前是第几页
        pagenum: 1,
        //每页显示的数据数量
        pagesize: 2
      },
      total: 0,
      columns: [
          {
            label: '商品分类',
            prop: 'cat_name',
            width: '400px',
          },
          //表示第二列的数据
          {
            label: '是否有效',
            // prop: 'cat_deleted',
            type:'template',//指定这行是一个模板来渲染
            //定义这个模板的名称
            template:'isOK'
          },
          //第三列排序，也是使用模板
          {
            label: '等级',            
            type:'template',//指定这行是一个模板来渲染
            //定义这个模板的名称
            template:'level'
          },
          //操作列
          {
            label: '操作',             
            type:'template',//指定这行是一个模板来渲染
            //定义这个模板的名称
            template:'operate'
          }
          ],
          addCateVisible:false,
          addCateForm:{
              cat_pid:'',
              cat_name:'',
              cat_level:0//默认为一级分类
                   },
           addCateRules:{
               cat_name:[
                  { required: true, message: '请输入分类名', trigger: 'blur'}
               ]
           },
           cateParentsList:[],
           //两级选项，所以是用数组
           selectKeys:[],
           //定义级联选择器的属性
           selectedProps:
               { 
               expandTrigger: 'hover',
               value: 'cat_id',
               label: 'cat_name',
               children:  'children'
            
               },

           
    
    };
  },
  created() {
    this.getGoodsCateList();
  },
  methods: {
    handleSizeChange(newSize) {
      console.log(`每页 ${newSize} 条`);
      //每页显示数据数量改变时 监听数据发生的变化 更新列表
      this.paramsObj.pagesize = newSize;
      this.getGoodsCateList();
    },
    //监听当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //更新请求的参数更新列表
      this.paramsObj.pagenum = val;
      this.getGoodsCateList();
    },
     
    async getGoodsCateList() {
      const { data: res } = await this.$http.get("categories", {
        params: this.paramsObj
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.GoodsCateList = res.data.result;
      this.total = res.data.total;
      console.log("商品分类列表：");
      console.log(res);
    },
    //显示添加分类对话框
    showAddCateDialog(){

        //显示对话框的时候先获得分类
        this.getCateParentList()

        this.addCateVisible=true;
    },
    //获得要添加的分类的父级类别，一级和二级。因为最多是三级

    async getCateParentList(){
        const { data: res } = await this.$http.get("categories", {
        type:2
      });
      if (res.meta.status !== 200) {
        return this.$message.error("获取商品分类失败！");
      }
      this.cateParentsList = res.data;
      console.log(`父级分类x`);
      console.log(res); 
      
      

    },
    handleChange(){
        console.log(this.selectKeys);
        //级联框发生变化的时候要修改addCateForm 的参数数据
        if(!this.selectKeys.length){
            this.addCateForm.cat_pid=0
            this.addCateForm.cat_level=0
            
        }else
        this.addCateForm.cat_pid=this.selectKeys[this.selectKeys.length-1];
        this.addCateForm.cat_level=this.selectKeys.length;
        
    },
    //确认添加商品
     addCateComfirm(){
        //有表单都要预验证
        this.$refs.addCateFormRef.validate(  async valid=>{
            if(!valid) return;
            const { data: res } = await this.$http.post("categories", 
           this.addCateForm);
      if (res.meta.status !== 201) {
        return this.$message.error("获取商品分类失败！");
      }
         this.$message.success('添加分类成功！')
         //更新表单
         this.getGoodsCateList()
         this.addCateVisible=false
        }) 

    },
    //重置表单
    addCateClosed(){
        this.$refs.addCateFormRef.resetFields()
        //清空级联选择框
         this.addCateForm.cat_pid=0
         this.addCateForm.cat_level=0
         this.selectKeys=[]
    },



  }
};
</script>
<style lang="less" scoped>
.addCate {
  margin-bottom: 10px;
}

</style>