<template lang="html">
  <!-- 图表统计 -->
  <section class="echarts">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">图表统计</h3>
      <el-button class="add-a right-btn" type="primary" @click="openScreen">筛选</el-button>
    </header>
    <section class="select-wrap">
      <scroll ref="scroll" :scrollX="scrollX">
        <div class="white-space" :style="{'width': whiteSpaceWidth+'px'}">
          <span class="select-list" :class="{'active': currentIndex==='1'}" @click="_openCut('1')">用户注册</span>
          <span class="select-list" :class="{'active': currentIndex==='2'}" @click="_openCut('2')">用户登陆时段</span>
          <span class="select-list" :class="{'active': currentIndex==='3'}" @click="_openCut('3')">客户录入</span>
          <span class="select-list" :class="{'active': currentIndex==='4'}" @click="_openCut('4')">抢客图表</span>
          <span class="select-list" :class="{'active': currentIndex==='5'}" @click="_openCut('5')">客户跟进</span>
          <span class="select-list" :class="{'active': currentIndex==='6'}" @click="_openCut('6')">客户报备</span>
          <span class="select-list" :class="{'active': currentIndex==='7'}" @click="_openCut('7')">客户到访</span>
          <span class="select-list" :class="{'active': currentIndex==='8'}" @click="_openCut('8')">客户成交</span>
          <span class="select-list" :class="{'active': currentIndex==='9'}" @click="_openCut('9')">到访转化率</span>
          <span class="select-list" :class="{'active': currentIndex==='10'}" @click="_openCut('10')">成交转化率</span>
        </div>
      </scroll>
    </section>
    <!-- 筛选组件 -->
    <screen ref="screen" :IsHide="screenIsHide" :current="echartScreenChurrent" :isOneOff="isOneOff" @select="onSelect" @empty="selectEmpty"></screen>
    <!-- 等待组件 -->
    <loader-center ref="loaderCenter"></loader-center>
    <!-- 图表路由 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </section>
</template>

<script>
import Screen from "@/base/Screen";
import Scroll from "@/base/BScroll";
import LoaderCenter from '@/base/LoaderCenter'
import { mapActions, mapGetters } from "vuex";

/**@augments
 *  每个页面都是分开的路由，加载自己的数据
 *  可以单独筛选，不影响其他页面，筛选组件是一个
 *  每次切换都能到自己页面对应的筛选条件上
 *  每个路由都有一个值记录自己当前的筛选条件
 *  打开筛选后，把当前记录的筛选条件同步到筛选组件上去
 * 
 *  每个子路由都有自己的筛选条件，切换到自己的时候，把筛选条件传递给父路由，由父路由再传给筛选组件
 */

