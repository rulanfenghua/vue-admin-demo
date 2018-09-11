<template>
  <div class="residents-manager">
    <div class="filter-container">
      <div class="name-picker">
        <el-input v-model="name" placeholder="输入姓名查询"></el-input>
      </div>
      <div class="idcard-picker">
        <el-input v-model="idcard" placeholder="输入身份证号查询"></el-input>
      </div>
      <div class="date-picker">
        <el-date-picker v-model="date" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions">
        </el-date-picker>
      </div>
      <el-button @click="init"></el-button>
    </div>
    <div class="table-container" v-loading="loading" element-loading-text="正在加载居民列表" element-loading-spinner="el-icon-loading">
      <el-table v-loading="listLoading" :data="res_getPersonList" border fit highlight-current-row style="width: 100%">
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
        <el-table-column fixed="right" label="操作" align="center" width="120">
          <template slot-scope="scope">
            <el-button @click.native.prevent="initMess(scope.row.idcard)" type="text" size="small">
              查看检查记录清单
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pagination-container">
      <el-pagination :current-page="page" :page-sizes="[10,20,30]" :page-size="limit" :total="total" background layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <resident-details :personalMess="personalMess" ref="resident"></resident-details>
  </div>
</template>

<script>
import {getPersonList} from '@/api/station'
import {
  getPersonalMess
} from '@/api/resident'
import residentDetails from './residentDetails'

export default {
  name: 'manager',
  components: {
    residentDetails
  },
  data() {
    return {
      res_getPersonList: [],
      personalMess: [],

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
    },
    initMess(idcard) {
      console.log(idcard)
      getPersonalMess().then(response => {
        this.$refs.resident._toggleResident()
        this.personalMess = response.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
