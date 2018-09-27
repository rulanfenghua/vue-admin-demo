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
    <!-- 引入打印组件 -->
    <print ref="print" @residentToggle="_toggleResident" @thisIndex="_thisIndex"></print>
  </div>
</template>

<script>
import print from './print'

export default {
  name: 'residentDetails',
  data() {
    return {
      residentToggle: false,
      thisIndex: null // 判断控制按钮loading条件
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
  components: {
    print
  },
  methods: {
    getPrinting(id, checkDate, index) {
      this.thisIndex = index
      this.$nextTick(() => {
        this.$refs.print.initPrinting(id, checkDate)
        // this.$refs.print._toggle()
      })
    },
    _thisIndex() {
      this.thisIndex = null
    },
    _toggleResident() {
      this.residentToggle = !this.residentToggle
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
    font-weight: normal !important;

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

    img {
      transform: scale(1);
      transition: all ease 0.2s;
    }

    img.scale {
      transform: scale(4);
    }
  }
</style>
