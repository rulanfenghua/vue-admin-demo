<template>
  <div class="login-wrapper">
    <div class="login">
      <h1 class="title">桥西区医学影像信息管理系统</h1>
      <div class="login-content">
        <div class="login-tab">
          <div class="tab-resident" @click="transResident" :class="{'active': userToggle === 'manager'}">居民查询入口</div>
          <div class="tab-manager" @click="transManager" :class="{'active': userToggle === 'resident'}">管理登陆入口</div>
        </div>
        <div class="login-main-manager" v-if="userToggle === 'manager'">
          <!-- <div class="photo"></div> -->
            <el-form :model="loginForm" :rules="loginRules" auto-complete="on" label-position="left" class="login-input-enter" style="padding-top:30px" status-icon ref="loginForm" label-width="90px">
              <el-form-item prop="username" label="用户名">
                <span class="">

                </span>
                <el-input v-model="loginForm.username" placeholder="请填写您的用户名" name="username" type="text" auto-complete="on" />
              </el-form-item>
              <el-form-item prop="password" label="密码">
                <span class="">

                </span>
                <el-input type="password" v-model="loginForm.password" placeholder="请填写您的密码" name="password"
                  auto-complete="on" @keyup.enter.native="userLogin" />
              </el-form-item>
              <el-form-item prop="captcha" label="验证码">
                <el-input type="text" v-model.trim="loginForm.captcha" placeholder="请输入验证码" name="captcha"
                  auto-complete="off" @keyup.enter.native="seach" style="width:132px;" />
                <img width="80" height="25" :src="captchaSrc" @click="changeImg" style="cursor:pointer;vertical-align:middle;height:34px;border-radius:2px" />
              </el-form-item>
              <div class="button">
              <el-button type="primary" style="background-color:#347ed3;" @click.native.prevent="userLogin">点击登陆</el-button>
              <el-button type="primary" style="background-color:#347ed3;" @click.native.prevent="_toggle">修改密码</el-button>
              </div>
            </el-form>
            <transition name="slide">
              <el-form :model="loginForm" :rules="changeRules" auto-complete="on" label-position="left" class="login-input-change"
                v-show="changeToggle" label-width="80px" style="width:325px" status-icon ref="changeForm">
                <el-form-item prop="username" label="用户名" style="color:#000">
                  <span class="">

                  </span>
                  <el-input v-model="loginForm.username" placeholder="请填写您的用户名" name="username" type="text"
                    auto-complete="on" />
                </el-form-item>
                <el-form-item prop="password" label="密码">
                  <span class="">

                  </span>
                  <el-input type="password" v-model="loginForm.password" placeholder="请填写您的密码" name="password"
                    auto-complete="on" />
                </el-form-item>
                <el-form-item prop="newPassword" label="新密码">
                  <span class="">

                  </span>
                  <el-input type="password" v-model="loginForm.newPassword" placeholder="请填写您新的密码" name="newPassword"
                    auto-complete="on" @keyup.enter.native="change" />
                </el-form-item>
                <div class="button">
                  <el-button :loading="changeLoading" type="primary" @click.native.prevent="change" size="medium">修改密码</el-button>
                  <el-button type="info" @click.native.prevent="_toggle" size="medium">取消</el-button>
                </div>
              </el-form>
            </transition>
        </div>
        <div class="login-main-resident" v-else>
            <el-form :model="residentLoginForm" :rules="seachRules" label-position="left" class="login-input-enter" style="padding-top:30px" status-icon ref="seachForm" label-width="90px">
              <el-form-item prop="name" label="您的名字">
                <span class="">

                </span>
                <el-input v-model="residentLoginForm.name" placeholder="请填写您的名字" name="name" type="text" auto-complete="on" />
              </el-form-item>
              <el-form-item prop="idcard" label="身份证号">
                <span class="">

                </span>
                <el-input type="text" v-model="residentLoginForm.idcard" placeholder="请填写您的身份证号" name="idcard"
                  auto-complete="on" @keyup.enter.native="seach" />
              </el-form-item>
              <!-- <div class="captcha">
                <el-input type="text" name="captcha" placeholder="请输入验证码" v-model.trim="captcha" @keyup.enter.native="seach" style="width:132px;" />
                <img width="80" height="25" :src="captchaSrc" @click="changeImg" style="cursor:pointer" />
              </div> -->
              <el-form-item prop="captcha" label="验证码">
                <el-input type="text" v-model.trim="residentLoginForm.captcha" placeholder="请输入验证码" name="captcha"
                  auto-complete="off" @keyup.enter.native="seach" style="width:132px;" />
                <img width="80" height="25" :src="captchaSrc" @click="changeImg" style="cursor:pointer;vertical-align:middle;height:34px;border-radius:2px" />
              </el-form-item>
              <div class="button">
              <el-button type="primary" style="width:90%;background-color:#347ed3" @click.native.prevent="seach">查询诊断列表</el-button>
              </div>
            </el-form>
            <!-- <div class="photo"></div> -->
        </div>
      </div>
    </div>
    <div class="background">
      <!-- <img src="./影像.jpg" alt="" width="100%" height="100%"> -->
    </div>
    <!-- 引入residentDetails组件 -->
    <resident-details :personalMess="personalMess" :id="id" :personalData="personalData" ref="resident"></resident-details>
  </div>

