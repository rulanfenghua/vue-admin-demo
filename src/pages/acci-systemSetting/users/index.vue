<template>
  <div class="users">
    <component :is="currentRole" />
  </div>
</template>

<script>
import admin from './admin'
import superadmin from './super'

export default {
  name: 'users',
  components: {
    admin,
    superadmin
  },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  created() {
    /* eslint-disable eqeqeq */
    if (sessionStorage.getItem('levels') == 0) {
      console.log('角色权限————————users')
      console.log('levels: ' + sessionStorage.getItem('levels'))
      this.currentRole = 'superadmin'
    }
  }
}
</script>

<style scoped lang="scss">
</style>
