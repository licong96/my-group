<template lang="html">
  <!-- 新建和回复共用 -->
  <section class="mail-add">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">发送邮件</h3>
      <span class="right-span" @click="onSend"><el-button type="primary" size="small">发送</el-button></span>
    </header>
    <div class="main">
      <div class="screen" v-show="!messageID">
        <div class="flex-1">
          <el-select v-model="params.MessageType" clearable placeholder="选择类型">
            <el-option v-for="(item, index) in typeData" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="flex-1">
          <select-dept-name ref="deptNames" @onDeptName="onDeptName" :isOneDeptName="isOneDeptName"></select-dept-name>
        </div>
        <div class="flex-1">
          <select-emp-name ref="empNames" :DeptID="params.ReceiveDeptID" @onEmpName="onEmpName" :disabled="disabled"></select-emp-name>
        </div>
      </div>
      <div class="input-title" v-show="!messageID">
        <el-input class="border-none" v-model="params.MessageTitle" clearable placeholder="请输入标题"></el-input>
      </div>
      <textarea class="textarea" v-model="params.MessageContent" cols="30" rows="10" placeholder="请输入内容..."></textarea>
      <div class="we-chat" v-show="!messageID && isWechat">
        <el-switch
          v-model="isSwitch"
          active-color="#409EFF"
          inactive-color="#999999"
          active-text="是否需要发送微信">
        </el-switch>
      </div>
      <div class="add-img">
        <ul class="list-wrap">
          <li class="list" v-for="(item, index) in imgData" :key="index">
            <i class="el-icon-error" @click="removeImg(index)"></i>
            <div class="img-wrap" @click="fullShowImg(index)">
              <img class="img" :src="smPath(item.PhotoPath)" alt="">
            </div>
          </li>
          <li class="list add">
            <core-image class="core-pic-image" cropRation="1:1" @coreImage="corePicImage"></core-image>
            <i class="add-icon el-icon-plus"></i>
          </li>
        </ul>
      </div>
    </div>
    <loader-center ref="loaderCenters"></loader-center>
    <confirm ref="confirms" @confirm="confirm"></confirm>
    <awesomeSwiper ref="awesomeSwiper" :swiperData="swiperData" :initialSlide="initialSlide"></awesomeSwiper>
  </section>
</template>

