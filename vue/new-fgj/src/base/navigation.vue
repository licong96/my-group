<template lang="html">
  <!-- 右上角更多选项 -->
  <transition name="nav">
    <div class="navigation-bg" v-show="navigation" @touchstart.prevent="closeNav">
      <div class="navigation" @touchstart.stop>
        <i class="el-icon-caret-top"></i>
        <div class="navigation-list" @click="edit" v-if="IsEdit">
          <i class="iconfont icon-editor"></i>
          <span class="text">编辑</span>
        </div>
        <div class="navigation-list" @click="upStick" v-if="IsUpStick">
          <i class="iconfont icon-zhiding1"></i>
          <span class="text">置顶</span>
        </div>
        <div class="navigation-list" @click="noStick" v-if="IsNoStick">
          <i class="iconfont icon-zhiding2"></i>
          <span class="text">取顶</span>
        </div>
        <div class="navigation-list" @click="onToAD" v-if="IsToAd">
          <i class="iconfont icon-guanggao"></i>
          <span class="text">广告</span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
  export default {
    props: {
      IsEdit: {
        type: Boolean,
        default: false
      },
      IsUpStick: {
        type: Boolean,
        default: false
      },
      IsNoStick: {
        type: Boolean,
        default: false
      },
      IsToAd: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        navigation: false
      }
    },
    created() {
    },
    methods: {
      edit() {    // 编辑
        this.$emit('edit')
        this.closeNav()
      },
      upStick() {   // 置顶
      },
      noStick() {   // 取顶
      },
      onUpIsTop(id, op) {   // 置顶或取消置顶， 楼盘 id ，up置顶，down取顶
      },
      onToAD() {    // 广告
      },
      operNav() {   // 打开右上角操作
        this.navigation = true
      },
      closeNav() {  // 关闭右上角操作
        this.navigation = false
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../common/sass/mixin';

  .navigation-bg {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 9;
    background-color: transparent;
  }
  .navigation {
    position: absolute;
    top: 45px;
    right: 5px;
    z-index: 10;
    text-align: left;
    border-radius: 4px;
    box-shadow: 0 0 15px 2px rgba(144, 144, 144, 0.3);
    background-color: #fff;
    .el-icon-caret-top {
      position: absolute;
      right: 6px;
      top: -16px;
      font-size: 24px;
      color: #fff;
    }
    .navigation-list {
      display: flex;
      align-items: center;
      width: 100%;
      &:last-child {
        .text {
          &:after {
            display: none;
          }
        }
      }
      .iconfont {
        padding: 0 15px;
        font-size: 18px;
        color: #5A5E66;
      }
      .text {
        display: block;
        width: 100px;
        height: 45px;
        line-height: 45px;
        font-size: 14px;
        color: #5A5E66;
        @include border-b-1px(0);
      }
    }
  }

  .nav-enter-active,
  .nav-leave-active {
    transition: .3s all ease;
  }
  .nav-enter,
  .nav-leave-to{
    transform-origin: right top;
    transform: scale(0);
  }
</style>
