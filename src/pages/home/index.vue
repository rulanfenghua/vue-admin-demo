<template>
  <div class="home">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import admin from './admin'
import manager from './manager'
import superadmin from './super'

export default {
  name: 'home',
  components: {
    admin,
    manager,
    superadmin
  },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  created() {
    /* eslint-disable eqeqeq */
    if (sessionStorage.getItem('levels') == 2) {
      console.log('角色权限————————home')
      console.log('levels: ' + sessionStorage.getItem('levels'))
      this.currentRole = 'manager'
    } else if (sessionStorage.getItem('levels') == 0) {
      console.log('角色权限————————home')
      console.log('levels: ' + sessionStorage.getItem('levels'))
      this.currentRole = 'superadmin'
    }
  }
}
</script>

<style scoped lang="scss">
</style>
