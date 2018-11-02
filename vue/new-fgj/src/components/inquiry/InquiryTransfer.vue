<template lang="html">
  <!-- 公客池 -->
  <section class="lc transfer">
    <div class="head-top" @touchmove.prevent>
      <header class="lc header">
        <i class="el-icon-arrow-left icon" @click="back"></i>
        <h3 class="title">公客池({{resultcount}})</h3>
        <el-button class="add-a right-btn" type="primary" @click="openMore">筛选</el-button>
      </header>
      <div class="lc b-search">
        <i class="el-icon-search"></i>
        <input class="search-input" v-model="likestr" type="text" placeholder="搜索关键字，如姓名，电话，标签...">
        <i class="el-icon-circle-close" v-show="likestr" @click="cleanLikestr"></i>
      </div>
    </div>
    <!-- 列表 -->
    <div class="scroll-area">
    <scroll
      ref="scrolls"
      :data="listData"
      :pullup="pullup"
      :bounce="bounce"
      :momentum="momentum"
      :listemScroll="listemScroll"
      :pullDown="pullDownRefresh"
      :probeType="probeType"
      @scrollToEnd="upLoad"
      @pullingDown="pullDown"
      @scroll="scrollVal">
      <section class="list-wrap">
        <ul>
          <li
            class="list"
            v-for="(item, index) in listData"
            :key="index"
            :class="{'trans-right': item.InquiryID===touchRight, 'list-transX': item.InquiryID===item.transX, 'status-1': item.Status==='有效', 'status-2': item.Status==='暂缓', 'status-3': item.Status==='无效',}"
            @touchstart.prevent="listTouchStart($event, item)"
            @touchmove.prevent="listTouchMove"
            @touchend="listTouchEnd"
            >
            <!-- 中间的内容 -->
            <div class="list-center">
              <div class="flex-wrap">
                <section class="center-l">
                  <div class="top">
                    <div class="text-top">
                      <h4 class="title">
                        <span class="title-span">{{item.CustName}}</span>
                        <small class="phone">{{item.CustMobile}}<i class="iconfont icon-xin" v-show="item.IsNewInquiry==='1'"></i></small>
                      </h4>
                      <p class="nick-name">{{item.NickName}}</p>
                    </div>
                    <div class="percentage">
                      <el-progress type="circle" :stroke-width="2" :width="32" :percentage="item.CompletePercent"></el-progress>
                    </div>
                  </div>
                  <div class="tags">
                    <span class="tag" v-for="(item, index) in item.Tag" :key="index" v-if="item">{{item}}</span>
                  </div>
                </section>
                <!-- 抢 -->
                <section class="center-r" @click="transfer(item, index)">
                  <div class="circle-wrap">
                    <div class="circle" :class="{'animRotate': animRotate===item.InquiryID}">抢</div>
                  </div>
                </section>
              </div>
              <!-- <p class="remark" v-if="item.Remark">{{item.Remark}}</p> -->
              <div class="f-time">
                <div class="intention-line">
                  <ul>

                  </ul>
                  <el-progress :percentage="item.Intention" :stroke-width="2" :show-text="false"></el-progress>
                </div>
                <p class="intention-text">意向值：{{item.Intention}}</p>
                <p class="text-r" v-if="item.RegDate">录入：{{item.RegDate}}</p>
              </div>
            </div>
            <!-- 右侧跟进 -->
            <div class="list-btn-r">
              <span class="button lc-follow" @click="_follow(item.InquiryID)"><i class="iconfont icon-tianxiegenjin"></i>跟进</span>
            </div>
          </li>
        </ul>
        <!-- 加载中 -->
        <loader v-show="hasMore"></loader>
        <!-- 什么都没有 -->
        <empty v-show="!hasMore && !listData.length"></empty>
      </section>
    </scroll>
    <!-- 下拉更新 -->
    <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-show="isPullingDown">
      <div class="before-trigger">
        <bubble :y="bubbleY"></bubble>
      </div>
      <div class="refreshTxt" v-show="isRebounding">松开刷新数据</div>
    </div>
    <!-- 刷新数据加载中提示 -->
    <transition name="iconload">
      <div class="icon-loader" v-show="DownLoader">
        <div class="loader-text">
          <i class="el-icon-loading"></i><span class="desc">加载中</span>
        </div>
      </div>
    </transition>
    </div>
    <!-- 底部统计 -->
    <footer class="foot-statistics">
      <span class="state">今天剩余：{{grabCount.HaveGrabCount}}次</span>
      <span class="state">本周已抢：{{grabCount.WeekGrab}}次</span>
      <span class="state">本月已抢：{{grabCount.MonthGrab}}次</span>
    </footer>
    <!-- 更多筛选 -->
    <screen ref="screen" :IsHide="screenIsHide" :isOneOff="isOneOff" @select="onSelect" @empty="selectEmpty"></screen>
    
    <loader-center ref="loaders"></loader-center>
    <!-- 回到顶部 -->
    <transition name="top-in">
      <div class="back-top" v-show="IsBackTop" @click="onBackTop">
        <el-button type="primary" icon="el-icon-upload2"></el-button>
      </div>
    </transition>
  </section>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import LoaderCenter from '@/base/LoaderCenter'
  import Screen from '@/base/Screen'
  import Bubble from '@/components/reported/Bubble'
  import { InquiryTag } from '@/api/inquiry/inquiry'
  import { GetGrabPageData, GrabInquiry, GetGrabEasyStatistics } from '@/api/inquiry/inquiryTransfer'
  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        likestr: '',
        listData: [],     // 数据列表
        paramsItem: {     // 筛选数据
          page: 1
        },
        hasMore: false,    // 数据加载中
        loadingText: '加载中...',
        loadingShow: true,   // 是否显示加载中
        scrollY: 0,       // y轴坐标
        bubbleY: 0,        // 下拉刷新偏移度
        isRebounding: false,    // 是否显示刷新文字
        isPullingDown: true,      // 是否显示刷新图标
        pullDownStyle: '',    // 刷新图标偏移
        DownLoader: false,   // 下拉刷新提示
        grabCount: {         // 统计
          HaveGrabCount: 0,
          WeekGrab: 0,
          MonthGrab: 0
        },
        animRotate: '',     // 抢旋转动画
        IsBackTop: false,     // 回到顶部
        resultcount: 0,        // 总数
        touchRight: 0 ,   // 当前可以滑动的值 right
        touch: {},         // 存储滑动
        isOneOff: true,   // 直接获取标签选项数据
        isTransfer: true,   // 是否能够抢客
      }
    },
    created() {
      this.bounce = true     // 关闭弹动
      this.probeType = 3    // 不截流
      this.listemScroll = true  // 派发滚动时间
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载
      // this.bounceTimes = 300   // 筛选滑动回弹速度
      this.pullDownRefresh = true   // 开启下拉刷新
      this.pullDownInitTop = -50

      this.screenIsHide = {   // 决定显示哪个筛选条件
        tag: true,
        status: true,
        order: true,
        CustGrade: true,
        rangPrice: true,
        rangSquare: true
      }
      
      this._customer()
      this._InquiryTag()
      this._GetGrabEasyStatistics()
    },
    mounted() {
      this.loaders = this.$refs.loaders      // 提示元素全局保存
    },
    methods: {
      _follow(id) {     // 跟进
        this.$router.push({
          path: '/follow',
          query: {
            id: id
          }
        })
      },
      listTouchStart (e, item) {
        this.touch.InquiryID = item.InquiryID      // 把当前操作的列表保存在touch中

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = ''
          return
        }
        this.touch.initiated = true
        this.touch.current = e.currentTarget    // 当前元素，event输出是null，但是单独输出就有
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      listTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          this.touch.sides = false
          return
        }

        if (deltaX < -40) {
          this.touch.sides = 'r'
        } else {
          this.touch.sides = false
        }

        let excur = excur = Math.max(Math.min(deltaX, 0), -80)
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`
      },
      listTouchEnd () {
        if (!this.touch.initiated) {
          return
        }
        // 要么左，要么右，要么全部清除掉
        this.touch.current.style.transition = 'all .2s linear'      // 放手的时候添加过渡
        setTimeout(() => {      // 加延迟可以防止跳动
          this.touch.current.style[transform] = null
        }, 20)
        if (this.touch.sides === 'r') {
          this.touchRight = this.touch.InquiryID
        } else {
          this.touchRight = ''
        }
      },
      scrollVal(pos) {      // 下拉刷新图标动画
        if (pos.y > 80) {
          this.isRebounding = true
        } else {
          this.isRebounding = false
        }
        if (-pos.y > window.innerHeight) {    // 显示隐藏回到顶部按钮
          this.IsBackTop = true
        } else {
          this.IsBackTop = false
        }
        // 计算偏移
        this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
        this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 0)}px`
      },
      onBackTop() {   // 回到顶部
        this.$refs.scrolls.scrollTo(0, 0, 300)
        this.IsBackTop = false
      },
      transfer(item, index) {        // 抢
        if (!this.isTransfer) {
          this.$message.warning('别点了')
          return
        }
        this.isTransfer = false
        this.animRotate = item.InquiryID
        this.loaders.show('抢客中')     // 开启等待

        if (this.listData.length < 5) {     // 当前页面数据小于5，再加载数据
          this.upLoad()
        }

        GrabInquiry(item.InquiryID).then((res) => {
          this.isTransfer = true
          this.loaders.hide()
          if (res.data.result === 'success') {
            this.$message({
              message: '抢客成功！',
              type: 'success',
              duration: '2000'
            })
            // 修改统计次数
            this.grabCount.HaveGrabCount = parseInt(this.grabCount.HaveGrabCount) - 1
            this.grabCount.WeekGrab = parseInt(this.grabCount.WeekGrab) + 1
            this.grabCount.MonthGrab = parseInt(this.grabCount.MonthGrab) + 1
          } else {
            this.$message.error(res.data.msg)
          }
          this.listData.forEach((list) => {
            if (list.InquiryID === item.InquiryID) {
              this.$set(list, 'transX', item.InquiryID)
            }
          })
          // this.listData.splice(index, 1)
          setTimeout(() => {
            this.listData.splice(index, 1)
          }, 500)
          setTimeout(() => {
            this.$refs.scrolls.refresh()
          }, 600)
        })
      },
      pullDown() {    // 下拉刷新数据
        this.isPullingDown = false
        this.DownLoader = true
        this._customer()
      },
      upLoad() {            // 加载更多
        this.hasMore = true
        this.paramsItem.page++
        
        this.loaders && this.loaders.show('加载中')     // 开启等待
        GetGrabPageData(this.paramsItem).then((res) => {
          this.loaders && this.loaders.hide()
          if (res.data.result === 'success') {
            let ship = this._forData(res.data.tempTable)
            this.listData = this.listData.concat(ship)
            // 要重新计算高度
            setTimeout(() => {
              this.$refs.scrolls.refresh()
            }, 600)     // 因为列表有动画，所以延迟多一点
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.hasMore = false
        }).catch((error) => {
          this.hasMore = false
          this.$message.error('请求失败，网络错误！')
        })
      },
      _customer() {       // 获取列表数据
        // this.listData = []
        this.paramsItem.page = 1
        this.hasMore = true     // 加载中
        GetGrabPageData(this.paramsItem).then((res) => {
          // console.log(res)
          this.loaders && this.loaders.hide()
          if (res.data.result === 'success') {
            let ship = this._forData(res.data.tempTable)
            this.listData = ship
            this.resultcount = res.data.resultcount     // 总数

            if (this.$refs.scrolls) {
              this.$refs.scrolls.scrollTo(0, 0)     // 这是首页请求，要回到顶部
              setTimeout(() => {
                this.pullDownStyle = `top: ${this.pullDownInitTop}px`
              }, 30)
            }
            // 要重新计算高度
            setTimeout(() => {
              this.isPullingDown = true
              this.$refs.scrolls.refresh()
            }, 600)     // 因为列表有动画，所以延迟多一点
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.DownLoader = false
          this.hasMore = false
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
          this.DownLoader = false
          this.hasMore = false
        })
      },
      _forData(data) {      // 处理数据
        let ship = data
        data.forEach((item, index) => {
          ship[index].Intention = parseInt(item.Intention)
          ship[index].CompletePercent = parseInt(item.CompletePercent)
          ship[index].Tag = item.Tag.split('|')    // 拆解tag
        })
        return ship
      },
      _GetGrabEasyStatistics() {    // 获取统计
        GetGrabEasyStatistics().then((res) => {
          if (res.data.result === 'success') {
            let data = res.data.tempTable[0]

            this.grabCount.HaveGrabCount = data.HaveGrabCount
            this.grabCount.WeekGrab = data.WeekGrab
            this.grabCount.MonthGrab = data.MonthGrab

            if (data.HaveGrabCount <= 0) {    // 不能抢了
              this.isTransfer = false
            }
          } else {
            this.$message.error(res.data.msg)
            this.isTransfer = false
          }
        })
      },
      _InquiryTag() {   // 获取标签
        InquiryTag().then((res) => {
          this.tag = res.data.tempTable
        })
      },
      onSelect(obj) {      // 接收筛选条件
        // console.log('接收筛选条件', obj)
        this.paramsItem = obj
        this.paramsItem.likestr = this.likestr
        this._customer()
      },
      selectEmpty(obj) {   // 清空筛选
        this.paramsItem = obj
        this.likestr = ''
        this._customer()
      },
      openMore() {    // 打开更多筛选
        this.$refs.screen.openMore()
      },
      cleanLikestr() {      // 清空搜索
        this.likestr = ''
      },
      back() {
        this.$router.back()
      }
    },
    watch: {
      likestr(newVal) {   // 监听搜索
        if (this.timeGetList) {
          clearTimeout(this.timeGetList)
        }
        this.timeGetList = setTimeout(() => {
          this.paramsItem.likestr = newVal
          // console.log(this.paramsItem)
          this.loaders && this.loaders.show('加载中')     // 开启等待
          this._customer()   // 去筛选
        }, 300)
      }
    },
    components: {
      Scroll,
      Empty,
      Loader,
      LoaderCenter,
      Bubble,
      Screen
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .transfer {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background: #f5f5f5;
    .head-top {
      @include border-b-1px(0);
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 10;
      // padding-bottom: 1px;
      background: #ffffff;
    }
    .scroll-area {
      position: absolute;
      top: 95px;
      right: 0;
      bottom: 20px;
      left: 0;
      background: #f5f5f5;
    }
    .list-wrap {
      overflow: hidden;
      position: relative;
      z-index: 2;
      padding: 10px 5px;
    }
    .list {
      position: relative;
      margin-bottom: 10px;
      &.status-1 {
        .list-center {
          box-shadow: 0 1px 6px rgba(64, 158, 255, .6);
        }
      }
      &.status-2 {
        .list-center {
          box-shadow: 0 1px 6px rgba(235, 158, 5, .6);
          .title-span {
            color: rgba(235, 158, 5, 1);
          }
          .f-time {
            .intention-text {
              color: rgba(235, 158, 5, .8);
            }
          }
          .tags {
            .tag {
              color: rgba(235, 158, 5, .7);
              border-color: rgba(235, 158, 5, .7);
            }
          }
        }
      }
      &.status-3 {
        .list-center {
          box-shadow: 0 1px 6px rgba(135, 141, 153, .6);
          .title-span {
            color: rgba(135, 141, 153, 1);
          }
          .text-l {
            color: rgba(135, 141, 153, .9);
          }
          .f-time {
            .intention-text {
              color: rgba(135, 141, 153, .8);
            }
          }
          .tag {
            color: rgba(135, 141, 153, .7);
            border-color: rgba(135, 141, 153, .7);
          }
          .text-r {
            color: rgba(135, 141, 153, .6);
          }
          .top {
            .text-top {
              .privy {
                background-color: rgba(135, 141, 153, .8);
              }
            }
          }
        }
      }
      &.trans-right {
        transform: translate3d(-80px, 0, 0);
      }
      .list-center {
        padding: 10px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
        // box-shadow: 0 1px 6px rgba(64, 158, 255, .6);
        .flex-wrap {
          display: flex;
          text-align: left;
          .center-l {
            flex: 1;
            padding-right: 10px;
          }
          .center-r {
            margin: 0 10px 10px 10px;
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
        .top {
          display: flex;
          justify-content: space-between;
          .text-top {
            padding-right: 10px;
            .nick-name {
              padding-top: 4px;
              font-size: 12px;
              color: #999;
              line-height: 1.2;
            }
          }
          .title {
            font-size: 15px;
            color: #2D2F33;
            .iconfont {
              position: absolute;
              top: -5px;
              right: -24px;
              font-size: 22px;
              color: #ff2255;
            }
          }
          .title-span {
            padding-right: 6px;
          }
          .phone {
            position: relative;
            font-size: 14px;
            color: #878D99;
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
        .remark {
          margin-bottom: 5px;
          padding-top: 5px;
          font-size: 13px;
          color: #878D99;
          line-height: 1.4;
          text-align: left;
          @include text-over-2();
        }
        .f-time {
          display: flex;
          justify-content: space-between;
          position: relative;
          // @include border-b-1px(100%);
          padding-top: 10px;
          text-align: right;
          .intention-text {
            font-size: 14px;
            color: #878D99;
          }
          .intention-line {
            position: absolute;
            top: 0;
            left: 0;
            z-index: 2;
            width: 100%;
          }
        }
        .text-r {
          color: #878D99;
        }
      }
      .list-btn-r {
        position: absolute;
        top: 0;
        padding-left: 10px;
        right: -80px;
        width: 80px;
        display: flex;
        .button {
          flex: 1;
          width: 80px;
        }
      }
      .list-btn-r {
        height: 100%;
        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          // border-radius: 4px;
          height: 100%;
          font-size: 16px;
          color: #fff;
          &.lc-follow {
            border-radius: 4px;
            background-color: #509dec;
          }
        }
        .iconfont {
          padding-bottom: 4px;
          font-size: 22px;
        }
      }
      .defeated {
        display: none;
        position: absolute;
        top: 10px;
        right: 50px;
        z-index: 10;
        font-size: 16px;
        color: rgba(250, 85, 85, 1);
      }
    }
    // 底部统计
    .foot-statistics {
      display: flex;
      justify-content: space-around;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 5;
      padding: 5px;
      width: 100%;
      color: #fff;
      background: rgba(64, 158, 255, .9);
    }
  }
  .pulldown-wrapper {
    position: absolute;
    top: -50px;
    left: 0;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    transition: all;
    .refreshTxt {
      margin-top: -6px;
      font-size: 12px;
    }
  }
  .back-top {
    position: fixed;
    bottom: 45px;
    right: 10px;
    z-index: 9;
    .el-button {
      padding: 10px;
      font-size: 16px;
      border-radius: 50%;
      box-shadow: 0 1px 4px 1px #B4BCCC;
    }
  }
  .icon-loader {
    position: fixed;
    top: 85px;
    left: 0;
    width: 100%;
    z-index: 12;
    text-align: center;
    .loader-text {
      display: inline-block;
      margin: 0 auto;
      border-radius: 4px;
      padding: 4px 10px;
      font-size: 14px;
      color: #fff;
      background: rgba(64, 158, 255, .8);
      .desc {
        margin-left: 4px;
      }
    }
  }
  .el-icon-loading {
    animation: rotating 1s linear infinite
  }
  .animRotate {
    animation: rotate 2s;
  }

  .top-in-enter-active,
  .top-in-leave-active {
    transition: .3s all ease;
  }
  .top-in-enter,
  .top-in-leave-to{
    opacity: 0;
    transform: translate3d(0, 100%, 0);
  }
  .list-transX {
    transition: all .5s;
    opacity: .5;
    transform: translateX(-150%);
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
