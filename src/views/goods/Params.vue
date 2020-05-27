<template>
  <div>
    <!--头部面包屑导航栏 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域显示列表结构 -->
    <el-card class="box-card">
      <!-- 添加一个警告提示  没添加一个组件都要注册否则没有样式 -->
      <el-alert show-icon title="注意：只能为第三级分类添加参数！" type="warning" :closable="false"></el-alert>
      <el-row class="row-opt">
        <el-col>
          <!-- 文本使用span包裹 -->
          <span>选择商品分类:</span>
          <!-- 选择分类的级联框  需要配置属性 即选择的id value children 以及选择的keys数组-->
          <el-cascader
            v-model="selectKeys"
            :options="catelist"
            :props="cateListProps"
            @change="handleChange"
          ></el-cascader>
        </el-col>
      </el-row>

      <!-- Tab 标签页 -->
      <el-tabs v-model="activeName" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-row>
            <el-col>
              <el-button
                :disabled="isDisabled"
                class="addCate"
                type="primary"
                @click="showAddParamDialog"
              >添加动态参数</el-button>
            </el-col>
          </el-row>

         <!-- 动态参数列表 -->
          <el-table
            :data="manyDataTable"
            ref="singleTable"
            highlight-current-row
            style="width: 100%"
          >
          <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  class="el-tag"
                  closable
                  @close="handleClose(scope.attr_id,scope.row)"
                >{{item}}</el-tag>

                <!-- 添加input输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small"
                 @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column property="attr_name" label="参数名称"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row.attr_id)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamById(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-row>
            <el-col>
              <el-button
                :disabled="isDisabled"
                class="addCate"
                type="primary"
                @click="showAddParamDialog"
              >添加静态属性</el-button>
            </el-col>
          </el-row>
        <!-- 静态属性列表 -->
          <el-table
            :data="onlyDataTable"
            ref="singleTable"
            highlight-current-row
            style="width: 100%"
          >
             <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 渲染tag标签 -->
                <el-tag
                  v-for="(item,i) in scope.row.attr_vals"
                  :key="i"
                  class="el-tag"
                  closable
                  @close="handleClose(scope.attr_id,scope.row)"
                >{{item}}</el-tag>

                <!-- 添加input输入框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                ></el-input>
                <el-button v-else class="button-new-tag" size="small"
                 @click="showInput(scope.row)">+ New Tag</el-button>
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column property="attr_name" label="参数名称"></el-table-column>

            <el-table-column label="操作">
              <template slot-scope="scope">
                <!-- 修改按钮 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditParamDialog(scope.row.attr_id)"
                ></el-button>
                <!-- 删除按钮 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParamById(scope.row.attr_id)"
                ></el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加对话框  注意使用属性控制对话框的显示和隐藏 -->
    <!-- 静态和动态的都显示同一个对话框，使用计算属性  动态属性加：-->
    <el-dialog
      :title="'添加'+titleText"
      :visible.sync="addParamVisible"
      width="50%"
      @close="addParamClosed"
    >
      <!-- 添加用户的表单 -->
      <el-form
        :model="addParams"
        :rules="addParamRules"
        ref="addParamFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="属性名称" prop="paramname">
          <el-input v-model="addParams.paramname"></el-input>
        </el-form-item>
      </el-form>

      <!-- footer 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParamVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParamComfirm">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改参数 -->
    <el-dialog
      :title="'修改'+titleText"
      :visible.sync="editParamVisible"
      width="50%"
      @close="editParamClosed"
    >
      <!-- 添加用户的表单 -->
      <el-form
        :model="editParams"
        :rules="editParamRules"
        ref="editParamFormRef"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editParams.attr_name"></el-input>
        </el-form-item>
      </el-form>

      <!-- footer 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editParamVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParamComfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>

export default {
  // 定义数据
  data() {
    return {
      addParamRules: {
        paramname: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },
      editParamRules: {
        attr_name: [{ required: true, message: "请输入参数", trigger: "blur" }]
      },

      catelist: [],
      cateListProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectKeys: [],
      //   Tab的参数

      activeName: "only", //被激活的页签名称

      // 存储静态动态属性
      manyDataTable: [],
      onlyDataTable: [],
      addParamVisible: false,
      addParams: {
        paramname: ""
      },
      editParamVisible: false,
      editParams: {},
      inputVisible: false,
      inputValue: ''
    };
  },
  created() {
    this.getCateList();
  },
  // 定义方法
  methods: {
    //得到分类数据列表
    async getCateList() {
      var { data: res } = await this.$http.get("categories");
      if (res.status !== 200) {
        this.$message.error("获取商品分类列表失败！");
      }
      this.catelist = res.data;
    },
    //级联选择器发生变化时的处理函数
    async handleChange() {
      // 组件默认只能选择三级了，不用使用判断函数了

      // 控制只能选择三级分类
      // if(this.selectKeys.length!==3){
      //     this.selectKeys=[]
      //     return
      // }
      // // 说明是三级分类
      // console.log(this.selectKeys);

      //得到列表
      this.getParamsList();
    },
    handleTabClick() {
      console.log(this.activeName);
      this.getParamsList();
    },
    showAddParamDialog() {
      this.addParamVisible = true;
    },
    //获取属性分类列表
    async getParamsList() {
      var { data: res } = await this.$http.get(
        "categories/" + this.CateID + "/attributes",
        {
          params: { sel: this.activeName }
        }
      );
      if (res.status !== 200) {
        this.$message.error("获取商品分类列表失败！");
      }
      console.log("得到参数：");

      console.log(res.data);
      // 将每个数据转换成数组，但是要判断是否有数据
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        // 为了实现每行单独绑定自己的输入框，为每个数据添加一个属性
      item.inputVisible=false
      // 文本框输入的值
      item.inputValue=""
      });

      // 根据选择的是动态参数还是静态属性设置不同的值
      if (this.activeName == "many") {
        this.manyDataTable = res.data;
      } else {
        this.onlyDataTable = res.data;
      }
    },
    addParamComfirm() {
      //添加用户表单预校验

      this.$refs.addParamFormRef.validate(async valid => {
        if (!valid) return;
        // console.log(valid); //为何不会正确打印？因为邮箱校验部分函数写错了。。。
        //成功之后可以发起添加用户请求
        const { data: res } = await this.$http.post(
          `categories/${this.CateID}/attributes`,
          {
            attr_name: this.addParams.paramname,
            attr_sel: this.activeName
          }
        );
        // console.log(res);
        if (res.meta.status !== 201) {
          this.$message.error("添加参数失败！");
        }

        this.$message.success("添加参数成功！");
        // 隐藏添加用户的对话框
        this.addParamVisible = false;
        // 重新获取用户列表数据
        this.getParamsList();
      });
    },
    //监听到对话框关闭的时候重置添加用户表单
    addParamClosed() {
      this.$refs.addParamFormRef.resetFields();
    },
    editParamClosed() {
      this.$refs.editParamFormRef.resetFields();
    },
    editParamComfirm() {
      //对表单信息预校验,所以要先得到表单
      console.log("succsess");

      this.$refs.editParamFormRef.validate(async valid => {
        if (!valid) return;
        //校验成功，更改数据,从之前动态绑定的editUserForm中获取,注意put 方式
        const { data: res } = await this.$http.put(
          `categories/${this.CateID}/attributes/${this.editParams.attr_id}`,
          {
            attr_name: this.editParams.attr_name,
            attr_sel: this.activeName
          }
        );
        //判断是否请求数据成功
        if (res.meta.status != 200) {
          return this.$message.error("修改用户信息失败！");
        }
        //隐藏对话框
        this.editParamVisible = false;
        //更新列表
        this.getParamsList();
        //提示成功信息
        this.$message.success("修改用户信息成功！");
      });
    },
     //修改用户数据，要得到当前的选择的用户，需要传递参数id，此时仅仅是显示对话框
    async showEditParamDialog(attrId) {
      console.log(attrId);
      //显示对话框
      this.editParamVisible = true;
      // 根据id查询用户信息
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.CateID}/attributes/${attrId}`,
        {
          params: { attr_sel: this.activeName }
        }
      );

      console.log(res);

      if (res.meta.status != 200) {
        return this.$message.error("查询用户信息失败！");
      }
      this.editParams = res.data;
    },
    async removeParamById(attrId) {
      const confirmRes = await this.$confirm(
        "此操作将永久删除该参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      if (confirmRes !== "confirm") {
        return this.$message.info("已取消删除！");
      }
      //调用API从数据库删除数据
      const { data: res } = await this.$http.delete(
        `categories/${this.CateID}/attributes/${attrId}`
      );

      console.log(res);

      //记得判断状态
      if (res.meta.status !== 200) {
        return this.$message.error("删除参数失败！");
      }

      this.$message.success("删除参数成功！");
      this.getParamsList();
    },
  //  输入标签名称
    showInput(row) {
        row.inputVisible = true;
      // 让文本框自动获得焦点
      // $nextTick 方法的作用，就是当页面上元素被重新渲染之后，才会指定回调函数中的代码
        this.$nextTick(()=> {
          this.$refs.saveTagInput.$refs.input.focus();
        });
      },
    // 确认添加tag
      handleInputConfirm(row) {
        // 判断是否有数据输入
        if(row.inputValue.trim().length==0){
          row.inputValue=""
          row.inputVisible=false
          return;
        }
        // 否则保存数据        
        row.attr_vals.push(row.inputValue.trim());        
        row.inputVisible = false;
        row.inputValue = '';

        // 发起请求保存数据
        this.saveParam(row)
          
      },
    // 删除标签函数，获得索引和数据
    handleClose(i,row) {
      row.attr_vals.splice(i,1)
      // 删除也要发起请求保存数据
      this.saveParam(row)      
    },
    async saveParam(row){
      const {data:res}=await this.$http.put(`categories/${this.CateID}/attributes/${row.attr_id}`,{
           attr_name:row.attr_name,
           attr_sel:row.attr_sel,
           attr_vals:row.attr_vals.join(" ")
        })       
        if (res.meta.status !== 200) {
        return this.$message.error('修改参数项失败！')
      }

      this.$message.success('修改参数项成功！')
    },
  },

  //使用计算属性保存状态，实现关联
  computed: {
    isDisabled() {
      return this.selectKeys.length !== 3;
    },
    //得到分类ID 方便查询分类列表
    CateID() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2];
      }
      return null;
    },
    titleText() {
      return this.activeName == "many" ? "动态参数" : "静态属性";
    }
  }
};
</script>
 <style lang="less" scoped>
.box-card {
  margin-top: 10px;
}
.row-opt {
  margin: 15px 0;
}
.el-tag {
  margin: 10px;
}
</style>