<template>
  <div class="residents-admin">
    <div class="filter-container">
      输入查询条件查询：
      <div class="name-picker">

        <el-input v-model="name" placeholder="输入姓名查询"></el-input>
      </div>
      <!-- <div class="idcard-picker">
        <el-input v-model="idcard" placeholder="输入身份证号查询"></el-input>
      </div>
      <div class="station-picker">
        <el-input v-model="station" placeholder="输入站点查询"></el-input>
      </div> -->
      <el-button @click="init" type="primary">点击查询</el-button>
    </div>
    <!-- <div class="date-container">
      选择日期查询：
      <div class="date-picker">
        <el-date-picker v-model="date" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <el-button @click="init" type="primary">点击查询</el-button>
    </div> -->
    <div class="table-container" v-loading="loading" element-loading-text="正在加载居民列表" element-loading-spinner="el-icon-loading">
      <el-table :data="res_getPersonList" border fit highlight-current-row style="width: 100%" :max-height="tableHeight">
        <el-table-column type="index" align="center">
        </el-table-column>
        <el-table-column label="姓名" align="center" width="95">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份证号" align="center" width="212">
          <template slot-scope="scope">
            <span>{{ scope.row.idCard }}</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column label="年龄" align="center" width="80">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡类型" align="center" width="95">
          <template slot-scope="scope">
            <span>{{ scope.row.idType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" align="center" width="160">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="家庭住址" width="240">
          <template slot-scope="scope">
            <span>{{ scope.row.homeAddr }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination :current-page="page" :page-sizes="[10,20,30]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
  </div>
</template>

<script>
import {list} from '@/api/systemSetting'

export default {
  name: 'admin',
  computed: {
    tableHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 345)
    }
  },
  data() {
    return {
      res_getPersonList: [],

      name: '',

      page: 1,
      limit: 20,
      total: 0,

      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      this.loading = true
      list(this.page, this.limit, this.name).then(response => {
        console.log('居民列表————————systemSetting')
        console.log(response)
        this.res_getPersonList = response.data.list
        this.total = response.data.total
      }).catch(error => {
        this.loading = false
        console.log(error)
      }).then(() => {
        this.loading = false
      })
    },
    handleSizeChange(value) {
      this.limit = value
      this.init()
    },
    handleCurrentChange(value) {
      this.page = value
      this.init()
    }
  }
}
</script>

<style scoped lang="scss">
</style>
