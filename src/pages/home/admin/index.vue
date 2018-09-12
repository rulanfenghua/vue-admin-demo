<template>
  <div class="admin">
    <div class="panel-container">
      <div class="panel-item">
        <div class="button"></div>
        <ul class="count">
          <li class="amount">{{res_index.amount}}</li>
          <li class="text">人员总数</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button"></div>
        <ul class="count">
          <li class="amount">{{res_index.day}}</li>
          <li class="text">日检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button"></div>
        <ul class="count">
          <li class="amount">{{res_index.week}}</li>
          <li class="text">周检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button"></div>
        <ul class="count">
          <li class="amount">{{res_index.mouth}}</li>
          <li class="text">月检查量</li>
        </ul>
      </div>
    </div>
    <div class="table-container" :style="{height: clientHeight+'px'}">
    <div class="table-top">
      <div class="container-line-week" ref="week"></div>
      <div class="container-bar-last" ref="last"></div>
    </div>
    <div class="table-bottom">
      <div class="container-table-day">
        <el-table
          :data="res_getDay"
          border
          fit
          highlight-current-row
          :style="{width: tableWidth+'px'}"
          :max-height="tableHeight">
          <el-table-column
            fixed
            label="诊断时间"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.checkDate }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            width="75">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="身份证号"
            align="center"
            width="175">
            <template slot-scope="scope">
              <span>{{ scope.row.idcard }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            align="center"
            width="75">
            <template slot-scope="scope">
              <span>{{ scope.row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="年龄"
            align="center"
            width="75">
            <template slot-scope="scope">
              <span>{{ scope.row.age }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="卡类型"
            align="center"
            width="75">
            <template slot-scope="scope">
              <span>{{ scope.row.idType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="电话"
            width="140">
            <template slot-scope="scope">
              <span>{{ scope.row.tel }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="家庭住址"
            width="240">
            <template slot-scope="scope">
              <span>{{ scope.row.homeAddr }}</span>
            </template>
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            align="center"
            width="120">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="seach(scope.row.id, scope.row.checkDate)"
                type="text"
                size="small">
                查看检查报告
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="container-pie-gender" ref="gender"></div>
    </div>
    </div>
    <!-- 引入打印组件 -->
    <print ref="print"></print>
  </div>
</template>

<script>
import {index, getWeek, getDay, getGender, getLast} from '@/api/admin'
import print from '@/components/residentDetails/print'
import echarts from 'echarts'

export default {
  name: 'admin',
  data() {
    return {
      chart: null,
      res_index: {},
      res_getDay: []
    }
  },
  components: {
    print
  },
  computed: {
    clientHeight() {
      return (document.documentElement.clientHeight || document.body.clientHeight) - 175
    },
    tableHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 175) / 2 - 14
    },
    tableWidth() {
      return (document.documentElement.clientWidth || document.body.clientWidth) / 3 * 2
    }
  },
  mounted() {
    this.init()
    this.initChart()
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    init() {
      index().then(response => {
        this.res_index = response.data
      })
      getDay().then(response => {
        this.res_getDay = response.data
      })
    },
    initChart() {
      getWeek().then(response => {
        this._initChart(this.$refs.week, {
          title: {
            text: '一周检查量变化趋势'
          },
          tooltip: {},
          legend: {
            data: ['检查量']
          },
          xAxis: {
            data: this._toArray_key(response.data)
          },
          yAxis: {},
          series: [{
            name: '检查量',
            type: 'line',
            data: this._toArray_value(response.data)
          }]
        })
      })
      getLast().then(response => {
        this._initChart(this.$refs.last, {
          title: {
            text: '各站点末次上传统计'
          },
          tooltip: {},
          legend: {
            data: ['上传数量']
          },
          xAxis: {
            data: ['站点1', '站点2', '站点3', '站点4', '站点5', '站点6', '站点7', '站点8', '站点9']
          },
          yAxis: {},
          series: [{
            name: '上传数量',
            type: 'bar',
            data: this._toArray_value(response.data)
          }]
        })
      })
      getGender().then(response => {
        this._initChart(this.$refs.gender, {
          title: {
            text: '居民男女比例'
          },
          tooltip: {},
          legend: {
            data: ['男性居民', '女性居民']
          },
          series: [{
            name: '居民男女比例',
            type: 'pie',
            data: [
              {value: response.data.Woman, name: '女性居民'},
              {value: response.data.Man, name: '男性居民'}
            ]
          }]
        })
      })
    },
    // 打印 调用子组件的方法
    seach(id, checkDate) {
      this.$nextTick(() => {
        this.$refs.print.getPrinting(id, checkDate)
        this.$refs.print._toggle()
      })
    },
    _initChart(element, expectedData) {
      this.chart = echarts.init(element)
      this.chart.setOption(expectedData)
    },
    _toArray_key(obj) {
      let expectedArray = []
      for (var key in obj) {
        expectedArray.push(key)
      }
      return expectedArray
    },
    _toArray_value(obj) {
      let expectedArray = []
      for (var key in obj) {
        expectedArray.push(obj[key])
      }
      return expectedArray
    }
  }
}
</script>

<style scoped lang="scss">
.admin{
  background-color: #e6e1e1;
  .panel-container {
    width: 100%;
    display: flex;
    .panel-item {
      margin-right: 7px;
      margin-top: 7px;
      background-color: #fff;
      flex: 1;
      border-radius: 1px;
      box-shadow: 0 0 5px #b59f9f;
      &:first-child {
        margin-left: 7px;
      }
    }
  }
  .table-container {
    width: 100%;
    display: flex;
    flex-flow: column;
    .container-line-week,.container-bar-last,.container-table-day,.container-pie-gender {
      margin-top: 7px;
      margin-right: 7px;
      border-radius: 1px;
      box-shadow: 0 0 1px #b59f9f;
    }
    .table-top {
      flex: 1;
      display: flex;
      width: 100%;
      .container-line-week {
        background-color: #fff;
        flex: 1;
        margin-left: 7px;
      }
      .container-bar-last {
        background-color: #fff;
        flex: 1;
      }
    }
    .table-bottom {
      flex: 1;
      display: flex;
      width: 100%;
      .container-table-day {
        background-color: #fff;
        flex: 2;
        margin-left: 7px;
        margin-bottom: 7px;
      }
      .container-pie-gender {
        background-color: #fff;
        flex: 1;
        margin-bottom: 7px;
      }
    }
  }
}
</style>
