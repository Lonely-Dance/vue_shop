<template>
  <div>
    <!--头部面包屑导航栏 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="18">
          <!-- 绑定查询参数，设置清空可以实现自动更新列表 -->
          <el-input
            placeholder="请输入内容"
            class="input-with-select"
            v-model="paramsObj.query"
            clearable
            @clear="getGoodsList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="6">
          <el-button type="primary" @click="goAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->

      <el-table :data="goodsList" ref="singleTable" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column property="goods_name" label="商品名称" width="120"></el-table-column>
        <el-table-column property="goods_price" label="商品价格" width="120"></el-table-column>
        <el-table-column property="goods_weight" label="商品重量"></el-table-column>
        <el-table-column property="add_time" label="创建时间">
            <!-- 使用slot接收数据  使用管道符实现日期格式化 -->
            <template slot-scope="scope">
                {{scope.row.add_time | dateFormat}}                
            </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeGoodsById(scope.row.goods_id)"
            ></el-button>
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
  </div>
</template>
<script>
export default {
    data(){
        return{
            goodsList:[],

            paramsObj:{
               query: "",
           //当前是第几页
               pagenum: 1,
            //每页显示的数据数量
               pagesize: 2
            },
            total:0,
            goodsListForm:{
                goodsname:"",
                price:"",
                weight:"",
                time:""
            }

        }
    },
    created(){
        this.getGoodsList()
    },
    methods:{
    async  getGoodsList(){
        const { data: res } = await this.$http.get("goods", {
        params: this.paramsObj
      });
      console.log(res);
      
      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.goodsList = res.data.goods;
      this.total=res.data.total;

        },
        // 监听到每页数据变化
    handleSizeChange(newSize) {
        
        //每页显示数据数量改变时 监听数据发生的变化 更新列表
         this.paramsObj.pagesize = newSize
         this.getGoodsList()
      },
      //监听当前页
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
        //更新请求的参数更新列表
        this.paramsObj.pagenum=val
        this.getGoodsList()
        
        },
    showEditDialog(){},
    async removeGoodsById(id){
        const confirmRes=await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err)
         if(confirmRes!=='confirm'){
           return this.$message.info('已取消删除！')
         }
         //调用API从数据库删除数据
       
        const { data: res } = await this.$http.delete('goods/' + id)
       //记得判断状态
        if (res.meta.status !== 200) {
        return this.$message.error('删除商品失败！')
      }

      this.$message.success('删除商品成功！')
      this.getGoodsList()       
     },
     //添加商品跳转
    goAddPage(){
        this.$router.push('/goods/add')
    },


    },
    
    }

</script>
<style lang="stylus" scoped></style>