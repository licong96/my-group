<template lang="html">
  <!-- 邮件详情 -->
  <section class="mail-detail">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">邮件详情</h3>
    </header>
    <div class="main" v-show="!hasMore">
      <scroll ref="scrolls" :data="messageData.imageData">
      <div>
        <p class="who">{{messageData.MessageType}}</p>
        <div class="who-text">
          <div class="info">
            <img class="img" :src="messageData.PicSrc" alt="">
            <div class="info-text">
              <p class="name">{{messageData.EmpName}}</p>
              <p class="time">{{messageData.SendTime}}</p>
            </div>
          </div>
          <div class="center-text">
            <h4 class="title">{{messageData.MessageTitle}}</h4>
            <p class="desc">{{messageData.MessageContent}}</p>
            <ul class="img-wrap">
              <li class="img-list" v-for="(item, index) in messageData.imageData" :key="index" @click="fullShowImg(messageData.imageData, index)">
                <img class="img" :src="smPath(item.PhotoPath)" alt="">
              </li>
            </ul>
          </div>
        </div>
        <!-- 评论 -->
        <div class="comment" v-for="(item, index) in messageData.reply" :key="index">
          <div class="info">
            <img class="img" :src="item.PicSrc" alt="">
            <div class="info-text">
              <p class="name">{{item.EmpName}}</p>
              <p class="time">{{item.SendTime}}</p>
            </div>
          </div>
          <div class="center-text">
            <p class="desc">{{item.MessageContent}}</p>
            <ul class="img-wrap">
              <li class="img-list" v-for="(img, index) in item.imageData" :key="index" @click="fullShowImg(item.imageData, index)">
                <img class="img" :src="smPath(img.PhotoPath)" alt="">
              </li>
            </ul>
          </div>
        </div>
      </div>
      </scroll>
    </div>
    <div class="reply" @click="openAdd" v-show="!hasMore">立即回复</div>
    <!-- 加载中 -->
    <loader v-show="hasMore"></loader>
    <awesomeSwiper ref="awesomeSwiper" :swiperData="swiperData" :initialSlide="initialSlide"></awesomeSwiper>
    <!-- 立即回复 -->
    <transition name="transY">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import Loader from '@/base/Loader'
  import Scroll from '@/base/BScroll'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import { GetMessageByID } from '@/api/mail/mailDetail'
  import { vipfgj } from '@/common/js/config'
  import { prefixStyle, verifyData } from '@/utils/index'
  import { mapGetters, mapActions } from 'vuex'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        messageID: '',      // 当前消息ID
        messageType: '',    // 消息类型
        messageData: {},    // 消息数据
        hasMore: true,      // 加载中
        swiperData: [],     // 图片预览数据
        initialSlide: 0,    // 预览下标
      }
    },
    created() {
    },
    activated() {
      this.hasMore = true
      this.messageID = this.$route.query.id
      this.messageType = this.$route.query.type
      this._GetMessageByID(this.messageID)
    },
    mounted() {
    },
    computed: {
      ...mapGetters([
        'getMailReply'
      ])
    },
    methods: {
      fullShowImg(imageData, index) {
        this.swiperData = imageData
        this.initialSlide = index
        console.log(index)
        this.$refs.awesomeSwiper.show()
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj{join}` 是本地测试用的
        if (!paths) {
          return
        }
        if (paths.includes('sm_')) {
          return `${vipfgj}${paths}`
        } else {
          let resol = paths.split('/')
          let leng = resol.length - 1
          resol[leng] = 'sm_' + resol[leng]
          let join = resol.join('/')
          return `${vipfgj}${join}`
        }
      },
      _GetMessageByID(messageID) {     // 获取数据
        GetMessageByID(messageID).then(res => {
          this.hasMore = false
          if (res.data.result === 'success') {
            // 处理数据结构
            let datas = res.data.tempTable
            let subject = {}
            let reply = []
            for (let i = 0; i < datas.length; i++) {
              // 图片
              let arrImg = []
              let ReceiveFile = datas[i].ReceiveFile
              if (ReceiveFile) {
                ReceiveFile.split('|').forEach(item => {
                  if (item) {
                    arrImg.push({
                      PhotoPath: item
                    })
                  }
                })
              }
              datas[i].imageData = arrImg
              if (verifyData(datas[i].ReplyMessageID, 'require')) {
                reply.push(datas[i])
              } 
              else {
                subject = datas[i]
              }
            }
            this.messageData = subject
            this.messageData.reply = reply
            setTimeout(() => {
              this.$refs.scrolls.scrollTo(0, 0, 300)
            }, 30)
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      openAdd() {
        this.$router.push({
          path: '/mailList/mailDetail/reply',
          query:  {
            id: this.messageID,
            type: this.messageType
          }
        })
      },
      back() {
        this.$router.back()
      },
      ...mapActions([
        'setMailReply'
      ])
    },
    watch: {
      getMailReply(newVal) {      // 立即回复成功，更新数据
        console.log('getMailReply', newVal)
        if (newVal) {
          this._GetMessageByID(this.messageID)
          this.setMailReply(false)      // 成功后，改回状态
        }
      }
    },
    components: {
      Loader,
      Scroll,
      AwesomeSwiper
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/variable';
  @import '../../common/sass/mixin';
  
  .mail-detail {
    overflow: hidden;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    min-height: 100%;
    background-color: #f5f5f5;
    .header{
      box-shadow: 0px 1px 2px #e6e6e6;
    }
    .main {
      position: absolute;
      top: 50px;
      right: 0;
      bottom: 50px;
      left: 0;
      z-index: 2;
      text-align: left;
    }
    .who {
      padding: 6px 16px;
      font-size: 12px;
      color: $color-blue;
      @include border-b-1px(0);
      background-color: #fff;
    }
    .who-text {
      margin-bottom: 6px;
    }
    .info {
      display: flex;
      align-items: center;
      padding: 10px 16px;
      background-color: #fff;
      .img {
        border-radius: 50%;
        width: 40px;
        height: 40px;
      }
      .info-text {
        padding-left: 10px;
        .name {
          font-size: 14px;
          color: #333;
        }
        .time {
          padding-top: 6px;
          font-size: 12px;
          color: #999;
        }
      }
    }
    .center-text {
      padding: 0 16px 10px;
      @include border-b-1px(0);
      background-color: #fff;
      .title {
        font-size: 16px;
        color: #000;
      }
      .desc {
        padding-top: 6px;
        font-size: 14px;
        color: #666;
        line-height: 1.5;
      }
      .img-wrap {
        display: flex;
        flex-wrap: wrap;
        margin-top: 10px;
        .img-list {
          margin-right: 10px;
          width: 80px;
        }
        .img {
          width: 100%;
          vertical-align: top;
        }
      }
    }
    .comment {
      // margin-top: 10px;
      padding-left: 12px;
      background-color: #fff;
      @include border-b-1px(0);
      .comment-reply {
        padding-left: 40px;
        padding-bottom: 10px;
        @include border-b-1px(0);
        font-size: 14px;
        color: #666;
        .info {
          padding: 4px;
          .img {
            width: 30px;
            height: 30px;
          }
        }
        .who-name {
          display: inline-block;
          padding: 0 4px;
          color: $color-blue;
        }
        .desc {
          padding-left: 46px;
        }
      }
    }
    .reply {
      @include border-b-1px(100%);
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 3;
      width: 100%;
      font-size: 16px;
      color: $color-blue;
      height: 45px;
      line-height: 45px;
      background-color: #fff;
    }
  }
</style>
