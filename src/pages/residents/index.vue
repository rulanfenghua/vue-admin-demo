<template>
  <div class="residents-container">
    <div class="filter-container">
      <div class="name-picker">
        <el-input v-model="name" placeholder="输入姓名查询"></el-input>
      </div>
      <div class="idcard-picker">
        <el-input v-model="idcard" placeholder="输入身份证号查询"></el-input>
      </div>
      <div class="date-picker">
        <el-date-picker
          v-model="date"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :picker-options="pickerOptions"
        >
        </el-date-picker>
      </div>
      <el-button @click="init"></el-button>
    </div>
    <div class="table-container" v-loading="loading"
      element-loading-text="正在加载居民列表"
      element-loading-spinner="el-icon-loading"
    >
      <el-table
        v-loading="listLoading"
        :data="res_getPersonList"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" align="center" width="">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination :current-page="page" :page-sizes="[10,20,30]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange"/>
    </div>
  </div>
</template>

<script>
import {getPersonList} from '@/api/admin'

export default {
  name: 'residents',
  data() {
    return {
      res_getPersonList: [],

      name: '',
      idcard: '',
      date: '',

      page: 1,
      limit: 20,
      total: 0,

      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },

      loading: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // let data = {
      //   'pageNum': this.page,
      //   'pageSize': this.limit,
      //   'condition': {
      //     'name': this.name,
      //     'idcard': this.idcard,
      //     'date': this.date
      //   }
      // }
      this.loading = true
      getPersonList().then(response => {
        this.res_getPersonList = response.data
      }).catch(error => {
        this.loading = false
        console.log(error)
      }).then(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
