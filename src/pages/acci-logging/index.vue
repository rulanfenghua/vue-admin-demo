<template>
<div class="container">
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <!-- <el-col :span="4">
          <el-tree :data="interfaceList" node-key="id" ref="tree" accordion check-strictly highlight-current :props="defaultProps"
            :default-expanded-keys="defaultExpanded" :expand-on-click-node="true" @node-click="nodeclicked">
          </el-tree>
        </el-col> -->
        <el-col :span="24">

          <el-row :model="query" :gutter="20">
            <el-col :span="24">
              <span style="margin-left: 20px;margin-right: -26px">用户名称：</span>
              <!-- <el-select style="width: 120px;" v-model="query.org" @change="getOrg" placeholder="全部">
                <el-option v-for="item in orgOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select> -->
              <div class="name-picker" style="width:274px;display:inline-block">
                <el-input v-model="name" placeholder="输入姓名查询" @keyup.enter.native="getOrg" style="width:120px"></el-input>
                <el-button @click="getOrg" type="primary" style="display:inline-block">点击查询</el-button>
              </div>
              <span style="margin-left: 20px;">调用结果：</span>
              <el-select style="width: 120px;" v-model="query.result" @change="getResult" placeholder="全部">
                <el-option v-for="item in resultOptions" :key="item.value" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
              <span style="margin-left: 20px;">时间区间：</span>
              <el-date-picker v-model="dateValue" type="datetimerange" @change="getDate" range-separator="至"
                start-placeholder="开始日期" end-placeholder="结束日期">
              </el-date-picker>
            </el-col>
          </el-row>
          <!--show-summary-->
          <el-table :data="tableData" border :height="tableHeight" style="width: 98%; margin-top: 20px">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column label="用户名称" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.userName }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" prop="interfaceTime" label="调用时间">
              <template slot-scope="scope">
                <span>{{ scope.row.createDate | formatTime }}</span>
              </template>
            </el-table-column>
            <el-table-column width="200" prop="operateType" label="调用类型">
            </el-table-column>
            <el-table-column width="200" prop="operation" label="调用内容">
            </el-table-column>
            <!-- <el-table-column width="150" prop="userName" label="目标人姓名">
            </el-table-column>
            <el-table-column width="180" prop="userCardId" label="目标人身份证号">
            </el-table-column> -->
            <el-table-column label="调用结果" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.operateResult | formatResultStatus }}</span>
              </template>
            </el-table-column>
            <el-table-column width="320" prop="remark" label="调用结果内容">
            </el-table-column>
            <!-- <el-table-column width="150" prop="interfaceOrgName" label="调用机构名称">
            </el-table-column> -->
            <!-- <el-table-column label="调用来源" width="150">
              <template slot-scope="scope">
                <span>{{ scope.row.interfaceSource | formatSourceStatus }}</span>
              </template>
            </el-table-column> -->
            <!-- <el-table-column width="250" prop="sno" label="接口调用设备编号">
            </el-table-column> -->
          </el-table>
          <div class="pagination">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
              :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper"
              :total="totalCount">
            </el-pagination>
          </div>
          <!-- <div class="counts">
            <span class="text">成功次数</span>
            <span>{{ sucessCount }}</span>
            <span class="text">失败次数</span>
            <span>{{ failCount }}</span>
            <span class="text">调用总数</span>
            <span>{{ allCount }}</span>
          </div> -->
        </el-col>
      </el-row>
    </el-main>
  </el-container>
</div>
</template>
<script>
import moment from 'moment'

