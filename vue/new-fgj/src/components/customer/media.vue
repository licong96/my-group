<template>
      <transition name="el-zoom-in-center"> 
          <div v-show="ERRNO" class="mediaWrapper">
          <div class="close" @click="hide()">
            <i class="el-icon-close"></i>
          </div>
            <video width="352" id="video" height="264" controls="controls" autobuffer :src="media">
            </video>
            <p style="padding:10px;line-height:20px">如果未显示播放按钮的苹果用户请多次滑动点击后可以正常播放</p>
          </div>
      </transition>
</template>
<script>
//   import wx from 'weixin-js-sdk'

export default {
  props:{
      media:{}
  },
  data(){
      return{
          ERRNO:false
      }
  },
  methods:{
      show(){
          this.ERRNO = true
          console.log(this.media)
          let media = document.getElementById('video')
            // axios.get('/Handler/Exec.aspx', {
            //     params: {
            //     todo: 'initjsapi',
            //     valiurl: document.URL
            //     }
            // }).then((res) => {
            //     console.log(wx)
            //     wx.config({
            //     debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
            //     appId: 'wxd477f8c4b596b5d5', // 必填，企业号的唯一标识，此处填写企业号corpid
            //     timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            //     nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            //     signature: res.data.signature, // 必填，签名，见附录1
            //     jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            //     })
            // }).catch((error) => {
            //     console.log(error)
            // })
            // wx.ready(function () {
            // media.play()
            // })
      },
      hide(){
          this.ERRNO = false
      }
  }
}
</script>
<style lang="stylus">
.mediaWrapper
    position fixed
    z-index 20
    width 100%
    top 0 
    left 0
    height 100%
    background rgba(0,0,0,0.8)
    color #ffffff
    font-size 16px
    .close
        position absolute
        right 10px
        top 10px
        color #fff
        z-index 21
    video
        margin 100px auto 0
        background-color #000

</style>
