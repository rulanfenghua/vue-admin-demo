<template>
  <div class="print-wrapper">
    <!-- 打印内容 -->
    <transition name="print">
      <div class="printing" v-if="printingToggle">
        <div id="printing">
          <h1 class="title">中华社区卫生服务中心B超报告单</h1>
          <ul class="header">
            <li>
              <span>姓名：</span>{{printingData.name}}
            </li>
            <li>
              <span>性别：</span>{{printingData.gender}}
            </li>
            <li>
              <span>年龄：</span>{{printingData.age}}
            </li>
            <li>
              <span>档案编号：</span>{{printingData.fileNumber}}
            </li>
          </ul>
          <div class="line"></div>
          <div class="photo">
            <img :src="printingData.bAddr1" alt="B超图像" id="img1" title="点击预览图像" preview="0">
            <img :src="printingData.bAddr2" alt="B超图像" id="img2" title="点击预览图像" preview="0">
          </div>
          <div class="line"></div>
          <p class="text" ref="text">
          </p>
          <ul class="bottom">
            <li>
              报告医师
            </li>
            <li>
              检验时间：<br/>{{printingData.provingTime | formatTimeSuper}}
              <!-- <span style="padding-left:112px">{{printingData.provingTime | formatTimeSuper}}</span> -->
            </li>
          </ul>
          <div class="end">本报告仅供参考，建议上一级医院进一步检查</div>
        </div>
        <div class="footer">
          <el-button @click="print" round type="success" size="small">立即打印</el-button>
          <el-button @click="print" round type="warning" size="small">保存为PDF</el-button>
          <el-button @click="_toggle();_toggleResident()" round type="primary" plain size="small">确定</el-button>
        </div>
      </div>
    </transition>
    <!-- 打印结束 -->
    <!-- 背景 -->
    <transition name="fade">
      <div class="mask" v-show="printingToggle" @click="_toggle" title="点击背景可以返回"></div>
    </transition>
    <!-- 背景结束 -->
  </div>
</template>

<script>
import { printing } from '@/api/resident' // printing原有api地址
import { crossorigin } from '@/utils/crossoriginImg' // 解决跨域，将跨域图片路径转为base64格式
import { formatTime } from '@/filters/filters' // 显式的引入时间filter
import 'print-js'
import { inserted } from '@/utils/directives' // 引入指令（放大）

export default {
  name: 'print',
  data() {
    return {
      printingData: {},
      printingToggle: false,

      checkDate: '' // 用于记录标题需要的时间
    }
  },
  directives: {
    enlarge: {
      inserted
    }
  },
  methods: {
    initPrinting(id, checkDate) {
      printing(id, checkDate).then(response => {
        console.log('打印数据————————print')
        console.log(response)
        this.printingData = response.data
        this.checkDate = formatTime(checkDate)

        // 用于测试服务器对图片响应正确 Access-Control-Allow-Origin 响应头
        // crossorigin('https://devimg.xiezixiansheng.com/users/0/1/photo/20160708035328.jpeg')
        crossorigin(this.printingData.bAddr1)

        this._toggleResident()
        this._toggle()
        this.$nextTick(() => {
          this.$refs.text.innerHTML = this._format(response.data.remark)
        })
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.$emit('thisIndex')
      })
    },
    print() {
      document.title = `B超报告单${this.printingData.name}${this.checkDate}`

      /* eslint-disable no-undef */
      printJS({
        printable: 'printing',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
        // style: ``
      })
    },
    _toggle() {
      this.printingToggle = !this.printingToggle
      document.title = '时代电子区域医学影像管理系统'
    },
    _toggleResident() {
      this.$emit('residentToggle')
    },
    _format(data) {
      data = data.replace(/(。)([\u4E00-\u9FA5]+：)/g, '$1<br><br>$2')
      data = data.replace(/：(?=[\u4E00-\u9FA5])/g, '：<br>&nbsp;&nbsp;')
      data = data.replace(/。(?=[\u4E00-\u9FA5])/g, '。<br>&nbsp;&nbsp;')
      return data
    }
  }
}
</script>

<style scoped lang="scss">
.print-wrapper {
   .printing {
    position: fixed;
    top: 0;
    bottom: 0;
    // min-height: calc(100% - 4px);
    min-height: 100%;
    width: 794px;
    // width: 600px;
    // min-height: 1123px;
    margin: 2px 0;
    left: calc(50% - 397px);
    border-radius: 3px;
    box-shadow: 0 0 6px #ddd;
    z-index: 3000;
    // padding: 4px 40px;
    overflow: auto;
    background-color: #fff;
    // display: flex;
    // flex-direction: column;

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
      box-sizing: border-box;
      // @page {
      //   size: 50mm 150mm;
      // }
      // flex: 1;
      // min-height: calc(100% - 52px);
      height: 1092px;
      // height: 977px;
      // display: flex;
      // flex-direction: column;
      position: relative;
      margin-bottom: 44px;
      // background-color: red;
      .title {
        box-sizing: border-box;
        text-align: center;
        font-weight: bolder;
        font-size: 24px;
        padding-top: 20px;
        padding-bottom: 13px;
        letter-spacing: 0px;
        font-family: "SimSun";
      }

      .header {
        // text-align: center;
        display: block;
        position: relative;
        height: 28px;
        padding-top: 20px;
        text-align: center;

        li {
          display: inline-block;
          margin-right: 64px;

          span {
            font-family: "NSimSun";
            font-weight: bolder;
            letter-spacing: 0;
            font-size: 19px;
          }
        }
      }

      .line {
        width: 89%;
        height: 1px;
        background-color: #ccc;
        position: relative;
        margin: 0 auto;
        margin-top: 23px;
      }

      .photo {
        text-align: center;
        margin: 17px 0;
        img {
          display: inline-block;
          height: 184px;
          width: 246px;

          &:first-child {
            margin-right: 90px;
          }
        }
      }

      .text {
        line-height: 26px;
        position: relative;
        width: 100%;
        padding: 7px 49px 0;
        font-family: "NSimSun";
        letter-spacing: 0;
        font-size: 19px;
      }

      .bottom {
        position: absolute;
        bottom: 0;
        right: 42px;
        font-family: "NSimSun";
        letter-spacing: -1px;
        font-size: 19px;

        li {
          margin-bottom: 20px;

          &:last-child {
            margin-bottom: 54px;
          }
        }
      }

      .end {
        position: absolute;
        width: 100%;
        bottom: 0;
        text-align: center;
        font-family: "NSimSun";
        font-size: 13px;
      }
    }

    .footer {
      position: fixed;
      // padding-top: 7px;
      // padding-bottom: 13px;
      bottom: 0;
      padding-bottom: 7px;
      left: -9px;
      width: 100%;
      text-align: center;
      background-color: #fff;
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
    overflow: hidden;

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
