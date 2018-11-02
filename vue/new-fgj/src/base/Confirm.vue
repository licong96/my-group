<template lang="html">
  <!-- 确定提示 -->
  <transition name="confirm-fade">
    <div class="lc-confirm" v-show="showFlag" @click.stop="hide">
      <div class="confirm-wrapper">
        <div class="confirm-content">
          <!-- text和paramText二选一 -->
          <p class="text">{{text}}{{paramText}}</p>
          <div class="operate">
            <div @click="cancel" class="operate-btn left">{{cancelBtnText}}</div>
            <div @click="confirm" class="operate-btn">{{confirmBtnText}}</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: ''
      },
      confirmBtnText: {
        type: String,
        default: '确定'
      },
      cancelBtnText: {
        type: String,
        default: '取消'
      }
    },
    data() {
      return {
        showFlag: false,
        parameter: null,
        paramText: '',      // 另一种传递文字说明的方式
      }
    },
    methods: {
      show(parameter) {       // 外部调用的时候，可以传递一个参数保存，确定或取消后再返回参数
        // 是否有提示文字
        if (parameter.text) {
          this.paramText = parameter.text
        }
        this.showFlag = true
        this.parameter = parameter
        document.getElementsByTagName('html')[0].style.overflow = 'hidden'
      },
      hide() {
        this.showFlag = false
        document.getElementsByTagName('html')[0].style.overflow = 'initial'
      },
      cancel() {
        this.hide()
        this.$emit('cancel', this.parameter)
        document.getElementsByTagName('html')[0].style.overflow = 'initial'
      },
      confirm() {
        this.hide()
        this.$emit('confirm', this.parameter)
        document.getElementsByTagName('html')[0].style.overflow = 'initial'
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../common/sass/variable';
  @import '../common/sass/mixin';

  .lc-confirm{
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 2998;
    background-color: rgba(0, 0, 0, .4);
    &.confirm-fade-enter-active {
      animation: confirm-fadein 0.3s;
    }
    .confirm-content {
      animation: confirm-zoom 0.3s;
    }
    .confirm-wrapper{
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 999;
    }
    .confirm-content {
      width: 270px;
      border-radius: 12px;
      background: #fff;
    }
    .text {
      padding: 22px 15px;
      line-height: 22px;
      text-align: center;
      font-size: 16px;
      color: $color-text-3;
      @include border-b-1px(0);
    }
    .operate {
      display: flex;
      align-items: center;
      text-align: center;
      font-size: 14px;
    }
    .operate-btn {
      flex: 1;
      line-height: 22px;
      padding: 12px 0;
      color: $color-blue;
      &.left {
        @include border-l-1px(100%);
        color: $color-text-4;
      }
    }
  }

  @keyframes confirm-fadein {
    0% {
      opacity: 0;
    }
    100% {
      opacity: 1;
    }
  }

  @keyframes confirm-zoom {
    0% {
      transform: scale(0);
    }
    50% {
      transform: scale(1.1);
    }
    100% {
      transform: scale(1);
    }
  }
</style>
