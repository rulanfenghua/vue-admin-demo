<template>
  <div class="null">
    测试
  </div>
</template>

<script>
import {index} from '@/api/admin'

export default {
  name: 'null',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      index().then(response => {
        console.log('数据————————test')
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
