<template>
  <div>
    <!--头部面包屑导航栏 -->

    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card">
      <!-- 2.定义一个div 放图表 -->
      <div id="main" style="width:800px;height:500px"></div>
    </el-card>
  </div>
</template>

<script>
// 1.导入echart 组件
import echarts from "echarts"
import _ from 'lodash'
export default {
    data(){
        return{
        options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
        }
    },
     //   // 此时，页面上的元素，已经被渲染完毕了！
 async mounted(){
    // 3. 初始化echart
    var myChart= echarts.init(document.getElementById('main'))
     
     const {data:res}=await this.$http.get("reports/type/1")
     var data=_.merge(res.data,this.options)
     console.log("shuju");
     console.log(res);
     
     
     
    // 4.使用数据
    myChart.setOption(data)

},
    
}
</script>
<style lang="less" scoped>
</style>