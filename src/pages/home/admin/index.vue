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
          style="width: 100%"
          max-height="100%">
          <el-table-column
            fixed
            prop="checkDate"
            label="诊断时间"
            width="">
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="">
          </el-table-column>
          <el-table-column
            prop="idcard"
            label="身份证号"
            width="">
          </el-table-column>
          <el-table-column
            prop="gender"
            label="性别"
            width="">
          </el-table-column>
          <el-table-column
            prop="age"
            label="年龄"
            width="">
          </el-table-column>
          <el-table-column
            prop="idType"
            label="卡类型"
            width="">
          </el-table-column>
          <el-table-column
            prop="tel"
            label="电话"
            width="">
          </el-table-column>
          <el-table-column
            prop="homeAddr"
            label="家庭住址"
            width="">
          </el-table-column>
        </el-table>
      </div>
      <div class="container-pie-gender" ref="gender"></div>
    </div>
    </div>
  </div>
</template>

<script>
import {index, getWeek, getDay, getGender, getLast} from '@/api/admin'
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
  computed: {
    clientHeight() {
      return (document.documentElement.clientHeight || document.body.clientHeight) - 146
    }
  },
  mounted() {
    this.init()
    this.initChart(this.$refs.week, {
      title: {
        text: '一周检查量变化趋势'
      },
      tooltip: {},
      legend: {
        data: ['检查量']
      },
      xAxis: {
        data: this._toArray_key(this.res_getWeek)
      },
      yAxis: {},
      series: [{
        name: '检查量',
        type: 'line',
        data: this._toArray_value(this.res_getWeek)
      }]
    })
    this.initChart(this.$refs.last, {
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
        data: this._toArray_value(this.res_getLast)
      }]
    })
    this.initChart(this.$refs.gender, {
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
          {value: this.res_getGender.Woman, name: '女性居民'},
          {value: this.res_getGender.Man, name: '男性居民'}
        ]
      }]
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    async init() {
      this.res_index = await index()
      this.res_getWeek = await getWeek()
      this.res_getDay = await getDay()
      this.res_getGender = await getGender()
      this.res_getLast = await getLast()
      console.log(this.res_getWeek)
    },
    initChart(element, expectedData) {
      this.chart = echarts.init(element)
      this.chart.setOption(expectedData)
    },
    _toArray_key(obj) {
      let expectedArray = []
      for (var key in obj) {
        expectedArray.push(key)
        console.log(key)
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
  .panel-container {
    width: 100%;
    display: flex;
    .panel-item {
      flex: 1;
    }
  }
  .table-container {
    width: 100%;
    display: flex;
    flex-flow: column;
    .table-top {
      flex: 1;
      display: flex;
      width: 100%;
      .container-line-week {
        flex: 1;
      }
      .container-bar-last {
        flex: 1;
      }
    }
    .table-bottom {
      flex: 1;
      display: flex;
      width: 100%;
      .container-table-day {
        flex: 1;
      }
      .container-pie-gender {
        flex: 1;
      }
    }
  }
}
</style>
