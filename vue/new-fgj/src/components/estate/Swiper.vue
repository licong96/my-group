<template lang="html">
  <!-- 楼盘详情轮播 -->
  <section class="swiper-wrap">
    <swiper :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper" v-if="swiperData.length">
      <swiper-slide v-for="(item, index) in swiperData" :key="index">
        <img class="swiper-img" :src="item.PhotoData" alt="">
        <!-- <img :data-src="item.PhotoData" class="swiper-lazy swiper-img" @load="loadImg">
        <div class="swiper-lazy-preloader"></div> -->
      </swiper-slide>
      <div class="swiper-pagination" slot="pagination"></div>
    </swiper>

    <!-- 户型轮播 -->
    <swiper class="room" :options="swiperOption" :not-next-tick="notNextTick" ref="mySwiper" v-if="roomData.length">
      <swiper-slide v-for="(item, index) in roomData" :key="index">
        <img class="swiper-img" :src="item.picSrc" alt="">
        <div class="room-text">
          <h4 class="title">{{item.CountF}}房{{item.CountT}}厅{{item.CountW}}卫，建面{{item.Square}}m²</h4>
          <p class="desc">参考均价：{{item.Price}}元/m²</p>
        </div>
      </swiper-slide>
      <!-- <div class="swiper-pagination" slot="pagination"></div> -->
    </swiper>
  </section>
</template>

<script>
  import 'swiper/dist/css/swiper.css'   // 轮播样式
  import {swiper, swiperSlide} from 'vue-awesome-swiper'

  export default {
    props: {
      swiperData: {   // 轮播数据
        type: Array,
        default: () => []
      },
      roomData: {   // 户型轮播数据
        type: Array,
        default: () => []
      },
      styles: {      // 样式，表示谁的样式
        type: String,
        default: 'swiper'
      },
      loop: {   // 是否循环
        type: Boolean,
        default: true
      },
      autoplay: {   // 自动播放
        type: Number,
        default: 3000
      },
      initialSlide: {   // 索引，从第几张图开始
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        notNextTick: true,
        swiperOption: {
          pagination: '.swiper-pagination',
          initialSlide: this.initialSlide,
          lazyLoading: false,     // 懒加载有 bug
          loop: this.loop,
          autoplay: this.autoplay
        },
        timeLoadImg: true
      }
    },
    created() {
      this.updateTime = true
    },
    mounted() {
    },
    computed: {
      swiper() {
        return this.$refs.mySwiper.swiper
      }
    },
    methods: {
      loadImg() {
        if (this.timeLoadImg) {     // 图片加载后，发送事件
          this.timeLoadImg = false
          this.$emit('load')
        }
      }
    },
    components: {
      swiper,
      swiperSlide
    }
  }
</script>

<style scoped lang="scss">
  .swiper-slide {
    background-color: #fff;
  }
  .swiper-img {
    width: 100%;
    max-width: 100%;
    max-height: 100%;
    display: block;
  }
  .swiper-lazy-preloader {
    margin-top: 100px;
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
