<template lang="html">
  <!-- 封装成一个页面scroll组件 -->
  <section class="scroll" ref="wrapper">
    <slot></slot>
  </section>
</template>

<script>
  /**@version 1.3.1
   *  注意啦，有些版本不兼容单选框和多选框
   */

  import BScroll from 'better-scroll'

  export default {
    props: {
      probeType: {    // 截留
        type: Number,
        default: 1
      },
      click: {      // 派发事件
        type: Boolean,
        default: true
      },
      tap: {      // tap事件
        type: Boolean,
        default: false
      },
      data: {     // 数据
        type: Array,
        default: null
      },
      listemScroll: {   // 监听scroll滚动事件
        type: Boolean,
        default: false
      },
      bounce: {   // 是否启用回弹动画效果
        type: Boolean,
        default: true
      },
      bounceTime: {   // 弹力动画持续的毫秒数，官方700
        type: Number,
        default: 300
      },
      momentum: {   // 在屏幕上快速滑动
        type: Boolean,
        default: true
      },
      pullup: {   // 上滑加载更多
        type: Boolean,
        default: false
      },
      pullDown: {   // 下拉刷新数据
        type: Boolean,
        default: false
      },
      scrollX: {
        type: Boolean,
        default: false
      }
    },
    mounted() {
      setTimeout(() => {
        this._initScroll()
      }, 20)
    },
    methods: {
      _initScroll() {
        if (!this.$refs.wrapper) {
          return
        }
        
        this.scroll = new BScroll(this.$refs.wrapper, {
          probeType: this.probeType,
          click: this.click,
          tap: this.tap,
          bounce: this.bounce,
          bounceTime: this.bounceTime,
          momentum: this.momentum,
          scrollX: this.scrollX
        })
        // 监听scroll滚动事件
        if (this.listemScroll) {
          let self = this
          this.scroll.on('scroll', (pos) => {
            self.$emit('scroll', pos)           // 派发事件，输出位置
          })
        }
        // 上滑加载更多
        if (this.pullup) {
          this.scroll.on('scrollEnd', () => {
            if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
              this.$emit('scrollToEnd')
            }
          })
        }
        // 上拉加载更多
        if (this.pullDown) {
          this.scroll.on('touchEnd', () => {
            if (this.scroll.y >= 80) {
              this.$emit('pullingDown')
            }
          })
        }
      },
      enable() {
        this.scroll && this.scroll.enable()    // 启用
      },
      disable() {
        this.scroll && this.scroll.disable()  // 禁用
      },
      refresh() {
        this.scroll && this.scroll.refresh()  // 重新计算
      },
      scrollTo() {
        this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
      },
      scrollToElement() {
        this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
      }
    },
    watch: {
      data() {
        setTimeout(() => {
          this.refresh()
        }, 20)
      }
    }
  }
</script>

<style scoped lang="scss">
  .scroll {
    height: 100%;
  }
</style>
