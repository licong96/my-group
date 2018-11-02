<template lang="html">
  <!-- 滑动组件 -->
  <section class="sideslip">
    <div
      class="list"
      @touchstart="touchStart($event, item)"
      @touchmove="touchMove"
      @touchend="touchEnd">
      <!-- 左侧按钮 -->
      <slot name="left"></slot>
      <!-- 中间内容 -->
      <slot name="center"></slot>
      <!-- 右侧按钮 -->
      <slot name="right"></slot>
    </div>
  </section>
</template>

<script>
  /**
   * @augments paramLeft       左侧按钮的参数数据
   *    @param { isSides } @type { Boolean }  是否允许滑动
   * 
   * @augments paramRight       右侧按钮的参数数据
   *    @param { isSides } @type { Boolean }  是否允许滑动
   */

  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    props: {
      item: {          // 当前滑动的元素
        type: Object,
        default: () => {}
      },
      touchSides: {       // 是否禁止滑动
        type: String,
        default: false
      },
      paramLeft: {      // 左侧按钮的参数数据
        type: Object,
        default: function () {
          return { isSides: false, style: {} }
        }
      },
      paramRight: {      // 右侧按钮的参数数据
        type: Object,
        default: function () {
          return { isSides: false, style: {} }
        }
      },
      previousEl: {     // 上一个的滑动
        type: Object,
        default: function () {
          return { el: null }
        }
      }
    },
    data() {
      return {
        touch: {},
      }
    },
    created() {
    },
    methods: {
      touchStart (e, item) {
        this.$emit('onTouchStart', item)    // 把当前数据状态派发出去

        if (this.previousEl) {
          this.previousEl.el.style[transform] = `translate3d(0, 0, 0)`    // 清除上一个
        }

        if (this.touchSides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.initiated = false    // 开关
          this.$emit('onTouchSides', '')
          return
        }
        this.touch.initiated = true
        this.touch.current = e.currentTarget    // 当前元素，event输出是null，但是单独输出就有
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY

        // 右边最大可滑动的距离
        this.touch.rightWidth = this.paramRight.style.width ? parseInt(this.paramRight.style.width) : 0
        // 左边最大可滑动的距离
        this.touch.LeftWidth = this.paramLeft.style.width ? parseInt(this.paramLeft.style.width) : 0
        // console.log('rightWidth', this.touch.rightWidth)
        // console.log('LeftWidth', this.touch.LeftWidth)
      },
      touchMove (e) {
        if (!this.touch.initiated) {      // 开关
          return
        }

        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
          this.$emit('onTouchSides', '')
          return
        }

        // 禁止滑动
        if (!this.paramRight.isSides && deltaX < 0) {
          return
        }
        if (!this.paramLeft.isSides && deltaX > 0) {
          return
        }
        
        // 判断是左还是右
        if (deltaX < - (this.touch.rightWidth / 3)) {
          this.$emit('onTouchSides', 'l')
        } else if (deltaX > (this.touch.LeftWidth / 3)) {
          this.$emit('onTouchSides', 'r')
        } else {
          this.$emit('onTouchSides', '')
        }

        // 取最大最小滑动值
        let excur = 0
        if (deltaX < 0) {
          excur = Math.max(Math.min(deltaX, 0), -this.touch.rightWidth)
        } 
        else {
          excur = Math.max(Math.min(deltaX, this.touch.LeftWidth), 0)
        }
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`    // 同步滑动
      },
      touchEnd () {
        if (!this.touch.initiated) {
          return
        }
        this.touch.current.style.transition = 'all .3s linear'      // 放手的时候添加过渡

        if (this.touchSides === 'l') {
          this.touch.current.style[transform] = `translate3d(-${this.touch.rightWidth}px, 0, 0)`    // 停到这个位置
          
          this.$emit('previous', {el: this.touch.current})
        } 
        else if (this.touchSides === 'r') {
          this.touch.current.style[transform] = `translate3d(${this.touch.LeftWidth}px, 0, 0)`    // 停到这个位置
          this.$emit('previous', {el: this.touch.current})
        } 
        else {
          this.touch.current.style[transform] = `translate3d(0, 0, 0)`    // 停到这个位置
          this.$emit('previous', {el: this.touch.current})
        }
      },
      clearTouchEl() {
        this.touchSides = ''
        this.previousEl.el.style[transform] = `translate3d(0, 0, 0)`    // 清除上一个
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../common/sass/mixin';
  @import '../common/sass/variable';

  .sideslip {
    overflow: hidden;
    .list {
      position: relative;
      background-color: #fff;
      &.trans-left {
        transform: translate3d(-80px, 0, 0) !important;
      }
      &.trans-right {
        transform: translate3d(80px, 0, 0) !important;
      }
    }
    .side-left,
    .side-right {
      display: flex;
      position: absolute;
      top: 0;
      // left: -80px;
      // width: 80px;
      height: 100%;
      transition: all .3s;
      .button {
        // flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        // width: 80px;
        height: 100%;
        font-size: 16px;
        color: #fff;
        white-space: nowrap;
        &.edit {
          background-color: #33be85;
        }
        &.blue {
          background-color: $color-blue;
        }
        &.red {
          background-color: $color-red;
        }
        &.success {
          background-color: $color-success;
        }
        &.green {
          background-color: $color-green;
        }
        &.warning {
          background-color: $color-warning;
        }
        &.yellow {
          background-color: $color-yellow;
        }
        &.danger {
          background-color: $color-danger;
        }
        &.info {
          background-color: $color-info;
        }
        &.black {
          background-color: $color-black;
        }
      }
      .iconfont {
        padding-bottom: 4px;
        font-size: 22px;
      }
    }
    .side-right {
      left: auto;
      // right: -80px;
    }
  }
</style>
