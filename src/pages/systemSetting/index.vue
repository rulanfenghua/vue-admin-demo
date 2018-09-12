<template>
  <div class="systemSetting">
    系统
  </div>
</template>

<script>
export default {
  name: 'systemSetting',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$http.post().then(response => {
        console.log('数据————————sys')
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
