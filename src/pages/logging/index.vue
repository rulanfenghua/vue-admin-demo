<template>
  <div class="logging">
    日志
  </div>
</template>

<script>
export default {
  name: 'logging',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      this.$http.post().then(response => {
        console.log('数据————————log')
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
