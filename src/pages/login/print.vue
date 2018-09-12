<template>
<div class="print-wrapper">
<transition name="print">
  <div class="printing" v-if="printingToggle">
    <div id="printing">
      <h1 class="title">{{printingData.title}}</h1>
      <ul class="header">
        <li>
          姓名：{{printingData.name}}
        </li>
        <li>
          性别：{{printingData.gender}}
        </li>
        <li>
          年龄：{{printingData.age}}
        </li>
        <li>
          档案编号：{{printingData.stationCode}}
        </li>
      </ul>
      <div class="photo">
        <img :src="printingData.B_Addr1" alt="" style="width:100px;height:100px">
        <img :src="printingData.B_Addr2" alt="" style="width:100px;height:100px">
      </div>
      <p class="text" ref="text">
      </p>
    </div>
    <el-button @click="print"></el-button>
    <el-button @click="_toggle"></el-button>
  </div>
</transition>
<transition name="fade">
  <div class="mask" v-show="printingToggle" @click="_toggle"></div>
</transition>
</div>
</template>

<script>
import 'print-js'

export default {
  name: 'print',
  data: function() {
    return {
      printingToggle: false
    }
  },
  props: {
    printingData: {}
  },
  created() {
    this.$refs.text.innerHTML = this._format(this.printingData.text)
  },
  methods: {
    print() {
      /* eslint-disable no-undef */
      printJS({
        printable: 'printing',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
      })
    },
    _toggle() {
      this.printingToggle = !this.printingToggle
    },
    _format(data) {
      data = data.replace('：', '：/r/n')
      console.log(data)
      console.log(this.$refs.text)
      this.$refs.text.innerHtml = data
    }
  }
}
</script>

<style scoped lang="scss">
.print-wapper{
  .printing {
    position: fixed;
    top: 0;
    height: 100%;
    width: 560px;
    left: calc(50% - 280px);
    z-index: 100;
    overflow: auto;
    background-color: #fff;
    &.print-enter-active, &.print-leave-active {
      transition: all .3s ease;
    }
    &.print-enter, &.print-leave-to {
      opacity: 0;
      transform: translate3d(0,10px,0);
    }
  }
  .mask {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    -webkit-backdrop-filter: blur(10px);
    background: rgba(7, 17, 27, 0.6);
    &.fade-enter-active,
    &.fade-leave-active {
      transition: all .3s ease;
    }
    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
    }
  }
}
</style>
