<template lang="html">
  <!-- 选择楼盘组件 -->
  <transition name="estate">
    <section class="lc houses-wrap" v-show="IsEstate">
      <div class="bg" @touchstart="closeEstate"></div>
      <div class="houses-center">
        <i class="el-icon-close" @click="closeEstate"></i>
        <h4 class="title">{{title}}</h4>
        <div class="houses-scroll">
          <!-- 报备上限，没有楼盘显示提示 -->
          <p class="house-estate-sx" v-show="!houseEstate.length && houseEstateUpper">{{houseEstateUpper}}</p>
          <loader v-show="!houseEstate.length && !houseEstateUpper"></loader>
          <scroll :data="houseEstate" ref="estateScroll">
            <ul>
              <li class="houses-list" v-for="(item, index) in houseEstate" :key="index" @click="pitchEstate(item)">
                {{item.EstateName}}
                <!-- 额外显示的内容 -->
                <div v-show="item.HasBill==='1'" class="extra">对账单已创建，状态是：{{item.Status}}</div>
              </li>
            </ul>
          </scroll>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import Loader from '@/base/Loader'

  export default {
    props: {
      houseEstate: {
        type: Array,
        default: []
      },
      houseEstateUpper: {     // 没有楼盘提示信息
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: '选择楼盘'
      }
    },
    data () {
      return {
        IsEstate: false
      }
    },
    methods: {
      pitchEstate(item) {
        this.$emit('onEstate', item)
      },
      closeEstate() {
        this.IsEstate = false
      },
      openEstate() {
        this.IsEstate = true
        setTimeout(() => {
          this.$refs.estateScroll.refresh()
        }, 20)
      }
    },
    components: {
      Scroll,
      Loader
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/sass/mixin";

  // 楼盘
  .houses-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 30;
    .bg {
      position: relative;
      z-index: 98;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }
    .house-estate-sx {
      position: absolute;
      top: 20%;
      left: 0;
      width: 100%;
      text-align: center;
      font-size: 16px;
      color: #F56C6C;
    }
    .houses-scroll {
      position: absolute;
      top: 30px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      padding: 15px;
    }
    .houses-center {
      overflow: hidden;
      position: absolute;
      z-index: 99;
      top: 20%;
      left: 10%;
      border-radius: 6px;
      width: 80%;
      height: 300px;
      background-color: #fff;
      .el-icon-close {
        position: absolute;
        top: 5px;
        right: 5px;
        z-index: 4;
        padding: 5px;
        font-size: 20px;
        color: #878D99;
      }
      .title {
        position: relative;
        z-index: 3;
        padding: 0;
        font-size: 16px;
        color: #B4BCCC;
        line-height: 45px;
        text-align: center;
        background: #fff;
        @include border-b-1px(0);
      }
      .houses-list {
        display: flex;
        flex-direction: column;
        justify-content: center;
        border-radius: 6px;
        padding: 10px 0;
        width: 100%;
        font-size: 16px;
        text-align: center;
        min-height: 45px;
        @include border-b-1px(0);
        .el-radio {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
        }
        .extra {
          padding-top: 6px;
          font-size: 12px;
          color: #999;
        }
      }
    }
  }

  .estate-enter-active,
  .estate-leave-active {
    transition: .3s all ease;
    .bg,
    .houses-center {
      transition: .3s all ease;
    }
  }
  .estate-enter,
  .estate-leave-to {
    .bg {
      opacity: 0;
    }
    .houses-center {
      transform: translate3d(0, 30px, 0);
      opacity: 0;
    }
  }
</style>
