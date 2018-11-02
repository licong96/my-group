<template lang="html">
  <!-- 等待中，中间显示 -->
  <transition name="loader">
    <section class="lc-loader-center" v-show="IsLoader" :style="loaderStyle">
      <i class="el-icon-loading"></i>
      <p class="desc" v-if="text">{{text}}</p>
      <p class="desc" v-else>{{desc}}</p>
    </section>
  </transition>
</template>

<script>
  export default {
    props: {
      desc: {
        type: String,
        default: '稍等'
      },
      loaderStyle: {
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        IsLoader: false,
        text: '',         // 额外的描述文字
      }
    },
    methods: {
      show(text) {
        this.text = text
        this.IsLoader = true
      },
      hide() {
        this.IsLoader = false
      }
    }
  }
</script>

<style scoped lang="scss">
  .lc-loader-center {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 2024;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin: -32px 0 0 -32px;
    border-radius: 8px;
    width: 64px;
    height: 64px;
    background-color: rgba(0, 0, 0, .8);
    .el-icon-loading {
      font-size: 30px;
      color: #fff;
      animation: rotating 1s linear infinite
    }
    .desc {
      padding-top: 4px;
      font-size: 12px;
      color: #fff;
      text-align: center;
    }
  }

  .loader-enter-active,
  .loader-leave-active {
    transition: .3s all ease;
  }
  .loader-enter,
  .loader-leave-to {
    opacity: 0;
  }
</style>
