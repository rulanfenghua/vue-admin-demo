<template>
  <div class="admin">
    <div class="panel-container">
      <div class="panel-item">
        <div class="button amount">
          <i class="icon-user-plus"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.AMOUNT}}</li>
          <li class="text">人员总数</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button day">
          <i class="icon-paragraph-left"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.DAY}}</li>
          <li class="text">日检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button week">
          <i class="icon-indent-increase"></i>
        </div>
        <ul class="count">
          <li class="amount">{{res_index.WEEK}}</li>
          <li class="text">周检查量</li>
        </ul>
      </div>
      <div class="panel-item">
        <div class="button mouth">
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
          size="small"
          stripe
          highlight-current-row
          :default-sort = "{prop: 'createDate', order: 'descending'}"
          :style="{width: tableWidth+'px'}"
          :max-height="tableHeight">
          <el-table-column
            fixed
            sortable
            prop="createDate"
            label="创建时间"
            width="105">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="姓名"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="身份证号"
            align="center"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.idCard }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="性别"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="年龄"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.age }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="卡类型"
            align="center"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.idType }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="电话"
            align="center"
            width="165">
            <template slot-scope="scope">
              <span>{{ scope.row.tel }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="家庭住址"
            width="265">
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
                @click.native.prevent="initMess(scope.row.id, scope.row.idCard)"
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
    <!-- <print ref="print"></print> -->
    <!-- 引入residentDetails组件 -->
    <resident-details :personalMess="personalMess" :id="id" :personalData="personalData" ref="resident"></resident-details>
  </div>
</template>

<script>
import {index, getWeek, getDay, getGender, getLast} from '@/api/admin'
import residentDetails from '@/components/residentDetails'
// import {getPersonalMess, getPersonalData} from '@/api/resident'
import echarts from 'echarts'

export default {
  name: 'admin',
  data() {
    return {
      chart: null,
      res_index: {},
      res_getDay: [],

      personalMess: [],
      personalData: {},

      id: ''
    }
  },
  components: {
    residentDetails
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
          color: ['#6fa7e8'],
          title: {
            text: '一周检查量变化趋势',
            left: '30%'
          },
          tooltip: {
            trigger: 'axis'
            // axisPointer: {
            //   type: 'cross'
            // }
          },
          legend: {
            data: ['检查量'],
            show: false
          },
          xAxis: {
            data: this._toArray_key_super(response.data),
            axisTick: {
              alignWithLabel: true
            },
            axisLabel: {
              // fontWeight: 'bold'
            }
          },
          yAxis: {
            name: '检查量',
            type: 'value',
            axisLine: {
              lineStyle: {
                color: '#193a70'
              }
            },
            axisLabel: {
              formatter(value, index) {
                if (value % 1 === 0) {
                  return value
                }
              },
              fontWeight: 'bold'
            }
          },
          series: [{
            // name: '检查量',
            type: 'line',
            data: this._toArray_value_super(response.data),
            color: ['#2f4554']
          }]
        })
      })
      getLast().then(response => {
        console.log('各站点————————admin')
        console.log(response)
        this._initChart(this.$refs.last, {
          color: ['#6fa7e8'],
          title: {
            text: '各站点上传统计',
            left: '30%'
          },
          tooltip: {},
          legend: {
            // data: ['上传数量']
          },
          xAxis: {
            data: this._toArray_key_super_super(response.data),
            axisLabel: {
              rotate: -60,
              fontWeight: 'bold'
            }
            // name: '服务站'
          },
          yAxis: {
            name: '上传数量',
            axisLine: {
              lineStyle: {
                color: '#193a70'
              }
            },
            axisLabel: {
              formatter(value, index) {
                if (value % 1 === 0) {
                  return value
                }
              },
              fontWeight: 'bold'
            }
          },
          series: [{
            // name: '上传数量',
            type: 'bar',
            data: this._toArray_value_super_super(response.data),
            color: function (params) {
              var colorList = ['#6fa7e8', '#FFBC75', '#AAFFFA', '#999EFF', '#5c70ad', '#FDEC6D', '#44A9A8', '#8bc34a', '#ffc107',
                '#795548', '#9e9e9e', '#607d8b']
              // var colorList = ['#6fa7e8', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#795548', '#9e9e9e', '#607d8b', '', '', '', '', '', '', '']
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
            data: ['男性居民', '女性居民'],
            right: 0,
            orient: 'vertical',
            top: '15%'
          },
          series: [{
            name: '居民男女比例',
            type: 'pie',
            label: {
              formatter: '{b|{b}}:{per|{d}}%',
              // backgroundColor: '#eee',
              // borderColor: '#aaa',
              // borderWidth: 1,
              // borderRadius: 4,
              rich: {
                b: {
                  fontWeight: 'bold'
                  // fontSize: 14
                  // lineHeight: 33
                },
                per: {
                }
              }
              // position: 'inner'
            },
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
    // seach(id, checkDate) {
    //   console.log('调用子组件————————home/admin')
    //   console.log('id: ' + id + '  checkDate: ' + checkDate)
    //   this.$nextTick(() => {
    //     this.$refs.print.getPrinting(id, checkDate)
    //     // this.$refs.print._toggle()
    //   })
    // },
    initMess(id, idCard) {
      this.$http.get('/resident/getPersonalMess' + '/' + idCard).then(response => {
      // getPersonalData(this.idCard).then(response => {
        this.personalData = response.data
      })
      this.$http.get('/resident/getPersonalDateList' + '/' + id).then(response => {
      // getPersonalMess(this.id).then(response => {
        this.personalMess = response.data
        this.id = id
        this.$refs.resident._toggleResident()
        console.log('居民列表数据——————home/admin')
        console.log(response.data)
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
    _toArray_key_super(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.CREATETIME.slice(5))
      })
      return expectedArray
    },
    _toArray_value_super(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.COUNT)
      })
      return expectedArray
    },
    _toArray_key_super_super(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        var subIndex = obj.STATION_NAME.indexOf('卫生')
        expectedArray.push(obj.STATION_NAME.slice(0, subIndex))
      })
      return expectedArray
    },
    _toArray_value_super_super(arr) {
      let expectedArray = []
      arr.forEach(obj => {
        expectedArray.push(obj.NUM)
      })
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
      display: flex;
      cursor: pointer;
      &:first-child {
        margin-left: 7px;
      }
      &:hover {
        .button {
          opacity: 0.7!important;
          i {
            color: #b59f9f;
          }
        }
      }
      .button {
        flex: 1;
        height: 100%;
        background-color: #347bcd;
        display: inline-block;
        text-align: center;
        padding-top: 9px;
        &.amount {
          background-color: rgb(30,159,255);
        }
        &.day {
          background-color: rgb(0,150,136);
        }
        &.week {
          background-color: rgb(255,87,34);
        }
        &.mouth {
          background-color: rgb(255,184,0);
        }
        i {
          color: #fff;
          font-size: 24px;
        }
      }
      .count {
        flex: 1;
        height: 40px;
        display: inline-block;
        vertical-align: top;
        text-align: center;
        font-family: 'simHei',serif;
        line-height: 20px;
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
