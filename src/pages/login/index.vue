<template>
    <div class="login-wrapper">
        <div class="login">
          <h1 class="title">桥西区医学影像管理系统</h1>
          <div class="login-content">
            <div class="login-tab">
              <div class="tab-resident" @click="transResident">居民查询入口</div>
              <div class="tab-manager" @click="transManager">管理登陆入口</div>
            </div>
            <div class="login-main-manager" v-if="userToggle === 'manager'">
                <!-- <form>
                <ul class="login-input-enter">
                  <li class="name">
                    <span class="login-name-text">登陆名称</span>
                    <input type="text" class="login-name-input" placeholder="账号" v-model.trim="account" autocomplete="on">
                  </li>
                  <li class="password">
                    <span class="login-password-text">登陆密码</span>
                    <input type="password" class="login-password-input" placeholder="密码" v-model.trim="password" @keyup.enter="userLogin" autocomplete="new-password">
                  </li>
                  <li class="button">
                    <div class="enter" @click="userLogin">登陆</div>
                    <div class="change" @click="_toggle">修改密码</div>
                  </li>
                </ul>
                </form> -->
                <el-form :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left" class="login-input-enter" label-width="80px">
                  <el-form-item prop="name" label="用户名">
                    <span class="">

                    </span>
                    <el-input
                      v-model="loginForm.username"
                      placeholder="请填写您的用户名"
                      name="username"
                      type="text"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password" label="密码">
                    <span class="">

                    </span>
                    <el-input
                      type="password"
                      v-model="loginForm.password"
                      placeholder="请填写您的密码"
                      name="password"
                      auto-complete="on"
                      @keyup.enter.native="userLogin" />
                  </el-form-item>
                  <el-button type="primary" style="margin-bottom:30px;" @click.native.prevent="userLogin">点击登陆</el-button>
                  <el-button type="primary" style="margin-bottom:30px;" @click.native.prevent="_toggle">修改密码</el-button>
                </el-form>
                <!-- <form>
                <transition name="slide">
                <ul class="login-input-change" v-show="changeToggle">
                  <li class="name">
                    <span class="login-name-text">登陆名称</span>
                    <input type="text" class="login-name-input" placeholder="账号" v-model.trim="account" autocomplete="on">
                  </li>
                  <li class="password">
                    <span class="login-password-text">登陆密码</span>
                    <input type="password" class="login-password-input" placeholder="密码" v-model.trim="password" autocomplete="new-password">
                  </li>
                  <li class="new-password">
                    <span class="login-new-password-text">新密码</span>
                    <input type="password" class="login-new-password-input" placeholder="新密码" v-model.trim="newPassword" autocomplete="new-password">
                  </li>
                  <li class="button">
                    <div class="enter" @click="change">确定</div>
                    <div class="change" @click="_toggle">取消</div>
                  </li>
                </ul>
                </transition>
                </form> -->
                <transition name="slide">
                <el-form :model="loginForm" :rules="changeRules" auto-complete="on" label-position="left" class="login-input-change" v-show="changeToggle" label-width="80px" style="width:600px">
                  <el-form-item prop="name" label="用户名">
                    <span class="">

                    </span>
                    <el-input
                      v-model="loginForm.username"
                      placeholder="请填写您的用户名"
                      name="username"
                      type="text"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="password" label="密码">
                    <span class="">

                    </span>
                    <el-input
                      type="password"
                      v-model="loginForm.password"
                      placeholder="请填写您的密码"
                      name="password"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="newPassword" label="新密码">
                    <span class="">

                    </span>
                    <el-input
                      type="password"
                      v-model="loginForm.newPassword"
                      placeholder="请填写您新的密码"
                      name="newPassword"
                      auto-complete="on"
                      @keyup.enter.native="change" />
                  </el-form-item>
                  <div class="button">
                  <el-button :loading="changeLoading" type="primary" @click.native.prevent="change">修改密码</el-button>
                  <el-button type="primary" @click.native.prevent="_toggle">取消</el-button>
                  </div>
                </el-form>
                </transition>
            </div>
            <!-- <div class="login-main-resident" v-else v-loading="loading"
              element-loading-text="正在加载居民数据"
              element-loading-spinner="el-icon-loading"
            > -->
            <div class="login-main-resident" v-else>
              <!-- <div class="login-input">
                <ul class="login-input-enter">
                  <li class="name">
                    <span class="login-name-text">姓名</span>
                    <input type="text" class="login-name-input" placeholder="姓名" v-model.trim="name" autocomplete="on">
                  </li>
                  <li class="idcard">
                    <span class="login-idcard-text">身份证号</span>
                    <input type="text" class="login-idcard-input" placeholder="身份证号" v-model.trim="idCard" autocomplete="on">
                  </li>
                  <li class="button">
                    <el-button class="seach" @click="seach">查询</el-button>
                  </li>
                </ul>
              </div> -->
              <el-form :model="residentLoginForm" :rules="seachRules" label-position="left" class="login-input-enter" label-width="80px">
                  <el-form-item prop="name" label="名字">
                    <span class="">

                    </span>
                    <el-input
                      v-model="residentLoginForm.name"
                      placeholder="请填写您的名字"
                      name="name"
                      type="text"
                      auto-complete="on"
                    />
                  </el-form-item>
                  <el-form-item prop="idcard" label="身份证号">
                    <span class="">

                    </span>
                    <el-input
                      type="text"
                      v-model="residentLoginForm.idcard"
                      placeholder="请填写您的身份证号"
                      name="idcard"
                      auto-complete="on"
                      @keyup.enter.native="seach" />
                  </el-form-item>
                  <el-button type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="seach">查询诊断列表</el-button>
                </el-form>
            </div>
            <!-- 引入组件 -->
            <resident-details :personalMess="personalMess" :id="id" ref="resident"></resident-details>
          </div>
        </div>
    </div>
