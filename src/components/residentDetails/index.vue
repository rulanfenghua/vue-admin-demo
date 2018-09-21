<template>
  <div class="resident-details-wrapper">
    <el-dialog :visible.sync="residentToggle" class="dialog" title="检查记录列表：">
      <!-- 清单列表 -->
      <div class="resident-details">
        <div class="details-wrapper">
          <ul class="details-name">
            <li>姓名：{{personalData.name}}</li>
            <li>身份证号：{{personalData.idCard}}</li>
            <li>性别：{{personalData.gender}}</li>
            <li>年龄：{{personalData.age}}</li>
          </ul>
          <ul class="details-addr">
            <li>电话：{{personalData.tel}}</li>
            <li>家庭住址：{{personalData.homeAddr}}</li>
          </ul>
          <!-- <h2>检查记录列表：</h2> -->
        </div>
        <ul class="mess">
          <li class="mess-item" v-for="(data,index) in personalMess" :key="index">
            <span class="text">诊断时间：</span>
            <span class="date">{{data.checkDate | formatTime}}</span>
            <span>诊断状态：诊断完成</span>
            <el-button @click="getPrinting(id,data.checkDate,index)" type="warning" plain size="small" :loading="index===thisIndex">查看报告单</el-button>
          </li>
        </ul>
      </div>
      <div class="button">
        <el-button @click="_toggleResident" round>确定</el-button>
      </div>
      <!-- 清单列表结束 -->
    </el-dialog>
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
            <img :src="printingData.bAddr1" alt="" style="" id="img1">
            <!-- <img :src="printingData.bAddr2" alt="" style=""> -->
            <!-- <img :src="url1" alt="" style="">
            <img :src="url2" alt="" style=""> -->
          </div>
          <div class="line"></div>
          <p class="text" ref="text">
          </p>
          <ul class="bottom">
            <li>
              报告医师
            </li>
            <li>
              检验时间：{{printingData.provingTime | formatTime}}
            </li>
          </ul>
          <div class="end">本报告仅供参考，建议上一级医院进一步检查</div>
        </div>
        <div class="footer">
          <el-button @click="print" round type="success" size="small">立即打印</el-button>
          <el-button @click="toPdf" round type="warning" size="small">保存为PDF</el-button>
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
// import { crossorigin } from '@/utils/crossoriginImg' // 解决跨域，将跨域图片路径转为base64格式
import 'print-js'

