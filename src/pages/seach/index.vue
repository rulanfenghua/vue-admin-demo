<template>
  <div class="seach">
    <div class="container">
      <!-- 顶部tab栏 -->
      <div class="top-aside">
        <h1 class="title">区域医学影像管理系统（桥西区）</h1>
        <!-- 退出登陆部分 -->
        <div class="top-right">
          <span class="user-name">{{currentDate}}：{{name}}</span>
          <div class="quit" @click="loginOut" title="点击退出登陆">
            <i class="icon-switch"></i>
          </div>
        </div>
        <!-- 退出登陆部分结束 -->
      </div>
      <!-- 顶部tab栏结束 -->
    </div>
    <div class="content">
      <div class="left">
        <h2 class="title">居民个人信息：</h2>
        <ul class="details">
          <li><span>姓名：</span>{{personalData.name}}</li>
          <li><span>身份证号：</span>{{personalData.idCard}}</li>
          <li><span>性别：</span>{{personalData.gender}}</li>
          <li><span>年龄：</span>{{personalData.age}}</li>
          <li><span>电话：</span>{{personalData.tel}}</li>
          <li><span>家庭住址：</span>{{personalData.homeAddr}}</li>
        </ul>
        <!-- <div class="background"><img src="./left.jpg" alt="" width="100%" height="100%"></div> -->
      </div>
      <div class="right">
        <el-collapse v-model="activeNames">
          <el-collapse-item v-for="(data,index) in personalMess" :key="index" :name="index">
            <template slot="title">
              <span class="text">诊断时间：</span>
              <span class="date">{{data.checkDate | formatTimeSuper}}</span>
              <span>诊断状态：诊断完成</span>
              <el-button @click.stop.prevent="seach(id,data.checkDate,index)" type="warning" plain size="small" :loading="index===thisIndex">查看详细报告单</el-button>
            </template>
            <div class="right-content">
              <h2 class="title">诊断内容：</h2>
              <p class="text">{{data.remark}}</p>
            </div>
          </el-collapse-item>
        </el-collapse>
        <!-- <div class="background"><img src="./background.jpg" alt="" width="100%" height="100%"></div> -->
      </div>
    </div>
    <!-- 引入打印组件 -->
    <print ref="print" @thisIndex="_thisIndex"></print>
  </div>
</template>

<script>
/* eslint-disable no-unused-vars */
import { logout } from '@/api/permission'
import { mapState } from 'vuex'
import print from '@/components/residentDetails/print'

export default {
  name: 'seach',
  data() {
    return {
      name: '',
      id: '',
      idcard: '',

      personalMess: [],
      personalData: {},

      thisIndex: null, // 判断控制按钮loading条件

      activeNames: ['1', 0]
    }
  },
  components: {
    print
  },
  computed: {
    // 时间检查方法的计算属性
    currentDate() {
      const date = new Date()
      if (date.getHours() < 6) {
        return '凌晨了'
      } else if (date.getHours() >= 6 && date.getHours() < 12) {
        return '上午好'
      } else if (date.getHours() >= 12 && date.getHours() < 14) {
        return '中午好'
      } else if (date.getHours() >= 14 && date.getHours() < 20) {
        return '下午好'
      } else {
        return '晚上好'
      }
    }
  },
  created() {
    this.name = sessionStorage.getItem('name')
    this.id = sessionStorage.getItem('residentId')
    this.idcard = sessionStorage.getItem('residentIdcard')
    this._initMess(this.id, this.idcard)
  },
  methods: {
    loginOut() {
      this.$router.replace('/login')
    },
    // 打印 调用子组件的方法
    seach(id, checkDate, index) {
      console.log('调用子组件————————seach')
      console.log('id: ' + id + '  checkDate: ' + checkDate)
      this.thisIndex = index

      this.$nextTick(() => {
        this.$refs.print.initPrinting(id, checkDate)
        // this.$refs.print._toggle()
      })
    },
    _initMess(id, idCard) {
      this.$http.get('/resident/getPersonalMess' + '/' + idCard).then(response => {
        this.personalData = response.data
      })
      this.$http.get('/resident/getPersonalDateList' + '/' + id).then(response => {
        console.log('居民列表数据————————seach')
        console.log(response)
        this.personalMess = response.data
      })
    },
    _thisIndex() {
      this.thisIndex = null
    },
    handleChange(val) {
      console.log(val)
    }
  }
}
</script>

<style lang="scss">
.seach {
  .el-collapse {
    .el-collapse-item__header {
      font-size: 15px;
      font-family: serif;
    }
    .el-collapse-item__content {
      font-size: 14px;
    }
  }
}
</style>

<style scoped lang="scss">
.seach {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  .container {
    width: 100%;
    .top-aside {
      padding-top: 32px;
      height: 114px;
      // background-color: greenyellow;
      background: no-repeat center/100% 100% url('./影像标头.png');
      .title {
        display: inline-block;
        padding: 7px 40px 0 40px;
        font-weight: 575;
        font-size: 29px;
        vertical-align: top;
        color: #fff;
      }
      .top-right {
        float: right;
        padding-right: 7px;
        .user-name {
          display: inline-block;
          vertical-align: top;
          padding-top: 21px;
          position: relative;
          font-size: 16px;
          font-weight: bold;
          color: #fff;
          &::after {
            display: block;
            position: absolute;
            top: 14px;
            right: -22px;
            content: '';
            border-right: 1px solid #000;
            height: 34px;
          }
        }
        .quit {
          display: inline-block;
          padding-top: 20px;
          padding-left: 30px;
          padding-right: 12px;
          cursor: pointer;
          i {
            font-size: 24px;
            color: #fff;
          }
        }
      }
    }
  }
  .content {
    width: 100%;
    flex: 1;
    display: flex;
    background-color: #f1eded;
    .left, .right {
      position: relative;
      // background: rgba(8, 22, 57, 0.2);
      border-radius: 4px;
      border-color: rgba(8, 22, 57, 0.2);
      margin: 4px;
      .background {
        position: absolute;
        top: 0;
        right: 0;
        width: 100%;
        height: 100%;
        z-index: -1;
        filter: blur(1px);
      }
    }
    .left {
      flex: 0 0 275px;
      background-color: #fff;
      margin-right: 0;
      font-size: 16px;
      font-family: serif;
      background: no-repeat bottom/100% url('./background.png');
      &::after {
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        content: '';
        width: 1px;
        background: no-repeat url('./xian.png');
        background-size: auto 100%;
        height: 100%;
        opacity: 0.7;
      }
      .title {
        line-height: 34px;
        font-weight: bold;
        padding-left: 14px;
        margin-bottom: 9px;
      }
      .details {
        padding-left: 14px;
        li {
          margin-bottom: 4px;
        }
      }
      // background-color: red;
      // background: no-repeat center/100% 100% url('./left.jpg');
    }
    .right {
      flex: 1;
      background-color: #fff;
      margin-left: 0;
      .el-collapse-item {
        margin-bottom: 23px;
        padding-left: 32px;
        position: relative;
        &:first-child {
          margin-top: 27px;
        }
        &:last-child {
          margin-bottom: 0;
        }

        .text {

        }

        .date {
          margin-right: 40px;
        }

        .el-button {
          position: absolute;
          top: 7px;
          right: 44px;
        }

        .right-content {
          .title {
            font-size: 15px;
            font-weight: bold;
          }
          .text {

          }
        }
      }
      // background-color: green;
      // background: no-repeat center/100% 100% url('./background.jpg');
    }
  }
}

</style>
