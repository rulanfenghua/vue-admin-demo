<template>
  <div class="residents-manager">
    <div class="filter-container">
      输入查询条件查询：
      <div class="name-picker">
        <el-input v-model="name" placeholder="输入姓名查询"></el-input>
      </div>
      <div class="idcard-picker">
        <el-input v-model="idcard" placeholder="输入身份证号查询"></el-input>
      </div>
      <!-- <el-button @click="init" type="primary">点击查询</el-button> -->
    </div>
    <div class="date-container">
      选择日期查询：
      <div class="date-picker">
        <el-date-picker v-model="date" type="daterange" align="right" unlink-panels range-separator="至"
          start-placeholder="开始日期" end-placeholder="结束日期" :picker-options="pickerOptions" value-format="yyyy-MM-dd HH:mm:ss" style="width:390px">
        </el-date-picker>
      </div>
      <el-button @click="init" type="primary">点击查询</el-button>
    </div>
    <div class="table-container" v-loading="loading" element-loading-text="正在加载居民列表" element-loading-spinner="el-icon-loading">
      <el-table :data="res_getPersonList" border fit highlight-current-row style="width: 100%"
      :max-height="tableHeight"
      >
        <el-table-column
          type="index"
          align="center"
        >
        </el-table-column>
        <el-table-column
          label="姓名"
          align="center"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="身份证号"
          align="center"
          width="245">
          <template slot-scope="scope">
            <span>{{ scope.row.idCard }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="性别"
          align="center"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.gender }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="年龄"
          align="center"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.age }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="卡类型"
          align="center"
          width="125">
          <template slot-scope="scope">
            <span>{{ scope.row.idType }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="电话"
          width="200">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="家庭住址"
          width="375">
          <template slot-scope="scope">
            <span>{{ scope.row.homeAddr }}</span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" width="200">
          <template slot-scope="scope">
            <el-button @click.native.prevent="initMess(scope.row.id,scope.row.idCard)" type="text" size="small">
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
    <!-- 引入residentDetails组件 -->
    <resident-details :personalMess="personalMess" :id="id" :personalData="personalData" ref="resident"></resident-details>
  </div>
</template>

<script>
import {getPersonList} from '@/api/station'
// import {
//   getPersonalMess,
//   getPersonalData
// } from '@/api/resident' // getPersonalDateList原有的api地址
import residentDetails from '@/components/residentDetails'

export default {
  name: 'manager',
  components: {
    residentDetails
  },
  computed: {
    tableHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 284)
    }
  },
  data() {
    return {
      res_getPersonList: [],
      personalMess: [],
      personalData: {},

      name: '',
      idcard: '',
      date: '',

      page: 1,
      limit: 20,
      total: 0,

      id: '',

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

      loading: false,
      loadingMess: false
    }
  },
  created() {
    this.init()
  },
  methods: {
    init() {
      // 全部居民列表请求的数据格式
      // {
      //   'pageNum': this.page,
      //   'pageSize': this.limit,
      //   'condition': {
      //     'name': this.name,
      //     'idcard': this.idcard,
      //     'stationId': this.station,
      //     'date': this.date
      //   }
      // }
      this.loading = true
      console.log('起止日期——————station')
      console.log(this.date)
      console.log(this.page)
      getPersonList(this.page, this.limit, this.name, this.idcard, this.date).then(response => {
        console.log('居民列表————————station')
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
    initMess(id, idCard) {
      // this.loadingMess = true
      // let symbol = false
      this.$http.get('/resident/getPersonalMess' + '/' + idCard).then(response => {
      // getPersonalData(this.idCard).then(response => {
        this.personalData = response.data
        // symbol = !symbol
        // if (symbol === false) {
        //   this.loadingMess = false
        // }
      })
      this.$http.get('/resident/getPersonalDateList' + '/' + id).then(response => {
      // getPersonalMess(this.id).then(response => {
        console.log('居民清单——————station')
        console.log(response.data)
        this.personalMess = response.data
        this.id = id
        this.$refs.resident._toggleResident()
        // symbol = !symbol
        // if (symbol === false) {
        //   this.loadingMess = false
        // }
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

<style lang="scss">
.residents-admin {
  .el-table td {
    height: 35px;
  }

.el-table th {
  padding: 8px 0 !important;
  }
}
</style>

<style scoped lang="scss">
.residents-manager {
  font-size: 15px;
  font-weight: bold;
  height: 100%;
  // width: 100%;
  margin: 0 30px 17px;
  overflow: hidden;
  .filter-container {
    display: inline-block;
    margin-top: 19px;
    margin-left: 33px;
    font-size: 15px;
    font-weight: bold;
    .name-picker {
      display: inline-block;
    }
    .idcard-picker {
      display: inline-block;
    }
    .station-picker {
      display: inline-block;
    }
  }
  .date-container {
    display: inline-block;
    margin-top: 19px;
    margin-bottom: 30px;
    margin-left: 33px;
    font-size: 15px;
    font-weight: bold;
    .date-picker {
      display: inline-block;
    }
  }
  .table-container {
    margin-bottom: 17px;
  }
}
</style>
