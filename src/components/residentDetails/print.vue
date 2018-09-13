<template>
  <div class="print-wrapper">
    <!-- 打印内容 -->
    <transition name="print">
      <div class="printing" v-if="printingToggle">
        <div id="printing">
          <h1 class="title">中华社区卫生服务中心B超报告单</h1>
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
        <el-button @click="print">立即打印</el-button>
        <el-button @click="print">保存为PDF</el-button>
        <el-button @click="_toggle">确定</el-button>
      </div>
    </transition>
    <!-- 打印结束 -->
    <!-- 背景 -->
    <transition name="fade">
      <div class="mask" v-show="printingToggle" @click="_toggle"></div>
    </transition>
    <!-- 背景结束 -->
  </div>
</template>

<script>
import 'print-js'

export default {
  name: 'print',
  data() {
    return {
      printingData: {},
      printingToggle: false
    }
  },
  methods: {
    getPrinting(id, checkDate) {
      this.$http.get('/resident/printing' + '/' + id + '/' + checkDate).then(response => {
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
#printing {
  .title {
    text-align: center;

  }
  .header {
    text-align: center;
    li {
      display: inline-block;
      margin-right: 7px;

    }
  }
  .photo {
    text-align: center;
    img {
      display: inline-block;
      margin-right: 20px;
    }
  }
}

.printing {
  position: fixed;
  top: 0;
  height: 100%;
  width: 600px;
  left: calc(50% - 300px);
  border-radius: 2px;
  z-index: 3000;
  overflow: auto;
  background-color: #fff;

  &.print-enter-active,
  &.print-leave-active {
    transition: all .3s ease;
  }

  &.print-enter,
  &.print-leave-to {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }
  #printing {
    .title {
      text-align: center;

    }
    .header {
      text-align: center;
      li {
        display: inline-block;
        margin-right: 7px;

      }
    }
    .photo {
      text-align: center;
      img {
        display: inline-block;
        margin-right: 20px;
      }
    }
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
</style>
