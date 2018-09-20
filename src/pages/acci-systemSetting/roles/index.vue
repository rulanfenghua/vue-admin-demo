<template>
<div class="container">
  <el-container>
    <el-header>
      <el-row :gutter="20">
        <el-col :span="16">
          <el-button type="success" v-on:click="dialogFormVisible = true;form.id = ''">添加</el-button>
        </el-col>
        <div class="rightTop">
          <el-input v-model="input" placeholder="请输入角色名称"></el-input>
          <el-button type="success" @click="inputBtn">搜索</el-button>
        </div>
      </el-row>

    </el-header>
    <el-main>
      <el-dialog title="角色信息" @close="resetForm" :visible.sync="dialogFormVisible" width="450px">
        <el-form :model="form" :rules="rules" ref="form">
          <el-form-item label="角色姓名" :label-width="formLabelWidth" prop="roleName">
            <el-input v-model="form.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色编码" :label-width="formLabelWidth" prop="roleKey">
            <el-input v-model="form.roleKey" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="电话" :label-width="formLabelWidth" prop="roleDescription">
            <el-input v-model="form.roleDescription" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
            <el-select v-model="form.status" @change="getStatus" placeholder="角色状态">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item> -->
          <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
            <el-input v-model="form.remark" auto-complete="off"></el-input>
          </el-form-item>
          <!-- <el-form-item label="权限选择" :label-width="formLabelWidth" prop="permissionChoose">
            <el-radio-group v-model="radios" size="mini" @change="handleCheckAllChange">
              <el-radio-button name="allCheck" label="全选"></el-radio-button>
              <el-radio-button name="allnoCheck" label="全不选"></el-radio-button>
            </el-radio-group>
            <el-tree :data="permissionList" show-checkbox node-key="id" ref="tree" accordion highlight-current
              check-on-click-node :props="defaultProps" :default-expanded-keys="defaultExpanded">
            </el-tree>
          </el-form-item> -->
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="addEditRoles">确 定</el-button>
        </div>
      </el-dialog>
      <el-dialog class="userDialog" title="角色详情" @close="resetForm" :visible.sync="dialogGetDetail" width="450px">
        <el-form :model="form">
          <el-form-item label="角色姓名：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.roleName" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色标识：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.roleKey" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色描述：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.roleDescription" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="注册时间：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.createDate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="修改时间：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.updateDate" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="状态：" :label-width="formLabelWidth">
            <el-select :disabled="true" v-model="form.status" placeholder="角色状态">
              <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注：" :label-width="formLabelWidth">
            <el-input :readonly="true" v-model="form.remark" auto-complete="off"></el-input>
          </el-form-item>
          <el-form-item label="角色权限：" :label-width="formLabelWidth">
            <el-tree :data="permissionList" show-checkbox node-key="id" ref="tree" accordion highlight-current
              check-on-click-node :props="defaultProps" :default-expanded-keys="defaultExpanded">
            </el-tree>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogGetDetail = false">确定</el-button>
        </div>
      </el-dialog>
      <el-table :data="tableData" :height="tableHeight" stripe element-loading-text="拼命加载中" @row-dblclick="rowDbclick"
        highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column label="角色名称" width="250">
          <template slot-scope="scope">
            <span>{{ scope.row.stationName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="角色编码" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.stationCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status | formatStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.tel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="修改时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate | formatDate}}</span>
          </template>
        </el-table-column>
        <el-table-column label="备注" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.remark }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="dialogFormVisible = true;handleEdit(scope.$index, scope.row);form.id = scope.row.id">编辑</el-button>
            <el-button size="mini" type="danger" @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <span class="dbtips">*双击行以查看详情</span>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
          :page-sizes="[10, 20, 30, 40]" :page-size="pagesize" layout="total, sizes, prev, pager, next, jumper" :total="totalCount">
        </el-pagination>
      </div>
    </el-main>
  </el-container>
</div>
</template>

<script>
import moment from 'moment'
export default {
  data() {
    return {
      /* form开始 */
      dialogFormVisible: false,
      dialogGetDetail: false,
      form: {
        roleName: '',
        roleKey: '',
        roleDescription: '',
        status: '',
        remark: '',
        permissions: [],
        id: ''
      },
      rules: {
        roleName: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        }],
        roleKey: [{
          required: true,
          message: '请输入角色标识',
          trigger: 'blur'
        }],
        roleDescription: [{
          required: true,
          message: '请输入角色描述',
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
        permissionChoose: [{
          required: true
        }],
        remark: []
      },
      formLabelWidth: '120px',
      /* form结束 */
      /* status下拉框开始 */
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '1',
        label: '禁用'
      }],
      /* status下拉框结束 */
      /* table开始 */
      tableData: [],
      tableHeight: 0,
      /* table结束 */
      /* 分页开始 */
      // 默认每页数据量
      pagesize: 10,
      // 当前页码
      currentPage: 1,
      // 默认数据总数
      totalCount: 10,
      /* 分页结束 */
      /* 全部选择开始 */
      radios: '',
      /* 全部选择结束 */
      /* 复选框开始 */
      permissionList: [{
        id: 'ehcUser:list',
        label: '用户管理',
        children: [{
          id: 'ehcUser:detail',
          label: '查看详情'
        }, {
          id: 'ehcUserLog:list',
          label: '轨迹'
        }]
      }, {
        id: 'ehcInApp:list',
        label: 'App管理',
        children: [{
          id: 'ehcInAppLog:list',
          label: '轨迹'
        }, {
          id: 'ehcInApp:detail',
          label: '查看详情'
        }, {
          id: 'ehcInApp:delete',
          label: '删除'
        }, {
          id: 'ehcInApp:auth',
          label: '授权'
        }, {
          id: 'ehcInApp:freeze',
          label: '冻结'
        }]
      }, {
        id: 'ehcInDev:list',
        label: '识读终端管理',
        children: [{
          id: 'ehcInDevLog:list',
          label: '轨迹'
        }, {
          id: 'ehcInDev:detail',
          label: '查看详情'
        }, {
          id: 'ehcInDev:delete',
          label: '删除'
        }, {
          id: 'ehcInDev:auth',
          label: '授权'
        }, {
          id: 'ehcInDev:freeze',
          label: '冻结'
        }]
      }, {
        id: 'ehcInOrg:list',
        label: '机构管理',
        children: [{
          id: 'ehcInOrgLog:list',
          label: '轨迹'
        }, {
          id: 'ehcInOrg:detail',
          label: '查看详情'
        }, {
          id: 'ehcInOrg:delete',
          label: '删除'
        }, {
          id: 'ehcInOrg:auth',
          label: '授权'
        }, {
          id: 'ehcInOrg:freeze',
          label: '冻结'
        }]
      }, {
        id: 'ehcInterface',
        label: '日志管理',
        children: [{
          id: 'ehcInterface:up',
          label: '上行日志'
        }, {
          id: 'ehcInterface:down',
          label: '下行日志'
        }]
      }, {
        id: 'ehcCryptMachine:list',
        label: '密码机管理',
        children: [{
          id: 'ehcCryptMachine:add',
          label: '添加'
        }, {
          id: 'ehcCryptMachine:update',
          label: '修改'
        }, {
          id: 'ehcCryptMachine:detail',
          label: '查看详情'
        }, {
          id: 'ehcCryptMachine:delete',
          label: '删除'
        }]
      }, {
        id: 'ehcStatistics',
        label: '统计分析',
        children: [{
          id: 'ehcStatistics:all',
          label: '整体统计'
        }, {
          id: 'ehcStatistics:card',
          label: '用卡率统计'
        }, {
          id: 'ehcStatistics:reg',
          label: '注册率统计'
        }]
      }, {
        id: 'sysSetting',
        label: '系统设置',
        children: [{
          id: 'sysUser:list',
          label: '用户列表',
          children: [{
            id: 'sysUser:add',
            label: '添加'
          }, {
            id: 'sysUser:update',
            label: '修改'
          }, {
            id: 'sysUser:detail',
            label: '查看详情'
          }, {
            id: 'sysUser:delete',
            label: '删除'
          }]
        }, {
          id: 'sysRole:list',
          label: '角色列表',
          children: [{
            id: 'sysRole:add',
            label: '添加'
          }, {
            id: 'sysRole:update',
            label: '修改'
          }, {
            id: 'sysRole:detail',
            label: '查看详情'
          }, {
            id: 'sysRole:delete',
            label: '删除'
          }]
        }, {
          id: 'sysDept:list',
          label: '部门列表',
          children: [{
            id: 'sysDept:add',
            label: '添加'
          }, {
            id: 'sysDept:update',
            label: '修改'
          }, {
            id: 'sysDept:detail',
            label: '查看详情'
          }, {
            id: 'sysDept:delete',
            label: '删除'
          }]
        }, {
          id: 'sysOrgan:list',
          label: '机构列表',
          children: [{
            id: 'sysOrgan:add',
            label: '添加'
          }, {
            id: 'sysOrgan:update',
            label: '修改'
          }, {
            id: 'sysOrgan:detail',
            label: '查看详情'
          }, {
            id: 'sysOrgan:delete',
            label: '删除'
          }]
        }, {
          id: 'sysDict:list',
          label: '字典列表',
          children: [{
            id: 'sysDict:add',
            label: '添加'
          }, {
            id: 'sysDict:update',
            label: '修改'
          }, {
            id: 'sysDict:detail',
            label: '查看详情'
          }, {
            id: 'sysDict:delete',
            label: '删除'
          }]
        }, {
          id: 'sysLog:list',
          label: '日志列表',
          children: [{
            id: 'sysLog:add',
            label: '添加'
          }, {
            id: 'sysLog:update',
            label: '修改'
          }, {
            id: 'sysLog:detail',
            label: '查看详情'
          }, {
            id: 'sysLog:delete',
            label: '删除'
          }]
        }, {
          id: 'sysLogNew:list',
          label: '新日志列表',
          children: [{
            id: 'sysLog:add',
            label: '添加'
          }, {
            id: 'sysLog:update',
            label: '修改'
          }, {
            id: 'sysLog:detail',
            label: '查看详情'
          }, {
            id: 'sysLog:delete',
            label: '删除'
          }]
        }, {
          id: 'sysInterface:list',
          label: '接口配置列表',
          children: [{
            id: 'sysInterface:add',
            label: '添加'
          }, {
            id: 'sysInterface:update',
            label: '修改'
          }, {
            id: 'sysInterface:detail',
            label: '查看详情'
          }, {
            id: 'sysInterface:delete',
            label: '删除'
          }]
        }, {
          id: 'sysDbConfig:list',
          label: '数据库列表',
          children: [{
            id: 'sysDbConfig:add',
            label: '添加'
          }, {
            id: 'sysDbConfig:update',
            label: '修改'
          }, {
            id: 'sysDbConfig:detail',
            label: '查看详情'
          }, {
            id: 'sysDbConfig:delete',
            label: '删除'
          }]
        }]
      }],
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      defaultExpanded: [],
      /* 复选框结束 */
      /* 搜索开始 */
      input: ''
      /* 搜索结束 */
    }
  },
  mounted() {
    this.loadData(this.input, this.currentPage, this.pagesize)
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
    formatStatus: function (val) {
      return val === 1 ? '禁用' : '正常'
    },
    formatDate: function (val) {
      if (!val) {
        return ''
      }
      return moment(val).format('YYYY-MM-DD HH:mm:ss')
    }
  },
  methods: {
    /* 判断按钮是否显示 */
    contens: function (arg) {
      let btnData = sessionStorage.getItem('permissionArr')
      let permissionArr = btnData.split(',')
      return permissionArr.indexOf(arg) !== -1
    },
    /* 权限全选 */
    handleCheckAllChange: function (val) {
      let keysArr = []
      this.permissionList.forEach((v, i) => {
        keysArr.push(v.id)
        if (v.children) {
          v.children.forEach((item, j) => {
            keysArr.push(item.id)
          })
        }
      })

      switch (val) {
      case '全选':
        this.$refs.tree.setCheckedKeys(keysArr)
        break
      case '全不选':
        this.$refs.tree.setCheckedKeys([])
        break
      default:
        break
      }
    },
    /* 初始化执行/请求角色列表 */
    loadData: function (input, pageNum, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)',
        target: document.querySelector('.el-table')
      })
      let condition = {
        // 'status': this.form.status.toString(),
        'stationName': this.input
      }
      let reqdata = {
        'pageNum': pageNum,
        'pageSize': pageSize,
        'condition': condition
      }
      let aesdata = reqdata
      let _this = this
      this.$http.post('/sysStation/list', aesdata)
        .then(response => {
          console.log('列表————————roles')
          console.log(response)
          loading.close()

          let respData = response
          if (respData.code === 0) {
            _this.tableData = respData.data.list
            this.totalCount = respData.data.total
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
    rowDbclick: function (row, event) {
      this.dialogGetDetail = true
      this.$http.get('/sysStation/detail/' + row.id)
        .then(response => {
          let respData = response
          if (respData.code === 0) {
            this.form.roleName = respData.data.roleName
            this.form.roleKey = respData.data.roleKey
            this.form.roleDescription = respData.data.roleDescription
            this.form.status = respData.data.status
            this.form.remark = respData.data.remark
          }
          this.$store.commit('CODE', respData.code)
          if (respData.code === '101') {
            window.location.reload()
          }
        })
        .catch(response => {
          console.log('进入catch')
          console.log(response)
        })
      this.form.roleName = row.roleName
      this.form.roleKey = row.roleKey
      this.form.roleDescription = row.roleDescription
      // this.form.status = row.status.toString()
      this.form.remark = row.remark
      this.form.createDate = row.createDate
      this.form.updateDate = row.updateDate
      let _this = this
      setTimeout(function () {
        if (_this.$refs.tree) {
          _this.$refs.tree.setCheckedKeys(row.permissions === null ? [] : row.permissions)
        }
      }, 500)
    },
    /* status下拉框 */
    getStatus: function (val) {
      // this.form.status = val.toString() ? val.toString() : ''
    },
    /* 分页器 */
    // 每页显示数据量变更
    handleSizeChange: function (val) {
      this.pagesize = val
      this.loadData(this.input, this.currentPage, this.pagesize)
    },

    // 页码变更
    handleCurrentChange: function (val) {
      this.currentPage = val
      console.log('this.currentPage  ' + this.currentPage)

      this.loadData(this.input, this.currentPage, this.pagesize)
    },
    inputBtn: function () {
      this.loadData(this.input, this.currentPage, this.pagesize)
    },
    /* 请求添加角色接口 */
    addEditRoles: function () {
      // this.form.permissions = [].concat(this.$refs.tree.getHalfCheckedKeys(), this.$refs.tree.getCheckedKeys())
      // if (!this.form.permissions.length) {
      //   this.$message({
      //     type: 'info',
      //     message: '请选择角色权限'
      //   })
      //   return
      // } else
      if (!this.form.roleName) {
        this.$message({
          type: 'warning',
          message: '请输入角色姓名!'
        })
        return
      } else if (!this.form.roleKey) {
        this.$message({
          type: 'warning',
          message: '请输入角色标识!'
        })
        return
      } else if (!this.form.roleDescription) {
        this.$message({
          type: 'warning',
          message: '请输入角色描述!'
        })
        return
      }
      // else if (!this.form.status.toString()) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请输入角色状态!'
      //   })
      //   return
      // }
      if (this.form.id) {
        console.log('有ID')
        let data = {
          id: this.form.id,
          stationName: this.form.roleName,
          stationCode: this.form.roleKey,
          tel: this.form.roleDescription,
          // status: this.form.status.toString(),
          remark: this.form.remark
          // permissions: this.form.permissions
        }
        let aesData = data
        this.$http.post('/sysStation/update', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
              })
              this.dialogFormVisible = false
              this.loadData(this.input, this.currentPage, this.pagesize)
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
      } else {
        console.log('么有ID')
        let data = {
          stationName: this.form.roleName,
          stationCode: this.form.roleKey,
          tel: this.form.roleDescription,
          // status: this.form.status.toString(),
          remark: this.form.remark
          // permissions: this.form.permissions
        }
        let aesData = data
        this.$http.post('/sysStation/add', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功'
              })
              this.dialogFormVisible = false
              this.loadData(this.input, this.currentPage, this.pagesize)
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
      }
    },
    /* 编辑 */
    handleEdit: function (index, row) {
      this.form.roleName = row.stationName
      this.form.roleKey = row.stationCode
      this.form.roleDescription = row.tel
      // this.form.status = row.status.toString()
      this.form.remark = row.remark
      let _this = this
      setTimeout(function () {
        if (_this.$refs.tree) {
          _this.$refs.tree.setCheckedKeys(row.permissions === null ? [] : row.permissions)
        }
      }, 500)
    },
    /* 清空form */
    resetForm: function () {
      this.form.roleName = ''
      this.form.roleKey = ''
      this.form.roleDescription = ''
      this.form.status = ''
      this.form.remark = ''
      this.form.permissions = []
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      if (!this.$refs.tree) {
        return
      }
      this.$refs.tree.setCheckedKeys([])
    },
    /* 删除 */
    handleDelete: function (index, row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$http.get('/sysStation/delete/' + row.id)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
              this.loadData(this.input, this.currentPage, this.pagesize)
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
    }

  }
}
</script>

<style lang='scss'>
.container {
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
}

</style>
