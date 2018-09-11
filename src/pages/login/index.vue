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
              <div class="login-photo"></div>
              <div class="login-input">
                <form>
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
                </form>
                <form>
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
                </form>
              </div>
            </div>
            <div class="login-main-resident" v-else v-loading="loading"
              element-loading-text="正在加载居民数据"
              element-loading-spinner="el-icon-loading"
            >
              <div class="login-photo"></div>
              <div class="login-input">
                <ul class="login-input-enter">
                  <li class="name">
                    <span class="login-name-text">姓名</span>
                    <input type="text" class="login-name-input" placeholder="姓名" v-model.trim="name" autocomplete="on">
                  </li>
                  <li class="idcard">
                    <span class="login-idcard-text">身份证号</span>
                    <input type="text" class="login-idcard-input" placeholder="身份证号" v-model.trim="idcard" autocomplete="on">
                  </li>
                  <li class="button">
                    <el-button class="seach" @click="seach">查询</el-button>
                  </li>
                </ul>
              </div>
            </div>
            <resident-details :personalMess="personalMess" ref="resident"></resident-details>
          </div>
        </div>
    </div>
</template>

<script>
import {login, changePass} from '@/api/permission'
import {loginResident, getPersonalMess} from '@/api/resident'
import residentDetails from './residentDetails'

export default {
  data() {
    return {
      account: '',
      password: '',
      newPassword: '',
      userToggle: 'resident',
      changeToggle: false,

      name: '',
      idcard: '',
      personalMess: [],
      residentToggle: false,

      loading: false
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
      login().then(response => {
        if (response.code === 0) {
          this.$message({
            message: '登陆成功，欢迎 ' + response.data.name,
            type: 'success'
          })
          sessionStorage.setItem('name', response.data.name)
          this.$store.commit('LOGIN_IN', response.code)
          this.$router.replace('/')
          if (response.data.stationId) {
            sessionStorage.setItem('id', response.data.stationId)
          }
        } else {
          loading.close()
          this.$message.error({
            message: response.msg
          })
        }
      }).catch(error => {
        loading.close()
        console.log(error)
      }).then(() => {
        loading.close()
      })
    },
    change() {
      changePass().then(response => {
        if (response.code === 0) {
          this.$message({
            message: '密码修改成功',
            type: 'success'
          })
          this._toggle()
        } else {
          this.$message.error({
            message: response.msg
          })
        }
      })
    },
    transResident() {
      this.userToggle = 'resident'
    },
    transManager() {
      this.userToggle = 'manager'
    },
    seach() {
      this.loading = true
      loginResident().then(response => {
        if (response.code === 0) {
          this.$refs.resident._toggleResident()
          this._initMess()
        } else {
          this.loading = false
          this.$message.error({
            message: response.msg
          })
        }
      }).catch(error => {
        this.loading = false
        console.log(error)
      }).then(() => {
        this.loading = false
      })
    },
    _toggle() {
      this.changeToggle = !this.changeToggle
    },
    _initMess() {
      getPersonalMess().then(response => {
        this.personalMess = response.data
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .login {
    position: relative;
    width: 600px;
    // height: 400px;
    top: calc(50% - 200px);
    left: calc(50% - 300px);
    .title {
      display: block;
      font-weight: bolder;
      text-align: center;
      font-size: 27px;
      line-height: 54px;
    }
    .login-content {
      .login-tab {
        display: flex;
        width: 100%;
        height: 35px;
        .tab-manager {
          flex: 1;
          font-weight: bold;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
          background-color: green;
        }
        .tab-resident {
          flex: 1;
          font-weight: bold;
          line-height: 35px;
          text-align: center;
          cursor: pointer;
          background-color: yellow;
        }
      }
      .login-main-manager {
        width: 100%;
        height: 200px;
        .login-photo {
          display: inline-block;
          width: 45%;
          height: 100%;
          vertical-align: top;
          background-color: red;
        }
        .login-input {
          display: inline-block;
          height: 100%;
          .login-input-enter {
            .name {

            }
            .password {

            }
            .button {
              .enter {
                display: inline-block;
                background-color: yellow;
                height: 30px;
                width: 90px;
                cursor: pointer;
              }
              .change {
                display: inline-block;
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
            bottom: 0;
            height: 200px;
            width: 330px;
            z-index: 10;
            background-color: blue;
            &.slide-enter-active, &.slide-leave-active {
              transition: all .3s ease;
            }
            &.slide-enter, &.slide-leave-to {
              transform: translate3d(50%,0,0);
              opacity: 0;
            }
          }
        }
      }
      .login-main-resident {
        width: 100%;
        height: 200px;
        .login-photo {
          display: inline-block;
          width: 30%;
          height: 100%;
          vertical-align: top;
        }
        .login-input {
          display: inline-block;
          height: 100%;
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
