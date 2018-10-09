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
        <div class="container-line-week" ref="map"></div>
        <div class="container-bar-last" ref="week"></div>
      </div>
      <div class="table-bottom">
        <div class="container-map" ref="last"></div>
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
import {
  index,
  getWeek,
  getGender,
  getLast,
  getMap
} from '@/api/city'
// import { getMap } from '@/api/city'
import residentDetails from '@/components/residentDetails'
import echarts from 'echarts'
import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store/index.js'
import router from '@/router/index'

export default {
  name: 'super',
  data() {
    return {
      chart: null,
      mapChart: null, // 地图
      res_index: {},
      res_getDay: [],

      personalMess: [],
      personalData: {},

      id: '',

      state: '00' // 地图切换
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
  created() {
    axios.interceptors.response.use(
      response => {
        if (response.data.code === 101) {
          Message.warning({
            message: '登录超时，请重新登录'
          })
          store.commit('LOGIN_OUT')
          router.replace({
            path: '/login'
          })
        }
        return response
      }
    )
    this.init()
    this.initChart()
    this.initMapChart()
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
        console.log('首页数据————————super')
        console.log(response)
        this.res_index = response.data
      })
    },
    initChart() {
      getWeek(this.state).then(response => {
        console.log('一周趋势————————supper')
        console.log(this.state)
        console.log(response)
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
            right: 0,
            top: '5%'
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
            nameTextStyle: {
              fontWeight: 'bold'
            },
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
              }
              // fontWeight: 'bold'
            }
          },
          series: [{
            name: '检查量',
            type: 'line',
            data: this._toArray_value_super(response.data),
            color: ['#2f4554']
          }]
        })
      })
      getGender(this.state).then(response => {
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
                per: {}
              }
              // position: 'inner'
            },
            data: [{
              value: response.data.WOMAN,
              name: '女性居民'
            },
            {
              value: response.data.MAN,
              name: '男性居民'
            }
            ],
            color: ['#6fa7e8', '#2f4554']
          }]
        })
      })
    },
    initMapChart() {
      getMap().then(response => {
        console.log('地图数据————————super')
        console.log(response)
        this._initMapChart(this.$refs.map, {
          color: ['#3f51b5'],
          title: {
            text: '邢台市区域检查量概览'
          },
          tooltip: {
            trigger: 'item',
            transitionDuration: 0.2
          },
          legend: {
            orient: 'vertical',
            top: '37%',
            left: 'right',
            data: ['邢台市区域检查量']
          },
          visualMap: {
            left: 'right',
            top: '50%',
            max: 90,
            min: 0,
            splitNumber: 3,
            // calculable: false,
            color: ['#3f51b5', '#4575b4', '#74add1']
          },
          toolbox: {
            show: true,
            // orient: 'vertical',
            left: 'left',
            bottom: 13,
            feature: {
              dataView: {readOnly: false}
            }
          },
          series: [{
            name: '邢台市区域检查量',
            type: 'map',
            roam: true,
            selectedMode: 'single',
            map: '邢台',
            emphasis: {
              label: {
                show: true
              }
            },
            label: {
              show: true,
              color: '#fff'
            },
            data: [{
              'name': '桥东区',
              'value': response.data.QIAODONG
            },
            {
              'name': '桥西区',
              'value': response.data.QIAOXI
            }]
          }]
        })
      })
      getLast().then(response => {
        console.log('各站点————————supper')
        console.log(response)
        this._initChart(this.$refs.last, {
          color: ['#6fa7e8'],
          title: {
            text: '各站点上传统计',
            left: '30%'
          },
          grid: {
            right: 170,
            left: '7%'
          },
          tooltip: {},
          legend: {
            // data: ['上传数量']
          },
          visualMap: [
            {
              right: 27,
              top: '5%',
              bottom: 0,
              align: 'left',
              itemSymbol: 'pin',
              itemGap: 7,
              // itemHeight: 10,
              categories: this._toArray_key_super_super(response.data),
              color: ['#6fa7e8', '#FFBC75', '#AAFFFA', '#999EFF', '#5c70ad', '#FDEC6D', '#44A9A8', '#8bc34a', '#ffc107', '#795548', '#9e9e9e', '#607d8b'].reverse(),
              outOfRange: {}
            }
          ],
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
            nameTextStyle: {
              fontWeight: 'bold'
            },
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
              }
              // fontWeight: 'bold'
            }
          },
          series: [{
            // name: '上传数量',
            type: 'bar',
            data: this._toArray_value_super_super(response.data),
            color: function (params) {
              var colorList = ['#6fa7e8', '#FFBC75', '#AAFFFA', '#999EFF', '#5c70ad', '#FDEC6D', '#44A9A8', '#8bc34a', '#ffc107',
                '#795548', '#9e9e9e', '#607d8b']
              return colorList[params.dataIndex]
            }
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
        this.personalData = response.data
      })
      this.$http.get('/resident/getPersonalDateList' + '/' + id).then(response => {
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
    _initMapChart(element, expectedData) {
      this.mapChart = echarts.init(element)
      this.mapChart.showLoading()
      axios.get('/static/xingtai.json').then(response => {
        this.mapChart.hideLoading()
        echarts.registerMap('邢台', response.data)
        this.mapChart.setOption(expectedData)
      })
      this.mapChart.on('click', params => {
        console.log('点击地图数据————————super')
        console.log(params)
        if (this._params(params.name) !== this.state) {
          this.state = this._params(params.name)
          this.initChart()
        } else if (this._params(params.name) === this.state) {
          this.state = '00'
          this.initChart()
        }
      })
    },
    _params(name) {
      switch (name) {
      case '桥西区': return '0'
      case '桥东区': return '1'
      }
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
        var subIndex = obj.STATIONNAME.indexOf('卫生')
        expectedArray.push(obj.STATIONNAME.slice(0, subIndex))
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
  .admin {
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
            opacity: 0.7 !important;

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
            background-color: rgb(30, 159, 255);
          }

          &.day {
            background-color: rgb(0, 150, 136);
          }

          &.week {
            background-color: rgb(255, 87, 34);
          }

          &.mouth {
            background-color: rgb(255, 184, 0);
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
          line-height: 20px;
          font-family: 'simHei', serif;
          .text {
            font-weight: bold;
          }
        }
      }
    }

    .table-container {
      width: 100%;
      display: flex;
      flex-flow: column;

      .container-line-week,
      .container-bar-last,
      .container-map,
      .container-pie-gender {
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

        // .container-table-day {
        //   background-color: #fff;
        //   flex: 2;
        //   margin-left: 7px;
        //   margin-bottom: 7px;
        // }

        .container-map {
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