export default {
  data() {
    return {
      interfaceList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpanded: [],
      tableData: [],
      tableHeight: 0,
      /* 分页开始 */
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 默认数据总数
      totalCount: 10,
      query: {
        'org': '',
        'result': ''
      },
      name: '',
      orgOptions: [],
      resultOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '成功'
      }, {
        value: '-1',
        label: '失败'
      }],
      dateValue: [],
      addrArr: [],
      currentAddr: '',
      flag: true,
      sucessCount: 0,
      failCount: 0,
      allCount: 0
    }
  },
  mounted() {
    // this.loadData()
    this.nodeclicked()
    // this.initOrgList()
  },
  created() {
    let height = document.body.clientHeight
    this.tableHeight = height - 280
    let that = this
    window.onresize = () => {
      that.tableHeight = document.body.clientHeight - 280
    }
  },
  /* table数据格式化 */
  filters: {
    formatResultStatus: function(val) {
      return val === 0 ? '成功' : '失败'
    },
    formatSourceStatus: function(val) {
      return val === 0 ? '网页端' : val === 1 ? 'App' : '终端'
    }
  },
  methods: {
    /* 判断按钮是否显示 */
    contens: function(arg) {
      let btnData = sessionStorage.getItem('permissionArr')
      let permissionArr = btnData.split(',')
      return permissionArr.index1Of(arg) !== -1
    },
    /* 初始化执行/请求App列表 */
    // loadData: function () {
    //   this.$axios.get('/sysInterface/list/1')
    //     .then(response => {
    //       let respData = JSON.parse(Crypto.Decrypt(response.data))
    //       var parentArr = []
    //       if (respData.code === 0) {
    //         this.interfaceList = transTreeData(respData.data)
    //         for (var i = 0; i < respData.data.length; i++) {
    //           if (respData.data[i].interfaceAddr) {
    //             this.addrArr.push(respData.data[i].interfaceAddr)
    //           }
    //           if (respData.data[i].interrfaceLevel === 0) {
    //             parentArr.push(respData.data[i])
    //           }
    //         }
    //         this.currentAddr = parentArr[0].interfaceAddr
    //         this.defaultExpanded.push(parentArr[0].id)
    //         sessionStorage.setItem('resp', JSON.stringify(respData.data))
    //         this.nodeclicked()
    //       } else if (respData.code === -1) {
    //         this.$message({
    //           type: 'info',
    //           message: respData.msg
    //         })
    //       }
    //       /* 平级数据转分级开始 */
    //       function transTreeData(items) {
    //         if (items.length > 0) {
    //           var curPid = null // pid=0，为最上层节点 ，即无父节点
    //           var parent = findChild(curPid) // 数组
    //           return parent
    //         } else {
    //           return []
    //         }
    //       }
    //       // 找子节点
    //       function findChild(curPid) {
    //         var _arr = []
    //         var items = respData.data
    //         var length = items.length

    //         for (var i = 0; i < length; i++) {
    //           if (items[i].interrfaceParent === curPid) {
    //             var _obj = {
    //               id: '',
    //               label: ''
    //             }
    //             _obj.id = items[i].id
    //             _obj.label = items[i].interfaceName
    //             _obj.children = findChild(_obj.id)
    //             _arr.push(_obj)
    //           }
    //         }
    //         return _arr
    //       }
    //       /* 平级数据转分级结束 */
    //     })
    //     .catch(response => {
    //       console.log('进入catch')
    //       console.log(response)
    //     })
    // },
    nodeclicked: function() {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)',
        target: document.querySelector('.el-table')
      })
      this.sucessCount = 0
      this.failCount = 0
      this.allCount = 0
      // if (this.$refs.tree.getCurrentKey()) {
      //   let currentId = this.$refs.tree.getCurrentKey()
      //   let resp = JSON.parse(sessionStorage.getItem('resp'))
      //   resp.forEach((item, i) => {
      //     if (item.id === currentId) {
      //       this.currentAddr = item.interfaceAddr
      //     }
      //   })
      // }
      let _this = this
      // console.log('时间判断————————logging')
      // console.log(this.flag)
      // console.log(!this.dateValue)
      // console.log(this.flag || !this.dateValue)
      if (this.flag || !this.dateValue) {
        var condition = {
          'startDate': '',
          'endDate': '',
          'name': this.name,
          'operateResult': 1
        }
      } else {
        console.log(this.dateValue)
        condition = {
          'startDate': moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss'),
          'endDate': moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss'),
          'name': this.name,
          'operateResult': 1
        }
        console.log(condition)
      }
      let reqdata = {
        'pageNum': this.currentPage,
        'pageSize': this.pagesize,
        'condition': condition
      }
      let aesdata = reqdata
      this.$http.post('/sysLog/list', aesdata)
        .then(response => {
          console.log('日志————————sys')
          console.log(response)
          loading.close()
          let respData = response
          if (respData.code === 0) {
            _this.tableData = respData.data.list
            this.totalCount = respData.data.total
            // this.initcount()
          } else if (respData.code === -1) {
            this.$message({
              type: 'info',
              message: respData.msg
            })
          }
        })
        .catch(response => {
          console.log('进入catch')
          console.log(response)
        })
    },
    // initOrgList: function () {
    //   this.$axios.get('/ehcInOrg/orgList')
    //     .then(response => {
    //       let respData = JSON.parse(Crypto.Decrypt(response.data))
    //       if (respData.code === 0) {
    //         for (let i = 0; i < respData.data.length; i++) {
    //           let orgObj = {
    //             'value': '',
    //             'label': ''
    //           }
    //           orgObj.value = respData.data[i].id
    //           orgObj.label = respData.data[i].orgName
    //           this.orgOptions.push(orgObj)
    //         }
    //       } else if (respData.code === -1) {
    //         this.$message({
    //           type: 'info',
    //           message: respData.msg
    //         })
    //       }
    //     })
    //     .catch(response => {
    //       console.log('进入catch')
    //       console.log(response)
    //     })
    // },
    // initcount: function () {
    //   var condition = {
    //     'addr': this.currentAddr,
    //     'interfaceOrgId': this.query.org,
    //     'interfaceResult': this.query.result,
    //     'startTime': !this.flag && this.dateValue ? moment(this.dateValue[0]).format('YYYY-MM-DD HH:mm:ss') : '',
    //     'endTime': !this.flag && this.dateValue ? moment(this.dateValue[1]).format('YYYY-MM-DD HH:mm:ss') : ''
    //   }
    //   let aesdata = condition
    //   this.$axios.post('/interface/statusCount', aesdata)
    //     .then(response => {
    //       let respData = JSON.parse(Crypto.Decrypt(response.data))
    //       console.log('countcountcountcountcount' + JSON.stringify(respData.data))
    //       if (respData.code === 0) {
    //         var sucessCount = 0
    //         var failCount = 0
    //         for (let i = 0; i < respData.data.length; i++) {
    //           sucessCount += respData.data[i].SUCCESSCOUNTS
    //           failCount += respData.data[i].FAILURECOUNTS
    //         }
    //         this.sucessCount = sucessCount
    //         this.failCount = failCount
    //         this.allCount = sucessCount + failCount
    //       } else if (respData.code === -1) {
    //         this.$message({
    //           type: 'info',
    //           message: respData.msg
    //         })
    //       }
    //     })
    //     .catch(response => {
    //       console.log('进入catch')
    //       console.log(response)
    //     })
    // },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.nodeclicked()
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val

      this.nodeclicked()
    },
    getOrg: function() {
      // this.name = val
      this.nodeclicked()
    },
    getResult: function(val) {
      console.log('this.query.result————————' + val)
      this.query.result = val
      this.nodeclicked()
    },
    getDate: function() {
      this.flag = false
      this.nodeclicked()
    }
  }
}
</script>

