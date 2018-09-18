<template>
  <div class="admin">
    <div class="panel-container">
      <div class="panel-item">
        <div class="button">
          <i class="icon-user-plus"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.AMOUNT}}</li>
          <li class="text">人员总数</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button">
          <i class="icon-paragraph-left"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.DAY}}</li>
          <li class="text">日检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button">
          <i class="icon-indent-increase"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.WEEK}}</li>
          <li class="text">周检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button">
          <i class="icon-table2"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.MOUTH}}</li>
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
              <span>{{ scope.row.createDate | formatTime }}</span>
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
              <span>{{ scope.row.idCard }}</span>
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
            align="center"
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
                @click.native.prevent="seach(scope.row.id, scope.row.createDate)"
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
        console.log('首页数据————————admin')
        console.log(response)
        this.res_index = response.data
      })
      getDay().then(response => {
        console.log('表格数据————————admin')
        console.log(response)
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
            data: this._toArray_key_supper(response.data)
          },
          yAxis: {},
          series: [{
            name: '检查量',
            type: 'line',
            data: this._toArray_value_supper(response.data),
            color: ['#6fa7e8']
          }]
        })
      })
      getLast().then(response => {
        console.log('各站点末次————————admin')
        console.log(response)
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
            data: this._toArray_value_supper(response.data),
            color: function (params) {
              var colorList = ['#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8', '#6fa7e8']
              return colorList[params.dataIndex]
            }
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
              {value: response.data.WOMAN, name: '女性居民'},
              {value: response.data.MAN, name: '男性居民'}
            ],
            color: ['#6fa7e8', '#2f4554']
          }]
        })
      })
    },
    // 打印 调用子组件的方法
    seach(id, checkDate) {
      console.log('调用子组件————————home/admin')
      console.log('id: ' + id + '  checkDate: ' + checkDate)
      this.$nextTick(() => {
        console.log('调用子组件————————home/admin')
        console.log('id: ' + id + '  checkDate: ' + checkDate)
        this.$refs.print.getPrinting(id, checkDate)
        // this.$refs.print._toggle()
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
    },
    _toArray_key_supper(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.CREATETIME)
      })
      console.log(expectedArray)
      return expectedArray
    },
    _toArray_value_supper(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.COUNT)
      })
      console.log(expectedArray)
      return expectedArray
    },
    _toArray_key_supper_supper(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.STATION_NAME)
      })
      console.log(expectedArray)
      return expectedArray
    },
    _toArray_value_supper_supper(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.NUM)
      })
      console.log(expectedArray)
      return expectedArray
    }
  }
}
</script>

<style scoped lang="scss">
.admin{
  background-color: #e6e1e1;
  overflow: hidden;
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
      border-color: rgba(0, 0, 0, .05);
      cursor: pointer;
      &:first-child {
        margin-left: 7px;
      }
      &:hover {
        .button {
          background-color: #143965;
          i {
            color: #b59f9f;
          }
        }
      }
      .button {
        width: 50%;
        height: 100%;
        background-color: #347bcd;
        display: inline-block;
        text-align: center;
        padding-top: 9px;
        i {
          color: #fff;
          font-size: 24px;
        }
      }
      .count {
        display: inline-block;
        vertical-align: top;
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