</template>

<script>
import {login, changePass} from '@/api/permission'
// import {loginResident, getPersonalMess} from '@/api/resident'
import {loginResident} from '@/api/resident'
import residentDetails from '@/components/residentDetails'

export default {
  data() {
    return {
      // loginForm.userName: '',
      // password: '',
      // newPassword: '',
      userToggle: 'resident',
      changeToggle: false,
      loginForm: {
        userName: '',
        password: '',
        newPassword: ''
      },

      // name: '',
      // idCard: '',
      id: '',
      personalMess: [],
      residentToggle: false,
      residentLoginForm: {
        name: '',
        idCard: ''
      },

      personalData: {},

      changeLoading: false,

      loginRules: {
        username: [{ trigger: 'blur' }],
        password: [{ trigger: 'blur' }]
      },
      changeRules: {
        username: [{ trigger: 'blur' }],
        password: [{ trigger: 'blur' }],
        newPassword: [{ trigger: 'blur' }]
      },
      seachRules: {
        name: [{ trigger: 'blur' }],
        idcard: [{ trigger: 'blur' }]
      }
    }
  },
  components: {
    residentDetails
  },
  methods: {
    userLogin() {
      const loading = this.$loading({
        lock: true,
        text: '登陆中',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      login(this.loginForm.username, this.loginForm.password).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '登陆成功，欢迎 ' + response.data.userName,
            type: 'success'
          })
          sessionStorage.setItem('name', response.data.userName)
          this.$store.commit('LOGIN_IN', response.code)
          this.$router.replace('/')
          console.log('权限相关————————login')
          console.log(response.data)
          console.log(response.data.levels)
          if (response.data.levels) {
            sessionStorage.setItem('levels', response.data.levels)
            console.log('角色权限相关————————login')
            console.log('levels: ' + sessionStorage.getItem('levels'))
          }
        } else {
          loading.close()
          this.$message.error({
            message: response.msg
          })
        }
      }).catch(error => {
        loading.close()
        console.log('错误————————login')
        console.log(error)
      }).then(() => {
        loading.close()
      })
    },
    change() {
      this.changeLoading = true
      changePass(this.loginForm.username, this.loginForm.password, this.loginForm.newPassword).then(response => {
        if (response.code === 0) {
          this.$message({
            message: '密码修改成功',
            type: 'success'
          })
          this._toggle()
        } else {
          this.changeLoading = false
          this.$message.error({
            message: response.msg
          })
        }
      }).catch(error => {
        this.changeLoading = false
        console.log('错误————————change')
        console.log(error)
      }).then(() => {
        this.changeLoading = false
      })
    },
    transResident() {
      this.userToggle = 'resident'
    },
    transManager() {
      this.userToggle = 'manager'
    },
    // 居民查询方法
    seach() {
      // this.loading = true // 废弃的element加载层
      const loading = this.$loading({
        lock: true,
        text: '正在加载居民数据',
        spinner: 'el-icon-loading',
        background: 'rgba(125, 125, 125, 0.2)'
      })
      loginResident(this.residentLoginForm.name, this.residentLoginForm.idcard).then(response => {
        if (response.code === 0) {
          console.log('居民登陆————————seach')
          console.log(response)
          this.personalData = response.data
          this.id = response.data.id
          this._initMess()
          this.$refs.resident._toggleResident()
        } else {
          this.loading = false
          this.$message.error({
            message: response.msg
          })
        }
      }).catch(error => {
        // this.loading = false
        loading.close()
        console.log('错误————————seach')
        console.log(error)
      }).then(() => {
        // this.loading = false
        loading.close()
      })
    },
    _toggle() {
      this.changeToggle = !this.changeToggle
    },
    _initMess() {
      this.$http.get('/resident/getPersonalDateList' + '/' + this.id).then(response => {
        console.log('居民列表数据————————login')
        console.log(response)
        this.personalMess = response.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
.login-wrapper{
  width: 100%;
  height: 100%;
  background-color: #0f54a1;

  .login {
    position: relative;
    width: 600px;
    top: calc(50% - 200px);
    left: calc(50% - 300px);
    .title {
      display: block;
      font-weight: 900;
      text-align: center;
      font-size: 35px;
      line-height: 54px;
      color: #fff;
      font-family: Helvetica,Arial,"Hiragino Sans GB","Microsoft Yahei","黑体",sans-serif!important;
      letter-spacing: 5px;
      margin-bottom: 50px;
    }
    .login-content {
      .login-tab {
        display: flex;
        width: 100%;
        height: 40px;
        margin-bottom: 30px;
        letter-spacing: 4px;
        .tab-manager {
          flex: 1;
          font-weight: bold;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          background-color: green;
          &:active {
            border: 1px solid #000;
            background-color: green;
            border-radius: 1px;
          }
        }
        .tab-resident {
          flex: 1;
          font-weight: bold;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          background-color: yellow;
          &:active {
            border: 1px solid #000;
            background-color: yellow;
            border-radius: 1px;
          }
        }
        .tab-confirm {

        }
      }
      .login-main-manager {
        width: 100%;
        height: 200px;
        // background-color: #fff;
          .login-input-enter {
            .name {

            }
            .password {

            }
            .button {
              .enter {
                background-color: yellow;
                height: 30px;
                width: 90px;
                cursor: pointer;
              }
              .change {
                background-color: green;
                height: 30px;
                width: 90px;
                cursor: pointer;
              }
            }
          }
          .login-input-change {
            position: absolute;
            right: 0;
            top: 102px;
            // height: 194px; // 自适应高度
            // width: 330px; // el-form的width属性不能在此设置
            z-index: 10;
            border-radius: 4px;
            border: 1px solid #fff;
            background-color: #fff;
            &.slide-enter-active, &.slide-leave-active {
              transition: all .3s ease;
            }
            &.slide-enter, &.slide-leave-to {
              transform: translate3d(50%,0,0);
              opacity: 0;
            }
            .el-form-item {
              margin-right: 42px;
              margin-left: 26px;
              &:first-child {
                margin-top: 30px;
              }
            }
            .button {
              text-align: center;
              padding-right: 204px;
            }
          }
      }
      .login-main-resident {
        width: 100%;
        height: 200px;
        // background-color: #fff;
          .login-input-enter {
            .name {

            }
            .idcard {

            }
            .button {

            }
          }
      }
    }
  }
}
</style>