export default {
  name: 'residentDetails',
  data() {
    return {
      printingData: {},
      residentToggle: false,
      printingToggle: false,

      thisIndex: null, // 判断控制按钮loading条件

      url1: '',
      url2: ''
    }
  },
  props: {
    personalMess: {
      type: Array
    },
    id: {
      type: String
    },
    personalData: {
      type: Object
    }
  },
  methods: {
    getPrinting(id, checkDate, index) {
      console.log('checkDate: ' + checkDate)
      this.thisIndex = index
      // this.$http.get('/resident/printing' + '/' + id + '/' + checkDate).then(response => {
      printing(id, checkDate).then(response => {
        console.log('打印数据————————print')
        console.log(response)
        this.printingData = response.data

        // crossorigin('https://devimg.xiezixiansheng.com/users/0/1/photo/20160708035328.jpeg')

        this._toggleResident()
        this._toggle()
        this.$nextTick(() => {
          this.$refs.text.innerHTML = this._format(response.data.remark)
        })
      }).catch((error) => {
        console.log(error)
      }).then(() => {
        this.thisIndex = null
      })
    },
    print() {
      /* eslint-disable no-undef */
      printJS({
        printable: 'printing',
        type: 'html',
        // 继承原来的所有样式
        targetStyles: ['*']
        // scanStyles: false,
        // style: `
        //   #printing {
        //   box-sizing: border-box;
        //   height: 994px;
        //   position: relative;
        //   margin-bottom: 44px; }
        //   #printing .title {
        //     box-sizing: border-box;
        //     text-align: center;
        //     font-weight: bolder;
        //     font-size: 24px;
        //     padding-top: 20px;
        //     padding-bottom: 13px;
        //     letter-spacing: 0px;
        //     font-family: "SimSun"; }
        //   #printing .header {
        //     display: block;
        //     position: relative;
        //     height: 28px;
        //     padding-top: 20px;
        //     font-family: "NSimSun";
        //     font-weight: bolder;
        //     letter-spacing: -1px;
        //     font-size: 19px; }
        //     #printing .header li {
        //       display: inline-block;
        //       margin-right: 47px; }
        //   #printing .line {
        //     width: 100%;
        //     height: 1px;
        //     background-color: #eee;
        //     position: relative;
        //     margin-top: 23px; }
        //   #printing .photo {
        //     text-align: center;
        //     margin: 17px 0; }
        //     #printing .photo img {
        //       display: inline-block;
        //       height: 184px;
        //       width: 246px; }
        //       #printing .photo img:first-child {
        //         margin-right: 90px; }
        //   #printing .text {
        //     line-height: 24px;
        //     position: relative;
        //     width: 100%;
        //     padding: 7px 14px 0;
        //     letter-spacing: 1px;
        //     font-family: "NSimSun";
        //     letter-spacing: -1px;
        //     font-size: 19px; }
        //   #printing .bottom {
        //     position: absolute;
        //     bottom: 0;
        //     right: 7px; }
        //     #printing .bottom li {
        //       margin-bottom: 20px; }
        //       #printing .bottom li:last-child {
        //         margin-bottom: 54px; }
        //   #printing .end {
        //     position: absolute;
        //     width: 100%;
        //     bottom: 0;
        //     text-align: center;
        //     font-size: 12px; }
        // `
      })
    },
    toPdf() {
      this.getPdf('printing', '中华社区卫生服务中心B超报告单', 'img1', this.printingData.bAddr1)
    },
    _toggleResident() {
      this.residentToggle = !this.residentToggle
    },
    _toggle() {
      this.printingToggle = !this.printingToggle
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

<style lang="scss">
.resident-details-wrapper {
  .el-dialog {
    height: 430px;
    width: 640px;
    .el-dialog__body {
      height: calc(430px - 57px);
      overflow: auto;
    }
  }
}

</style>
<style scoped lang="scss">
  .resident-details-wrapper {

    .dialog {
      .resident-details {
        .details-wrapper {
          .details-name {
            margin-top: -26px;
            margin-bottom: 9px;
            // text-align: center;
            padding-left: 34px;
            font-size: 14px;
            font-weight: bold;

            li {
              display: inline-block;
              margin-right: 30px;
            }
          }

          .details-addr {
            position: relative;
            margin-bottom: 17px;
            // text-align: center;
            padding-left: 34px;
            font-size: 14px;
            font-weight: bold;

            li {
              display: inline-block;
              margin-right: 30px;
            }

            &:after {
              display: block;
              position: absolute;
              left: 0;
              bottom: -17px;
              width: 100%;
              border-top: 1px solid #ddd;
              content: '';
            }
          }

          h2 {
            font-weight: bolder;
            font-size: 16px;
            line-height: 40px;
          }
        }

        .mess {
          .mess-item {
            margin-bottom: 23px;
            position: relative;
            padding-left: 32px;

            &:first-child {
              margin-top: 27px;
            }

            &:after {
              display: block;
              position: absolute;
              left: 0;
              bottom: -12px;
              width: 100%;
              border-top: 1px solid #ddd;
              content: '';
            }

            .text {}

            .date {
              margin-right: 40px;
            }

            .el-button {
              position: absolute;
              top: -7px;
              right: 44px;
            }
          }
        }
      }

      .button {
        position: absolute;
        width: 600px;
        text-align: center;
        bottom: 0;
        left: 0;
        background-color: #fff;
        padding-bottom: 14px;
      }
    }

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