<style lang='scss'>
.container {
  font-size: 15px;
  font-weight: bold;
  .el-header,
  .el-footer {
      background-color: transparent;
      color: #333;
      text-align: center;
      height: 60px;
      line-height: 60px;
  }
  .el-header .el-col{
      text-align: left;
  }
  .rightTop{
          width: 100%;
          height: 60px;
          line-height: 60px;
          text-align: right;
          padding-right: 10px;
      }
      .rightTop .el-input{
          width: 180px;
      }
  .el-dialog .el-input{
          width: 200px;
      }
  .el-main {
      background-color: transparent;
      color: #333;
      text-align: center;
      height: 100%;
  }
  .el-main .el-form {
      text-align: left;
  }
  .el-main .el-table{
      height: 100%;
      line-height: 100%;
  }
  .el-main .el-table td{
      height: 35px;
  }
  .el-main .el-table th{
      padding: 8px 0!important;
      text-align: center;
  }
  .el-main .pagination{
      height: 30px;
      line-height: 30px;
      position: relative;
      text-align: right;
      width: 80%;
      margin-top: 20px;
  }
  .el-main .pagination2{
      height: 30px;
      line-height: 30px;
      margin-top: 20px;
  }

  .el-main .pagination .dbtips{
      float: left;color: goldenrod;font-size: 14px;
  }
  .el-main .dialog-footer {
      text-align: center;
  }
  .el-button--success{
      color: #fff;
      background-color: #1E9FFF!important;
      border-color: #1E9FFF!important;
  }
  .el-button--danger{
      color: #fff;
      background-color: #FFB800!important;
      border-color: #FFB800!important;
  }
  ::-webkit-scrollbar-corner,
  ::-webkit-scrollbar-track {
      background-color: #e2e2e2;
  }

  ::-webkit-scrollbar-thumb {
      border-radius: 0;
      background-color: rgba(0, 0, 0, .3);
  }

  ::-webkit-scrollbar {
      width: 10px;
      height: 10px;
  }

  .el-tree {
    background-color: transparent;
  }

  .el-tree-node__expand-icon+span::before {
    display: inline-block;
    vertical-align: bottom;
    margin-bottom: 10px;
    width: 20px;
    height: 20px;
  }

  .pagination {
    margin-left: -500px;
  }

  .el-tree-node__content {
    height: 35px;
    line-height: 35px;
  }

  .el-pagination {
    width: 100%;
    position: absolute;
    left: 300px;
    display: inline-block;
  }

  .counts {
    display: inline-block;
    float: right;
    margin-right: 30px;
    margin-top: -25px;
  }

  .text {
    margin-left: 20px;
  }
}

</style>
