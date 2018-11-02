<template>
  <!-- <transition name="move"> -->
    <div  v-loading.body="loading" class="follow xb-follow" ref="follow">
      <div class="header-wrapper">
        <div class="header">
          <i @click="hide()" class="el-icon-arrow-left"></i>
          <span class="title">跟进记录</span>
          <span class="add" @click="dialogFormVisible = true">新建</span>
        </div>
      </div>
      <div class="f-content" :class="{'overflow-hide': dialogFormVisible}">
        <div v-show="bigPic" class="bigPic" @click="toBig()">
          <el-carousel trigger="click">
            <el-carousel-item v-for="(item,index) in picList" :key="index">
              <img :src="item" alt="" class="full-img">
            </el-carousel-item>
          </el-carousel>
        </div>
        <div v-for="(item,index) in followData" :key="item.id" class="item">
          <div class="item-inside">
            <img class="author" style="vertical-align: middle;border-radius: 45px;flex: 0 0 45px"
                 :src="item.pic" width="45"
                 height="45" alt="">
            <div class="right">
              <p
                style="display: inline-block;vertical-align: middle;color: #007aff;padding-bottom: 5px;font-size: 12px">
                {{item.EmpName}}</p>
              <div class="contentItem" v-show="item.Content" v-html="item.Content" @click="toBig(index)"  ></div>
              <div v-show="item.voicefile" style="width:100%;margin-top:10px;">
                <div class="voicemsg stop" @click="audioPlay(index)" :style="voiceWidth(item)">
                  <audio id="audio" ref="audio">
                    <source :src="'http://app.vipfgj.com'+item.voicefile" type="audio/mpeg">
                  </audio>
                  <div class="volume-medium"><span></span></div>
                </div>
                <span style="color:#999999;padding-left:10px;">{{item.voicetime}}s</span>
              </div>
              <p v-show="item.voicefile" class="contentVoice">识别内容：{{item.Content}}(仅供参考)</p>
            </div>
          </div>
          <p style="padding-left: 55px;font-size: 12px;padding-top: 5px;color: #989898">{{item.FollowDate}}</p>
        </div>
      </div>
      <!-- Form -->

      <el-dialog :modal="false" class="foolow-dialog" title="新建跟进" :visible.sync="dialogFormVisible" width="80%">
        <div class="el-form-item__content">
          <div v-if="changeIcon" @click="change()" class="key"><span></span></div>
          <div v-if="!changeIcon" @click="change()" class="mic"><span></span></div>
          <!-- <el-input v-if="!changeIcon" v-model="message" auto-complete="off"></el-input> -->
          <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-if="!changeIcon" v-model="message" auto-complete="off"></el-input>
          
          <el-button v-if="changeIcon" id="voicebtn" @click="_touchstart()">说话</el-button>
        </div>
        <!-- 提醒 -->
        <div class="remind">
          <div class="remind-switch">
            <i-switch v-model="remindSwitch" @on-change="changeRemind"></i-switch><span class="off-title">是否开启提醒</span>
          </div>
          <section class="remind-wrap" v-show="remindSwitch">
            <ul class="remind-ul">
              <li class="remind-li">
                <span class="title">提醒内容：</span>
                <div class="flex-1">
                  <!-- <el-input v-model="remindText" placeholder="输入提醒内容"></el-input> -->
                  <el-input type="textarea" :autosize="{ minRows: 1, maxRows: 4}" v-model="remindText" placeholder="输入提醒内容"></el-input>
                </div>
              </li>
              <li class="remind-li">
                <span class="title">提醒时间：</span>
                <div class="flex-1 input-color-f">
                  <p class="el-input__inner" @click="openRemindTime">{{remindTime}}</p>
                  <mt-datetime-picker
                    ref="picker"
                    type="datetime"
                    :startDate="startDate"
                    @confirm="RemindConfirm">
                  </mt-datetime-picker>
                </div>
              </li>
              <li class="remind-li">
                <span class="title">提醒范围：</span>
                <div class="flex-1">
                  <el-radio v-model="remindRadio" label="本人">本人</el-radio>
                  <el-radio v-model="remindRadio" label="本部">本部</el-radio>
                </div>
              </li>
            </ul>
          </section>
        </div>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="_formCreat()" id="subfollowbtn">确 定</el-button>
        </div>
      </el-dialog>
      <div v-show="empty && followData.length === 0" class="empty">
        <i class="iconfont icon-iconfontbiaoqingwunai2eps"></i>
        <p class="lc-desc">暂无跟进</p>
      </div>
      <div v-show="hover" class="hover" @click="_touchend()">
        <div class="sound">
        </div>
        <span class="hover-text" style="color: #ccc;line-height: 41px">正在录音,再次点击关闭</span>
      </div>
    </div>
  <!-- </transition> -->
