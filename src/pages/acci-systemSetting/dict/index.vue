<template>
<div class="container">
  <el-container>
    <el-main>
      <el-row :gutter="20">
        <el-col :span="4">
          <el-tree :data="dictList" node-key="id" ref="tree" accordion check-strictly highlight-current :props="defaultProps"
            :default-expanded-keys="defaultExpanded" @node-click="nodeclicked">
          </el-tree>
        </el-col>
        <el-col :span="20">

          <el-row :model="query" :gutter="20">
            <el-col :span="24">
              <el-button type="success" style="float: left;" v-on:click="handleAdd">添加</el-button>
              <!-- <el-button type="success" style="float: right;" v-on:click="dialogTypeVisible = true">字典分类</el-button> -->
            </el-col>
          </el-row>
          <el-table :data="tableData" border :height="tableHeight" style="width: 100%; margin-top: 20px">
            <el-table-column type="index" width="50">
            </el-table-column>
            <el-table-column label="字典名称" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.name }}</span>
              </template>
            </el-table-column>
            <el-table-column label="字典标识" width="180">
              <template slot-scope="scope">
                <span>{{ scope.row.key }}</span>
              </template>
            </el-table-column>

            <el-table-column label="字典编码" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.code }}</span>
              </template>
            </el-table-column>
            <el-table-column label="创建时间" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.createDate | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="修改时间" width="200">
              <template slot-scope="scope">
                <span>{{ scope.row.updateDate | formatDate }}</span>
              </template>
            </el-table-column>
            <el-table-column label="操作" fixed="right" width="200">
              <template slot-scope="scope">
                <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row);dialogFormVisible = true;form.id = scope.row.id">编辑</el-button>
                <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <el-dialog title="字典信息" :visible.sync="dialogFormVisible" @close="resetForm" width="500px">
            <el-form :model="form" :rules="rules" ref="form">
              <el-form-item label="中文名称" :label-width="formLabelWidth" prop="name">
                <el-input v-model="form.name" placeholder="请输入内容" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="字典标识" :label-width="formLabelWidth" prop="key">
                <el-input v-model="form.key" placeholder="请输入内容" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="字典编码" :label-width="formLabelWidth" prop="code">
                <el-input v-model="form.code" placeholder="请输入内容" auto-complete="off"></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormVisible = false">取 消</el-button>
              <el-button type="success" @click="addEditUsers">确 定</el-button>
            </div>
          </el-dialog>
          <el-dialog width="90%" @open="typeOpen" style="text-align: center;" title="字典分类" :visible.sync="dialogTypeVisible"
            append-to-body>
            <el-button type="success" style="float: left;" @click="subhandleAdd" dialogFormVisible=true;>添加</el-button>
            <el-table :data="subtableData" border height="400" style="width: 100%; margin-top: 20px;text-align: center;">
              <el-table-column type="index" width="50">
              </el-table-column>
              <el-table-column label="字典名称" width="180" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                </template>
              </el-table-column>
              <el-table-column label="字典标识" width="180" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.key }}</span>
                </template>
              </el-table-column>

              <el-table-column label="字典编码" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.code }}</span>
                </template>
              </el-table-column>
              <el-table-column label="创建时间" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.createDate | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="修改时间" width="200" align="center">
                <template slot-scope="scope">
                  <span>{{ scope.row.updateDate | formatDate }}</span>
                </template>
              </el-table-column>
              <el-table-column label="操作" fixed="right" width="200" align="center">
                <template slot-scope="scope">
                  <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row);dialogFormVisible = true;form.id = scope.row.id;addflag = true">编辑</el-button>
                  <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-dialog>
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
      dictList: [],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpanded: [],
      tableData: [],
      tableDataDetial: [],
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
      /* form开始 */
      dialogFormVisible: false,
      dialogTypeVisible: false,
      form: {
        key: '',
        code: '',
        type: '',
        name: '',
        value: '',
        id: ''
      },
      rules: {
        name: [{
          required: true, // 显示*
          message: '请输入字典名称', // 提示
          trigger: 'blur' // 触发事件
        }],
        key: [{
          required: true,
          message: '请输入字典标识',
          trigger: 'blur'
        }],
        code: [{
          required: true,
          message: '请输入字典编码',
          trigger: 'blur'
        }]
      },
      parentId: '',
      formLabelWidth: '120px',
      /* form结束 */
      /* status下拉框开始 */
      typeOptions: [{
        value: '0',
        label: '上行'
      }, {
        value: '1',
        label: '下行'
      }],
      editionOptions: [{
        value: '0',
        label: '测试版'
      }, {
        value: '1',
        label: '正式版'
      }],
      /* status下拉框结束 */
      orgOptions: [],
      resultOptions: [{
        value: '',
        label: '全部'
      }, {
        value: '0',
        label: '成功'
      }, {
        value: '1',
        label: '失败'
      }],
      dateValue: [],
      currentId: '',
      flag: true,
      subtableData: [],
      addflag: false
    }
  },
  mounted() {
    this.loadData()
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
    formatTypeStatus: function(val) {
      return val === 0 ? '上行' : '下行'
    },
    formatEditionStatus: function(val) {
      return val === 0 ? '正式版' : '测试版'
    },
    formatDate: function(val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    /* 判断按钮是否显示 */
    contens: function(arg) {
      let btnData = sessionStorage.getItem('permissionArr')
      let permissionArr = btnData.split(',')
      return permissionArr.indexOf(arg) !== -1
    },
    /* 初始化执行/请求App列表 */
    loadData: function() {
      let reqdata = {}
      let aesdata = reqdata
      this.$http.post('/dict/list', aesdata)
        .then(response => {
          let respData = response
          if (respData.code === 0) {
            console.log('树形结构————————sys-dict')
            console.log(respData)
            this.dictList = transTreeData(respData.data)
            sessionStorage.setItem('resp', JSON.stringify(respData.data))
            this.nodeclicked()
            this.typeOpen()
          } else if (respData.code === -1) {
            this.$message({
              type: 'info',
              message: respData.msg
            })
          }
          /* 平级数据转分级开始 */
          function transTreeData(items) {
            if (items.length > 0) {
              var curPid = null // pid=0，为最上层节点 ，即无父节点
              var parent = findChild(curPid) // 数组
              return parent
            } else {
              return []
            }
          }
          // 找子节点
          function findChild(curPid) {
            var _arr = []
            var items = respData.data
            var length = items.length

            for (var i = 0; i < length; i++) {
              if (items[i].parentId === curPid) {
                var _obj = {
                  id: '',
                  label: ''
                }
                _obj.id = items[i].id
                _obj.label = items[i].name
                _obj.children = findChild(_obj.id)
                if (items[i].type === 1) {
                  return
                }
                _arr.push(_obj)
              }
            }
            return _arr
          }
          /* 平级数据转分级结束 */
        })
        .catch(response => {
          console.log('进入catch')
          console.log(response)
        })
    },
    nodeclicked: function() {
      this.sucessCount = 0
      this.failCount = 0
      this.allCount = 0
      var tableData = []
      var resp = JSON.parse(sessionStorage.getItem('resp'))
      if (this.$refs.tree.getCurrentKey()) {
        var currentId = this.$refs.tree.getCurrentKey()
      } else {
        currentId = resp[0].id
      }
      this.currentId = currentId
      resp.forEach((item, i) => {
        if (item.parentId === currentId) {
          tableData.push(item)
        }
      })
      this.tableData = tableData
      /* 显示子项 */
    },
    /* status下拉框 */
    getTypeStatus: function(val) {
      console.log('this.form.interfaceType     ' + val)
      this.form.interfaceType = val || ''
    },
    getEditionStatus: function(val) {
      console.log('this.form.interfaceEdition     ' + val)
      this.form.interfaceEdition = val || ''
    },
    /* 请求添加接口接口 */
    handleAdd: function() {
      this.dialogFormVisible = true
    },
    addEditUsers: function() {
      var parentId
      var type
      if (this.addflag) {
        parentId = null
        type = 0
      } else {
        parentId = this.currentId
        type = 1
      }
      if (!this.form.name) {
        this.$message({
          type: 'warning',
          message: '请输入字典名称!'
        })
        return
      } else if (!this.form.key) {
        this.$message({
          type: 'warning',
          message: '请输入字典标识!'
        })
        return
      } else if (!this.form.code) {
        this.$message({
          type: 'warning',
          message: '请输入字典编码!'
        })
        return
      }
      if (this.form.id) {
        console.log('有ID')
        let data = {
          id: this.form.id,
          name: this.form.name,
          code: this.form.code,
          type: type,
          key: this.form.key,
          parentId: parentId
        }
        let aesData = data
        this.$http.post('/dict/edit', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功!'
              })
              this.dialogFormVisible = false
              this.loadData(this.query, this.currentPage, this.pagesize)
            } else if (respData.code === -1) {
              this.$message({
                type: 'info',
                message: respData.msg
              })
              this.dialogFormVisible = false
              this.loadData(this.query, this.currentPage, this.pagesize)
            }
            this.addflag = false
          })
          .catch(response => {
            console.log('进入catch')
            console.log(response)
          })
      } else {
        console.log('么有ID')

        let data = {
          name: this.form.name,
          code: this.form.code,
          type: type,
          key: this.form.key,
          parentId: parentId
        }
        let aesData = data
        this.$http.post('/dict/add', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功!'
              })
              this.dialogFormVisible = false
              this.loadData(this.query, this.currentPage, this.pagesize)
            } else if (respData.code === -1) {
              this.$message({
                type: 'info',
                message: respData.msg
              })
            }
            this.addflag = false
          })
          .catch(response => {
            console.log('进入catch')
            console.log(response)
          })
      }
    },
    /* 编辑 */
    handleEdit: function(index, row) {
      console.log(index, row)
      this.form.name = row.name
      this.form.code = row.code
      this.form.type = row.type
      this.form.key = row.key
      this.form.currentId = row.currentId
    },
    /* 删除 */
    handleDelete: function(index, row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/dict/delete/' + row.id)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.dialogFormVisible = false
              this.loadData(this.query, this.currentPage, this.pagesize)
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
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    /* 清空form */
    resetForm: function() {
      this.form.name = ''
      this.form.code = ''
      this.form.type = ''
      this.form.key = ''
      this.form.id = ''
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
    },
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      let row = JSON.parse(sessionStorage.getItem('row'))
      this.rowDbclick(row, event)
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      console.log('this.currentPage  ' + this.currentPage)
      let row = JSON.parse(sessionStorage.getItem('row'))
      this.rowDbclick(row, event)
    },
    typeOpen: function() {
      var resp = JSON.parse(sessionStorage.getItem('resp'))
      var subdataList = []
      resp.forEach((item, i) => {
        if (item.type === 0) {
          subdataList.push(item)
        }
      })
      this.subtableData = subdataList
    },
    subhandleAdd: function() {
      this.addflag = true
      this.dialogFormVisible = true
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

  .el-tree-node__content .el-tree-node__expand-icon+span::before {
    content: url(./7.png);
  }

  .el-tree-node__children .el-tree-node__expand-icon+span::before {
    content: url(./8.png);
  }

  .el-tree-node__children .el-tree-node__children .el-tree-node__expand-icon+span::before {
    content: url(./8.png);
  }

  .el-tree-node__children .el-tree-node__children .el-tree-node__children .el-tree-node__expand-icon+span::before {
    content: url(./1.png);
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
