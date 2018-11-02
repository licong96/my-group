<template lang="html">
  <!-- 图片轮播显示 -->
  <section class="swiper-wrap" v-show="isShow" @click="hide" @touchmove.prevent>
    <swiper :options="swiperOption" ref="mySwiper">
      <swiper-slide class="swiper-zoom-container" v-for="(item, index) in swiperData" :key="index">
        <img class="swiper-img" :src="paths(item.PhotoPath)" alt="">
        <div class="swiper-lazy-preloader"></div>
      </swiper-slide>
    </swiper>
  </section>
</template>

<script>
  import 'swiper/dist/css/swiper.css'   // 轮播样式
  import {swiper, swiperSlide} from 'vue-awesome-swiper'
  import { vipfgj } from '@/common/js/config'

  export default {
    props: {
      swiperData: {   // 轮播数据
        type: Array,
        default: () => []
      },
      initialSlide: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        swiperOption: {
          zoom: true,
          initialSlide: this.initialSlide,
          loadPrevNext: true
        },
        timeLoadImg: true,
        isShow: false,
      }
    },
    created() {
      this.updateTime = true
    },
    mounted() {
    },
    mounted() {
      this.$nextTick(() => {
        this.mySwiper = this.$refs.mySwiper.swiper
      })
    },
    methods: {
      show() {
        this.isShow = true
      },
      hide() {
        this.isShow = false
      },
      loadImg() {
        if (this.timeLoadImg) {     // 图片加载后，发送事件
          this.timeLoadImg = false
          this.$emit('load')
        }
      },
      paths(paths) {      // `vipfgj是本地测试用的
        if (!paths) {
          return
        }
        return `${vipfgj}${paths}`
      }
    },
    watch: {
      initialSlide(newVal) {      // 序列改变后切换
        this.mySwiper.slideTo(newVal, 0, false)
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style scoped lang="scss">
  .swiper-wrap {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 2222;
    background-color: rgba(0, 0, 0, .9);
  }
  .swiper-container {
    height: 100%;
  }
  .swiper-img {
    display: block;
    position: relative;
    z-index: 2;
    max-width: 100%;
    max-height: 100%;
  }
  .swiper-lazy-preloader {
    z-index: 1;
  }
  .room {
    .swiper-img {
      width: auto;
      margin: 0 auto;
    }
  }
  .room-text {
    width: 100%;
    padding: 6px 15px;
    background-color: #fff;
    font-size: 14px;
    color: #FA5555;
    .title {
      padding-bottom: 4px;
    }
  }
</style>
