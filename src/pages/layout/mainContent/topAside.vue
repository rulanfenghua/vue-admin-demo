<template>
<!-- 顶部layout结构 -->
  <div class="container">
    <!-- 顶部tab栏 -->
    <div class="top-aside">
      <h1 class="title">时代电子区域医学影像管理系统</h1>
      <div class="tab-container">
        <ul class="tab">
          <li class="tab-item">
            <router-link to="/home">
              <i class="icon-home"></i>
              <span>首页</span>
            </router-link>
          </li>
          <li class="tab-item" v-show="showSuper">
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
          <li class="tab-item" style="position:relative" @mouseover="slideControl" @mouseout="slideControl">
            <a href="javascript:void(0);">
              <i class="icon-cogs"></i>
              <span>系统管理</span>
            </a>
            <!-- <transition name="slide" mode="out-in"> -->
            <transition name="slide">
            <ul class="setting-item" v-show="slide">
              <li class="setting"><router-link to="/systemSetting/users">
              <i class="icon-file-text"></i>
              <span>用户管理</span>
            </router-link></li>
              <li class="setting"><router-link to="/systemSetting/roles">
              <i class="icon-file-text"></i>
              <span>角色管理</span>
            </router-link></li>
              <li class="setting"><router-link to="/systemSetting/dict">
              <i class="icon-file-text"></i>
              <span>字典管理</span>
            </router-link></li>
            </ul>
            </transition>
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
      name: '',
      slide: false
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
    },
    // 判断显示市级权限的计算属性
    showSuper() {
      /* eslint-disable eqeqeq */
      if (sessionStorage.getItem('levels') == 0) {
        console.log('显示权限————————topAside')
        console.log('levels: ' + sessionStorage.getItem('levels'))
        return false
      } else {
        return true
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
      logout().then(response => {
        this.$store.commit('LOGIN_OUT')
        /* 防止切换角色时addRoutes重复添加路由导致出现警告 */
        window.location.reload()
      })
    },
    slideControl() {
      this.slide = !this.slide
    }
  }
}
</script>

<style scoped lang="scss">
  .container {
    width: 100%;
    .top-aside {
      padding-top: 32px;
      height: 100px;
      // background-color: greenyellow;
      background: no-repeat center/100% url('./影像标头.png');
      .title {
        display: inline-block;
        padding: 7px 40px 0 40px;
        font-weight: 575;
        font-size: 27px;
        vertical-align: top;
        color: #fff;
      }
      .tab-container {
        height: 100px;
        display: inline-block;
        margin-left: 70px;
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
              color: #fff;
              &:hover {
               color: #7ba3d2;
              }
              i {
                display: block;
                font-size: 30px;
                width: 30px;
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
          color: #fff;
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
            color: #fff;
          }
        }
      }
    }
    .breadcrumd-wrapper {
      // background-color: #6fa7e8;
      background: no-repeat center/100% url('./影像标头.png');
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

  .setting-item {
    position: absolute;
    top: 0;
    left: 64px;
    width: 400px;
    &.slide-enter-active, &.slide-leave-active {
      transition: all .6s ease;
    }
    &.slide-enter, &.slide-leave-to {
      transform: translate3d(-15%,0,0);
      opacity: 0;
    }
    .setting {
      display: inline-block;
    }
  }
</style>
