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
      <div class="list" :class="{'active': currentIndex===0}" @click="switchList('系统', 0)">
        <span class="title">
          系统消息
          <mark class="make" v-show="sysUnReadCount!=='0'">{{sysUnReadCount}}</mark>
        </span>
      </div>
      <div class="list" :class="{'active': currentIndex===1}" @click="switchList('业务', 1)">
        <span class="title">业务消息<mark class="make" v-show="busUnReadCount!=='0'">{{busUnReadCount}}</mark></span>
      </div>
      <div class="list" :class="{'active': currentIndex===2}" @click="switchList('私人', 2)">
        <span class="title">私人消息<mark class="make" v-show="persUnReadCount!=='0'">{{persUnReadCount}}</mark></span>
      </div>
      <span class="line" :style="lineTransform"></span>
    </nav>
    <section class="main">
      <scroll ref="scrolls" :data="listData" :pullup="pullup" @scrollToEnd="scrollToEnd">
        <div>
          <sideslip
            ref="sideslips"
            v-for="(item, index) in listData" :key="index" :item="item" 
            :touchSides="touchSides"
            :paramRight="paramRight"
            :previousEl="previousEl"
            @onTouchSides="onTouchSides"
            @previous="previous"
            @onTouchStart="onTouchStart">
              <!-- 中间内容 -->
              <div class="center" :class="{'read': item.UnReadCount==='0'}" slot="center" @click="openDetail(item)"> 
                <i class="dot">{{item.UnReadCount}}</i>
                <p class="text ellipsis">{{item.MessageContent}}</p>
                <div class="right">
                  <p class="time">{{item.SendTime}}</p>
                  <p class="info"><i class="iconfont icon-tubiao15"></i>{{item.ReplyCount}}</p>
                </div>
              </div>
              <!-- 右侧按钮，用了滑动组件之后，点击事件的父容器就不需要 touchStart.stop -->
              <div class="side-right" slot="right" :style="paramRight.style">
                <span class="button yellow" :style="paramRight.btnStyle1" @click="onReply(item)">标记已读</span>
              </div>
          </sideslip>
          <loader v-show="hasMore"></loader>
          <empty v-show="!hasMore && !listData.length"></empty>
        </div>
      </scroll>
    </section>
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
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
  import Sideslip from '@/base/Sideslip'
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Scroll from '@/base/BScroll'
  import LoaderCenter from '@/base/LoaderCenter'
  import Confirm from '@/base/Confirm'
  import { GetMessagePurview } from '@/api/mail/mailAdd'
  import { GetMessagePageListByType, MessageSetReader, GetUnReadMessageCount } from '@/api/mail/mailList'
  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        likestr: '',          // 搜索
        MessageType: '系统',      // 类型
        page: 1,              // 页数
        isShowNew: false,     // 是否有权限去新建
        currentIndex: 0,
        touchSides: '',       // 滑动组件
        previousEl: null,
        paramRight: {
          isSides: true,      // 是否允许滑动
          style: {
            width:  '100px',
            right: '-100px',
          },
          btnStyle1: {
            width: '100px'
          },
        },
        listData: [],       // 列表数据
        hasMore: true,      // 数据加载中
        isOnceData: false,    // 限制重复加载
        sysUnReadCount: '0',      // 系统未读
        busUnReadCount: '0',      // 业务未读
        persUnReadCount: '0',      // 私人未读
        recordCount: 0,     // 记录请求数量
      }
    },
    created() {
      let type = this.$route.query.type
      // 切换当前选中状态
      if (type) {
        switch (type) {
          case 'sys':
              this.currentIndex = 0
              this.MessageType = '系统'
            break;
          case 'bus':
              this.currentIndex = 1
              this.MessageType = '业务'
            break;
          default:
              this.currentIndex = 2
              this.MessageType = '私人'
            break;
        }
      }
      this.pullup = true      // 开启上滑加载更多
      this._GetUnReadMessageCount()   // 获取未读
      this._GetMessagePageListByType()    // 获取数据
      this._GetMessagePurview()   // 获取权限
    },
    mounted() {
    },
    computed: {
      lineTransform() {     // 切换下划线标记的位置
        return `${transform}: translate3d(${this.currentIndex * 100}%, 0, 0)`
      }
    },
    methods: {
      openDetail(item) {      // 打开详细页
        this.$router.push({
          path: '/mailList/mailDetail',
          query: {
            id: item.MessageID,
            type: this.MessageType
          }
        })
        MessageSetReader(item.MessageID)     // 标记已读
        item.UnReadCount = '0'      // 未读数设为0
        this._reduceCount(item.MessageType)     // 总的未读消息减一
      },
      onReply(item) {   // 标记已读
        MessageSetReader(item.MessageID).then(res => {
          if (res.data.result === 'success') {
            this.$message.success('成功标记已读')
            item.UnReadCount = '0'      // 未读数设为0
            this._reduceCount(item.MessageType)     // 总的未读消息减一
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _reduceCount(type) {
        switch (type) {
          case '系统':
            this.sysUnReadCount--
            break;
          case '业务':
            this.busUnReadCount--
          default:
            this.persUnReadCount--
            break;
        }
      },
      scrollToEnd() {      // 上滑加载更多
        if (this.isOnceData) {
          return
        }
        this.isOnceData = true      // 限制加载一次
        this.hasMore = true
        this.page++
        GetMessagePageListByType(this.likestr, this.MessageType, this.page).then((res) => {
          this.hasMore = false
          this.isOnceData = false
          if (res.data.result === 'success') {
            this.listData = this.listData.concat(res.data.tempTable)   // 拼在一起
            this._checkMore(res.data.tempTable)
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      _GetMessagePageListByType() {     // 获取数据
        this.listData = []
        this.hasMore = true
        this.isOnceData = true
        this.page = 1
        this.recordCount++
        GetMessagePageListByType(this.likestr, this.MessageType, this.page).then(res => {
          this.hasMore = false
          this.isOnceData = false
          if (res.data.result === 'success') {
            this.recordCount --   // 防止多次点击后数据不吻合的问题，这个方法很贱
            if (this.recordCount === 0) {
              this.listData = res.data.tempTable
              this._checkMore(res.data.tempTable)
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
      _checkMore(data) {    // 判断是否拿到更多数据，没有的话就不要再去滑动加载了
        if (!data.length || data.length < 10) {
          this.isOnceData = true
          return
        }
      },
      _GetUnReadMessageCount() {    // 获取未读消息
        GetUnReadMessageCount().then(res => {
          let data = res.data
          if (data.result === 'success') {
            data.tempTable.forEach(item => {
              if (item.MessageType === '系统') {
                this.sysUnReadCount = item.UnReadCount
              }
              else if (item.MessageType === '业务') {
                this.busUnReadCount = item.UnReadCount
              }
              else {
                this.persUnReadCount = item.UnReadCount
              }
            })
          }
          else {
            this.$message.error(data.msg)
          }
        }).catch(err => alert('网络异常：' + err))
      },
      onTouchStart(item) {      // 开始的时候，要判断当前这条数据的状态，能显示多少按钮和大小
        if (item.UnReadCount === '0') {
          this.paramRight.isSides = false
        } 
        else {
          this.paramRight.isSides = true
        }
      },
      previous(el) {
        this.previousEl = el
      },
      onTouchSides(Bool) {
        this.touchSides = Bool
      },
      clearTouchEl() {
        this.touchSides = ''
        this.previousEl.el.style[transform] = `translate3d(0, 0, 0)`    // 清除上一个
      },
      query(newVal) {     // 搜索
        this.likestr = newVal
        this._GetMessagePageListByType()
      },
      switchList(type, index) {   // 类型
        this.MessageType = type
        this.currentIndex = index
        this.page = 1     // 切换类型后，page要还原
        this._GetMessagePageListByType()
      },
      addNew() {      // 新建
        this.$router.push({
          path: '/mailAdd'
        })
      },
      _GetMessagePurview() {
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
      }
    },
    components: {
      Search,
      Sideslip,
      Loader,
      Empty,
      Scroll,
      LoaderCenter,
      Confirm,
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
          left: 58px;
          border-radius: 10px;
          padding: 2px 4px;
          min-width: 16px;
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
    .main {
      overflow: hidden;
      position: absolute;
      top: 132px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      padding-bottom: 32px;
      text-align: left;
      .center {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 16px 10px 24px;
        @include border-b-1px(0);
        &.read {
          .dot {
            display: none;
          }
          .text {
            color: #999;
          }
        }
        .dot {
          display: flex;
          justify-content: center;
          align-items: center;
          position: absolute;
          top: 50%;
          left: 4px;
          margin-top: -7px;
          border-radius: 10px;
          padding: 0 4px;
          height: 14px;
          line-height: 14px;
          font-size: 10px;
          font-style: normal;
          color: #fff;
          background-color: $color-red;
        }
        .text {
          flex: 1;
          font-size: 14px;
          color: #333;
        }
        .right {
          font-size: 12px;
          color: #999;
          .info {
            padding-top: 4px;
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .iconfont {
            padding-right: 2px;
          }
        }
      }
    }
  }
</style>
