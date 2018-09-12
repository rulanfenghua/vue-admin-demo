<template>
<transition name="pull">
<div class="resident-details-wrapper" v-show="residentToggle">
  <div class="resident-details">
    <ul class="mess">
      <li class="mess-item" v-for="(data,index) in personalMess" :key="index">
        <span class="text">诊断时间</span>
        <span class="date">{{data.checkDate | formatTime}}</span>
        <el-button @click="getPrinting(data.id,data.checkDate)"></el-button>
      </li>
    </ul>
    <el-button @click="_toggleResident"></el-button>
  </div>
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
</transition>
</template>

<script>
// import { printing } from '@/api/resident'
import 'print-js'

export default {
  name: 'residentDetails',
  data() {
    return {
      printingData: {},
      residentToggle: false,
      printingToggle: false
    }
  },
  props: {
    personalMess: {
      type: Array
    }
    // id: {
    //   type: Number
    // }
  },
  methods: {
    getPrinting(id, checkDate) {
      this.$http.get('/resident/getPersonalDate' + '/' + id + '/' + checkDate).then(response => {
        this.printingData = response.data
        this._toggle()
        this.$nextTick(() => {
          this.$refs.text.innerHTML = this._format(response.data.text)
        })
      }).catch((error) => {
        console.log(error)
      }).then(() => {

      })
    },
    print() {
      /* eslint-disable no-undef */
      printJS({
        printable: 'printing',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
      })
    },
    _toggleResident() {
      this.residentToggle = !this.residentToggle
    },
    _toggle() {
      this.printingToggle = !this.printingToggle
    },
    _format(data) {
      data = data.replace(/(。)([\u4E00-\u9FA5]+：)/g, '$1<br><br>$2')
      data = data.replace(/：(?=[\u4E00-\u9FA5])/g, '：<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
      data = data.replace(/。(?=[\u4E00-\u9FA5])/g, '。<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;')
      return data
    }
  }
}
</script>

<style scoped lang="scss">
.resident-details-wrapper {
  position: absolute;
  bottom: 0;
  left: 0;
  z-index: 10;
  height: 230px;
  width: 600px;
  background-color: blue;
  &.pull-enter-active, &.pull-leave-active {
    transition: all .3s ease;
  }
  &.pull-enter, &.pull-leave-to {
    transform: translate3d(0,50%,0);
    opacity: 0;
  }
  .resident-details{

  }
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
