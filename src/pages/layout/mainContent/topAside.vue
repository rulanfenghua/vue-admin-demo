<template>
<!-- 顶部layout结构 -->
  <div class="container">
    <!-- 顶部tab栏 -->
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
      <!-- 退出登陆部分 -->
      <div class="top-right">
        <span class="user-name">{{currentDate}}：{{name}}</span>
        <div class="quit" @click="loginOut" title="点击退出登陆">
          <i class="icon-switch"></i>
        </div>
      </div>
      <!-- 退出登陆部分结束 -->
    </div>
    <!-- 顶部tab栏结束 -->
    <!-- 面包屑导航 -->
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
    <!-- 面包屑导航结束 -->
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { logout } from '@/api/permission'
import { mapState } from 'vuex'

export default {
  name: 'topAside',
  data() {
    return {
      name: ''
    }
  },
  computed: {
    ...mapState(['crumbList']),
    // 时间检查方法的计算属性
    currentDate() {
      const date = new Date()
      if (date.getHours() < 6) {
        return '凌晨了'
      } else if (date.getHours() >= 6 && date.getHours() < 12) {
        return '上午好'
      } else if (date.getHours() >= 12 && date.getHours() < 14) {
        return '中午好'
      } else if (date.getHours() >= 14 && date.getHours() < 20) {
        return '下午好'
      } else {
        return '晚上好'
      }
    }
  },
  created() {
    this.name = sessionStorage.getItem('name')
  },
  methods: {
    loginOut() {
      this.$store.commit('LOGIN_OUT')
      /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
      window.location.reload()
      // logout().then(response => {
      //   this.$store.commit('LOGIN_OUT')
      //   /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
      //   window.location.reload()
      // })
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
          display: inline-block;
          vertical-align: top;
          padding-top: 21px;
          position: relative;
          font-size: 16px;
          font-weight: bold;
          &::after {
            display: block;
            position: absolute;
            top: 14px;
            right: -22px;
            content: '';
            border-right: 1px solid #000;
            height: 34px;
          }
        }
        .quit {
          display: inline-block;
          padding-top: 20px;
          padding-left: 30px;
          padding-right: 12px;
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
  // 面包屑导航的动画
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
