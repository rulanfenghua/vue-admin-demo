<template>
  <div class="container">
    <div class="top-aside">
      <h1 class="title">桥西区医学影像信息管理系统</h1>
      <div class="tab-container">
        <ul class="tab">
          <li class="tab-item">
            <router-link to="/home"></router-link>
          </li>
          <li class="tab-item">
            <router-link to="/residents"></router-link>
          </li>
          <li class="tab-item">
            <router-link to="/logging"></router-link>
          </li>
          <li class="tab-item">
            <router-link to="/systemSetting"></router-link>
          </li>
        </ul>
      </div>
      <div class="top-right">
        <div class="user-msg">
          <img src="" alt="" class="user-img"><span class="user-name"></span>
        </div>
        <div class="quit" @click="loginOut">
          <i></i>
        </div>
      </div>
    </div>
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
</style>
