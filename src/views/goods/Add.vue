<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加用户</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card class="box-card" shadow="never">
      <el-alert title="添加商品属性" type="info" :closable="false" center show-icon></el-alert>
      <!-- 激活的是数字 -->
      <el-steps :space="200" :active="activeIndex-0" finish-status="success" align-center>
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <!-- 标签页中是Form表单，使用表单元素包裹 -->
      <el-form ref="addFormRef" :model="addForm" label-width="80px" :rules="addRules">
        <el-tabs
          :tab-position="'left'"
          v-model="activeIndex"
          :before-leave="beforeLeaveTab"
          @tab-click="tabClicked"
        >
          <!-- 添加tab点击函数 -->
          <el-tab-pane label="基本信息" name="0">
            <!-- 第一个面板 -->
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 选择分类的级联框  需要配置属性 即选择的id value children 以及选择的keys数组-->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateListProps"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <!-- 第二个面板 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <el-form-item :label="item.attr_name" v-for="item in manyDataTable" :key="item.attr_id">
              <el-checkbox-group v-model="item.attr_vals">
                <!-- 同样适用for 循环渲染 -->
                <el-checkbox :label="cb" v-for="(cb,i) in item.attr_vals" :key="i" border></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品属性面板 -->
          <el-tab-pane label="商品属性" name="2">
            <el-form-item :label="item.attr_name" v-for="item in onlyDataTable" :key="item.attr_id">
              <el-input v-model="item.attr_name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <!-- 商品图片上传  -->
          <el-tab-pane label="商品图片" name="3">
            <!-- action表示的是服务器的地址 -->
            <el-upload
              action="http://119.23.53.78:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
              <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑 -->
            <quill-editor            
              v-model="addForm.goods_introduce"               
            />
            <!-- 添加提交按钮 -->
            <el-button type="primary" @click="add">添加商品</el-button>
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import _ from "lodash"
export default {
  data() {
    return {
      activeIndex: 0,

      addRules: {
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" }
           
        ],
        goods_price: [
          { required: true, message: "请输入密码", trigger: "blur" }          
        ],
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" }
        ],
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" }
        ]
         
      },
      catelist: [],
      cateListProps: {
        value: "cat_id",
        label: "cat_name",
        children: "children"
      },
      selectKeys: [],
      selectValue: "",
      addForm: {
        name: "",
        goods_name: "",
        goods_price: 1,
        goods_number:1,
        goods_weight: 1,
        goods_cat: [],
        pics: [],
        goods_introduce:"",
        attrs:[]

      },
      manyDataTable: [],
      onlyDataTable: [],
      //   设置图片上传的headers
      headersObj: {
        Authorization: window.sessionStorage.getItem("token")
      }
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //得到分类数据列表
    async getCateList() {
      var { data: res } = await this.$http.get("categories");
      if (res.status !== 200) {
        this.$message.error("获取商品分类列表失败！");
      }
      this.catelist = res.data;
    },
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
    //  阻止标签页随意切换
    beforeLeaveTab(oldTabName) {
      // 只有当前的标签页是0 ，即第一个的时候且选择了三级分类时才可到下一下面板
      if (oldTabName !== "0" && this.addForm.goods_cat.length !== 3) {
        return false;
      }
    },
    tabClicked() {
      // 点击标签页是获得商品参数列表

      //   console.log(this.activeIndex);
      if (this.activeIndex == "1" || this.activeIndex == "2") {
        this.getParamsList();
      }
      this.getParamsList();
    },
    //获取属性分类列表
    async getParamsList() {
      var { data: res } = await this.$http.get(
        "categories/" + this.CateID + "/attributes",
        {
          // 减少请求次数，根据选择的面板id自定义修改
          params: { sel: this.activeIndex == 1 ? "many" : "only" }
        }
      );
      if (res.meta.status !== 200) {
        this.$message.error("获取动态参数列表失败！");
      }
      console.log("获取动态参数列表");

      console.log(res.data);

      // 将每个数据转换成数组，但是要判断是否有数据
      res.data.forEach(item => {
        item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];
        // 控制文本框的显示与隐藏
        // 为了实现每行单独绑定自己的输入框，为每个数据添加一个属性
        item.inputVisible = false;
        // 文本框输入的值
        item.inputValue = "";
      });
      console.log("tab name" + this.activeIndex);

      // 根据选择的是动态参数还是静态属性设置不同的值
      if (this.activeIndex == "1") {
        this.manyDataTable = res.data;
      }
      if (this.activeIndex == "2") {
        this.onlyDataTable = res.data;
      }
    },
    async handleRemove(file) {
      // 1.获取当前的图片路径
      // 2.找到在数组中的索引值
      // 3. 使用spice方式删除
      console.log(file);
      const picinfo = file.response.data.tmp_path;
      const picIndex = this.addForm.pics.indexOf(picinfo);
      this.addForm.pics.splice(picIndex, 1);
      console.log(this.addForm.pics);
    },
    handlePreview(file) {
      console.log(file);
    },
    handleSuccess(response) {
      const temp = { pic: response.data.tmp_path };
      this.addForm.pics.push(temp);
      console.log(this.addForm.pics);
    },
    add(){
        // 首先进行表单预校验
        this.$refs.addFormRef.validate(async valid => {
        if (!valid) return this.$message.error('请填写必要的表单项！');
        // 添加商品的业务逻辑
        // 首先处理goods_cat参数，要求是一个字符串，但是我们的数据是一个数组，而且级联选择框要求绑定的就是一个数组
        // 然而改变数组为字符串会报错，因此使用深拷贝一个addForm 对象
        // 使用loadhash 的deepcopy函数
        const form= _.cloneDeep(this.addForm)
        form.goods_cat=form.goods_cat.join(',')
        // 处理动态参数
        this.manyDataTable.forEach(item => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(' ')
          }
          this.addForm.attrs.push(newInfo)
        })
        // 处理静态属性
        this.onlyDataTable.forEach(item => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
          this.addForm.attrs.push(newInfo)
        })
        form.attrs = this.addForm.attrs
        console.log(form)
         
       // 发起请求添加商品
        // 商品的名称，必须是唯一的
        const { data: res } = await this.$http.post('goods', form)
            console.log("hhhhh:");
            console.log(res);
            
            
        if (res.meta.status !== 201) {
          return this.$message.error('添加商品失败！')
        }

        this.$message.success('添加商品成功！')
        this.$router.push('/goods')
      
    })
    }
  },
  computed: {
    //得到分类ID 方便查询分类列表
    CateID() {
      if (this.selectKeys.length === 3) {
        return this.selectKeys[2];
      }
      return null;
    }
  }
};
</script>
<style lang="less" scoped>
 
</style>