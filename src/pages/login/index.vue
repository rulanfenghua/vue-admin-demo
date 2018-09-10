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
                    <div class="change" @click="toggle">修改密码</div>
                  </li>
                </ul>
                </form>
                <form>
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
                    <div class="change" @click="toggle">取消</div>
                  </li>
                </ul>
                </form>
              </div>
            </div>
            <div class="login-main-resident" v-else>
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
                    <div class="seach" @click="seach">查询</div>
                  </li>
                </ul>
              </div>
            </div>
            <div class="resident-details" v-show="residentToggle">

            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { login } from '@/api/permission'
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
      residentToggle: false
    }
  },
  methods: {
    userLogin() {
      login().then(response => {
        if (response.code === 0) {
          this.$message({
            message: '登陆成功，欢迎username',
            type: 'success'
          })
          this.$store.commit('LOGIN_IN', response.code)
          this.$router.replace('/')
        } else {
          this.$message.error({
            message: response.msg
          })
        }
      })
    },
    change() {

    },
    transResident() {
      this.userToggle = 'resident'
    },
    transManager() {
      this.userToggle = 'manager'
    },
    toggle() {
      this.changeToggle = !this.changeToggle
    },
    seach() {
      this.residentToggle = !this.residentToggle
    }
  }
}
</script>

<style scoped lang="scss">
  .login {
    width: 600px;
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
        }
      }
    }
  }
</style>