export default {
  data() {
    return {
      currentIndex: 1,
      screenIsHide: {   // 是否显示筛选，要显示哪个就传哪个值过去
        timeType: true,
        SDeptNo: true,
        SEmpID: true,
        intention: false,
        DatePeriod: false
      },
      whiteSpaceWidth: 0,      // 滑动容器的宽度
      onceLoader: [],         // 加载提醒只一次，因为打开后缓存，用一个数组记录打开过的页面 
      middleElement: null,     // select-list元素
      isOneOff: true,   // 直接获取标签选项数据
    }
  },
  created() {
    this.scrollX = true; // 开启X轴滚动
  },
  mounted() {
    setTimeout(() => {
      this.initWidth()
      this.middleElement = document.querySelectorAll('.select-list')    // 获取所有列表元素，先保存起来
    }, 20)
  },
  computed: {
    ...mapGetters([
      'echartScreenChurrent',
      'IsShowScreen',
      'loaderCenter'
    ])
  },
  methods: {
    initWidth() {     // 根据个数，决定滑动容器的宽度
      let arr = document.querySelectorAll('.select-list')
      let height = 0
      for (let i = 0; i < arr.length; i++) {
        height += arr[i].clientWidth
      }
      this.whiteSpaceWidth = height
      this.$refs.scroll.$el.style.width = '100%'
      this.$refs.scroll.refresh()
      setTimeout(() => {
        this._cutActive()   // 切换当前选中的状态，和位置，但是要延迟执行
      }, 50)
    },
    selectEmpty(obj) {    // 清空筛选条件
      this.setEchartScreen({
        dateType: obj.timeType,
        name: this.$route.name
      })
    },
    onSelect(obj) {   // 接收筛选条件
      // console.log('接收到的筛选值', obj)
      this.setEchartScreen({
        dateType: obj.timeType,
        SDeptNo: obj.SDeptNo,
        SEmpID: obj.SEmpID,
        name: this.$route.name,
        bumen: obj.bumen,
        intention: obj.intention,       // 意向值
        DatePeriod: obj.DatePeriod      // 自定义时间
      })
    },
    openScreen() {
      // 打开筛选
      this.$refs.screen.openMore()
    },
    _openCut(index) {
      // 提醒只开一次，点过的就不要再开启了
      let include = this._IsArr(index, this.onceLoader)
      if (!include) {
        this.onceLoader.push(index)
        this.setLoaderCenter(true)      // 开启提示
      }
      this.middleScrollTo(index)
      // 切换路由
      this.currentIndex = index
      this.$router.replace({
        path: `/echarts/${index}`
      })
    },
    _cutActive() {
      // 切换当前选中的状态
      let str = this.$route.path
      let arr = str.split('')
      let num = arr[arr.length-1]     // 拿到最后的那位数

      if (num === 's') {    // 如果是 's' 则说明路径是 echarts，没有指定子路由，手动调整成图表'1'
        this._openCut('1')
        return
      }
      this.onceLoader.push(num)
      this.currentIndex = num
      this.middleScrollTo(num)
    },
    middleScrollTo(index) {       // 把当前选中的块滑到指定位置
      // 修改滑动位置
      if (index > 3) {
        this.$refs.scroll.scrollToElement(this.middleElement[index - 3], 800)   // 滑到点击的前两个的位置上
      } else {
        this.$refs.scroll.scrollToElement(this.middleElement[0], 800)   // 滑动第一个的位置上
      }
    },
    _IsArr(val, arr) {     // 判断数组里面是否存在这个值
      let i = 0
      while(arr.length > i) {
        if (val === arr[i]) {
          return true
        }
        i++
      }
      return false
    },
    back() {
      this.$router.back()
    },
    ...mapActions([
      'setEchartScreen',
      'setLoaderCenter'
    ])
  },
  watch: {
    IsShowScreen(newVal) {
      // console.log('要显示的筛选', newVal)
      this.screenIsHide.SDeptNo = newVal.SDeptNo ? true : false
      this.screenIsHide.SEmpID = newVal.SEmpID ? true : false
      this.screenIsHide.intention = newVal.intention ? true : false
      this.screenIsHide.DatePeriod = newVal.DatePeriod ? true : false
    },
    loaderCenter(newVal) {    // 是否开启等待提示
      console.log('loaderCenter', newVal)
      if (newVal) {
        this.$refs.loaderCenter.show()
      } else {
        this.$refs.loaderCenter.hide()
      }
    }
  },
  components: {
    Screen,
    Scroll,
    LoaderCenter
  }
};
</script>

<style scoped lang="scss">
@import "../../common/sass/mixin";

.echarts {
  margin: 0 auto;
  max-width: 600px;
  background-color: #fff;
  .select-wrap {
    overflow: hidden;
    display: flex;
    margin-bottom: 10px;
    width: 100%;
    text-align: left;
    @include border-b-1px(0);
    .white-space {
      white-space: nowrap;
      font-size: 0;
      cursor: pointer;
    }
    .select-list {
      display: inline-block;
      padding: 0 10px;
      height: 45px;
      font-size: 14px;
      color: #606266;
      text-align: center;
      line-height: 45px;
      @include border-l-1px(0);
      &:first-child {
        &:after {
          display: none
        }
      }
      &:after {
        top: 25%;
        height: 50%;
      }
      &.active {
        color: #409eff;
      }
    }
  }
}
</style>
