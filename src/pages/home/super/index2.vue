<template>
  <div class="null">
    测试 supper
  </div>
</template>

<script>
import {
  index,
  getGender,
  getWeek,
  getLast
} from '@/api/city'

export default {
  name: 'null',
  mounted() {
    this.init()
  },
  methods: {
    init() {
      index().then(response => {
        console.log('数据index————————test')
        console.log(response)
      })
      getGender().then(response => {
        console.log('数据getGender————————test')
        console.log(response)
      })
      getWeek().then(response => {
        console.log('数据getWeek————————test')
        console.log(response)
      })
      getLast().then(response => {
        console.log('数据getLast————————test')
        console.log(response)
      })
    }
  }
}
</script>

<style scoped lang="scss">
</style>
