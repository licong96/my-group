<template lang="html">
  <!-- 报备大厅 -->
  <section class="reported">
    <!-- 头部标题 -->
    <header class="head-title">
      <i class="el-icon-arrow-left icon" @click="_back"></i>
      <h3 class="title">报备大厅</h3>
      <i class="el-icon-search icon" @click="_openScreen"></i>
    </header>
    <!-- 列表 -->
    <section class="content">
      <scroll
        ref="scrolls"
        :data="listData"
        :probeType="probeType"
        :bounceTime="bounceTime"
        :listemScroll="listemScroll"
        :pullup="pullup"
        :pullDown="pullDownRefresh"
        @scrollToEnd="upLoad"
        @pullingDown="pullDown"
        @scroll="scrollVal">
       <div class="r-scroll-wrap"> <!-- 空div是scroll容器 -->
        <div class="list" v-for="(item, index) in listData" :key="index">
          <div class="user-name">
            <h4 class="title">{{item.CustName}}</h4>
            <p class="phone">
              <i class="el-icon-mobile-phone"></i>{{item.CustMobile}}
            </p>
          </div>
          <div class="text-wrap">
            <div class="text">
              <span class="title">报备楼盘：</span>
              <span class="desc">{{item.EstateName}}</span>
            </div>
            <div class="text">
              <span class="title">报备用户：</span>
              <span class="desc">{{item.DeclareDeptName}}-<em class="tag">{{item.DeclareEmpName}}</em></span>
            </div>
            <div class="text">
              <span class="title">报备时间：</span>
              <span class="desc">{{item.DeclareDate}}<em class="tag tag2">报备</em></span>
            </div>
          </div>
        </div>
        <!-- 什么都没有 -->
        <empty v-show="!hasMore && !listData.length"></empty>
        <!-- loader -->
        <loader v-show="loadingShow"></loader>
      </div>
      </scroll>
      <!-- 下拉更新 -->
      <div ref="pulldown" class="pulldown-wrapper" :style="pullDownStyle" v-show="isPullingDown">
        <div class="before-trigger" v-show="isPullingDown">
          <bubble :y="bubbleY"></bubble>
        </div>
        <div class="refreshTxt" v-show="isRebounding">松开刷新数据</div>
      </div>
    </section>
    <!-- 子路由 -->
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import { getFiling } from '@/api/reported/reported'
  import Scroll from '@/base/BScroll'
  import Bubble from '@/components/reported/Bubble'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        listData: [],    // 列表数据
        page: 1,        // 页数
        hasMore: true,   // 是否能够加载更多
        requestone: true,   // 阻止请求一次
        loadingText: '加载中...',
        loadingShow: true,   // 是否显示加载中
        scrollY: 0,       // y轴坐标
        bubbleY: 0,        // 下拉刷新偏移度
        isPullingDown: true,
        isRebounding: false,
        pullDownStyle: ''
      }
    },
    created() {
      this.probeType = 3    // 不截流
      this.listemScroll = true  // 派发滚动时间
      this.bounceTime = 700     // 滚动数据
      this.pullup = true      // 开启上滑加载
      this.pullDownRefresh = true   // 开启下拉刷新
      this.pullDownInitTop = -50

      this._getList()
    },
    computed: {
      ...mapGetters([
        'screenData'
      ])
    },
    methods: {
      scrollVal(pos) {      // 下拉刷新图标动画
        if (pos.y > 88) {
          this.isRebounding = true
        } else {
          this.isRebounding = false
        }
        // 计算偏移
        this.bubbleY = Math.max(0, pos.y + this.pullDownInitTop)
        this.pullDownStyle = `top:${Math.min(pos.y + this.pullDownInitTop, 10)}px`
      },
      _getList() {    // 获取获取分页数据
        this.listData = []
        this.page = 1
        this.hasMore = true     // 加载图标
        this.loadingShow = true   // 开启加载中
        this.loadingText = '加载中...'
        getFiling(this.page, this.screenData).then((res) => {
          if (res.data.result !== '权限不足') {
            this.listData = res.data.tempTable
            this._checkMore(res.data.tempTable)
            if (this.$refs.scrolls) {
              this.$refs.scrolls.scrollTo(0, 0)     // 这是首页请求，要回到顶部
            }
            setTimeout(() => {      // 等过度结束，显示上拉图标，并且还原位置
              this.isPullingDown = true
              this.pullDownStyle = `top:${this.pullDownInitTop}px`
            }, 300)
          } else {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
        })
      },
      pullDown() {    // 下拉刷新数据
        this.isPullingDown = false
        this._getList()
      },
      upLoad() {    // 上滑加载更多数据
        if (!this.hasMore) {
          return
        }
        this.page++
        getFiling(this.page, this.screenData).then((res) => {
          this.listData = this.listData.concat(res.data.tempTable)
          this._checkMore(res.data.tempTable)
          // console.log(this.listData)
        })
      },
      _checkMore(data) {    // 如果没有数据，就不要上滑加载了
        if (!data) {
          return
        }
        if (!data.length) {
          this.hasMore = false
          this.loadingText = '已经到底了'
        }
        if (data.length < 10) {   // 如果小于10条数据，提示都不用加了
          this.loadingText = ''
          this.loadingShow = false
        }
      },
      _openScreen() {   // 打开筛选
        this.$router.push({
          path: '/reported/screen'
        })
      },
      _back() {
        this.$router.back()
      }
    },
    watch: {
      screenData(newVlaue) {
        this._getList()
      }
    },
    components: {
      Scroll,
      Bubble,
      Empty,
      Loader
    }
  }
