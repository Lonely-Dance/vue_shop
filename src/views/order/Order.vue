<template>
  <div>
    <!--头部面包屑导航栏 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
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
            @clear="getOrdersList"
          >
            <el-button slot="append" icon="el-icon-search" @click="getOrdersList"></el-button>
          </el-input>
        </el-col>
      </el-row>
      <!-- 商品列表区域 -->

      <el-table :data="ordersList" ref="singleTable" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50" label="#"></el-table-column>
        <el-table-column property="order_number" label="订单编号" width="120"></el-table-column>
        <el-table-column property="order_price" label="订单价格" width="120"></el-table-column>
        <el-table-column property="pay_status" label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success" v-if="scope.row.pay_status==1">已付款</el-tag>
            <el-tag type="danger" v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column property="is_send" label="是否发货"></el-table-column>
        <el-table-column property="create_time" label="下单时间">
          <!-- 使用slot接收数据  使用管道符实现日期格式化 -->
          <template slot-scope="scope">{{scope.row.create_time | dateFormat}}</template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showBox(scope.row.id)"
            ></el-button>
            <!-- 物流按钮 -->
            <el-button
              type="success"
              icon="el-icon-location-outline"
              size="mini"
              @click="showProcess(scope.row.goods_id)"
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
        :total="this.total"
      ></el-pagination>
    </el-card>
    <!-- 修改地址的对话框 -->
    <el-dialog title="修改地址" :visible.sync="addressVisible" width="50%" @close="addressDialogClosed">
      <el-form
        :model="addressForm"
        :rules="addressFormRules"
        ref="addressFormRef"
        label-width="100px"
      >
        <el-form-item label="省市区/县" prop="address1">
          <el-cascader :options="cityData" v-model="addressForm.address1"></el-cascader>
        </el-form-item>
        <el-form-item label="详细地址" prop="address2">
          <el-input v-model="addressForm.address2"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addressVisible = false">取 消</el-button>
        <el-button type="primary" @click="addressVisible = false">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 显示物流时间线 -->
    <el-dialog title="提示" :visible.sync="dialogVisible" width="30%" >
      <span>物流信息</span>
       <el-timeline >
    <el-timeline-item
      v-for="(activity, index) in logistics"
      :key="index"
      :timestamp="activity.time">
      {{activity.context}}
    </el-timeline-item>
  </el-timeline>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>


<script>
import cityData from "./citydata.js";
export default {
  data() {
    return {
      ordersList: [],

      paramsObj: {
        query: "",
        //当前是第几页
        pagenum: 1,
        //每页显示的数据数量
        pagesize: 2
      },
      total: 0,
      addressVisible: false,
      addressForm: {
        address1: [],
        address2: ""
      },
      addressFormRules: {
        address1: [
          { required: true, message: "请选择省市区县", trigger: "blur" }
        ],
        address2: [
          { required: true, message: "请填写详细地址", trigger: "blur" }
        ]
      },
      cityData,
      dialogVisible:false,
        logistics:{       
     }
    };
  },
created() {
    this.getOrdersList();
  },
 
  methods: {
    async getOrdersList() {
      const { data: res } = await this.$http.get("orders", {
        params: this.paramsObj
      });
      console.log("hhh");

      console.log(res);

      if (res.meta.status !== 200) {
        return this.$message.error("获取列表失败！");
      }
      this.ordersList = res.data.goods;
      this.total = res.data.total;
    },
    // 监听到每页数据变化
    handleSizeChange(newSize) {
      //每页显示数据数量改变时 监听数据发生的变化 更新列表
      this.paramsObj.pagesize = newSize;
      this.getOrdersList();
    },
    //监听当前页
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`);
      //更新请求的参数更新列表
      this.paramsObj.pagenum = val;
      this.getOrdersList();
    },
    // 展示修改地址的对话框
    showBox() {
      this.addressVisible = true;
    },
    addressDialogClosed() {
      this.$refs.addressFormRef.resetFields();
    },
    async showProcess(){
        this.dialogVisible=true
         const { data: res } = await this.$http.get("/kuaidi/1106975712662");
        console.log(res);
        this.logistics=res.data

        
    }
  },

};
</script>
<style lang="less" scoped>
</style>