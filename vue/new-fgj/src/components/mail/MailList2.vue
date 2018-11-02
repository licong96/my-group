<template lang="html">
  <!-- 邮件列表 -->
  <div class="mail-list">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">邮件列表</h3>
      <span class="right-span" v-show="isShowNew" @click="addNew"><el-button type="primary" size="small">新建</el-button></span>
    </header>
    <search placeholder="搜索关键字" @query="query"></search>
    <nav class="nav">
      <div class="list" :class="{'active': currentIndex===0}" @click="switchList('sys', 0)">
        <span class="title">系统消息<mark class="make" v-show="sysUnReadCount!=='0'">{{sysUnReadCount}}</mark></span>
      </div>
      <div class="list" :class="{'active': currentIndex===1}" @click="switchList('bus', 1)">
        <span class="title">业务消息<mark class="make" v-show="busUnReadCount!=='0'">{{busUnReadCount}}</mark></span>
      </div>
      <div class="list" :class="{'active': currentIndex===2}" @click="switchList('pers', 2)">
        <span class="title">私人消息<mark class="make" v-show="persUnReadCount!=='0'">{{persUnReadCount}}</mark></span>
      </div>
      <span class="line" :style="lineTransform"></span>
    </nav>
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
/**
 * 权限：
 *  PublicMsg	发送系统及业务类型消息	0 不允许  1允许
 *  PrivateMsg	发送私人类型消息	0 不允许  1允许
 *  Wechat	选择发送微信	0 不允许  1允许 
 */

  import Search from '@/base/Search'
  import { GetMessagePurview } from '@/api/mail/mailAdd'
  import { GetUnReadMessageCount } from '@/api/mail/mailList'
  import { prefixStyle } from '@/utils/index'
  import { mapActions } from 'vuex'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        likestr: '',          // 搜索
        isShowNew: false,     // 是否有权限去新建
        currentIndex: 0,
        sysUnReadCount: '0',      // 系统未读
        busUnReadCount: '0',      // 业务未读
        persUnReadCount: '0',      // 私人未读
      }
    },
    created() {
      this._GetUnReadMessageCount()
      let route = this.$route
      // 切换当前选中状态
      switch (route.name) {
        case 'MailListSys':
            this.currentIndex = 0
          break;
        case 'MailListBus':
            this.currentIndex = 1
          break;
        default:
            this.currentIndex = 2
          break;
      }
    },
    computed: {
      lineTransform() {     // 切换下划线标记的位置
        return `${transform}: translate3d(${this.currentIndex * 100}%, 0, 0)`
      }
    },
    methods: {
      query(newVal) {     // 搜索
        this.likestr = newVal
        this.setMailLikestr(newVal)
      },
      switchList(type, index) {   // 类型
        this.currentIndex = index
        this.$router.replace({
          path: '/mailList/' + type
        })
      },
      addNew() {      // 新建
        this.$router.push({
          path: '/mailAdd'
        })
      },
      _GetUnReadMessageCount() {    // 获取未读消息
        GetUnReadMessageCount().then(res => {

        })
      },
      _GetMessagePurview() {    // 获取权限
        GetMessagePurview().then(res => {
          let data = res.data
          if (data.result === 'success') {
            if (data.PublicMsg === '1' || data.PrivateMsg === '1' || data.Wechat === '1') {   // 只要满足一个权限就能去新建消息
              this.isShowNew = true
            }
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
      back() {
        this.$router.back()
      },
      ...mapActions([
        'setMailLikestr'
      ])
    },
    components: {
      Search,
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/variable';
  @import '../../common/sass/mixin';
  
  .mail-list {
    min-height: 100%;
    background-color: #f5f5f5;
    .header{
      box-shadow: 0px 1px 2px #e6e6e6;
    }
    .nav {
      position: relative;
      display: flex;
      background-color: #fff;
      @include border-b-1px(0);
      .list {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        &.active {
          .title {
            color: $color-blue;
          }
        }
        .title {
          position: relative;
          font-size: 14px;
          color: #333;
        }
        .make {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: -4px;
          right: -16px;
          border-radius: 50%;
          min-width: 14px;
          min-height: 14px;
          font-size: 12px;
          color: #fff;
          background-color: $color-red;
        }
      }
      .line {
        position: absolute;
        left: 0;
        bottom: 1px;
        width: 33.33%;
        height: 2px;
        transition: all .3s;
        &:after {
          content: "";
          display: block;
          margin: 0 auto;
          width: 70px;
          height: 100%;
          background-color: $color-blue;
        }
      }
    }
  }
</style>