</script>

<style scoped lang="scss">
  // mixin方法，因为不太好自己建文件，所以写在这里
  @mixin border-b-1px($cost) {
    position: relative;
    &:after{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: $cost;
      z-index: 9;
      width: 100%;
      border-bottom: 1px solid rgba(203, 203, 203, 0.6); // #cbcbcb; 1px 边框的颜色很重要
      @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
        transform: scaleY(0.5);
        transform-origin: bottom;
      }
      @media only screen and (-webkit-min-device-pixel-ratio: 3), only screen and (min-device-pixel-ratio: 3) {
        transform: scaleY(0.333);
        transform-origin: bottom;
      }
    }
  }

  .reported {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    background-color: #DFE4ED;
    .content {
      position: absolute;
      top: 45px;
      bottom: 0;
      width: 100%;
      padding: 4px;
      background-color: #DFE4ED;
    }
    .head-title {
      @include border-b-1px(0);
      position: fixed;
      top: 0;
      z-index: 10;
      display: flex;
      align-items: center;
      width: 100%;
      height: 45px;
      line-height: 45px;
      background-color: #fff;
      .icon {
        width: 45px;
        line-height: 45px;
        color: #409EFF;
        font-size: 20px;
      }
      .title {
        flex: 1;
        font-size: 16px;
      }
    }
    .list {
      margin-bottom: 4px;
      padding: 0 16px;
      border-radius: 4px;
      background-color: #fff;
      // @include border-b-1px(0);
      .user-name {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 10px 0;
        text-align: left;
        @include border-b-1px(0);
        .title {
          flex: 1;
          padding-right: 4px;
          font-size: 14px;
          line-height: 1.2;
          color: #2D2F33;
        }
        .phone {
          font-size: 14px;
          color: #878D99;
        }
      }
      .text-wrap {
        padding-bottom: 10px;
        text-align: left;
        .text {
          display: flex;
          align-items: center;
          line-height: 1.2;
          padding-top: 10px;
          font-size: 14px;
          .title {
            width: 72px;
            color: #878D99;
          }
          .desc {
            flex: 1;
            padding-left: 4px;
            color: #5A5E66;
          }
          .tag {
            font-style: normal;
            margin-left: 5px;
            padding: 0 3px;
            border-radius: 3px;
            border: 1px solid #67C23A;
            color: #67C23A;
          }
          .tag2 {
            font-size: 12px;
            border: 1px solid #409EFF;
            color: #409EFF;
          }
        }
      }
    }
    .r-scroll-wrap {
      position: relative;
      z-index: 2;
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
  }
  /* 页面过渡 */
  .transX-enter-active,
  .transX-leave-active {
    transition: .3s all ease;
  }
  .transX-enter,
  .transX-leave-to{
    transform: translate3d(100%, 0, 0);
  }
  // .upacity-enter-active,
  // .upacity-leave-active {
  //   transition: .15s all ease;
  // }
  // .upacity-enter,
  // .upacity-leave-to{
  //   transform: translateY(50px);
  //   opacity: 0;
  // }
</style>
