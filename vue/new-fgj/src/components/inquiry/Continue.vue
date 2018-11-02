<template lang="html">
  <!-- 客户续报 -->
  <section class="continue">
    <div class="main">
      <section class="center">
        <h3 class="title">客户续报</h3>
        <div class="count-wrap">
          <div class="count-down">
            <span class="time-title">等待到期倒计时</span>
            <span class="time-num">{{time}}.<span id="elcountup">0</span></span>
          </div>
        </div>
        <div class="list-wrap" v-show="!pastDue">
          <div class="list">
            <span class="title">报备楼盘</span>
            <span class="text">{{datas.EstateName}}</span>
          </div>
          <div class="list">
            <span class="title">报备客户</span>
            <div class="text text-wrap">
              <span class="name">{{datas.CustName}}</span>
              <span class="nick-name" v-show="datas.NickName">{{datas.NickName}}</span>
            </div>
            <span class="phone">{{datas.CustMobile}}</span>
          </div>
          <div class="list">
            <span class="title">报备时间</span>
            <span class="text">{{datas.DeclareDate}}</span>
          </div>
          <div class="list" v-show="datas.VisitDate">
            <span class="title">最后到访</span>
            <span class="text">{{datas.VisitDate}}</span>
          </div>
          <div class="list" v-show="datas.VisitExpireDate || datas.ExpireDate">
            <span class="title">到期时间</span>
            <span class="text" v-if="datas.VisitExpireDate">{{datas.VisitExpireDate}}</span>
            <span class="text" v-else>{{datas.ExpireDate}}</span>
          </div>
        </div>
        <div class="expireds" v-show="pastDue">
          已过期
        </div>
        <div class="foot-btn" v-show="!pastDue">
          <el-button type="primary" :disabled="disabled" @click="onExceed">{{buttonText}}</el-button>
        </div>
      </section>
      <div class="explain">
        <p class="desc"><span class="infuse">注：</span>到期后10分钟之内可续报，保留原始报备时间</p>
        <p class="desc">10分钟之后报备则记为重新报备，重新记录报备时间</p>
      </div>
    </div>
    <div class="code">
      <p>Copyright© 2017 vipfgj.com</p>
    </div>
  </section>
</template>

