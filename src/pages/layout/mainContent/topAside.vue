<template>
  <div class="container">
    <div class="top-aside">
      <h1 class="title">桥西区医学影像信息管理系统</h1>
      <div class="tab-container">
        <ul class="tab">
          <li class="tab-item">
            <router-link to="/home">
              <i class="icon-home"></i>
              <span>首页</span>
            </router-link>
          </li>
          <li class="tab-item">
            <router-link to="/residents">
              <i class="icon-address-book"></i>
              <span>居民列表</span>
            </router-link>
          </li>
          <li class="tab-item">
            <router-link to="/logging">
              <i class="icon-file-text"></i>
              <span>日志管理</span>
            </router-link>
          </li>
          <li class="tab-item">
            <router-link to="/systemSetting">
              <i class="icon-cog"></i>
              <span>系统管理</span>
            </router-link>
          </li>
          <li class="tab-item">
            <router-link to="/systemSetting">
              <i class="icon-cog"></i>
              <span>系统管理</span>
            </router-link>
          </li>
          <li class="tab-item">
            <router-link to="/systemSetting">
              <i class="icon-cog"></i>
              <span>系统管理</span>
            </router-link>
          </li>

        </ul>
      </div>
      <div class="top-right">
        <span class="user-name">早上好：usrname</span>
        <div class="quit" @click="loginOut">
          <i class="icon-switch"></i>
        </div>
      </div>
    </div>
    <div class="breadcrumd-wrapper">
      <span class="intro">您所在的位置是：</span>
      <el-breadcrumb separator="/">
        <transition-group name="breadcrumb">
          <el-breadcrumb-item
            v-for="(route,i) in crumbList"
            :key="route.name"
            :to="{name:route.name}"
            v-if="route.name!='home'"
            :class="{'is-last-link':i==crumbList.length-1}"
          >
            {{route.meta.name}}
          </el-breadcrumb-item>
        </transition-group>
      </el-breadcrumb>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'topAside',
  computed: {
    ...mapState(['crumbList'])
  },
  methods: {
    loginOut() {
      this.$store.commit('LOGIN_OUT')
      /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
      window.location.reload()
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    width: 100%;

    .top-aside {
      padding-top: 23px;
      height: 100px;
      background-color: greenyellow;
      .title {
        display: inline-block;
        padding: 12px 40px 0 40px;
        font-weight: 575;
        font-size: 24px;
        vertical-align: top;
        color: #000;
      }
      .tab-container {
        height: 100px;
        display: inline-block;
        margin-left: 134px;
        margin-top: 9px;
        .tab {
          padding: 0 10px;
          display: inline-block;
          .tab-item {
            display: inline-block;
            &:last-child {
              a {
                margin-right: 0;
              }
            }
            a {
              display: block;
              width: 64px;
              text-align: center;
              i {
                display: block;
                font-size: 27px;
                width: 27px;
                margin: 0 auto;
                margin-bottom: 4px;
              }
              span {
                font-size: 12px;
              }
            }
          }
        }
      }
      .top-right {
        float: right;
        padding-right: 7px;
        .user-name {
          margin-right: 30px;
          display: inline-block;
          vertical-align: top;
          padding-top: 19px;
          position: relative;
          font-size: 16px;
          font-weight: bold;
          &::after {
            display: block;
            position: absolute;
            top: 16px;
            right: -22px;
            content: '';
            border-right: 1px solid #000;
            height: 29px;
          }
        }
        .quit {
          display: inline-block;
          width: 50px;
          height: 50px;
          padding-top: 20px;
          cursor: pointer;
          i {
            font-size: 24px;
          }
        }
      }
    }
    .breadcrumd-wrapper {
      background-color: royalblue;
      color: #fff;
      padding: 4px 0 4px 6px;
      .intro {
        font-size: 14px;
      }
    }
  }
  .breadcrumb-enter,
  .breadcrumb-leave-active {
    opacity: 0;
    transform: translateX(20px);
  }
  .breadcrumb-enter-active,
  .breadcrumb-leave-active {
    transition: all 0.6s;
  }
  .breadcrumb-leave-active {
    position: absolute;
  }
</style>