</template>

<script type="text/ecmascript-6">
  import wx from 'weixin-js-sdk'
  // import $ from 'jquery'
  import {GetFollow,initjsapi,InsertFollow} from '../../api/customer/follow'
  import { parseTime } from '@/utils/index'

  export default {
    props: {},
    data () {
      return {
        loading: true,
        bigPic: false,
        picList: [], // 图片列表
        hover: false, // 录音遮罩
        item: [],
        empty: false, // 无数据
        followData: [],
        itemData: [],
        voice: '',
        voicetime: '',
        changeIcon: false, // 语音图标切换
        voiceBegin: false, // 播放
        dialogFormVisible: false,
        translateResult: '',
        serverId: '',
        message: '',
        formData: [],
        formLabelWidth: '',
        iscs: false,
        timesc: 1,
        timer: null,
        // 跟进记录
        followResult: [],
        remindSwitch: false,     // 跟进提醒    测试设置为true
        startDate: new Date(),      // 当前时间
        remindText: '',      // 提醒内容
        remindTime: '',     // 提醒时间
        remindRadio: '本人',     // 提醒范围
        isRender: false,
      }
    },
    created() {
      console.log('created')
      this.GetFollow()
    },
    activated() {
      console.log('activated')
      this.GetFollow()
    },
    mounted () {
      initjsapi().then((res) => {
        // console.log(res)
        // console.log(wx)
        wx.config({
          debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
          appId: 'wxd477f8c4b596b5d5', // 必填，企业号的唯一标识，此处填写企业号corpid
          timestamp: res.data.timestamp, // 必填，生成签名的时间戳
          nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
          signature: res.data.signature, // 必填，签名，见附录1
          jsApiList: ['startRecord', 'stopRecord', 'onVoiceRecordEnd', 'playVoice', 'pauseVoice', 'stopVoice', 'onVoicePlayEnd', 'uploadVoice', 'downloadVoice', 'translateVoice'] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
        })
      }).catch((error) => {
        // console.log('catch', error)
        alert(error)
      })
      let _this = this
      wx.ready(function () {
        // console.log('wx.ready')
        wx.onVoiceRecordEnd({
          // 录音时间超过一分钟没有停止的时候会执行 complete 回调
          complete: function (res) {
            clearInterval(this.timer)
            _this.timesc = 60
            _this.iscs = true
            var localId = res.data.localId
            _this.trvoice(localId)
          }
        })
      })
      wx.error(function (res) {
        console.log('失败', res)
        this.$message.error(res)
        // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
      })
    },
    methods: {
      // 获取跟进内容
      GetFollow() {
        this.InquiryID = this.$route.query.id
        // this.startDate = new Date()     // 选择提醒时间，最小就是当前日期
        console.log(this.InquiryID)
        GetFollow(this.InquiryID).then((res) => {
          if (res.data.result === 'success') {
            this.loading = false
            if (res.data.tempTable.length === 0) {
              this.empty = true
            }
            this.followData = res.data.tempTable

            setTimeout(() => {
              let arr = document.getElementsByClassName('contentItem')
              for (let i = 0; i < arr.length; i++) {
                if (arr[i].getElementsByTagName('img')[0]) {
                  let imgBox = arr[i].getElementsByTagName('img')[0].src
                  if (imgBox) {
                    let nowPic = imgBox.replace(/sm_/gi,'')
                    this.picList.push(nowPic)
                  }
                }
              }
            }, 20)
          } else if (res.data.result === 'error') {
            this.loading = false
            // console.log(res.data.msg)
          }
        }).catch((error) => {
          // console.log(error)
          alert(error)
        })
      },
      _clearRemind() {      // 清空提醒输入
        this.remindText = ''
        this.remindTime = ''
        this.remindRadio = '本人'
      },
      openRemindTime() {    // 打开选择时间
        this.$refs.picker.open()
      },
      RemindConfirm(time) {
        let times = parseTime(time)     // 时间需要处理一下
        this.remindTime = times
      },
      changeRemind(status) {      // 提现内容
        this.remindSwitch = status
        if (status === false) {
          this._clearRemind()
        }
      },
      orange(){
        this.serverId = ''
        this.message = ''
        this.translateResult = ''
        this.voicetime = ''
      },
      toBig (index) {
        // console.log(index)
        // if(index !== '' && index !== undefined){
        //   this.picList = []
        //   console.log(document.getElementsByClassName('contentItem')[index].getElementsByTagName('img')[0].src)
        //   let nowPic = (document.getElementsByClassName('contentItem')[index].getElementsByTagName('img')[0].src).replace(/sm_/gi,'')
        //   this.picList.push(nowPic)
        // }
        this.bigPic = false
        // console.log(index)
        if(index == undefined){
          this.bigPic = false
          return
        }
        if($('.contentItem').eq(index)[0].getElementsByTagName('img').length!==0){
        // console.log(this.picList)
        if (this.bigPic) {
          this.bigPic = false
        } else {
          this.bigPic = true
        }

        }
      },
      voiceWidth (item) {
        let width = item.voicetime * 30
        let style = 'width:' + width + 'px'
        return style
      },
      change () {
        if (this.changeIcon === true) {
          this.changeIcon = false
        } else {
          this.changeIcon = true
        }
      },
      hide () {
        window.history.go(-1)
      },
      _formCreat () {
        // 如果什么都没有，就阻止掉
        if (this.message === '' && this.translateResult === '') {
          this.$message.error('请输入跟进内容！')
          return
        }

        let content = ''
        if(this.message !== ''){
          content = this.message
        } else{
          content = this.translateResult
        }

        if (this.remindSwitch) {    // 判断是否开启提醒
          // 提醒时间和范围必填
          if (!this.remindTime) {
            this.$message.error('请选择提醒时间')
            return false
          }
        } else {
          this._clearRemind()
        }

        this.loading = true
        InsertFollow(this.InquiryID,this.serverId,content,this.voicetime, this.remindText, this.remindTime, this.remindRadio).then((res) => {
          if (res.data.result === 'success') {
            let ss = {
              Content: res.data.Content,
              FollowDate: res.data.DateTime,
              EmpName: res.data.EmpName,
              pic: res.data.picSrc,
              voicetime: res.data.voicetime,
              serverId: this.serverId,
              voicefile: res.data.voice
            }
            console.log(ss)
            this.followData.unshift(ss)
            this.orange()
            this.loading = false
          } else if (res.data.result === 'error') {
            this.$message.error(res.data.msg)
            this.loading = false
          }
          // 完成后，清空提示
          if (this.remindSwitch) {
            this.remindSwitch = false
            this._clearRemind()
          }
        }).catch((error) => {
          console.log(error)
        })
        this.dialogFormVisible = false
      },
      // 播放语音
      audioPlay (index) {
        // console.log(index)
        // this.open('正在播放语音')
        this.$message.success('正在播放语音')
        // console.log(document.getElementsByTagName('audio')[index])
        let media = document.getElementsByTagName('audio')[index]
        wx.ready(function () {
          media.play()
        })
      },
      trvoice (localId) {
        console.log(localId)
        let _this = this
        wx.translateVoice({
          localId: localId, // 需要识别的音频的本地Id，由录音相关接口获得
          isShowProgressTips: 1, // 默认为1，显示进度提示
          success: function (res) {
            wx.uploadVoice({
              localId: localId, // 需要上传的音频的本地ID，由stopRecord接口获得
              isShowProgressTips: 1, // 默认为1，显示进度提示
              success: function (res) {
                console.log('trvoice()函數')
                console.log(res)
//                let serverId = res.serverId // 返回音频的服务器端ID
                _this.serverId = res.serverId
                _this.translateResult = res.translateResult
//                this.subfollow(res.translateResult, serverId)
                _this._formCreat()
              }
            })
          }
        })
      },
      _touchstart (e) {
        this.hover = true
        // this.open('正在录音')
        this.$message.success('正在录音')
        wx.startRecord()
        let itime = 1
        const _this = this
        this.timer = setInterval(function () {
          itime++
          _this.timesc = itime
          console.log(_this.timesc)
        }, 1000)
      },
      _touchend (e) {
        clearTimeout(this.timer)
        this.voicetime = this.timesc
        let _this = this
        if (this.timesc < 4) {
          // this.open('录音时间过短，请重新录制')
          this.$message.success('录音时间过短，请重新录制')
        } else {
          if (!_this.iscs) {
            wx.stopRecord({
              success: function (res) {
                console.log(res)
                _this.trvoice(res.localId)
                // _this.open('录音结束')
                _this.$message.success('录音结束')
              }
            })
          } else {
            _this.iscs = false
          }
        }
        this.hover = false
      },
      // 反转义
      HTMLDecode (text) {
        var temp = document.createElement('div')
        temp.innerHTML = text
        var output = temp.innerText || temp.textContent
        temp = null
        return output
      },
      // 提示
      open (msg) {
        this.$message(msg)
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">

  .xb-follow
    margin 0
    background: #f8f8f8
    height 100%
  .author
    background url(../login/default_header.png)
    background-size: 100%
  .cell
    text-align center
  .el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 150px;
    margin: 0;
  }

  .el-carousel__item:nth-child(2n) {
     background-color: #99a9bf;
  }

  .el-carousel__item:nth-child(2n+1) {
     background-color: #d3dce6;
  }

  .xb-follow
    .empty
      width 314px
      height 214px
      margin 0 auto
      // background url(img/empty.png) no-repeat
      // background-size 100%
      display flex
      flex-direction column
      align-items: center
      justify-content: center
      .iconfont
        font-size 60px
        color #878D99
      .lc-desc
        padding-top 10px
        font-size 14px
        color #878D99
    .contentItem
      font-size 15px
      line-height 1.4
      word-break break-all
    .contentItem img
      width 120px
      margin-top 5px

    .bigPic
      width 100%
      position fixed
      background-color #000
      top 100px
      z-index 2
      .full-img
        width 100%

    .hover
      width 100%
      height 100%
      position fixed
      top: 0px
      bottom 0px
      background rgba(0, 0, 0, 0.7)
      z-index 20010
      .sound
        width 60px
        height 130px
        margin 0 auto
        margin-top 250px
        background url(img/mic.png)
        background-size 100%
      .hover-text
        display block
        text-align center

  .el-dialog
    z-index 1

  .voicebtn
    flex 1
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c4c4c4;
    color: #1f2d3d;
    margin: 0;
    padding: 10px 15px;
    border-radius: 4px;

  .volume-medium
    position absolute
    left 10px
    top 3px
    width: 20px;
    height: 20px;
    span
      margin 5px
      width 12px
      height 15px
      display block
      background url(img/volume-medium.svg) no-repeat
      background-size 100%

  .voicemsg
    position relative
    display: inline-block;
    height: 30px;
    width 200px
    max-width: 250px;
    min-width: 50px;
    border-radius: 10px;
    line-height: 30px;
    border: 1px solid #ccc;
    -webkit-box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.3);
    background: #9EEA6A;

  .el-form-item__content
    display flex
    justify-content space-between
    .mic
      width: 35px;
      height: 35px;
      span
        margin 5px
        width 20px
        height 25px
        display block
        background url(img/mic.svg) no-repeat
        background-size 100%

    .key
      width: 35px;
      height: 35px;
      span
        width 20px
        height: 18px;
        margin: 9px 5px;
        display block
        background url(img/keyboard.svg) no-repeat
        background-size 100%
    .el-button.el-button--default
      flex 1

  .follow.xb-follow
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    z-index: 40;
    width: 100%;
    top: 0;
    left: 0;
    background: #fff;
    height 100%
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .el-checkbox__label
      display inline-block
    .header-wrapper
      position fixed
      top 0
      left 0
      width 100%
      z-index 1
      .header
        display flex
        justify-content space-between
        height 44px
        background #f9f9f9
        line-height 44px
        font-size: 16px
        i
          font-size 20px
        i, .add
          line-height 44px
          color #007aff
          padding 0 10px
    .f-content
      background #ffffff
      padding-top 44px
      text-align left
      font-size 14px
      .item
        padding 10px 15px
        position relative
        .item-inside
          display flex
          .right
            padding-left 10px
        &::after
          position absolute
          width 100%
          content ''
          bottom 0
          left 0
          border-bottom 1px solid #dfe6ec
        p
          line-height 20px
    .el-dialog--small
      width 90%
    .remind
      padding-top 10px;
      text-align left
      .remind-li
        padding-top 10px
        .input-color-f
          .el-input__inner
            line-height 40px
            background-color #fff
            color #666
    .remind-switch
      text-align right
      .off-title
        display inline-block
        padding-left 5px
  .overflow-hide
    overflow hidden
    height 100%

  .foolow-dialog
    background-color rgba(0, 0, 0, .4)
</style>