<script>
  /**
   * 判断GetDeclareByID如果为1，显示过期
   *  VisitExpireDate  有效期优先级更高
   *  ExpireDate 有效期优先级第二
   * 
   * 没超过有效期不能点
   * 超过10分钟以内 显示续报
   * 超过10分钟以后 显示重新报备
   * 倒计时到了有效期，就变0
   */
  import { GetDeclareByID } from '@/api/inquiry/continue'
  import { TranFiling } from '@/api/inquiry/inquiry'
  import CountUp from 'countup.js'

  export default {
    data() {
      return {
        datas: {},     // 数据
        time: '0:00',      // 倒计时
        disabled: true,    // 按钮变化，0不能点，1可以续报，2重新报备
        buttonText: '续报',  // 按钮文字
        pastDue: false      // 是否过期
      }
    },
    created() {
      this._GetDeclareByID()
    },
    methods: {
      onExceed() {        // 续报和重新报备
        let InquiryID = this.datas.InquiryID + ',' + this.datas.CustName + ',' + this.datas.CustMobile
        TranFiling(InquiryID, this.datas.EstateID, this.datas.EstateName).then((res) => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.$message.success('报备成功')
            setTimeout(() => {
              window.location.href = '/Filing/MyFiling.html'
            }, 1000)
          }  else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _GetDeclareByID() {     // 拿数据
        let id = this.$route.query.id
        GetDeclareByID(id).then((res) => {
          // console.log(res)
          if (res.data.result === 'success') {
            if (res.data.isHaveAfterDeclare === '1') {
              // 过期
              this.pastDue = true
            } else if (res.data.tempTable.length) {
              this.datas = res.data.tempTable[0]

              // VisitExpireDate  1有效期，优先级最高
              // ExpireDate 2有效期
              let expire = ''
              if (this.datas.VisitExpireDate) {
                expire = this.datas.VisitExpireDate
              } else {
                expire = this.datas.ExpireDate
              }

              let end = new Date(expire).getTime()
              let now = new Date().getTime()

              let diff = end - now      // 差值
        
              // s= parseInt(lefttime/1000%60)
              if (diff < 0) {
                this.IsSurpass(diff)    // 到了有效期
              } else {      
                this.dispose(end)   // 没到有效期
              }
            } else {
              // 非法访问
              this.$message.error('非法访问')
            }
          } else if (res.data.result === '权限不足') {
            // 没有权限
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
        })
      },
      dispose(end) {      // 倒计时
        let now = new Date().getTime()

        var lefttime = parseInt((end - now)/1000)
        let m = parseInt(lefttime/60%60)
        let s = parseInt(lefttime%60)
        // let sm = parseInt(lefttime%100)

        this.time = `${this.check(m)}:${this.check(s)}`

        this.timeStop = setTimeout(() => {
          let diff = end - now      // 差值
          if (diff < 0) {
            clearTimeout(this.timeStop)
            this.IsSurpass()
          } else {
            // console.log('倒计时毫秒')
            this.fnCountup()        // 倒计时毫秒
            this.dispose(end)
          }
        }, 1000)
      },
      IsSurpass() {     // 是否超过
        let expire = ''
        if (this.datas.VisitExpireDate) {
          expire = this.datas.VisitExpireDate
        } else {
          expire = this.datas.ExpireDate
        }
        let end = new Date(expire).getTime()
        let now = new Date().getTime()

        let diff = end - now      // 差值

        let m = parseInt(Math.abs(diff)/(60*1000)%60)

        if (m < 10) {
          this.within()     // 续报
        } else {
          this.exceed()     // 重新报备
          clearTimeout(this.timeSurpass)
          return
        }
        this.timeSurpass = setTimeout(() => {      // 一直判断到重新报备
          this.IsSurpass()
        }, 1000)
      },
      within() {      // 超过十分钟以内，允许续报
        this.buttonText = '续报'
        this.disabled = false
      },
      exceed() {      // 超过十分钟以后，重新报备
        this.buttonText = '重新报备'
        this.disabled = false
      },
      check(arg) {
        return arg >= 10 ? arg : '0' + arg
      },
      fnCountup() {     // 毫秒变化
        var options = {
          useEasing: false, 
          useGrouping: false, 
          separator: ',',
          decimal: '.'
        }
        this.numAnim = new CountUp('elcountup', 1000, 0, 0, 1, options)
        this.numAnim.start()
      },
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .continue {
    width: 100%;
    height: 100%;
    padding: 30px 20px;
    background-color: #f5f5f5;
    .main {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -55%);
      width: 90%;
    }
    .center {
      border-radius: 8px;
      box-shadow: 0 8px 12px 8px rgba(0, 0, 0, 0.1);
      background: #fff;
      text-align: left;
      .title {
        position: relative;
        width: 100%;
        height: 45px;
        font-size: 16px;
        color: #5A5E66;
        line-height: 45px;
        text-align: center;
        .icon {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 45px;
          height: 45px;
          line-height: 45px;
          text-align: center;
          font-size: 20px;
          color: #409EFF;
        }
      }
      .count-wrap {
        display: flex;
        align-items: center;
        justify-content: center;
      }
      .count-down {
        border: 1px solid #FA5555;
        border-radius: 4px;
        padding: 6px;
        text-align: center;
        .time-title {
          padding: 0 4px;
          font-size: 14px;
          color: #5A5E66;
        }
        .time-num {
          font-size: 16px;
          color: #FA5555;
        }
        #elcountup {
          display: inline-block;
          width: 30px;
          text-align: left;
        }
      }
    }
    .list-wrap {
      padding: 10px;
      .list {
        display: flex;
        align-items: center;
        .title {
          width: 100px;
          font-size: 14px;
          color: #878D99;
        }
        .text {
          flex: 1;
        }
        .text-wrap {
          display: flex;
          flex-direction: column;
        }
        .nick-name {
          color: #878D99;
        }
        .phone {
          flex: 2;
        }
      }
    }
    .expireds  {
      padding: 50px 0;
      font-size: 20px;
      color: #5A5E66;
      text-align: center;
    }
    .foot-btn {
      padding-top: 10px;
      padding-bottom: 20px;
      text-align: center;
      .el-button {
        width: 50%;
      }
    }
    .explain {
      padding-top: 20px;
      text-align: left;
      .desc {
        font-size: 14px;
        color: #5A5E66;
        line-height: 1.4;
        .infuse {
          font-size: 14px;
          color: #FA5555;
        }
      }
    }
    .code {
      position: absolute;
      bottom: 0;
      left: 0;
      padding: 10px;
      width: 100%;
      font-size: 12px;
      color: #B4BCCC;
      text-align: center;
    }
  }

</style>
