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
              姓名：{{printingData.name}}
            </li>
            <li>
              性别：{{printingData.gender}}
            </li>
            <li>
              年龄：{{printingData.age}}
            </li>
            <li>
              档案编号：{{printingData.fileNumber}}
            </li>
            <li>
              检验时间：{{printingData.provingTime | formatTime}}
            </li>
          </ul>
          <div class="photo">
            <img :src="printingData.bAddr1" alt="" style="width:100px;height:100px">
            <img :src="printingData.bAddr2" alt="" style="width:100px;height:100px">
          </div>
          <p class="text" ref="text">
          </p>
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
import 'print-js'

export default {
  name: 'residentDetails',
  data() {
    return {
      printingData: {},
      residentToggle: false,
      printingToggle: false,

      thisIndex: null
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
      console.log('传入参数————————print')
      console.log('id: ' + id)
      console.log('checkDate: ' + checkDate)
      this.thisIndex = index
      // this.$http.get('/resident/printing' + '/' + id + '/' + checkDate).then(response => {
      printing(id, checkDate).then(response => {
        console.log('打印数据————————print')
        console.log(response)
        this.printingData = response.data
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
        // style: 'width:100%',
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

<style lang="scss">
.el-dialog {
  height: 430px;
  width: 600px;
  .el-dialog__body {
    height: calc(430px - 57px);
    overflow: auto;
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
            text-align: center;
            li {
              display: inline-block;
              margin-right: 30px;
            }
          }
          .details-addr {
            position: relative;
            margin-bottom: 17px;
            text-align: center;
            li {
              display: inline-block;
              margin-right: 30px;
            }
            &:after {
              display: block;
              position: absolute;
              left: 0;
              bottom: -15px;
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
            .text {

            }
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
      min-height: calc(100% - 4px);
      // width: 794px;
      width: 600px;
      margin: 2px 0;
      left: calc(50% - 300px);
      border-radius: 3px;
      box-shadow: 0 0 6px #ddd;
      z-index: 3000;
      padding: 4px 10px;
      overflow: auto;
      background-color: #fff;
      display: flex;
      flex-direction: column;

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
        // width: 600px;
        // margin: 0 auto;
        // background-color: #fff;
        flex: 1;
        .title {
          text-align: center;
          font-weight: bolder;
          font-size: 20px;

        }
        .header {
          // text-align: center;
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
        .text {
          line-height: 17px;
        }
      }
      .footer {
        padding-bottom: 20px;
        text-align: center;
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
