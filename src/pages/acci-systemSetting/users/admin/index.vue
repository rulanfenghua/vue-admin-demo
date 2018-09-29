<template>
  <div class="container">
    <el-col :span="4" :style="{height: leftHeight+'px'}">
      <tree-list ref="tree" @clicked="nodeclicked"></tree-list>
    </el-col>
    <el-col :span="20">
    <el-header>
      <el-row :model="query" :gutter="20">
        <el-col :span="13">
          <el-button type="success" v-on:click="dialogFormVisible = true;form.id = ''">添加</el-button>
          <span style="margin-left: 20px;">用户状态：</span>
          <el-select style="width: 120px;" v-model="query.status" @change="getQueryStatus" placeholder="全部">
            <el-option v-for="item in statusQueryOptions" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
        </el-col>
        <div class="rightTop">
          <el-button type="success" @click="queryBtnSuper">显示全部</el-button>
          <el-input v-model="query.input" placeholder="请输入姓名"></el-input>
          <el-button type="success" @click="queryBtn">搜索</el-button>
        </div>
      </el-row>
    </el-header>
    <el-main>
      <el-table :data="tableData" stripe :height="tableHeight" @row-dblclick="rowDbclick" highlight-current-row style="width: 100%">
        <el-table-column type="index" width="50">
        </el-table-column>
        <el-table-column label="姓名" width="150">
          <template slot-scope="scope">
            <span>{{ scope.row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="账号" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.loginName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.status | formatStatus}}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" width="120">
          <template slot-scope="scope">
            <span>{{ scope.row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="邮箱" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户注册时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.createDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="用户修改时间" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.updateDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" fixed="right" width="200">
          <template slot-scope="scope">
            <el-button size="mini" type="success" @click="handleEdit(scope.$index, scope.row);dialogFormVisible = true;form.id = scope.row.id">编辑</el-button>
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
      <el-dialog class="userDialog" title="用户详情" :visible.sync="dialogGetDetail" @close="resetForm" width="850px">
        <el-form :model="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户姓名：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.userName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="登陆账户：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.loginName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="状态：" :label-width="formLabelWidth">
                <el-select :disabled="true" v-model="form.status" @change="getStatus" placeholder="用户状态">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="手机号：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.phone" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="注册时间：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.createDate" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="邮箱：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.email" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="备注：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.remark" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="所属机构：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.organId" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="所属部门：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.deptId" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="修改时间：" :label-width="formLabelWidth">
                <el-input :readonly="true" v-model="form.updateDate" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button type="success" @click="dialogGetDetail = false">确定</el-button>
        </div>
      </el-dialog>
      <el-dialog title="用户信息" :visible.sync="dialogFormVisible" @open="initPermissionList" @close="resetForm" width="850px">
        <el-form :model="form" :rules="rules" ref="form">
          <el-row>
            <el-col :span="12">
              <el-form-item label="用户姓名" :label-width="formLabelWidth" prop="userName">
                <el-input v-model="form.userName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="登陆账户" :label-width="formLabelWidth" prop="loginName">
                <el-input v-model="form.loginName" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="密码" v-show='isShow' :label-width="formLabelWidth" prop="password">
                <el-input type="password" v-model="form.password" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="状态" :label-width="formLabelWidth" prop="status">
                <el-select v-model="form.status" @change="getStatus" placeholder="用户状态">
                  <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="电话" :label-width="formLabelWidth" prop="phone">
                <el-input v-model="form.phone" auto-complete="off"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" :label-width="formLabelWidth" prop="email">
                <el-input v-model="form.email" auto-complete="off"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="备注" :label-width="formLabelWidth" prop="remark">
                <el-input v-model="form.remark" auto-complete="off"></el-input>
              </el-form-item>
              <!-- <el-form-item label="权限等级" :label-width="formLabelWidth" prop="levels" v-show="showSuper==='super'">
                <el-select v-model="form.levels" @change="getLevels" placeholder="用户权限">
                  <el-option v-for="item in levelsOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="权限等级" :label-width="formLabelWidth" prop="levels" v-show="showSuper==='admin'">
                <el-select v-model="form.levels" @change="getLevels" placeholder="用户权限">
                  <el-option v-for="item in levelsOptionsAdmin" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="权限等级" :label-width="formLabelWidth" prop="levels">
                <el-select v-model="form.levels" @change="getLevels" placeholder="用户权限">
                  <el-option v-for="item in levelsOptionsAdmin" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="所属区域" :label-width="formLabelWidth" prop="state" v-show="form.levels==2">
                <el-select v-model="form.state" @change="getState" placeholder="区域">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="选择区域" :label-width="formLabelWidth" prop="state" v-show="form.levels==1">
                <el-select v-model="form.state" @change="getState" placeholder="区域">
                  <el-option v-for="item in stateOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <!-- <el-form-item label="所属机构" :label-width="formLabelWidth" prop="organId">
                <el-select v-model="form.organId" @change="getorganIdStatus" placeholder="所属机构">
                  <el-option v-for="item in organIdOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="vFlag" label="所属部门" :label-width="formLabelWidth" prop="deptId">
                <el-select v-model="form.deptId" @change="getdeptIdStatus" placeholder="所属部门">
                  <el-option v-for="item in deptIdOptions" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="权限选择" :label-width="formLabelWidth" prop="permissionChoose">
                <el-radio-group v-model="radios" size="mini" @change="handleCheckAllChange">
                  <el-radio-button name="allCheck" label="全选"></el-radio-button>
                  <el-radio-button name="allnoCheck" label="全不选"></el-radio-button>
                </el-radio-group>
                <el-tree :data="permissionList" show-checkbox node-key="id" ref="tree" accordion check-strictly
                  highlight-current check-on-click-node :props="defaultProps" :default-expanded-keys="defaultExpanded">
                </el-tree>
              </el-form-item> -->
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="success" @click="addEditUsers">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
    </el-col>
  </div>
</template>

<script>
import treeList from '@/components/treeList'

export default {
  components: {
    treeList
  },
  data() {
    var validatePWD = (rule, value, callback) => {
      var pass = /^[a-z0-9A-Z]{6,16}$/
      if (value === '') {
        callback(new Error('请输入密码'))
      } else if (!pass.test(value)) {
        callback(new Error('输入密码长度不少于6位最多不超16位！'))
      }
    }
    var validatePhone = (rule, value, callback) => {
      var reg = /^1\d{10}$/
      if (value === '') {
        callback(new Error('请输入手机号'))
      } else if (!reg.test(value)) {
        callback(new Error('手机号格式不正确！'))
      }
    }
    var validateEmail = (rule, value, callback) => {
      var reg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
      if (value === '') {
        callback(new Error('请输入邮箱'))
      } else if (!reg.test(value)) {
        callback(new Error('邮箱格式不正确！'))
      }
    }
    return {
      /* form开始 */
      isShow: true,
      dialogFormVisible: false,
      dialogGetDetail: false,
      form: {
        userName: '',
        loginName: '',
        password: '',
        status: '',
        phone: '',
        email: '',
        remark: '',
        organId: '',
        deptId: '',
        roleIdList: [],
        id: '',
        levels: '',
        state: ''
      },
      rules: {
        userName: [{
          required: true,
          message: '请输入姓名',
          trigger: 'blur'
        }],
        loginName: [{
          required: true,
          message: '请输入账号',
          trigger: 'blur'
        }],
        password: [{
          required: true,
          validator: validatePWD,
          trigger: 'blur'
        }],
        status: [{
          required: true,
          message: '请选择状态',
          trigger: 'change'
        }],
        remark: [],
        organId: [{
          required: true,
          message: '请选择所属机构',
          trigger: 'change'
        }],

        permissionChoose: [{
          required: true
        }],
        phone: [{
          required: true,
          validator: validatePhone,
          trigger: 'blur'
        }],
        email: [{
          required: true,
          validator: validateEmail,
          trigger: 'blur'
        }]
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
      levelsOptions: [{
        value: '0',
        label: '邢台市'
      },
      {
        value: '1',
        label: '区域'
      },
      {
        value: '2',
        label: '站点'
      }],
      levelsOptionsAdmin: [{
        value: '1',
        label: '区域'
      },
      {
        value: '2',
        label: '站点'
      }],
      stateOptions: [{
        value: '0',
        label: '桥西区'
      },
      {
        value: '1',
        label: '桥东区'
      }],
      organIdOptions: [],
      deptIdOptions: [],
      statusQueryOptions: [{
        value: '',
        label: '全部'
      }, {
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
      /* 角色复选框开始 */
      permissionList: [],
      // defaultProps: {
      //   children: 'children',
      //   label: 'label'
      // },
      // defaultExpanded: [],
      /* 复选框结束 */
      /* query开始 */
      query: {
        'status': '',
        'input': ''
      },
      vFlag: false
      /* query结束 */
    }
  },
  computed: {
    // 判断显示市级权限的计算属性
    showSuper() {
      /* eslint-disable eqeqeq */
      if (sessionStorage.getItem('levels') == 0) {
        // console.log('显示权限————————sys-users')
        // console.log('levels: ' + sessionStorage.getItem('levels'))
        return 'super'
      } else {
        return 'admin'
      }
    },
    leftHeight() {
      return ((document.documentElement.clientHeight || document.body.clientHeight) - 194)
    }
  },
  mounted() {
    this.loadData(this.query, this.currentPage, this.pagesize)
    this.getTreeList()
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
    formatStatus: function(val) {
      return val === 1 ? '禁用' : '正常'
    }
  },
  methods: {
    /* 判断按钮是否显示 */
    contens: function(arg) {
      let btnData = sessionStorage.getItem('permissionArr')
      let permissionArr = btnData.split(',')
      return permissionArr.indexOf(arg) !== -1
    },
    /* 初始化执行/请求用户列表 */
    loadData: function(query, pageNum, pageSize) {
      const loading = this.$loading({
        lock: true,
        text: '数据加载中...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.3)',
        target: document.querySelector('.el-table')
      })
      let condition = {
        'status': this.query.status,
        'name': this.query.input
      }
      let reqdata = {
        'pageNum': pageNum,
        'pageSize': pageSize,
        'condition': condition
      }
      let aesdata = reqdata
      let _this = this
      this.$http.post('/sysUser/list', aesdata)
        .then(response => {
          // console.log('用户列表————————sys')
          // console.log(response)
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
    getTreeList() {
      this.$nextTick(() => {
        this.$refs.tree.initTreeList()
      })
    },
    nodeclicked(data) {
      this.query.input = data.label
      this.loadData(this.query, this.currentPage, this.pagesize)
    },
    rowDbclick: function(row, event) {
      this.dialogGetDetail = true
      // console.log('row.id: ' + row.id)
      this.$http.get('/sysUser/detail/' + row.id)
        .then(response => {
          let respData = response
          if (respData.code === 0) {
            this.form.userName = respData.data.userName
            this.form.loginName = respData.data.loginName
            this.form.password = respData.data.password
            this.form.status = respData.data.status
            this.form.phone = respData.data.phone
            this.form.email = respData.data.email
            this.form.remark = respData.data.remark
            this.form.organId = respData.data.organId
            this.form.deptId = respData.data.deptId
            this.form.createDate = respData.data.createDate
            this.form.updateDate = respData.data.updateDate
            this.form.levels = respData.data.levels
            this.form.state = respData.data.state
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
    /* status下拉框 */
    getStatus: function(val) {
      this.form.status = val || ''
    },
    getLevels: function(val) {
      this.form.levels = val || ''
      if (val === '0') {
        this.form.state = '00'
      }
    },
    getState: function(val) {
      this.form.state = val || ''
    },
    // getorganIdStatus: function (val) {
    //   this.vFlag = true
    //   this.deptIdOptions = []
    //   this.form.deptId = ''
    //   this.form.organId = val || ''
    //   this.$http.get('/dept/getByOrgId/' + this.form.organId)
    //     .then(response => {
    //       let respData = response
    //       if (respData.code === 0) {
    //         for (let i = 0; i < respData.data.length; i++) {
    //           let orgObj = {
    //             'value': '',
    //             'label': ''
    //           }
    //           orgObj.value = respData.data[i].id
    //           orgObj.label = respData.data[i].depName
    //           this.deptIdOptions.push(orgObj)
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
    getdeptIdStatus: function(val) {
      this.form.deptId = val || ''
    },
    getQueryStatus: function(val) {
      this.query.status = val || ''
      this.loadData(this.query, this.currentPage, this.pagesize)
    },
    /* 分页器 */
    // 每页显示数据量变更
    handleSizeChange: function(val) {
      this.pagesize = val
      this.loadData(this.query, this.currentPage, this.pagesize)
    },

    // 页码变更
    handleCurrentChange: function(val) {
      this.currentPage = val
      // console.log('this.currentPage  ' + this.currentPage)

      this.loadData(this.query, this.currentPage, this.pagesize)
    },
    /* 权限全选 */
    // handleCheckAllChange: function (val) {
    //   let keysArr = []
    //   this.permissionList.forEach((v, i) => {
    //     keysArr.push(v.id)
    //   })
    //   switch (val) {
    //   case '全选':
    //     this.$refs.tree.setCheckedKeys(keysArr)
    //     break
    //   case '全不选':
    //     this.$refs.tree.setCheckedKeys([])
    //     break
    //   default:
    //     break
    //   }
    // },

    /* 请求添加用户接口 */
    addEditUsers: function() {
      // if (!this.$refs.tree.getCheckedKeys().length) {
      //   this.$message({
      //     type: 'warning',
      //     message: '请选择用户权限'
      //   })
      //   return
      // } else
      if (!this.form.userName) {
        this.$message({
          type: 'warning',
          message: '请输入用户姓名!'
        })
        return
      } else if (!this.form.loginName) {
        this.$message({
          type: 'warning',
          message: '请输入登录账户!'
        })
        return
      } else if (!this.form.password) {
        this.$message({
          type: 'warning',
          message: '请输入密码!'
        })
        return
      } else if (!this.form.status) {
        this.$message({
          type: 'warning',
          message: '请选择状态!'
        })
        return
      } else if (!this.form.phone) {
        this.$message({
          type: 'warning',
          message: '请输入手机号码!'
        })
        return
      } else if (!this.form.email) {
        this.$message({
          type: 'warning',
          message: '请输入邮箱账号!'
        })
        return
      }
      // this.form.roleIdList = this.$refs.tree.getCheckedKeys()
      if (this.form.id) {
        // console.log('有ID')
        let data = {
          id: this.form.id,
          userName: this.form.userName,
          loginName: this.form.loginName,
          password: this.form.password,
          status: this.form.status,
          phone: this.form.phone,
          email: this.form.email,
          remark: this.form.remark,
          organId: this.form.organId,
          deptId: this.form.deptId,
          roleIdList: this.form.roleIdList,
          levels: this.form.levels,
          state: this.form.state
        }
        let aesData = data
        this.$http.post('/sysUser/update', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '修改成功'
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
      } else {
        // console.log('么有ID')
        let data = {
          userName: this.form.userName,
          loginName: this.form.loginName,
          password: this.form.password,
          status: this.form.status,
          phone: this.form.phone,
          email: this.form.email,
          remark: this.form.remark,
          organId: this.form.organId,
          deptId: this.form.deptId,
          roleIdList: this.form.roleIdList,
          levels: this.form.levels,
          state: this.form.state
        }
        let aesData = data
        this.$http.post('/sysUser/add', aesData)
          .then(response => {
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '添加成功'
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
      }
    },
    /* 编辑 */
    handleEdit: function(index, row) {
      this.isShow = false
      this.deptIdOptions = []
      // this.$http.get('/dept/getByOrgId/' + row.organId)
      //   .then(response => {
      //     let respData = response
      //     if (respData.code === 0) {
      //       for (let i = 0; i < respData.data.length; i++) {
      //         let orgObj = {
      //           'value': '',
      //           'label': ''
      //         }
      //         orgObj.value = respData.data[i].id
      //         orgObj.label = respData.data[i].depName
      //         this.deptIdOptions.push(orgObj)
      //       }
      //     } else if (respData.code === -1) {
      //       this.$message({
      //         type: 'info',
      //         message: respData.msg
      //       })
      //     }
      //   })
      //   .catch(response => {
      //     console.log('进入catch')
      //     console.log(response)
      //   })

      this.form.userName = row.userName
      this.form.loginName = row.loginName
      this.form.password = row.password
      this.form.status = row.status
      this.form.phone = row.phone
      this.form.email = row.email
      this.form.remark = row.remark
      this.vFlag = true
      this.form.organId = row.organId ? row.organId.toString() : ''
      this.form.deptId = row.deptId ? row.deptId : ''

      // let _this = this
      // setTimeout(function () {
      //   if (_this.$refs.tree) {
      //     _this.$refs.tree.setCheckedKeys(row.roleIdList === null ? [] : row.roleIdList)
      //   }
      // }, 500)
    },
    /* 删除 */
    handleDelete: function(index, row) {
      this.$confirm('是否删除?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // console.log('删除了')
        this.$http.get('/sysUser/delete/' + row.id)
          .then(response => {
            // console.log('删除————————sys')
            // console.log(response)
            let respData = response
            if (respData.code === 0) {
              this.$message({
                type: 'success',
                message: '删除成功!'
              })
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
    /* 初始化角色列表 */
    initPermissionList: function() {
      // console.log('跳转了')
      this.$http.get('/sysRole/listAll')
        .then(response => {
          let permissionArr = []
          // console.log('角色列表————————sys')
          // console.log(response)
          let respData = response
          if (respData.code === 0) {
            for (let i = 0; i < respData.data.length; i++) {
              permissionArr.push({
                id: respData.data[i].id,
                label: respData.data[i].roleName
              })
            }
            this.permissionList = permissionArr
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

      // this.$http.get('/sysOrgan/orgList')
      //   .then(response => {
      //     this.organIdOptions = []
      //     let respData = response
      //     if (respData.code === 0) {
      //       for (let i = 0; i < respData.data.length; i++) {
      //         let orgObj = {
      //           'value': '',
      //           'label': ''
      //         }
      //         orgObj.value = respData.data[i].id
      //         orgObj.label = respData.data[i].organName
      //         this.organIdOptions.push(orgObj)
      //       }
      //     } else if (respData.code === -1) {
      //       this.$message({
      //         type: 'info',
      //         message: respData.msg
      //       })
      //     }
      //   })
      //   .catch(response => {
      //     console.log('进入catch')
      //     console.log(response)
      //   })
    },
    /* 清空form */
    resetForm: function() {
      this.isShow = true
      this.form.userName = ''
      this.form.loginName = ''
      this.form.password = ''
      this.form.status = ''
      this.form.phone = ''
      this.form.email = ''
      this.form.remark = ''
      this.form.organId = ''
      this.form.deptId = ''
      this.form.roleIdList = []
      this.vFlag = false
      if (this.$refs['form']) {
        this.$refs['form'].resetFields()
      }
      // if (!this.$refs.tree) {
      //   return
      // }
      // this.$refs.tree.setCheckedKeys([])
    },
    queryBtn: function() {
      this.loadData(this.query, this.currentPage, this.pagesize)
    },
    queryBtnSuper: function () {
      this.query.status = ''
      this.query.input = ''
      this.currentPage = 1
      this.loadData(this.query, this.currentPage, this.pagesize)
    }
  }
}
</script>

<style lang='scss'>
.container{
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