</template>

<script>
import {login, changePass} from '@/api/permission'
import {loginResident} from '@/api/resident'
import residentDetails from '@/components/residentDetails'
import baseURL from '@/config/baseUrl'

export default {
  data() {
    // var validatePass = (rule, value, callback) => {
    //   if (value === '') {
    //     callback(new Error('请输入登陆名称'))
    //   } else {
    //     callback()
    //   }
    // }

    return {
      userToggle: 'resident',
      changeToggle: false,
      loginForm: {
        username: '',
        password: '',
        newPassword: '',
        captcha: ''
      },

      id: '',
      personalMess: [],
      residentToggle: false,
      residentLoginForm: {
        name: '',
        idcard: '',
        captcha: ''
      },

      captchaSrc: baseURL + '/common/captcha',

      personalData: {},

      changeLoading: false,

      loginRules: {
        username: [{ required: true, message: '请填写登陆名称', trigger: 'blur' }],
        password: [{ trigger: 'blur', required: true, message: '请填写登陆密码' }],
        captcha: [{ trigger: 'blur', required: true, message: '请填写验证码' }]
      },
      changeRules: {
        username: [{ trigger: 'blur', required: true, message: '请输入登陆名称' }],
        password: [{ trigger: 'blur', required: true, message: '请填写登陆密码' }],
        newPassword: [{ trigger: 'blur', required: true, message: '请填写新密码' }]
      },
      seachRules: {
        name: [{ trigger: 'blur', required: true, message: '请输入姓名' }],
        idcard: [{ trigger: 'blur', required: true, message: '请输入身份证号' }],
        captcha: [{ trigger: 'blur', required: true, message: '请输入验证码' }]
      }
    }
  },
  components: {
    residentDetails
  },
  methods: {
    userLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          // const loading = this.$loading({
          //   lock: true,
          //   text: '登陆中',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0, 0, 0, 0.7)'
          // })
          login(this.loginForm.username, this.loginForm.password, this.loginForm.captcha).then(response => {
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
              // loading.close()
              this.$message.error({
                message: response.msg
              })
              this.captcha = ''
              this.captchaSrc = baseURL + '/common/captcha?t=' + Math.random()
            }
          }).catch(error => {
            // loading.close()
            console.log('错误————————login')
            console.log(error)
          }).then(() => {
            // loading.close()
          })
        } else {
          return false
        }
      })
    },
    // 修改密码方法
    change() {
      this.$refs.changeForm.validate((valid) => {
        if (valid) {
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
        } else {
          return false
        }
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
      this.$refs.seachForm.validate((valid) => {
        if (valid) {
          // const loading = this.$loading({
          //   lock: true,
          //   text: '正在加载居民数据',
          //   spinner: 'el-icon-loading',
          //   background: 'rgba(0, 0, 0, 0.7)'
          // })
          loginResident(this.residentLoginForm.name, this.residentLoginForm.idcard, this.residentLoginForm.captcha).then(response => {
            if (response.code === 0) {
              console.log('居民登陆————————seach')
              console.log(response)
              this.personalData = response.data
              this.id = response.data.id
              this._initMess()
              this.$refs.resident._toggleResident()
            } else {
              // loading.close()
              this.$message.error({
                message: response.msg
              })
              this.captcha = ''
              this.captchaSrc = baseURL + '/common/captcha?t=' + Math.random()
            }
          }).catch(error => {
            // loading.close()
            console.log('错误————————seach')
            console.log(error)
          }).then(() => {
            // loading.close()
          })
        } else {
          return false
        }
      })
    },
    changeImg() {
      console.log(1)
      this.captchaSrc = baseURL + '/common/captcha?t=' + Math.random()
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

<style lang="scss">
.login-wrapper {
  .el-form-item__label {
    color: #ddddddf5;
    font-size: 16px;
    // font-weight: bold;
    font-family: "黑体";
  }
  .login-input-change {
    .el-form-item__label {
      color: #646479;
    }
  }
  .el-button {
    font-weight: bold;
    font-size: 14px;
  }
  .login-input-enter {
    .el-button {
      width: 140px;
    }
  }
}

</style>

<style scoped lang="scss">
.login-wrapper{
  width: 100%;
  height: 100%;
  overflow: hidden;

  .login {
    position: relative;
    width: 325px;
    top: calc(50% - 175px);
    left: calc(50% + 65px);
    .title {
      display: block;
      // position: absolute;
      width: 600px;
      font-weight: 900;
      text-align: center;
      font-size: 35px;
      line-height: 54px;
      color: #fff;
      font-family: Helvetica,Arial,"Hiragino Sans GB","Microsoft Yahei","黑体",sans-serif!important;
      letter-spacing: 5px;
      margin-bottom: 50px;
      margin-left: -134px;
    }
    .login-content {
      // background-color: #fff;
      .login-tab {
        display: flex;
        // margin-left: 59px;
        width: 100%;
        height: 40px;
        // margin-bottom: 30px;
        // letter-spacing: 4px;

        font-size: 14px;
        .tab-manager {
          flex: 1;
          font-weight: bold;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          background-color: #347ed3;
          color: #fff;
          border-radius: 4px;
          &:active {
            border: 1px solid  #347ed3;
            background-color:  #347ed3;
            // border-radius: 1px;
          }
          &.active {
            background-color: #0d234a;
            &:active {
              border: 1px solid  #0d234a;
              background-color:  #0d234a;
              // border-radius: 1px;
            }
          }
        }
        .tab-resident {
          flex: 1;
          font-weight: bold;
          line-height: 40px;
          text-align: center;
          cursor: pointer;
          // background-color:#2960c5;
          background-color: #347ed3;
          color: #fff;
          border-radius: 4px;
          &:active {
            border: 1px solid #347ed3;
            background-color: #347ed3;
            // border-radius: 1px;
          }
          &.active {
            background-color: #0d234a;
            &:active {
              border: 1px solid  #0d234a;
              background-color:  #0d234a;
              // border-radius: 1px;
            }
          }
        }
        .tab-confirm {

        }
      }
      .login-main-manager {
        width: 100%;
        height: 200px;
        display: flex;
        // background-color: #fff;
        .photo {
          flex: 1;
        }
          .login-input-enter {
            flex: 1;
            .name {

            }
            .password {

            }
            .button {
              text-align: center;
            }
          }
          .login-input-change {
            position: absolute;
            right: 0;
            top: 146px;
            // height: 194px; // 自适应高度
            // width: 330px; // el-form的width属性不能在此设置
            z-index: 10;
            border-radius: 4px;
            border: 1px solid #e6e6e6;
            background-color: #e6e6e6;
            &.slide-enter-active, &.slide-leave-active {
              transition: all .3s ease;
            }
            &.slide-enter, &.slide-leave-to {
              transform: translate3d(30%,0,0);
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
              // padding-right: 204px;
            }
          }
      }
      .login-main-resident {
        width: 100%;
        height: 200px;
        display: flex;
        // background-color: #fff;
          .login-input-enter {
            flex: 1;
            .name {

            }
            .idcard {

            }
            .button {
              text-align: center;
            }
          }
        .photo {
          flex: 1;
        }
      }
    }
  }
  .background {
    position: absolute;
    top: 0;
    right: 0;
    background: no-repeat center/100% url('./影像.jpg');
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(1px);
    // opacity: 0.9;
    overflow: hidden;
  }
}
</style>
