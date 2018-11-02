<template>
    <div class="help xb-help" ref="help">
      <!-- <transition name="el-zoom-in-left"> -->
      <div v-show="!ERRON" class="leftButton" @click="show()"></div>
      <!-- </transition> -->
      <transition name="el-zoom-in-top">
        <div v-show="ERRON" class="rightContent">
          <div class="close" @click="hide">
            <i class="el-icon-arrow-right"></i>
          </div>
          <div class="helpContent">
            <p v-for="item in mediaList" :key="item" @click="toMedia(item)">{{item.name}}</p>
          </div>
        </div>
      </transition>
      <v-media :media="thisMedia.media" ref="vMedia"></v-media>
    </div>
</template>
<script>
import media from '../../components/customer/media.vue'

  export default {
    data () {
      return {
        ERRON: false,
        mediaList:[
            {name:'1,报备客户操作教学',media:'http://app.vipfgj.com/video/0b381a91753bf74b0cef81fed4920bb0.mp4'},
            {name:'2,客户管理操作视频',media:'http://app.vipfgj.com/video/7c692291de6023baf8c00f1d4543214e.mp4'},
            {name:'3,客户筛选操作视频',media:'http://app.vipfgj.com/video/968d89756f910e71340ca7517dbe5ad7.mp4'}
        ],
        thisMedia:''
      }
    },
    methods: {
      show () {
        this.ERRON = true
        console.log(this.$refs.help.style.right)
      },
      hide () {
        this.ERRON = false
      },
      toMedia(item){
        this.thisMedia = item
        this.$refs.vMedia.show()
      }
    },
    components:{
        'v-media':media
    }
  }
</script>
<style lang="stylus">
  .xb-help
    position: absolute;
    right: 0;
    top: 35%;
    height: 200px;
    z-index: 40;
    display: flex;

    .leftButton
      position absolute
      flex: 0 0 50px;
      background: url(img/help.png) 50% 50% no-repeat;
      background-size: contain;
      right: 0;
      top: 35%;
      width: 50px;
      height: 50px;

    .rightContent
      flex: 1;
      display: flex;
      height: 200px;
      background: #ffffff;



      .close
        flex: 0 0 25px
        line-height: 200px
        background: #ccc
      .helpContent
        padding: 10px 5px;
        width 150px
        p
            line-height 32px


</style>

