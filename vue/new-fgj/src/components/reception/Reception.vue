<template lang="html">
  <!-- 接待列表 -->
  <section class="lc lc-reception">
    <!-- 顶部筛选 -->
    <section class="color-bg" ref="top">
      <header class="lc header">
        <i class="el-icon-arrow-left icon" @click="back"></i>
        <h3 class="title">接待列表({{resultcount}})</h3>
      </header>
      <!-- 搜索 -->
      <search ref="searchs" placeholder="搜索关键字，如姓名，电话，标签..." @query="query"></search>
      <!-- 筛选 -->
      <section class="screen">
        <div class="branch lc-sort" @click="_visibleMake">
          <select-dept-name ref="deptNames" @onDeptName="onDeptName" :isOneDeptName="isOneDeptName"></select-dept-name>
        </div>
        <div class="branch estate">
          <el-select v-model="EstateID" placeholder="选择楼盘" @visible-change="visibleChange">
            <el-option label="不限" value=" "></el-option>
            <el-option v-for="(item, index) in options2" :key="index" :label="item.EstateName" :value="item.EstateID"></el-option>
          </el-select>
        </div>
        <div class="branch estate">
          <el-select v-model="filing" placeholder="选择时段" @visible-change="visibleChange">
            <el-option v-for="(item, index) in options3" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
        <div class="branch estate lc-sort">
          <el-select v-model="order" placeholder="选择排序" @visible-change="visibleChange">
            <el-option v-for="(item, index) in options4" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </div>
      </section>
    </section>
    <!-- 列表 -->
    <section class="scroll-area">
      <scroll
      ref="scrolls"
      :data="listData"
      :listemScroll="listemScroll"
      :probeType="probeType"
      :pullup="pullup"
      :bounce="bounce"
      :momentum="momentum"
      @scrollToEnd="upLoad">
      <div class="list-wrap">
        <div class="list"
          v-for="(item, index) in listData"
          :key="index"
          :class="{'trans-left': index===touchLeft, 'trans-right': index===touchRight}"
          @touchstart.prevent="listTouchStart($event, index)"
          @touchmove.prevent="listTouchMove"
          @touchend="listTouchEnd"
          >
          <!-- 左边的按钮 -->
          <section class="list-btn-l">
            <span class="button upimg" @click="followImg(item)"><i class="iconfont icon-shangchuantupian1"></i>图片</span>
            <span class="button follow" @click="_follow(item.InquiryID)"><i class="iconfont icon-tianxiegenjin"></i>跟进</span>
          </section>
          <section class="list-center">
            <!-- 基本信息 -->
            <div class="top">
              <div class="name">
                <span class="cust-name">{{item.CustName}}</span>
                <div>
                  <span class="nick-name">{{item.NickName}}</span>
                  <i v-show="item.NickName==='自来客' && item.CustName==='自来客'" @click="editNickName(item)" class="needll-name el-icon-edit"></i>
                </div>
              </div>
              <div class="mobile">{{item.CustMobile}}<i v-show="item.needall==='1'" @click="completeNumber(item)" class="needll-name el-icon-edit"></i></div>
              <div class="dept-name">{{item.EstateName}}</div>
            </div>
            <!-- 当前进度 -->
            <div class="schedule">
              <div class="progress-wrap">
                <span class="title">进度</span>
                <div class="progress">
                  <Progress :percent="item.percentCount" status="active" hide-info></Progress>
                  <div class="plan">
                    <span class="plan-text">{{item.VisitType}}<small class="count">{{item.VisitCount}}</small></span>
                    <span class="plan-text">接待<small class="count" v-show="item.ReceptionCount!=='0'">{{item.ReceptionCount}}</small></span>
                    <span class="plan-text">签约</span>
                    <span class="plan-text">销控</span>
                  </div>
                </div>
              </div>
            </div>
            <!-- 步骤信息 -->
            <div class="info-wrap">
              <div class="info-left">
                <span class="time-num">第{{item.VisitCount}}次到访</span>
                <p class="time-last">最近到访时间：<span class="small">{{item.VisitDate}}</span></p>
                <p class="time-last">辩客人：<span class="small">{{item.VisitOpEmpName}}</span></p>
                <p class="time-last">接待人：<span class="small">{{item.ReceptionOpEmpName}}</span></p>
              </div>
              <div class="info-right" @click="onReception(item)">
                <p class="button">
                  <el-button type="primary">接待</el-button>
                </p>
              </div>
            </div>
            <!-- 报备时间 -->
            <div class="report">
              <p class="text-left">报备<a class="name" :href="'tel:'+ item.DeclareEmpTel">{{item.DeclareDeptName}}-{{item.DeclareEmpName}}</a></p>
              <p class="text-right">{{item.DeclareDate}}</p>
            </div>
          </section>
          <!-- 右边的按钮 -->
          <section class="list-btn-r">
            <span class="button contract" @click="onSign(item)"><i class="iconfont icon-qianyue"></i>签约</span>
            <!-- <span class="button control" @click="onControl(item)"><i class="iconfont icon-xiaohu"></i>销控</span> -->
          </section>
        </div>
        <!-- 加载中 -->
        <loader v-show="hasMore"></loader>
        <!-- 什么都没有 -->
        <empty v-show="!hasMore && !listData.length"></empty>
      </div>
      </scroll>
    </section>
    <!-- 等待 -->
    <loader-center ref="loaderCenter"></loader-center>
    <section class="lc-mask" v-show="IsMake" @click="IsMake=false"></section>
    <!-- 接待弹窗操作 -->
    <el-dialog
      title="接待"
      :visible.sync="dialogVisible1"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-reception">
      <section class="dialog-tion">
        <!-- 指派 -->
        <div class="assign">
          <el-select v-model="selectRece" placeholder="请选择">
            <el-option
              v-for="item in options5"
              :key="item.EmpID"
              :label="item.EmpName"
              :value="item.EmpID">
            </el-option>
          </el-select>
          <el-button type="danger" @click="executeReception('指派')">指派</el-button>
        </div>
        <!-- 自接 -->
        <div class="self">
          <div class="self-l">
            <el-button type="primary" @click="executeReception('自接')">自接</el-button>
            <p class="desc">报备人自己接待</p>
          </div>
          <div class="self-r">
            <el-button type="success" @click="executeReception('接待')">接待</el-button>
            <p class="desc">操作人自己接待</p>
          </div>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible1 = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 签约操作弹窗 -->
    <el-dialog
      title="签约"
      :visible.sync="dialogVisible2"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign">
      <section class="dialog-sign">
        <section class="dialog-sign">
          <Cascader
            :data="options6"
            placeholder="试试搜索"
            v-model="RoomID"
            clearable
            size="large"
            filterable
            transfer
            change-on-select
          ></Cascader>
        </section>
        <div class="top">
          <span class="serial">合同编号：</span>
          <div class="input-wrap">
            <input class="input" type="text" v-model="signAcontract.ContractNo" placeholder="请输入合同编号">
          </div>
        </div>
        <div class="top">
          <span class="serial">客户姓名：</span>
          <div class="input-wrap">
            <input class="input" type="text" v-model="signAcontract.CustName" :placeholder="placeholders.CustName">
          </div>
        </div>
        <div class="top">
          <span class="serial">客户电话：</span>
          <div class="input-wrap">
            <input class="input" type="text" v-model="signAcontract.CustMobile" :placeholder="placeholders.CustMobile">
          </div>
        </div>
        <div class="top">
          <span class="serial">辩客人：</span>
          <p class="input-wrap">{{signAcontract.VisitOpEmpName}}</p>
        </div>
        <div class="up-img">
          <input class="file" v-if="isWeChats" @click="onUploadPic('签约')">
          <input class="file" v-else type="file" capture="camera" accept="image/*" @change="readFile($event, '签约')">
          <img v-if="signAcontract.picSrc" :src="smPath(signAcontract.picSrc)" class="avatar">
          <i v-else class="avatar-uploader-icon" :class="iconLoadingPlus"></i>
        </div>
        <p class="img-desc">上传文件</p>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="signConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 销控 -->
    <el-dialog
      title="销控"
      :visible.sync="dialogVisible3"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign">
      <section class="dialog-sign">
        <Cascader
          :data="options6"
          placeholder="试试搜索"
          v-model="RoomID"
          clearable
          size="large"
          filterable
          transfer
          change-on-select
        ></Cascader>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="meltConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 上传跟进图片 -->
    <el-dialog
      title="上传图片"
      :visible.sync="dialogVisible4"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign dg-follow-up">
      <section class="dialog-sign">
        <div class="up-img">
          <input class="file" v-if="isWeChats" @click="onUploadPic('跟进')">
          <input class="file" v-else type="file" accept="image/*" @change="readFile($event, '跟进')">
          <img v-if="followImgData.pic" :src="smPath(followImgData.pic)" class="avatar">
          <i v-else class="avatar-uploader-icon" :class="iconLoadingPlus"></i>
        </div>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="followImgConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 跟进文字 -->
    <el-dialog
      title="跟进"
      :visible.sync="dialogVisible5"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign dg-follow-text">
      <section class="dialog-sign">
        <textarea class="follow-text" v-model="followTextData.Content" placeholder="请输入跟进内容"></textarea>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="followTextConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 补齐全号 -->
    <el-dialog
      title="补齐全号"
      :visible.sync="dialogVisible6"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign dg-follow-text">
      <section class="dialog-sign">
        <el-input v-model="CustMobileAll" placeholder="请输入全号"></el-input>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="numberTextConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改名称 -->
    <el-dialog
      title="修改客户"
      :visible.sync="dialogVisible7"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign dg-follow-text">
      <section class="dialog-sign">
        <el-input v-model="editNickNameData.editName" placeholder="请输入客户名称"></el-input>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="nickNameTextConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  /**@augments
   * VisitCount 到访次数
   * ReceptionCount 接待次数
   * ReserveDate  签约
   * ReserveRoomNo 销控
   */
  import wx from 'weixin-js-sdk'
  import SelectDeptName from '@/base/SelectDeptName'
  import Scroll from '@/base/BScroll'
  import Search from '@/base/Search'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import LoaderCenter from '@/base/LoaderCenter'
  import { getEstate, getDepartment } from '@/api/inquiry/inquiry'  // 获取部门和楼盘是一样的，直接用了客户列表接口
  import { ImgUpLoad, initjsapi, SaveWxImgFile } from '@/api/public'
  import { SelectVisitByEstate,
           SelectNegotiatePersonByEstate,
           up_Negotiate,
           SalesControl,
           UpRoomStatus,
           UpNegoTiatePic,
           InsertFollow,
           SupplementNumber,
           InsertSubscriptionContract,
           upInquiry } from '@/api/reception/reception'
  import { prefixStyle, trim, isCheckMobile, verifyData, isWeChat } from '@/utils/index'
  import { DrawImageToBase, imageCompress } from '@/utils/picReduce'
  import { vipfgj } from '@/common/js/config'
  import { classie } from '@/common/js/dom'

  const transform = prefixStyle('transform')

  // 进度条  15到访  39接待  60签约  100销控
  const percent1 = 15
  const percent2 = 39
  const percent3 = 60
  const percent4 = 100

  export default {
    data() {
      return {
        // options1: [],    // 部门数据
        options2: [],   // 楼盘数据
        options3: [     // 时段
          {
            value: " ",
            label: "不限"
          },
          {
            value: "day",
            label: "当天"
          },
          {
            value: "threeday",
            label: "3天内"
          },
          {
            value: "week",
            label: "本周"
          },
          {
            value: "month",
            label: "本月"
          }
        ],
        options4: [     // 排序
          {
            value: " ",
            label: "不限"
          },
          {
            value: "ASC",
            label: "未接待、到访时间降序"
          },
          {
            value: "DFASC",
            label: "已接待、接待时间升序"
          },
          {
            value: "DFDESC",
            label: "已接待、接待时间降序"
          }
        ],
        options5: [],     // 可指派人员数据
        options6: [],     // 销控数据
        listData: [],    // 列表数据
        paramsItem: {     // 要传入的参数
          todo: 'Filing',
          type: 'SelectVisitByEstate',
          needpurview: true,
          valiurl: document.URL,
          page: 1,
          likestr: ''
        },
        EstateID: [],  // 楼盘筛选，选中的值
        filing: '',     // 时段
        order: '',      // 排序
        hasMore: false, // 数据加载中
        touch: {},       // 列表滑动
        touchLeft: '',    // 当前可以滑动的值 left
        touchRight: '',    // 当前可以滑动的值 right
        dialogVisible1: false,  // 接待弹窗
        selectRece: '',        // 选中的指派人
        negotiateObj: {},      // 接待要传的数据，指派/自接/接待，这个厉害了
        dialogVisible2: false,   // 签约弹窗
        signAcontract: {         // 签约要传的数据
          todo: 'Contract',
          type: 'InsertSubscriptionContract',
          needpurview: true,
          valiurl: document.URL,
          ContractNo: '',       // 合同编号
          picSrc: '',            // 合同图片url
          CustName: '',
          CustMobile: ''
        },
        placeholders: {     // 提示
          CustName: '',
          CustMobile: ''
        },
        dialogVisible3: false,   // 销控弹窗
        RoomID: [],            // 要销控的房间ID
        meltData: {},          // 销控要传的数据
        dialogVisible4: false,     // 上传跟进图片
        followImgData: {          // 上传跟进图片要传的数据
          InquiryID: '',
          pic: ''
        },
        dialogVisible5: false,   // 跟进弹窗
        followTextData: {       //跟进文本要上传的数据
          InquiryID: '',
          Content: ''
        },
        iconLoadingPlus: 'el-icon-plus',   // 图标上传状态和上传中状态的切换
        dialogVisible6: false,      // 补齐全号弹窗
        dialogVisible7: false,      // 编辑自来客名称弹窗
        editNickNameData: {},       // 编辑自来客名称数据
        CustMobileAll: '',      // 全号
        numberDeclareID: '',    // 报备id
        numberCustMobile: '',   // 当前的号码
        resultcount: 0,        // 总共多少条数据
        isSignConfirmOne: false,    // 禁止重复发送请求
        IsMake: false,       // 一个看不见的遮罩
        isOneDeptName: false,  // 是否点击了部门筛选，在获部门数据
        isWeChats: false,   // 是否微信打开
      }
    },
    created () {
      this.listemScroll = true   // 派发滚动
      this.probeType = 1     // 不截流
      this.bounce = false     // 关闭弹动
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载
      // this.bounceTimes = 300   // 筛选滑动回弹速度

      this._SelectVisitByEstate()   // 获取列表数据
      this._getEstate()          // 获取楼盘数据
      
      if (isWeChat()) {   // 判断是否微信打开
        this.isWeChats = true
        this.initWeChat()
      } 
    },
    activated () {
      this._SelectVisitByEstate()   // 获取列表数据
    },
    mounted() {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenter
        this.elCascader = document.querySelector('.el-cascader')
        this.elSelect = document.querySelectorAll('.el-input')
      })
    },
    methods: {
      initWeChat() {    // 获取微信sdk
        initjsapi().then((res) => {
          wx.config({
            debug: false, // 开启调试模式
            appId: 'wxd477f8c4b596b5d5', // 必填，企业号的唯一标识，此处填写企业号corpid
            timestamp: res.data.timestamp, // 必填，生成签名的时间戳
            nonceStr: res.data.nonceStr, // 必填，生成签名的随机串
            signature: res.data.signature, // 必填，签名，见附录1
            jsApiList: [
              'chooseImage',
              'previewImage',
              'uploadImage',
              'getLocalImgData',
            ] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
          })
        }).catch((error) => {
          this.$message.error(error)
        })
        // wx.ready(() => {
        // })
        wx.error((res) => {
          this.$message.error(res)
        })
      },
      onUploadPic(type) {   // 选择图片
        let _this = this
        wx.chooseImage({
          count: 1,   // 设置一次能选择的图片的数量
          sizeType: ['original'],   // 指定是原图还是压缩,默认二者都有 compressed：缩略图
          sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机,默认二者都有
          success: function(res) {   // 微信返回了一个资源对象
            // console.log(res)　　　　　　　　　 // res.localIds 是一个数组　保存了用户一次性选择的所有图片的信息
            _this.ulLoadToWechat(res.localIds[0], type)   // 只上传一张，就粗鲁一点了
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      ulLoadToWechat(localId, type) {   // 上传到微信服务器
        var _this = this
        wx.uploadImage({
          localId: localId,
          success: function(res) { // 上传图片到微信成功的回调函数   会返回一个媒体对象  存储了图片在微信的id
            // console.log('上传返回值', res)
            let serverId = res.serverId
            _this.iconLoadingPlus = 'el-icon-loading'
            SaveWxImgFile(serverId).then(res => {
              // console.log('返回的图片地址', res)
              _this.iconLoadingPlus = 'el-icon-plus'
              if (res.data.result === 'success') {
                if (type === '签约') {
                  _this.signAcontract.picSrc = res.data.path
                } else if (type === '跟进') {
                  _this.followImgData.pic = res.data.path
                }
              } else {
                _this.signAcontract = {}
                _this.followImgData = {}
                _this.$message.error(res.data.msg)
              }
            })
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      numberTextConfirm() {     // 补齐全号确定
        let mobiler = trim(this.CustMobileAll)     // 去掉空格
        if (!mobiler || mobiler === ' ') {
          this.$message.error('号码不能为空')
          return
        }
        // 判断前三后四是否匹配
        if (
          isCheckMobile(mobiler) &&
          mobiler.length >= 11 &&
          mobiler.substring(0, 3) == this.numberCustMobile.substring(0, 3) &&
          mobiler.substring(7, 11) == this.numberCustMobile.substring(7, 11)
        ) {
          SupplementNumber( this.CustMobileAll, this.numberDeclareID).then((res) => {
            if (res.data.result === 'success') {
              this.$message.success('补齐全号成功')
              // 成功后去掉补齐全号图标
              for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].DeclareID ===  this.numberDeclareID) {
                  this.listData[i].needall = '0'
                }
              }
              // 清空
              this.dialogVisible6 = false
              this.CustMobileAll = ''
              this.numberDeclareID = ''
            } else {
              this.$message.error(res.data.msg)
            }
          })
        } else {
          this.$message.error('号码不匹配，请检查您的号码')
        }
      },
      completeNumber(item) {      // 补齐全号弹窗
        this.numberDeclareID = item.DeclareID
        this.numberCustMobile = item.CustMobile
        this.dialogVisible6 = true
      },
      nickNameTextConfirm() {   // 编辑自来客用户提交
        let selfData = this.editNickNameData
        if (!verifyData(selfData.editName, 'require')) {
          this.$message.error('客户名称不能为空')
          return
        }
        this.loaderCenter.show('正在修改')
        upInquiry(selfData.InquiryID, selfData.editName).then(res => {
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            selfData.NickName = selfData.editName
            this.dialogVisible7 = false
            this.$message.success('修改成功')
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error(res.data.msg)
          }
        })
      },
      editNickName(item) {      // 编辑自来客名称
        this.editNickNameData = item      // 这里进行应用，修改成功后用得到
        this.editNickNameData.editName = ''
        this.editNickNameData.InquiryID = item.InquiryID
        this.dialogVisible7 = true
      },
      followTextConfirm() {     // 跟进确定按钮
        let str = trim(this.followTextData.Content)     // 去掉空格
        if (!str || str === ' ') {
          this.$message.error('请输入内容')
          return
        }
        this.followTextData.Content = str
        this.loaderCenter.show('正在跟进')
        InsertFollow(this.followTextData).then((res) => {
          // console.log(res)
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            this.$message.success('跟进成功！')
            // 清空
            this.dialogVisible5 = false
            this.followTextData = {}
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      // 打开跟进
      _follow(id) {
        this.$router.push({
          path: '/inquiry/follow',
          query: {
            id: id
          }
        })
      },
      followText(item) {      // 文本跟进弹窗
        this.followTextData.Content = ''      // 打开的时候先清空之前输入的你内容
        this.dialogVisible5 = true
        this.followTextData.InquiryID = item.InquiryID
      },
      followImgConfirm() {      // 上传跟进图片确定按钮
        if (!this.followImgData.pic) {
          this.$message.error('请先上传图片')
          return
        }
        UpNegoTiatePic(this.followImgData).then((res) => {
          if (res.data.result === 'success') {
            this.$message.success('图片上传成功！')
            // 成功后重置
            this.dialogVisible4 = false
            this.followImgData = {}
            this.iconLoadingPlus = 'el-icon-plus'
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      followImg(item) {     // 上传跟进图片
        this.iconLoadingPlus = 'el-icon-plus'     // 先把图片改为上传状态
        this.dialogVisible4 = true
        this.followImgData.InquiryID = item.InquiryID
      },
      meltConfirm() {     // 销控确定
        if (!this.RoomID.length) {
          this.$message.error('请选择房号')
          return
        }
        let InquiryID = this.meltData.InquiryID
        let RoomID = this.RoomID[this.RoomID.length - 1]
        let RoomNo = ''
        this.options6.forEach((item) => {
          for(let i = 0; i < item.children.length; i++) {
            if (item.children[i].value === RoomID) {
              RoomNo = item.label + ' ' + item.children[i].label
              return
            }
          }
        })
        UpRoomStatus(InquiryID, RoomID, RoomNo).then((res) => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.$message.success('销控成功')
            this.RoomID = []
            this.dialogVisible3 = false
            // 手动修改进度
            for (let i = 0; i < this.listData.length; i++) {
              if (this.listData[i].InquiryID === InquiryID) {
                this.listData[i].ReserveRoomNo = res.data.RoomNo
                if (this.listData[i].percentCount < percent4) {
                  this.listData[i].percentCount = percent4       // 进度
                  this.listData[i].IsClass = 3              // 修改当前对应的步骤
                }
                return
              }
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      onControl(item) {     // 销控
        if (item.IsClass < 2) {   // 是否完成签约
          this.$message.error('请先完成签约')
          return
        }
        this._SalesControl(item.EstateID)
        this.meltData = item
        this.dialogVisible3 = true
        this.options6 = []        // 先清空
        
      },
      _SalesControl(EstateID) {      // 获取销控数据
        this.options6 = []        // 先清空
        this.RoomID = []
        SalesControl(EstateID).then((res) => {
          if (res.data.result === 'success') {
            let log = null,
                min = null;

            res.data.data.forEach(value => {      // 处理数据
              log = {
                value: value.label,
                label: value.BuildingName,
                children: []
              }

              value.children.forEach(value => {
                min = {
                  value: value.label,
                  label: parseInt(value.RoomNo.substring(0, value.RoomNo.length - 2)) + 'F ' + value.RoomNo,
                  PropertyType: value.PropertyType
                }
                log.children.push(min)
              })
              this.options6.push(log)
            })
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      signConfirm() {     // 签约确定
        if (!this.RoomID.length) {
          this.$message.error('请选择房号')
          return
        }
        let RoomID = this.RoomID[this.RoomID.length - 1]
        let RoomNo = ''
        this.options6.forEach((item) => {
          for(let i = 0; i < item.children.length; i++) {
            if (item.children[i].value === RoomID) {
              this.signAcontract.PropertyType = item.children[i].PropertyType || ''
              RoomNo = item.label + ' ' + item.children[i].label
              return
            }
          }
        })
        this.signAcontract.Status = '在售'    // 需要传一个状态过去

        this.signAcontract.RoomID = RoomID
        this.signAcontract.RoomNo = RoomNo

        if (!verifyData(this.signAcontract.ContractNo, 'require')) {
          this.$message.error('请输入合同编号')
          return
        }
        if (!verifyData(this.signAcontract.CustName, 'require')) {
          this.$message.error('请输入客户姓名')
          return
        } 
        if (!verifyData(this.signAcontract.CustMobile, 'phone')) {
          this.$message.error('请输入客户完整电话')
          return
        } 
        if (!this.signAcontract.picSrc) {
          this.$message.error('请上传合同文件')
          return
        }
        // 禁止重复请求
        if (this.isSignConfirmOne) {
          return
        }
        this.isSignConfirmOne = true
        this.loaderCenter.show('正在签约')
        InsertSubscriptionContract(this.signAcontract).then((res) => {
          this.loaderCenter.hide()
          this.isSignConfirmOne = false
          this.dialogVisible2 = false
          if (res.data.result === 'success') {
            this.$message.success('签约成功！')
            // 成功后清空
            this.signAcontract.ContractNo = ''
            this.signAcontract.picSrc = ''
            this.RoomID = []
            this.iconLoadingPlus = 'el-icon-plus'

            // 手动修改进度
            for (let i = 0; i < this.listData.length; i++) {
              if (this.listData[i].EstateID === this.signAcontract.EstateID) {
                this.listData[i].ReserveDate = res.data.datestr
                // if (this.listData[i].percentCount < percent3) {
                //   this.listData[i].percentCount = percent3       // 进度
                //   this.listData[i].IsClass = 2              // 修改当前对应的步骤
                // }
                // 去掉了销控，直接跳到3
                if (this.listData[i].percentCount < percent4) {
                  this.listData[i].percentCount = percent4       // 进度
                  this.listData[i].IsClass = 3              // 修改当前对应的步骤
                }
                return
              }
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      readFile(e, type) {     // 合同图片
        let _this = this
        e = event || e
        var reader = new FileReader()
        this.iconLoadingPlus = 'el-icon-loading'
        this.loaderCenter.show('正在上传')
        reader.onload = (function(file) {
          return function(e) {
            let image = new Image()
            image.src = this.result

            image.onload = function () {
              // let lo_pic = imageCompress(image, 0.6)
              // let sm_pic = imageCompress(image, 0.8, 200, 153)
              let sm_pic = DrawImageToBase(image, 240, 184)
              let pic = DrawImageToBase(image, 1024, 1331)

              ImgUpLoad(pic, sm_pic).then((res) => {
                _this.loaderCenter.hide()
                // console.log(res)
                if (res.data.result === 'success') {
                  if (type === '签约') {
                    _this.signAcontract.picSrc = res.data.path
                  } else if (type === '跟进') {
                    _this.followImgData.pic = res.data.path
                  }
                } else {
                  _this.signAcontract = {}
                  _this.followImgData = {}
                  _this.$message.error(res.data.msg)
                }
                _this.iconLoadingPlus = 'el-icon-plus'
              })
            }
          }
        })(e.target.files[0])
        reader.readAsDataURL(event.target.files[0])
      },
      onSign(item) {      // 打开签约弹窗
        if (item.IsClass < 1) {         // 是否完成接待
          this.$message.error('请先完成接待')
          return
        }
        this.iconLoadingPlus = 'el-icon-plus'     // 先把图片改为上传状态
        this.dialogVisible2 = true
        this._SalesControl(item.EstateID)   // 获取房号

        this.signAcontract.EstateID = item.EstateID
        this.signAcontract.EstateName = item.EstateName
        this.signAcontract.InquiryID = item.InquiryID
        this.signAcontract.DeptID = item.VisitOpDeptID
        this.signAcontract.EmpID = item.VisitOpEmpID
        this.signAcontract.CustMobile = ''
        this.signAcontract.CustName = ''
        this.signAcontract.VisitOpEmpName = item.VisitOpEmpName

        // 下面仅供显示
        this.placeholders.CustMobile = item.CustMobile
        this.placeholders.CustName = item.CustName
      },
      executeReception(type) {    // 接待
        let obj = {
          EmpName: '',
          EmpID: '',
          Tel: '',
          ReceptionType: type,                // 接待类型
          DeclareID: this.negotiateObj.DeclareID   // 报备ID
        }
        // if (type === '自接') {
        //   obj.EmpName = this.negotiateObj.DeclareEmpName
        //   obj.EmpID = this.negotiateObj.DeclareID
        //   obj.Tel = this.negotiateObj.DeclareEmpTel
        // }

        if (type === '指派') {    // 如果是指派的话要处理一下
          if (!this.selectRece) {   // 判断是否选中人
            this.$message.error('请先选择要指派的人')
            return
          }
          let diff = {}
          for (let i = 0; i < this.options5.length; i++) {  // 根据ID拿人员其它数据
            if (this.options5[i].EmpID === this.selectRece) {
              diff.EmpName = this.options5[i].EmpName
              diff.EmpID = this.options5[i].EmpID
              diff.Tel = this.options5[i].Tel
            }
          }
          obj.EmpName = diff.EmpName
          obj.EmpID = diff.EmpID
          obj.Tel = diff.Tel
        }
        this._upNegotiate(obj)
      },
      _upNegotiate(obj) {   // 发送接待请求
        this.$confirm(`确定${obj.ReceptionType}吗？`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.loaderCenter.show(obj.ReceptionType + '中')
          up_Negotiate(obj).then((res) => {
            this.loaderCenter.hide()
            // console.log(res)
            if (res.data.result === 'success') {
              this.$message.success(`${obj.ReceptionType}成功！`)
              this.dialogVisible1 = false
              this.selectRece = ''      // 清空指派人员

              for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].DeclareID === res.data.DeclareID) {
                  // 判断是自接还是指派，根据不同的操作，手动修改对应的待人姓名
                  if (obj.ReceptionType === '指派') {
                    this.listData[i].ReceptionOpEmpName = obj.EmpName
                  } else if (obj.ReceptionType === '自接') {
                    this.listData[i].ReceptionOpEmpName = this.listData[i].DeclareEmpName
                  } else if (obj.ReceptionType === '接待') {
                    this.listData[i].ReceptionOpEmpName = res.data.OpEmpName
                  }
                  this.listData[i].ReceptionCount = parseInt(this.listData[i].ReceptionCount) + 1  // 接待次数加1
                  if (this.listData[i].percentCount < percent2) {
                    this.listData[i].percentCount = percent2       // 进度
                    this.listData[i].IsClass = 1              // 修改当前对应的步骤
                  }
                  return
                }
              }
            } else {
              this.$message.error(res.data.msg)
            }
          })
        }).catch(() => {})
      },
      onReception(item) {   // 接待
        // console.log(item)
        this.negotiateObj = item    // 先全部保存起来，等到对于操作的时候再筛出来
        this.dialogVisible1 = true
        SelectNegotiatePersonByEstate(item.EstateID).then((res) => {   // 获取可指派人员
          if (res.data.result === 'success') {
            this.options5 = res.data.tempTable
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      cuntPercent(data) {  // 计算当前进度
        // 15到访  39接待 60签约 100销控
        // 限制进度，不能跳级，但是可以重复之前的操作
        // IsClass 1接待  2签约  3销控

        let arr = []
        data.forEach((item) => {
          item.percentCount = percent1      // 默认都是到访15
          item.IsClass = 0
          if (item.ReceptionCount && item.ReceptionCount !== '0') {
            item.percentCount = percent2
            item.IsClass = 1
          }
          if (item.ReserveDate && item.ReserveDate !== '0') {
            item.percentCount = percent3
            item.IsClass = 2
          }
          if (item.ReserveRoomNo && item.ReserveRoomNo !== '0') {
            item.percentCount = percent4
            item.IsClass = 3
          }
          arr.push(item)
        })
        return arr
      },
      listTouchStart (e, index) {
        this.touch.index = index      // 把当前操作的列表保存在touch中

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = ''
          this.touchLeft = ''
          return
        }
        this.touch.initiated = true
        this.touch.current = e.currentTarget    // 当前元素，event输出是null，但是单独输出就有
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      listTouchMove (e) {
        if (!this.touch.initiated) {      // 开关
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
          this.touch.sides = false
          return
        }

        // 判断是左还是右
        if (deltaX < -40) {
          this.touch.sides = 'r'
        } else if (deltaX > 40) {
          this.touch.sides = 'l'
        } else {
          this.touch.sides = false
        }

        let excur = Math.max(Math.min(deltaX, 90), -90)    // 取最大值和最小值
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`    // 同步滑动
      },
      listTouchEnd () {
        if (!this.touch.initiated) {      // 开关
          return
        }
        // 要么左，要么右，要么全部清除掉
        this.touch.current.style.transition = 'all .3s linear'      // 放手的时候添加过渡
        setTimeout(() => {      // 加延迟可以防止跳动
          this.touch.current.style[transform] = null
        }, 30)
        if (this.touch.sides === 'r') {
          this.touchLeft = this.touch.index
          this.touchRight = ''
        } else if (this.touch.sides === 'l') {
          this.touchLeft = ''
          this.touchRight = this.touch.index
        } else {
          this.touchRight = ''
          this.touchLeft = ''
        }
      },
      upLoad() {      // 上滑加载更多
        if (!this.hasMore) {
          return
        }
        this.paramsItem.page++
        SelectVisitByEstate(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            let datas = this.cuntPercent(res.data.tempTable)
            this.listData = this.listData.concat(datas)   // 拼在一起
            this._checkMore(datas)
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _SelectVisitByEstate() {    // 数据列表
        this.touchRight = ''    // 滑动还原
        this.touchLeft = ''

        this.listData = []
        this.paramsItem.page = 1
        this.hasMore = true     // 加载中
        SelectVisitByEstate(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            this.listData = this.cuntPercent(res.data.tempTable)
            this._checkMore(this.listData)
            this.resultcount = res.data.resultcount       // 总共多少条数据
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch((error) => {
          this.$message.error('网络异常：' + error)
        })
      },
      _checkMore(data) {    // 判断是否拿到更多数据
        if (!data.length || data.length < 10) {
          this.hasMore = false
          return
        }
      },
      _getEstate() {     // 获取楼盘数据
        getEstate().then((res) => {
          if (res.data.result === 'success') {
            this.options2 = res.data.tempTable
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      smPath(paths) {
        if (!paths || !vipfgj) {
          return paths
        }
        if (paths.includes('sm_')) {
          return `${vipfgj}${paths}`
        } else {
          let resol = paths.split('/')
          let leng = resol.length - 1
          resol[leng] = 'sm_' + resol[leng]
          let join = resol.join('/')
          return `${vipfgj}${join}`
        }
      },
      onDeptName(newVal) {      // 选中的部门
        if (newVal.length) {
          let len = newVal.length
          let SDeptNo = newVal[len - 1].split(',')[1]
          this.paramsItem.SDeptNo = SDeptNo
          this._SelectVisitByEstate()
        } else {
          this.paramsItem.SDeptNo = ''      // id全部等于空
          this._SelectVisitByEstate()
        }
        this._visibleMake()
      },
      visibleChange(bool) {   // 下拉框出现/隐藏时触发
        this.IsMake = bool
      },
      _visibleMake() {    // 打开选项，显示遮罩
        this.isOneDeptName ? '' : this.isOneDeptName = true
        setTimeout(() => {
          let cascader = this.elCascader    // 部门用的是cascader
          let aSelect = this.elSelect
          let IsOff = false

          if (classie.hasClass(cascader, 'is-opened')) {
            IsOff = true
          }
          for (let i = 0; i < aSelect.length; i++) {
            if (classie.hasClass(aSelect[i], 'is-focus')) {
              IsOff = true
            }
          }
          // console.log(IsOff)
          if (IsOff) {
            this.IsMake = true
          } else {
            this.IsMake = false
          }
        }, 30)
      },
      query(likestr) {   // 搜索
        this.paramsItem.likestr = likestr
        this._SelectVisitByEstate()   // 去筛选
      },
      back() {        // 返回
        this.$router.back()
      }
    },
    watch: {
      EstateID(newVal) {      // 监听楼盘
        if (newVal && newVal !== ' ') {
          this.paramsItem.EstateID = newVal
        } else {
          delete this.paramsItem.EstateID
        }
        this._SelectVisitByEstate()   // 去筛选
      },
      filing(newVal) {      // 监听时段
        if (newVal && newVal !== ' ') {
          this.paramsItem.filing = newVal
        } else {
          delete this.paramsItem.filing
        }
        this._SelectVisitByEstate()   // 去筛选
      },
      order(newVal) {      // 监听排序
        if (newVal && newVal !== ' ') {
          this.paramsItem.order = newVal
        } else {
          delete this.paramsItem.order
        }
        this._SelectVisitByEstate()   // 去筛选
      }
    },
    components: {
      SelectDeptName,
      Scroll,
      Search,
      Empty,
      Loader,
      LoaderCenter
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .lc-reception {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 100%;
    text-align: left;
    background-color: #f5f5f5;
    .header {
      position: relative;
      z-index: 2;
      text-align: center;
      .add-a {
        right: 10px;
        padding: 0;
        color: #fff;
        .el-button {
          padding: 8px 14px;
        }
      }
    }
    .color-bg {
      position: relative;
      background-color: #f5f5f5;
    }
    .search-wrap {
      z-index: 2;
    }
    .screen {
      position: relative;
      z-index: 5;
      display: flex;
      width: 100%;
      // @include border-b-1px(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      .branch {
        flex: 1;
        overflow: hidden;
        .el-input__inner {
          text-align: center;
          border: 0;
        }
      }
      .branch-menu {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5A5E66;
        .text {
          padding-right: 4px;
          font-size: 14px;
        }
      }
    }
    .scroll-area {
      position: absolute;
      top: 140px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    .list-wrap {
      overflow: hidden;
      padding: 10px 5px;
      background-color: #f5f5f5;
    }
    .list {
      position: relative;
      margin-bottom: 10px;
      &.trans-left {
        transform: translate3d(-90px, 0, 0) !important;
      }
      &.trans-right {
        transform: translate3d(90px, 0, 0) !important;
      }
      .list-center {
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
      }
      .top {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        .name {
          display: flex;
          flex-direction: column;
          line-height: 1.4;
          .cust-name {
            min-width: 42px;
            font-size: 14px;
            color: #606266;
          }
          .nick-name {
            font-size: 12px;
            color: #909399;
          }
        }
        .mobile {
          flex: 1;
          padding-left: 15px;
          font-size: 14px;
          color: #606266;
        }
        .needll-name {
          position: relative;
          padding-left: 5px;
          color: #409EFF;
          &:after {
            content: '';
            position: absolute;
            top: -5px;
            left: -5px;
            right: -5px;
            bottom: -5px;
          }
        }
        .dept-name {
          padding-left: 10px;
          font-size: 14px;
          @include text-over();
        }
      }
      .schedule {
        background: #409EFF;
        .progress-wrap {
          position: relative;
          display: flex;
          align-items: center;
          padding: 10px;
          .title {
            padding-right: 15px;
            font-size: 14px;
            color: #fff;
          }
          .progress {
            width: 100%;
            flex: 1;
          }
          .plan {
            display: flex;
            justify-content: space-around;
            padding-top: 4px;
            font-size: 12px;
            color: #fff;
            .plan-text {
              position: relative;
            }
            .count {
              display: block;
              position: absolute;
              top: -17px;
              left: 50%;
              margin-left: -7px;
              padding: 1px;
              // width: 14px;
              min-width: 12px;
              height: 12px;
              border-radius: 12px;
              font-size: 10px;
              background-color: #F56C6C;
              text-align: center;
              line-height: 12px;
              box-sizing: content-box;
            }
          }
        }
      }
      .info-wrap {
        display: flex;
        padding: 10px;
        @include border-b-1px(0)
      }
      .info-left {
        flex: 1;
        .time-num {
          font-size: 14px;
          color: #303133;
        }
        .time-last {
          padding-top: 10px;
          font-size: 14px;
          color: #909399;
          .small {
            color: #606266;
          }
        }
      }
      .info-right {
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        @include border-l-1px(0);
        .title {
          font-size: 14px;
          color: #303133;
        }
      }
      .report {
        display: flex;
        justify-content: space-between;
        padding: 10px;
        .text-left {
          font-size: 14px;
          color: #909399;
          .name {
            padding-left: 10px;
            color: #606266;
          }
        }
        .text-right {
          font-size: 14px;
          color: #606266;
        }
      }
      .list-btn-l {
        display: flex;
        position: absolute;
        top: 0;
        padding: 0 10px 0 5px;
        left: -90px;
        width: 90px;
        .button {
          flex: 1;
        }
      }
      .list-btn-r {
        display: flex;
        position: absolute;
        top: 0;
        right: -90px;
        width: 90px;
        padding: 0 5px 0 10px;
        .button {
          flex: 1;
        }
      }
      .list-btn-l,
      .list-btn-r {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height: 100%;
        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          border-radius: 4px;
          font-size: 16px;
          color: #fff;
          &.upimg {
            margin-bottom: 10px;
            background-color: #33be85;
          }
          &.follow {
            background-color: #509dec;
          }
          &.contract {
            background-color: #67ce67;
          }
          &.control {
            background-color: #ff2255;
          }
        }
        .iconfont {
          display: black;
          padding-bottom: 4px;
          font-size: 28px;
        }
      }
    }
    .lc-mask {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 4;
      // background-color: rgba(255, 255, 255, .5);
    }
  }
</style>
