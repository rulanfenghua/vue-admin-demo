<template>
  <div class="home">
    <component :is="currentRole"/>
  </div>
</template>

<script>
import admin from './admin'
import manager from './manager'

export default {
  name: 'home',
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
    if (sessionStorage.getItem('id')) {
      this.currentRole = 'manager'
    }
  }
}
</script>

<style scoped lang="scss">
</style>
