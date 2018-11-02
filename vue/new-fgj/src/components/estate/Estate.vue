<template lang="html">
  <!-- 楼盘列表 -->
  <div class="bg-color">
  <section class="lc building">
    <scroll ref="scrolls"
        :data="listData"
        :listemScroll="listemScroll"
        :probeType="probeType"
        :pullup="pullup"
        :bounce="bounce"
        :momentum="momentum"
        @scrollToEnd="upLoad"
        @scroll="scrollPos">
    <article>
      <!-- 头部 -->
      <div class="b-top">
        <div class="b-header">
          <i class="el-icon-arrow-left icon" @click="_back"></i>
          <h3 class="title">楼盘列表</h3>
        </div>
        <!-- 搜索 -->
        <search placeholder="搜索关键字，列如名称、标签、地址" @query="query"></search>
        <!-- 筛选 -->
        <div class="b-screen">
          <ul class="screen-wrap">
            <li class="screen-list" @click="_showScreen(0)">
              <span class="l-title">{{DistrictText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" @click="_showScreen(1)">
              <span class="l-title">{{PriceText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" @click="_showScreen(2)">
              <span class="l-title">{{PropertyUsageText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" @click="_showScreen(3)">
              <span class="l-title">{{TagText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
          </ul>
        </div>
      </div>
      <!-- 列表 -->
      <div class="b-wrap">
        <div class="b-list"
          v-for="(item, index) in listData" :key="index"
          :class="{'trans-right': item.EstateID===touchRight, 'trans-left': item.EstateID===touchLeft, 'left-1': touchLeftNum===1, 'left-2': touchLeftNum===2, 'left-3': touchLeftNum===3}"
          @touchstart.prevent="listTouchStart($event, item)"
          @touchmove.prevent="listTouchMove"
          @touchend="listTouchEnd"
          >
          <div class="sides-btn sides-left">
            <span class="sides sides-2" v-if="IsEdit(item)" @click="edit(item.EstateID)"><i class="iconfont icon-editor"></i>编辑</span>
          </div>
          <div class="b-slides" @click="openDetail(item.EstateID)">
            <div class="img-wrap">
              <span class="tag" v-if="item.Offer">{{item.Offer}}</span>
              <img class="loadimg img" v-lazy="item.picSrc"/>
            </div>
            <div class="text-wrap">
              <h4 class="title">{{item.EstateName}}-{{item.DistrictName}}</h4>
              <p class="site">{{item.Address}}</p>
              <div class="square">
                <span class="money">{{item.Price}}<em class="unit">元/平</em> </span>
                <span class="area">建面 {{item.Square}}m²</span>
              </div>
              <div class="tags">
                <span class="lc tag" :class="tagClass(index)" v-for="(tag, index) in item.Tag" :key="index" v-show="tag">{{tag}}</span>
              </div>
            </div>
          </div>
          <!-- 操作按钮 -->
          <div class="sides-btn sides-right">
            <span class="sides sides-3" v-if="IsUpStick(item)" @click="upStick(item.EstateID)"><i class="iconfont icon-zhiding1"></i>置顶</span>
            <span class="sides sides-4" v-if="IsNoStick(item)" @click="noStick(item.EstateID)"><i class="iconfont icon-zhiding2"></i>取顶</span>
            <span class="sides sides-5" v-if="IsToAd(item)" @click="onToAD(item.EstateID)"><i class="iconfont icon-guanggao"></i>广告</span>
          </div>
        </div>
      </div>
      <!-- 加载中 -->
      <loader v-show="hasMore"></loader>
      <!-- 什么都没有 -->
      <empty v-show="!hasMore && !listData.length"></empty>
    </article>
    </scroll>
    <!-- 回到顶部 -->
    <transition name="top-in">
      <div class="back-top" v-show="IsBackTop" @click="onBackTop">
        <el-button type="primary" icon="el-icon-upload2"></el-button>
      </div>
    </transition>
    <!-- 筛选 -->
    <transition name="screen-anim">
    <div v-show="cutScreen">
      <section class="b-screen-bg" @click="_hideScreen">
        <div class="b-screen" @click.stop>
          <ul class="screen-wrap">
            <li class="screen-list" :class="{'active': activeIndex === 0}" @click="cutIndex(0)">
              <span class="l-title">{{DistrictText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" :class="{'active': activeIndex === 1}" @click="cutIndex(1)">
              <span class="l-title">{{PriceText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" :class="{'active': activeIndex === 2}" @click="cutIndex(2)">
              <span class="l-title">{{PropertyUsageText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
            <li class="screen-list" :class="{'active': activeIndex === 3}" @click="cutIndex(3)">
              <span class="l-title">{{TagText}}</span>
              <i class="el-icon-caret-bottom"></i>
            </li>
          </ul>
        </div>
        <div class="c-screen" @click.stop>
          <scroll :data="DistrictNameData" :bounceTime="bounceTimes" ref="screenScroll">
          <article class="radios">
            <!-- 区域 -->
            <div class="area" v-show="activeIndex === 0">
              <!-- <el-radio class="screen-list" v-model="DistrictName" label="">不限</el-radio>
              <el-radio class="screen-list" v-model="DistrictName" :label="item.DistrictName" v-for="item in DistrictNameData" :key="item.DistrictID">{{item.DistrictName}}</el-radio> -->
              <RadioGroup v-model="DistrictName">
                <Radio class="screen-list" label="">不限</Radio>
                <Radio class="screen-list" :label="item.DistrictName" v-for="(item, index) in DistrictNameData" :key="index">{{item.DistrictName}}</Radio>
              </RadioGroup>
            </div>
            <!-- 价格 -->
            <div class="price" v-show="activeIndex === 1">
              <!-- <el-radio class="screen-list" v-model="Price" :label="item.value" v-for="item in PriceData" :key="item.value">{{item.text}}</el-radio> -->
              <RadioGroup v-model="Price">
                <Radio class="screen-list" :label="item.value" v-for="(item, index) in PriceData" :key="index">{{item.text}}</Radio>
              </RadioGroup>
            </div>
            <!-- 类型 -->
            <div class="types" v-show="activeIndex === 2">
              <!-- <el-radio class="screen-list" v-model="PropertyUsage" label="">不限</el-radio>
              <el-radio class="screen-list" v-model="PropertyUsage" :label="item.ItemValue" v-for="item in PropertyUsageData" :key="item.ItemValue">{{item.ItemValue}}</el-radio> -->
              <RadioGroup v-model="PropertyUsage">
                <Radio class="screen-list" label="">不限</Radio>
                <Radio class="screen-list" :label="item.ItemValue" v-for="(item, index) in PropertyUsageData" :key="index">{{item.ItemValue}}</Radio>
              </RadioGroup>
            </div>
            <!-- 特色 -->
            <div class="feature" v-show="activeIndex === 3">
              <!-- <el-radio class="screen-list" v-model="Tag" label="">不限</el-radio> -->
              <!-- <el-radio class="screen-list" v-model="Tag" :label="item.ItemValue" v-for="item in TagData" :key="item.ItemValue">{{item.ItemValue}}</el-radio> -->
              <RadioGroup v-model="Tag">
                <Radio class="screen-list" label="">不限</Radio>
                <Radio class="screen-list" :label="item.ItemValue" v-for="(item, index) in TagData" :key="index">{{item.ItemValue}}</Radio>
              </RadioGroup>
            </div>
          </article>
          </scroll>
        </div>
      </section>
    </div>
    </transition>
    <!-- 子路由 -->
    <transition name="transX">
      <router-view></router-view>
    </transition>
  </section>
  </div>
</template>

<script>
  import { getBuilding, getDistrict, getProperty, getTaG, getUpIsTop } from '@/api/estate/estate'
  import Scroll from '@/base/BScroll'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import Search from '@/base/Search'
  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        listData: [],   // 列表数据
        screenData: {}, // 筛选条件
        page: 1,     // 页数
        likestr: '',   // 筛选文本
        hasMore: true,   // 是否能够加载更多
        cutScreen: false,   // 打开关闭筛选
        activeIndex: 0,   // 筛选切换
        DistrictName: '',      // 区域
        Price: '',    // 价格
        PropertyUsage: '',     // 类型
        Tag: '',   // 特色
        DistrictNameData: [],   // 获取到的筛选条件
        PriceData: [    // 价格手动填写了
          {
            text: '不限',
            value: ''
          }, {
            text: '8000以内',
            value: '0-8000'
          }, {
            text: '8000-10000元/m²',
            value: '8000-10000'
          }, {
            text: '10000-12000元/m²',
            value: '10000-12000'
          }, {
            text: '12000-15000元/m²',
            value: '12000-15000'
          }, {
            text: '15000以上',
            value: '15000-99999'
          }
        ],
        PropertyUsageData: [],
        TagData: [],
        DistrictText: '区域',    // 筛选标题文字同步修改
        PriceText: '价格',
        PropertyUsageText: '类型',
        TagText: '特色',
        dialogData: {},        // 该项目能有的操作
        IsBackTop: false,      // 回到顶部
        IsClickORtouch: false,   // 点击和长按连个事件共存
        touch: {},     // 列表滑动
        touchLeft: 0,    // 当前可以滑动的值 left
        touchRight: 0,    // 当前可以滑动的值 right
        touchLeftNum: 0,    // 滑动多少块
        winHeight: 0     // window 高度
      }
    },
    created() {
      this.listemScroll = true   // 派发滚动
      this.probeType = 3     // 不截流
      this.bounce = false     // 关闭弹动
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载
      this.bounceTimes = 300   // 筛选滑动回弹速度
      this.winHeight = window.innerHeight

      this._getBuilding()
      this._getDistrict()
      this._getProperty()
      this._getTaG()
    },
    methods: {
      openDetail(id) {
        this.$router.push({
          path: `/estate/${id}`
        })
      },
      scrollPos(pos) {
        if (-pos.y > this.winHeight) {    // 显示隐藏回到顶部按钮
          this.IsBackTop = true
        } else {
          this.IsBackTop = false
        }
      },
      onBackTop() {   // 回到顶部
        this.$refs.scrolls.scrollTo(0, 0, 300)
      },
      edit(id) {      // 编辑
        this.$router.push({
          path: '/addition',
          query: {
            id: id     // 把楼盘id传过去
          }
        })
      },
      upStick(id) {   // 置顶
        this.onUpIsTop(id, 'up')
      },
      noStick(id) {   // 取顶
        this.onUpIsTop(id, 'down')
      },
      onToAD(item) {    // 广告
        window.location.href = `/AD/ADAdd.html?v=20170915&ADTitle=${item.EstateName}&ADImage=${item.picSrc}&ADUrl=/estate/${item.EstateID}/estate/estate_detail.html?EstateID=${item.EstateID}`
      },
      IsEdit(item) {
        return item.EditEstate === '1' ? true : false
      },
      IsUpStick(item) {
        return item.ToUp === '1' ? true : false
      },
      IsNoStick(item) {
        return item.ToDown === '1' ? true : false
      },
      IsToAd(item) {
        return item.ToAD === '1' ? true : false
      },
      listTouchStart (e, item) {
        /**
         * 左右滑动
         * 原理是：按钮和内容在同级，左右按钮用的是定位，超出屏幕位置，给父元素加 translate 实现左右滑动
         * 是否有这个按钮是根据后端给的权限来的，如果没有这个按钮，就不能划开这个区域
         * 左边只有一个按钮好操作，如果EditEstate不是 '1'， 就不能划开
         * 右边有三个按钮，根据权限显示按钮，并且滑动的位置按照个数，有一个就划60px，两个就划120px，三个就划180px，没有就不能划开
         * 划开多少用的是一个css控制
         * 划开哪一个用的是 EstateID 控制
         */
        this.touch.EstateID = item.EstateID      // 把当前操作的列表保存在touch中
        this.touch.EditEstate = item.EditEstate   // 左侧，是否有权限操作编辑

        this.touch.count = 0      // 右边有多少个按钮有权限可以操作
        item.ToUp === '1' ? this.touch.count += 1 : ''
        item.ToDown === '1' ? this.touch.count += 1 : ''
        item.ToAD === '1' ? this.touch.count += 1 : ''

        console.log(this.touch.count)

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = ''
          this.touchLeft = ''
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

        if (deltaX < -60) {
          this.touch.sides = 'r'
        } else if (deltaX > 40 && this.touch.EditEstate === '1') {
          this.touch.sides = 'l'
        } else {
          this.touch.sides = false
        }

        let excur = 0
        // 判断权限，决定最大和最小值
        let maxLeft = this.touch.EditEstate === '1' ? 80 : 0      // 有没有权限编辑
        let maxRight = this.touch.count * 60

        excur = Math.max(Math.min(deltaX, maxLeft), -maxRight)    // 取最大值和最小值
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`
      },
      listTouchEnd () {
        if (!this.touch.initiated) {
          return
        }
        // 要么左，要么右，要么全部清除掉
        this.touch.current.style.transition = 'all .3s linear'      // 放手的时候添加过渡
        setTimeout(() => {      // 加延迟可以防止跳动
          this.touch.current.style[transform] = null
        }, 30)
        if (this.touch.sides === 'r') {
          this.touchLeftNum = this.touch.count
          this.touchLeft = this.touch.EstateID
          this.touchRight = ''
        } else if (this.touch.sides === 'l') {
          this.touchLeft = ''
          this.touchRight = this.touch.EstateID
        } else {
          this.touchRight = ''
          this.touchLeft = ''
        }
      },
      onUpIsTop(id, op) {   // 置顶或取消置顶， 楼盘 id ，up置顶，down取顶
        getUpIsTop(id, op).then((res) => {
          // console.log(res)
          if (res.data.result === 'success' && op === 'up') {
            this.$message.success('置顶成功')
          } else if (res.data.result === 'success' && op === 'down') {
            this.$message.success('取顶成功')
          } else {
            this.$message.error('操作失败')
          }
        })
      },
      _getTaG() {    // 获取标签条件
        getTaG().then((res) => {
          this.TagData = res.data.tempTable
        })
      },
      _getProperty() {    // 获取类型条件
        getProperty().then((res) => {
          this.PropertyUsageData = res.data.tempTable
        })
      },
      _getDistrict() {   // 获取区域条件
        getDistrict().then((res) => {
          this.DistrictNameData = res.data.tempTable
        })
      },
      _getBuilding() {      // 获取列表数据
        this.listData = []
        this.page = 1
        this.hasMore = true     // 加载中
        getBuilding(this.page, this.screenData).then((res) => {
          // console.log(res)
          if (res.data.result !== '权限不足') {
            let ship = this._tag(res.data.tempTable)   // 处理 tag
            this.listData = ship
            this._checkMore(ship)     // 不能直接传this.listData，需要折中一下
            if (this.$refs.scrolls) {
              this.$refs.scrolls.scrollTo(0, 0)     // 这是首页请求，要回到顶部
            }
          } else {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
        }).catch((error) => {
          alert('catch' + error)
        })
      },
      upLoad() {    // 上滑加载更多数据
        if (!this.hasMore) {
          return
        }
        this.page++
        getBuilding(this.page, this.screenData).then((res) => {
          let ship = this._tag(res.data.tempTable)
          this.listData = this.listData.concat(ship)
          this._checkMore(ship)
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
        })
      },
      _tag(data) {
        let arr = data
        arr.forEach((item, index) => {    // 处理 tag
          let one = item.Tag.split('|')
          let sub = []
          for (let i = 0; i < one.length; i++) {
            if (one[i].length) {
              let leng = one[i].indexOf(',')
              if (leng !== '-1') {              // 去掉最后一个逗号
                let cons = one[i].substr(0, leng)
                sub.push(cons)
              } else {
                sub.push(one[i])
              }
            }
          }
          arr[index].Tag = sub      // 和数据对应的 tag
        })
        return arr
      },
      _checkMore(data) {
        if (!data) {
          return
        }
        if (!data.length || data.length < 10) {
          this.hasMore = false
          return
        }
      },
      _forScreenText(newVal) {    // 筛选标题文字，同步更新
        for (let i = 0; i < this.DistrictNameData.length; i++) {
          if (!newVal) {
            this.DistrictText = '不限'
            return false
          }
          if (this.DistrictNameData[i].DistrictID === newVal) {
            this.DistrictText = this.DistrictNameData[i].DistrictName
            return
          }
        }
      },
      cutIndex(index) {      // 筛选切换选中
        this.activeIndex = index
        setTimeout(() => {
          this.$refs.screenScroll.refresh()
        }, 20)
      },
      tagClass(num) {     // tag 添加class颜色
        return `color-${num % 6}`
      },
      _showScreen(index) {   // 打开筛选
        this.activeIndex = index
        this.cutScreen = true
        setTimeout(() => {
          this.$refs.screenScroll.refresh()
        }, 20)
      },
      _hideScreen() {   // 关闭筛选
        this.cutScreen = false
      },
      query(newVal) {   // 搜索
        this.screenData.likestr = newVal
        this._getBuilding()   // 去筛选
        this._hideScreen()    // 关闭筛选
      },
      _back() {
        this.$router.back()
      }
    },
    watch: {
      DistrictName(newVal) {
        this.screenData.DistrictName = newVal
        this._getBuilding()
        this._hideScreen()
        // 筛选标题文字，同步更新
        for (let i = 0; i < this.DistrictNameData.length; i++) {
          if (!newVal) {
            this.DistrictText = '区域'
            return false
          }
          if (this.DistrictNameData[i].DistrictName === newVal) {
            this.DistrictText = this.DistrictNameData[i].DistrictName
            return
          }
        }
      },
      Price(newVal) {
        this.screenData.Price = newVal
        this._getBuilding()
        this._hideScreen()
        for (let i = 0; i < this.PriceData.length; i++) {
          if (!newVal) {
            this.PriceText = '价格'
            return false
          }
          if (this.PriceData[i].value === newVal) {
            this.PriceText = this.PriceData[i].text
            return
          }
        }
      },
      PropertyUsage(newVal) {
        this.screenData.PropertyUsage = newVal
        this._getBuilding()
        this._hideScreen()
        for (let i = 0; i < this.PropertyUsageData.length; i++) {
          if (!newVal) {
            this.PropertyUsageText = '类型'
            return false
          }
          if (this.PropertyUsageData[i].ItemValue === newVal) {
            this.PropertyUsageText = this.PropertyUsageData[i].ItemValue
            return
          }
        }
      },
      Tag(newVal) {
        this.screenData.Tag = newVal
        this._getBuilding()
        this._hideScreen()
        for (let i = 0; i < this.TagData.length; i++) {
          if (!newVal) {
            this.TagText = '特色'
            return false
          }
          if (this.TagData[i].ItemValue === newVal) {
            this.TagText = this.TagData[i].ItemValue
            return
          }
        }
      }
    },
    components: {
      Scroll,
      Empty,
      Loader,
      Search
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .bg-color {
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  .building {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    max-width: 600px;
    margin: 0 auto;
  }
  .b-top {
    background-color: #f5f5f5;
  }
  .b-header {
    position: relative;
    width: 100%;
    height: 45px;
    @include border-b-1px(0);
    background-color: #fff;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 45px;
      height: 45px;
      color: #409EFF;
      font-size: 20px;
      line-height: 45px;
    }
    .title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      width: 100%;
      height: 45px;
      font-size: 16px;
      color: #2D2F33;
      line-height: 45px;
    }
  }
  .b-screen {
    @include border-b-1px(0);
    background-color: #fff;
    .screen-wrap {
      display: flex;
      width: 100%;
      height: 45px;
      .screen-list {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        @include border-l-1px(100%);
        height: 45px;
        font-size: 14px;
        color: #878D99;
        &:after {
          height: 50%;
          top: 25%;
        }
        &:last-child {
          &:after {
            display: none;
          }
        }
        &.active {
          color: #409EFF;
          .el-icon-caret-bottom {
            color: #409EFF;
            transform: rotate(180deg);
            transform-origin: center center;
          }
        }
        .el-icon-caret-bottom {
          color: #B4BCCC;
          margin-left: 3px;
          transition: all .3s;
        }
        .l-title {
          max-width: 90px;
          @include text-over();
        }
      }
    }
  }
  .b-wrap {
    text-align: left;
    background-color: #fff;
  }
  .b-list {
    @include border-b-1px(0);
    &.trans-right {
      transform: translate3d(80px, 0, 0);
    }
    &.trans-left {
      &.left-1 {
        transform: translate3d(-60px, 0, 0);
      }
      &.left-2 {
        transform: translate3d(-120px, 0, 0);
      }
      &.left-3 {
        transform: translate3d(-180px, 0, 0);
      }
    }
    .b-slides {
      position: relative;
      z-index: 2;
      display: flex;
      padding: 15px;
      background-color: #fff;
    }
    .img-wrap {
      position: relative;
      width: 110px;
      height: 73px;
      .img {
        vertical-align: top;
        width: 100%;
      }
      .tag {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 99;
        padding: 3px;
        line-height: 1.2;
        width: 100%;
        font-size: 10px;
        color: #fff;
        background-color: rgba(0, 0, 0, .5);
        @include text-over;
      }
    }
    .text-wrap {
      flex: 1;
      padding-left: 15px;
      .title {
        padding-bottom: 7px;
        font-size: 16px;
        color: #2D2F33;
        line-height: 1.2em;
      }
      .site {
        padding-bottom: 7px;
        font-size: 12px;
        color: #8b8b8b;
      }
      .square {
        display: flex;
        align-items: flex-end;
        .money {
          font-size: 15px;
          color: #fa5741;
          font-weight: 600;
          .unit {
            padding-left: 2px;
            font-size: 12px;
            font-style: normal;
            font-weight: 600;
          }
        }
        .area {
          padding-left: 6px;
          font-size: 12px;
          color: #9c9fa1;
        }
      }
      .tag {
        display: inline-block;
        margin-right: 5px;
        margin-top: 7px;
        border-radius: 2px;
        padding: 2px 4px;
        font-size: 11px;
        font-weight: 400;
      }
    }

    // 右边的侧滑按钮
    .sides-btn {
      position: absolute;
      top: 0;
      z-index: 1;
      height: 100%;
      display: flex;
      align-items: center;
      &.sides-left {   // 左边的侧滑按钮
        left: -80px;
        width: 80px;
      }
      &.sides-right {   // 右边的侧滑按钮
        right: -180px;
        width: 180px;
      }
      .sides {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 0 10px;
        width: 60px;
        height: 100%;
        color: #fff;
      }
      .iconfont {
        padding-bottom: 4px;
        font-size: 20px;
      }
      .sides-2 {
        width: 80px;
        background-color: rgb(51,190,133);
      }
      .sides-3 {
        background-color: rgb(103,206,103);
      }
      .sides-4 {
        background-color: rgb(255,34,85);
      }
      .sides-5 {
        background-color: rgb(135,141,153);
      }
    }
  }
  .back-top {
    position: fixed;
    bottom: 5%;
    right: 10px;
    z-index: 9;
    .el-button {
      padding: 10px;
      font-size: 16px;
      border-radius: 50%;
      box-shadow: 0 1px 4px 1px #B4BCCC;
    }
  }
  // 筛选
  .b-screen-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: rgba(0, 0, 0, .4);
  }
  .c-screen {
    overflow: hidden;
    height: 330px;
    background-color: #fff;
    text-align: left;
    .ivu-radio-group {
      display: block;
      width: 100%;
    }
    .screen-list {
      display: flex;
      align-items: center;
      margin: 0;
      border: none;
      @include border-b-1px(0);
      padding: 0 15px;
      width: 100%;
      height: 45px;
      font-size: 14px;
      &.is-checked,
      &.ivu-radio-wrapper-checked {
        background-color: #f2f5f8;
        &:before {
          content: '';
          position: absolute;
          width: 2px;
          height: 16px;
          background: #409EFF;
          left: 0;
          top: 50%;
          margin-top: -8px;
        }
      }
    }
  }
  .el-dialog__body {
    padding: 15px;
  }
  .screen-anim-enter-active,
  .screen-anim-leave-active {
    transition: .3s all ease;
    .c-screen,
    .b-screen {
      transition: .3s all ease;
    }
  }
  .screen-anim-enter,
  .screen-anim-leave-to{
    opacity: 0;
    .c-screen,
    .b-screen {
      transform: translate3d(0, -100%, 0);
    }
  }
  .oper-anim-enter-active,
  .oper-anim-leave-active {
    transition: .3s all ease;
    .operation-wrap {
      transition: .3s all ease;
    }
  }
  .oper-anim-enter,
  .oper-anim-leave-to{
    opacity: 0;
    .operation-wrap {
      transform: translate3d(0, 100%, 0);
    }
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
</style>
