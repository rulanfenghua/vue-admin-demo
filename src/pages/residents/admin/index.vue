<template>
  <div class="residents-admin">
    <el-col :span="4" :style="{height: leftHeight+'px'}">
      <tree-list ref="tree" @clicked="nodeclicked"></tree-list>
    </el-col>
    <el-col :span="20">
      <div class="filter-container">
        输入查询条件查询：
        <div class="name-picker">
          <el-input v-model="name" placeholder="输入姓名查询" clearable></el-input>
        </div>
        <div class="idcard-picker">
          <el-input v-model="idcard" placeholder="身份证号查询" clearable></el-input>
        </div>
        <!-- <div class="station-picker">
        <el-input v-model="station" placeholder="输入站点查询"></el-input>
        </div> -->
        <div class="station-picker">
          <el-select v-model="station" @change="getStation" placeholder="选择站点查询" clearable>
            <el-option v-for="item in stationOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </div>
        <!-- <el-button @click="init" type="primary">点击查询</el-button> -->
      </div>
      <div class="date-container">
        <div class="date-picker">
          <el-date-picker v-model="date" type="daterange" align="right" unlink-panels range-separator="至"
            start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd HH:mm:ss" :picker-options="pickerOptions"
            style="width:360px">
          </el-date-picker>
        </div>
        <el-button @click="init" type="primary">点击查询</el-button>
      </div>
      <div class="table-container" v-loading="loading" element-loading-text="正在加载居民列表" element-loading-spinner="el-icon-loading">
        <el-table :data="res_getPersonList" fit stripe highlight-current-row style="width: 100%" :max-height="tableHeight" border>
          <el-table-column type="index" align="center">
          </el-table-column>
          <el-table-column label="姓名" align="center" width="94">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="创建时间" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.createDate | formatTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="身份证号" align="center" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.idCard }}</span>
            </template>
          </el-table-column>
          <el-table-column label="性别" align="center" width="94">
            <template slot-scope="scope">
              <span>{{ scope.row.gender }}</span>
            </template>
          </el-table-column>
          <el-table-column label="年龄" align="center" width="94">
            <template slot-scope="scope">
              <span>{{ scope.row.age }}</span>
            </template>
          </el-table-column>
          <el-table-column label="卡类型" align="center" width="94">
            <template slot-scope="scope">
              <span>{{ scope.row.idType }}</span>
            </template>
          </el-table-column>
          <el-table-column label="服务站名" width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.stationName }}</span>
            </template>
          </el-table-column>
          <el-table-column label="电话" width="145">
            <template slot-scope="scope">
              <span>{{ scope.row.tel }}</span>
            </template>
          </el-table-column>
          <el-table-column label="家庭住址" width="375">
            <template slot-scope="scope">
              <span>{{ scope.row.homeAddr }}</span>
            </template>
          </el-table-column>
          <el-table-column fixed="right" label="操作" align="left" width="175">
            <template slot-scope="scope">
              <el-button @click.native.prevent="initMess(scope.row.id,scope.row.idCard)" type="text" size="small">
                查看检查记录清单
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div class="pagination-container">
        <el-pagination :current-page="page" :page-sizes="[10,20,30]" :page-size="limit" :total="total" background
          layout="total, sizes, prev, pager, next, jumper" @size-change="handleSizeChange" @current-change="handleCurrentChange" />
      </div>
    </el-col>
    <!-- 引入residentDetails组件 -->
    <resident-details :personalMess="personalMess" :id="id" :personalData="personalData" ref="resident"></resident-details>
  </div>
</template>

<script>
import {
  getPersonList
} from '@/api/admin'
  // import {getPersonalMess, getPersonalData} from '@/api/resident' // getPersonalDateList原有的api地址
import residentDetails from '@/components/residentDetails'
import treeList from '@/components/treeList'

export default {
  name: 'admin',
  components: {
    residentDetails,
    treeList
  },
  computed: {
    tableHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 284)
    },
    leftHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 194)
    }
  },
  data() {
    return {
      res_getPersonList: [],
      personalMess: [],
      personalData: {},

      name: '',
      idcard: '',
      station: '',
      date: [],

      page: 1,
      limit: 20,
      total: 0,

      id: '',

      stationOptions: [{
        value: '330965C6BAEE4DD58513D4DC229FF1A0',
        label: '达活泉社区卫生服务中心'
      },
      {
        value: 'BD1C87F41CF242DAA8EFDE55180FE046',
        label: '钢铁社区卫生服务中心'
      },
      {
        value: 'EA7AE1EC32AA4FDF96D13170968BB3D3',
        label: '金牛社区卫生服务中心'
      },
      {
        value: '30CC1115738341849095662F07175E86',
        label: '李村镇卫生院'
      },
      {
        value: '923850FB526B489F846A5BDD76E3DA6D',
        label: '南大郭社区卫生服务中心'
      },
      {
        value: 'A42A97E3BAEF46CDB8908E276BA5EF3E',
        label: '泉西社区卫生服务中心'
      },
      {
        value: '96EF5D14B5334F7E8EA7E03140F1900C',
        label: '张宽社区卫生服务中心'
      },
      {
        value: '263220606F0D4E4A966572A630192FAD',
        label: '中华社区卫生服务中心'
      },
      {
        value: '44DD49650F864BF5A1DE2FE6C8008937',
        label: '中兴社区卫生服务中心'
      }],

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
    this.getTreeList()
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
      getPersonList(this.page, this.limit, this.name, this.idcard, this.station, this.date).then(response => {
        console.log('居民列表————————admin')
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
    getTreeList() {
      this.$nextTick(() => {
        this.$refs.tree.initTreeList()
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
        this.personalMess = response.data
        this.id = id
        this.$refs.resident._toggleResident()
        // symbol = !symbol
        // if (symbol === false) {
        //   this.loadingMess = false
        // }
        console.log('居民列表数据——————admin')
        console.log(response.data)
      })
    },
    getStation(value) {
      this.station = value || ''
    },
    handleSizeChange(value) {
      this.limit = value
      this.init()
    },
    handleCurrentChange(value) {
      this.page = value
      this.init()
    },
    nodeclicked(data) {
      let expectedArray = []
      this.stationOptions.forEach(obj => {
        expectedArray.push(obj.value)
      })
      if (expectedArray.indexOf(data.id) !== -1) {
        console.log(data.id)
        this.station = data.id
      } else {
        this.station = null
      }
      this.init()
    }
  }
}
</script>

<style lang="scss">
  .residents-admin {
    .filter-container {
      .el-input {
        width: 154px;
      }
    }
    .el-table {
      // padding: 4px;
    }
    .el-table td {
      height: 35px;
      padding: 7.5px 0;
    }

    .el-table th {
      padding: 8px 0 !important;
    }
  }
</style>

<style scoped lang="scss">
  .residents-admin {
    font-size: 15px;
    font-weight: bold;
    height: 100%;
    // width: 100%;
    margin: 0 30px 17px 10px;
    overflow: hidden;

    .filter-container {
      display: inline-block;
      margin-top: 19px;
      margin-left: 19px;
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
      // display: inline-block;
      margin-top: 19px;
      margin-bottom: 20px;
      // margin-left: 19px;
      // font-size: 15px;
      // font-weight: bold;
      float: right;

      .date-picker {
        display: inline-block;
      }
    }

    .table-container {
      margin-bottom: 17px;
      margin-left: 19px;
    }

    .pagination-container {
      margin-left: 19px;
      // text-align: center;
    }
  }
</style>
