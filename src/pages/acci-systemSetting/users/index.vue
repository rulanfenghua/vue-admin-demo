<template>
  <div class="users">
    <component :is="currentRole" />
  </div>
</template>

<script>
import admin from './admin'
import manager from './manager'

export default {
  name: 'users',
  components: {
    admin,
    manager
  },
  data() {
    return {
      currentRole: 'admin'
    }
  },
  created() {
    /* eslint-disable eqeqeq */
    if (sessionStorage.getItem('levels') == 2) {
      console.log('角色权限————————users')
      console.log('levels: ' + sessionStorage.getItem('levels'))
      this.currentRole = 'manager'
    }
  }
}
</script>

<style scoped lang="scss">
</style>