<script>
  import SelectDeptName from '@/base/SelectDeptName'
  import SelectEmpName from '@/base/SelectEmpName'
  import CoreImage from '@/base/CoreImage'
  import LoaderCenter from '@/base/LoaderCenter'
  import Confirm from '@/base/Confirm'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import { imageOnload, verifyData } from '@/utils/index'
  import { DrawImageToBase } from '@/utils/picReduce'
  import { vipfgj } from '@/common/js/config'
  import { ImgUpLoad } from '@/api/public'
  import { GetMessagePurview, InsertMessage } from '@/api/mail/mailAdd'
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        messageID: '',      // 立即回复用的的ID
        params: {
          todo: 'Message',
          type: 'InsertMessage',
          needpurview: true,
          valiurl: document.URL,
          ReplyMessageID: '',     // 消息id, 回复消息时传此参数
          MessageType: '',        // 消息类型, 系统|业务|私人
          MessageTitle: '',       // 消息标题
          MessageContent: '',     // 消息内容
          ReceiveDeptID: '',      // 接收人部门id
          ReceiveEmpID: '',       // 接收人id
          ReceiveFile: '',        // 附件文件路径
          NeedSendWeChat: '',     // 是否需要发送微信, 0否  1是
        },
        typeData: [
          {
            label: '系统',
            value: '系统'
          }, {
            label: '业务',
            value: '业务'
          }, {
            label: '私人',
            value: '私人'
          }
        ],
        imgData: [],
        DeptID: '',         // 部门ID
        disabled: true,    // 人员选项是否禁用
        isSwitch: false,    // 是否需要发送微信
        swiperData: [],     // 图片预览数据
        initialSlide: 0,    // 预览下标
        isWechat: false,    // 是否允许发送微信 
        isOneDeptName: true,  // 直接获取部门数据
      }
    },
    created() {
      this._GetMessagePurview()     // 获取权限
    },
    activated() {
      let query = this.$route.query
      if (query.id) {    // 这是立即回复，就没那么多选项了
        this.messageID = query.id
      }
      if (query.type) {
        this.params.MessageType = query.type
      }
    },
    mounted() {
      this.$nextTick(() => {
        this.loaderCenters = this.$refs.loaderCenters     // 提示元素全局保存
      })
    },
    methods: {
      _InsertMessage(params, type) {    // 发送消息
        this.loaderCenters.show('发送中')
        InsertMessage(params).then(res => {
        this.loaderCenters.hide()
          if (res.data.result === 'success') {
            if (type === '回复') {
              this.$message.success('回复成功')
              this.back()
              this.setMailReply(true)
            } else {
              this.$message.success('发送成功')
            }
            this._empty()   // 成功后清空
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      onSend() {      // 发送
        let params = this.params
        // 图片
        let pic = ''
        this.imgData.forEach((item) => {     // 拼接图片
          if (item) {
            pic += item.PhotoPath + '|'
          }
        })
        params.ReceiveFile = pic
        // 是否需要发送微信
        params.NeedSendWeChat = this.isSwitch ? '1' : '0'

        // 判断是创建还是回复
        if (this.messageID) {     // 回复
          params.ReplyMessageID = this.messageID
          if (!verifyData(params.MessageContent, 'require')) {
            this.$message.error('请输入内容')
            return false
          }
          this._InsertMessage(params, '回复')
        } else {       // 创建
          delete params.ReplyMessageID     // 这里用不到消息ID
          if (!this._requiredParam(params)) {      // 必填项
            return
          }
          this._InsertMessage(params, '新建')
        }
      },
      _requiredParam(params) {
        if (!verifyData(params.MessageType, 'require')) {
          this.$message.error('请选择邮件类型')
          return false
        }
        if (!verifyData(params.MessageTitle, 'require')) {
          this.$message.error('请输入标题')
          return false
        }
        if (!verifyData(params.MessageContent, 'require')) {
          this.$message.error('请输入内容')
          return false
        }
        return true
      },
      onEmpName(newVal) {     // 选中的人员
        this.params.ReceiveEmpID = newVal
      },
      onDeptName(newVal) {      // 选中的部门
        this.$refs.empNames.clearEmpName()
        if (newVal.length) {
          this.disabled = false
          let len = newVal.length
          this.params.ReceiveDeptID = newVal[len - 1].split(',')[0]    // 部门ID
        } else {
          this.disabled = true
          this.params.ReceiveDeptID = ''
        }
      },
      _GetMessagePurview() {
        GetMessagePurview().then(res => {
          let data = res.data
          if (data.result === 'success') {
            if (data.PublicMsg === '1' || data.PrivateMsg === '1' || data.Wechat === '1') {   // 只要满足一个权限就能去新建消息
              this.isShowNew = true
            }
            if (data.PublicMsg !== '1') {   // 不允许发送系统及业务类型消息
              this.typeData.splice(0, 2)
            }
            if (data.PrivateMsg !== '1') {   // 不允许发送私人类型消息
              this.typeData.splice(this.typeData.length-1, 1)
            }
            if (data.Wechat === '1') {   // 不允许选择发送微信
              this.isWechat = true
            }
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error(data.msg)
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      corePicImage(base64) {
        // this.imageUpload(base64)
        // 这是图片裁切插件的bug，完成裁切后，body的overflow：hiddle，没去掉，影响滑动，我这里手动去掉它
        let oBody = document.getElementsByTagName('body')[0]
        oBody.style.overflow = 'initial'

        imageOnload(base64).then(image => {
          let sm_pic = DrawImageToBase(image, 160, 160)     // 压缩
          return sm_pic
        }).then(sm_pic => {
          ImgUpLoad(base64, sm_pic).then((res) => {
            if (res.data.result === 'success') {
              this.imgData.push({
                PhotoPath: res.data.path, 
                PhotoSmPath: res.data.sm_path
              })
            } else {
              this.$message.error('图片上传失败！', res.data.msg)
            }
          }).catch(error => this.$message.error('catch', error))
        })
        .catch(error => this.$message.error(error))
      },
      confirm(obj) {     // 确定操作
        this.imgData.splice(obj.index, 1)
      },
      removeImg(index) {
        this.$refs.confirms.show({type: 'removeImg', index, text: '确定删除这张图片吗？'})
      },
      fullShowImg(index) {
        this.swiperData = this.imgData
        this.initialSlide = index
        this.$refs.awesomeSwiper.show()
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj{join}` 是本地测试用的
        if (!paths) {
          return
        }
        return `${vipfgj}${paths}`
      },
      _empty() {
        this.params.ReplyMessageID = ''     // 消息id 回复消息时传此参数
        this.params.MessageType = ''        // 消息类型 系统|业务|私人
        this.params.MessageTitle = ''       // 消息标题
        this.params.MessageContent = ''     // 消息内容
        this.params.ReceiveDeptID = ''      // 接收人部门id
        this.params.ReceiveEmpID = ''       // 接收人id
        this.params.ReceiveFile = ''        // 附件文件路径
        this.params.NeedSendWeChat = ''     // 是否需要发送微信, 0否  1是

        this.$refs.deptNames.clearSDeptVal()
        this.$refs.empNames.clearEmpName()
        this.imgData = []
        this.isSwitch = false      // 是否需要发送微信
      },
      back() {
        this.$router.back()
      },
      ...mapActions([
        'setMailReply'
      ])
    },
    components: {
      SelectDeptName,
      SelectEmpName,
      CoreImage,
      LoaderCenter,
      Confirm,
      AwesomeSwiper
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/variable';
  @import '../../common/sass/mixin';

  .mail-add {
    overflow-x: hidden;
    overflow-y: auto; 
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 999;
    min-height: 100%;
    background-color: #f5f5f5;
    .header{
      box-shadow: 0px 1px 2px #e6e6e6;
    }
    .main {
      margin-top: 6px;
      .screen {
        margin-top: 6px;
        display: flex;
      }
      .input-title {
        margin-top: 6px;
        border: none;
        background-color: #fff;
      }
      .textarea {
        margin-top: 6px;
        border: none;
        padding: 16px;
        width: 100%;
        height: 174px;
        font-size: 16px;
        line-height: 1.4;
        background-color: #fff;
        outline: none;
        resize: none;
      }
      .we-chat {
        margin-top: 10px;
        padding: 0 16px;
        text-align: left;
      }
      .add-img {
        padding: 10px 0;
        .list-wrap {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          padding-left: 10px;
        }
        .list {
          position: relative;
          padding: 0;
          border: 1px dashed #cbcbcb;
          width: 80px;
          height: 80px;
          margin: 10px 10px 0 0;
          .img-wrap {
            overflow: hidden;
            justify-content: center;
            display: flex;
            align-items: center;
            width: 100%;
            height: 100%;
          }
        }
        .el-icon-error {
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 2;
          font-size: 22px;
          color: $color-danger;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 2px;
            left: 0;
            z-index: -1;
            border-radius: 50%;
            background-color: #fff;
          }
        }
        .add {
          position: relative;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          .core-pic-image {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
          }
          .add-icon {
            font-size: 34px;
            font-weight: bold;
            color: #cbcbcb;
          }
          .file {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
          }
        }
        .img {
          width: 100%;
        }
      }
    }
  }
</style>
