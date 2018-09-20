<template>
  <div class="index">
    <!-- <main-content /> -->
    <component :is="currentRole" />
  </div>
</template>

<script>
import admin from './mainContent'
import manager from './mainContentManager'

export default {
  data() {
    return {
      currentRole: 'admin'
    }
  },
  components: {
    admin,
    manager
  },
  created() {
    /* eslint-disable eqeqeq */
    if (sessionStorage.getItem('levels') == 2) {
      console.log('角色权限————————layout')
      console.log('levels: ' + sessionStorage.getItem('levels'))
      this.currentRole = 'manager'
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
