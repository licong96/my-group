<template lang="html">
  <!-- 客户续报 -->
  <section class="continue" v-loading="loading">
    <div class="main">
      <section class="center">
        <h3 class="title">抢客 抢客 抢客 ！！！</h3>
        <div class="list-wrap">
          <div class="list">
            <span class="title">客户称呼</span>
            <div class="text text-wrap">
              <span class="name">{{listData.CustName}}</span>
              <span class="nick-name">{{listData.NickName}}</span>
            </div>
          </div>
          <div class="list">
            <span class="title">客户号码</span>
            <span class="text">{{listData.CustMobile}}</span>
          </div>
          <div class="list">
            <span class="title">客户标签</span>
            <!-- <span class="text">有钱可投</span> -->
            <div class="tags">
              <span class="tag" v-for="(item, index) in listData.Tag" :key="index">{{item}}</span>
            </div>
          </div>
          <div class="list">
            <span class="title">意向度</span>
            <span class="text"><el-progress :percentage="listData.Intention"></el-progress></span>
          </div>
          <div class="list">
            <span class="title">资料完善度</span>
            <span class="text"><el-progress :percentage="listData.CompletePercent"></el-progress></span>
          </div>
          <div class="list">
            <span class="title">录入时间</span>
            <span class="text">{{listData.RegDate}}</span>
          </div>
        </div>
        <div class="foot-btn">
          <section class="center-r" @click="transfer(listData)">
            <div class="circle-wrap">
              <div class="circle" :class="{'animRotate': animRotate}">抢</div>
            </div>
          </section>
        </div>
      </section>
    </div>
    <div class="code">
      <p>Copyright© 2017 vipfgj.com</p>
    </div>
  </section>
</template>

<script>
  import { GetGrabByID, GrabInquiry } from '@/api/inquiry/inquiryTransfer'

  export default {
    data() {
      return {
        listData: {},
        animRotate: false,
        loading: true     // 加载中
      }
    },
    created() {
      let id = this.$route.query.id
      // console.log(id)
      this._GetGrabByID(id)
    },
    methods: {
      transfer(item) {        // 抢
        this.animRotate = true
        GrabInquiry(item.InquiryID).then((res) => {
          if (res.data.result === 'success') {
            this.$message({
              message: '抢客成功！',
              type: 'success',
              duration: '2000'
            })
            setTimeout(() => {      // 成功后去客户列表页面
              this.$router.push({
                path: '/inquiry'
              })
            }, 1000)
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _GetGrabByID(id) {
        GetGrabByID(id).then((res) => {
          if (res.data.result === 'success') {
            let ship = res.data.tempTable[0]

            ship.Intention = parseInt(ship.Intention)
            ship.CompletePercent = parseInt(ship.CompletePercent)
            ship.Tag = ship.Tag.split('|')    // 拆解tag
            let arr = []
            ship.Tag.forEach((item) => {
              if (item) {
                arr.push(item)
              }
            })
            ship.Tag = arr

            this.listData = ship
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.loading = false
        }).catch((error) => {
          this.loading = false
          this.$message.error('请求失败，网络错误！')
        })
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
    }
    .list-wrap {
      padding: 10px;
      border-top: 3px solid #409EFF;
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
          align-items: flex-end;
        }
        .nick-name {
          padding-left: 15px;
          font-size: 80%;
          color: #878D99;
        }
      }
    }
    .foot-btn {
      padding-top: 10px;
      padding-bottom: 20px;
      text-align: center;
      .center-r {
        margin: 0 auto;
        width: 68px;
        height: 68px;
        .circle-wrap {
          border-radius: 50%;
          box-shadow: 0 2px 6px 2px rgba(0, 0, 0, 0.2);
          width: 100%;
          height: 100%;
        }
        .circle {
          display: flex;
          align-items: center;
          justify-content: center;
          border: 4px solid rgba(245, 245, 245, .5);
          border-radius: 50%;
          width: 100%;
          height: 100%;
          font-size: 22px;
          color: #fff;
          background: radial-gradient(rgba(245, 108, 108, 1),  rgb(231, 52, 52));
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
  .tags {
    display: flex;
    flex-wrap: wrap;
    padding: 4px 4px 4px 0;
    .tag {
      margin: 6px 6px 0 0;
      padding: 2px 4px;
      border-radius: 3px;
      font-size: 14px;
      color: #409EFF;
      border: 1px solid #409EFF;
    }
  }

  .animRotate {
    animation: rotate 2s;
  }

  @keyframes rotate {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(720deg);
    }
  }
</style>
