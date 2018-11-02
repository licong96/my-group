<template lang="html">
  <!-- 合同录入 -->
  <section class="lc contract-add">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">合同录入</h3>
      <span class="right-span" v-if="!FlagDeleted" :class="{'disabled': isOnceUpload}" @click="save"><el-button type="primary" size="small">保存</el-button></span>
      <span class="right-span flage-delete" v-show="FlagDeleted">已作废</span>
    </header>
    <div class="place"></div>
    <div class="main-con" v-show="isLoaderShow">
      <section class="info info-1">
        <ul class="list-wrap">
          <li class="list">
            <span class="name">合同类别：</span>
            <div class="input-wrap">
              <el-select v-model="param.ContractKind" placeholder="请选择">
                <el-option v-for="(item, index) in ContractKindData" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">交易类型：</span>
            <div class="input-wrap">
              <el-select v-model="param.Trade" placeholder="请选择交易类型">
                <el-option v-for="(item, index) in TradeData" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">合同状态：</span>
            <div class="input-wrap">
              <el-select v-model="param.Status" placeholder="请选择合同状态">
                <el-option v-for="(item, index) in StatusData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
              </el-select>
            </div>
          </li>
        </ul>
      </section>
      <section class="info info-2">
        <ul class="list-wrap">
          <li class="list">
            <span class="name">合同日期：</span>
            <!-- 默认选中今天 -->
            <div class="input-wrap">
              <p class="el-input__inner date" @click="openRemindTime">{{param.ContractDate}}</p>
              <mt-datetime-picker
                ref="picker"
                type="date"
                @confirm="RemindConfirm">
              </mt-datetime-picker>
            </div>
          </li>
          <li class="list">
            <span class="name">合同编号：</span>
            <div class="input-wrap">
              <el-input v-model="param.ContractNo" :disabled="!!ContractID" :clearable="!ContractID" placeholder="输入合同编号" @blur="_checkContractNoOnly(param.ContractNo)"></el-input>
            </div>
          </li>
          <!-- <li class="list">
            <span class="name">归属人员：</span>
            <div class="input-wrap" @click="onShowDeptEmp('dept')">
              <el-input v-model="DeptEmpText" readonly placeholder="请选择归属人员"></el-input>
            </div>
          </li> -->
          <li class="list">
            <span class="name">合同签约：</span>
            <div class="input-wrap" @click="onShowDeptEmp('sing')">
              <el-input v-model="ContractText" readonly placeholder="请选择签约人员"></el-input>
            </div>
          </li>
        </ul>
      </section>
      <section class="contract-img">
        <ul class="list-wrap">
          <li class="list" v-for="(item, index) in contractinputImage" :key="index" v-show="contractinputImage.length">
            <i class="el-icon-error" @click="removeImgUrl(index)"></i>
            <div class="img-wrap" @click="fullShowImg(index)">
              <img class="img" :src="smPath(item.PhotoPath)" alt="">
            </div>
          </li>
          <li class="list add">
            <input class="file" v-if="isWeChats" @click="onUploadPic">
            <input class="file" v-else type="file" accept="image/*" @change="readFile($event)">
            <i class="add-icon el-icon-plus"></i>
          </li>
        </ul>
      </section>
      <section class="info info-3">
        <ul class="list-wrap">
          <li class="list">
            <span class="name">用途：</span>
            <div class="input-wrap">
              <el-select v-model="param.Usage" placeholder="请选择用途">
                <el-option v-for="(item, index) in UsageData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">楼盘：</span>
            <div class="input-wrap" @click="onOpenEstate">
              <el-input v-model="param.EstateName" readonly placeholder="请选择楼盘"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">房号：</span>
            <div class="input-wrap" @click="onOpenRoom">
              <el-input v-model="RoomText" readonly placeholder="请选择房号"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">地址：</span>
            <div class="input-wrap">
              <el-input v-model="param.Address" readonly placeholder="地址"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">面积 (㎡)：</span>
            <div class="input-wrap">
              <el-input v-model="param.Square" @blur="onChangeSquare" clearable placeholder="输入面积"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">售价 (万)：</span>
            <div class="input-wrap">
              <el-input v-model="param.Price" @blur="onChangePrice" clearable placeholder="输入面积售价"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">单价 (元)：</span>
            <div class="input-wrap">
              <el-input v-model="param.PriceUnit" @blur="onChangePriceUnit" clearable placeholder="自动计算单价"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">房源编号：</span>
            <div class="input-wrap">
              <el-input v-model="param.PropertyNo" readonly placeholder="输入房源编号"></el-input>
            </div>
          </li>
        </ul>
      </section>
      <section class="info info-4">
        <h3 class="title">客户资料填写↓</h3>
        <ul class="list-wrap">
          <li class="list">
            <span class="name">姓名：</span>
            <div class="input-wrap">
              <el-input v-model="param.CustName" clearable placeholder="输入客户姓名"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">手机：</span>
            <div class="input-wrap">
              <el-input v-model="param.CustMobile" clearable placeholder="输入客户手机"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">固话：</span>
            <div class="input-wrap">
              <el-input v-model="param.CustTel" clearable placeholder="输入客户固话"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">地址：</span>
            <div class="input-wrap">
              <el-input v-model="param.CustAdd" clearable placeholder="输入联系地址"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">证件：</span>
            <div class="input-wrap">
              <el-input v-model="param.CustCard" clearable placeholder="输入身份证号"></el-input>
            </div>
          </li>
        </ul>
      </section>
      <section class="info info-4">
        <h3 class="title">业主资料填写↓</h3>
        <ul class="list-wrap">
          <li class="list">
            <span class="name">姓名：</span>
            <div class="input-wrap">
              <el-input v-model="param.OwnerName" clearable placeholder="输入业主姓名"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">手机：</span>
            <div class="input-wrap">
              <el-input v-model="param.OwnerMobile" clearable placeholder="输入业主手机"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">固话：</span>
            <div class="input-wrap">
              <el-input v-model="param.OwnerTel" clearable placeholder="输入业主固话"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">地址：</span>
            <div class="input-wrap">
              <el-input v-model="param.OwnerAdd" clearable placeholder="输入联系地址"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">证件：</span>
            <div class="input-wrap">
              <el-input v-model="param.OwnerCard" clearable placeholder="输入身份证号"></el-input>
            </div>
          </li>
        </ul>
      </section>
      <section class="info info-5">
        <ul class="list-wrap">
          <li class="list">
            <span class="name">备注：</span>
            <div class="input-wrap">
              <el-input type="textarea" v-model="param.Content" placeholder="备注"></el-input>
            </div>
          </li>
        </ul>
      </section>
      <!-- 审核意见 -->
      <section class="audit" :class="{'pd-bottome': ContractID}">
        <ul class="list-wrap">
          <li class="list" v-show="AuditNote1">
            <p class="title">初审意见：</p>
            <p class="text">{{AuditNote1}}</p>
          </li>
          <li class="list" v-show="AuditNote2">
            <p class="title">复审意见：</p>
            <p class="text">{{AuditNote2}}</p>
          </li>
        </ul>
      </section>
    </div>
    <loader desc="正在获取合同数据..." v-show="!isLoaderShow"></loader>
    <!-- 选项检索部门 -->
    <transition name="transY">
      <section class="select-box" v-show="isSelectDeptEmp">
        <div class="se-header">
          <i class="el-icon-close close" @click="onCloseDeptEmp"></i>检索部门
        </div>
        <search placeholder="搜索部门或人员" @query="query"></search>
        <div class="content">
          <ul>
            <li class="item" 
              v-for="(item, index) in DeptEmpData" 
              :key="index" 
              @click="onChangeDeptEmp(item, index)"
              :class="{'active': currentSelectDeptEmp===index}">
              <span class="space">{{item.DeptName}}</span>
              <span class="space">{{item.EmpName}}</span>
              <i class="el-icon-check check"></i>
            </li>
          </ul>
          <loader v-show="isLoader"></loader>
          <empty desc="没有找到相关人员" v-show="!isLoader && !DeptEmpData.length"></empty>
        </div>
      </section>
    </transition>
    <!-- 选项检索楼盘 -->
    <transition name="transY">
      <section class="select-box" v-show="isSelectEstate">
        <div class="se-header">
          <i class="el-icon-close close" @click="onCloseEstate"></i>检索楼盘
        </div>
        <search ref="searchEstate" placeholder="搜索楼盘" @query="queryEstate"></search>
        <div class="content">
          <ul>
            <li class="item" 
              v-for="(item, index) in EstateData" 
              :key="index" 
              @click="onChangeEstate(item, index)"
              :class="{'active': currentSelectEstate===index}">
              {{item.EstateName}}
              <i class="el-icon-check check"></i>
            </li>
          </ul>
          <loader v-show="isLoader"></loader>
          <empty v-show="!isLoader && !EstateData.length"></empty>
        </div>
      </section>
    </transition>
    <!-- 选项检索房号 -->
    <transition name="transY">
      <section class="select-box room" v-show="isSelectRoom">
        <div class="se-header">
          <i class="el-icon-close close" @click="onCloseRoom"></i>销控数据
        </div>
        <div class="content">
          <ul>
            <li class="item" 
              v-for="(item, index) in RoomData" 
              :key="index" 
              @click="onChangeRoom(item, index)"
              :class="{'active': currentSelectRoom===index}">
              <span class="space">{{item.BuildingName}}</span>
              <span class="space">{{item.floor}}</span>
              <span class="space">{{item.RoomNo}}</span>
              <i class="el-icon-check check"></i>
            </li>
          </ul>
          <loader v-show="isLoader"></loader>
          <empty v-show="!isLoader && !RoomData.length"></empty>
        </div>
      </section>
    </transition>
    <loader-center ref="loaderCenters"></loader-center>
    <confirm ref="confirms" @confirm="onConfirm"></confirm>
    <awesome-swiper :swiperData="swiperData" :initialSlide="initialSlide" ref="awesomeSwiper"></awesome-swiper>
    <!-- 编辑的时候显示操作按钮 -->
    <section class="operating" v-show="ContractID && isLoaderShow" v-if="!FlagDeleted">
      <el-button type="danger" class="oper-btn" @click="cancellation">作废</el-button>
      <el-button type="primary" class="oper-btn" :class="{'disabled': Audit!=='0'}" @click="firstTrial">初审</el-button>
      <el-button type="success" class="oper-btn" :class="{'disabled': Audit!=='1'}" @click="repeatTrial">复审</el-button>
      <el-button type="warning" class="oper-btn" :class="{'disabled': Audit!=='2'}" @click="reverseTrial">反审</el-button>
      <el-button type="primary" class="oper-btn" @click="openChild('per')">业绩</el-button>
      <el-button type="primary" class="oper-btn" @click="openChild('fin')">财务</el-button>
    </section>
    <!-- 子路由 -->
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import wx from 'weixin-js-sdk'
  import Loader from '@/base/Loader'
  import Search from '@/base/Search'
  import Empty from '@/base/Empty'
  import LoaderCenter from '@/base/LoaderCenter'
  import Confirm from '@/base/Confirm'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import { 
    GetEstateByKey, 
    insertData, 
    GetEmployeeInfoByPara, 
    GetSalesDateToSelect, 
    checkContractNoOnly, 
    upContract, 
    SelectByID 
  } from '@/api/contract/contractAdd'
  import { ImgUpLoad, SelectByName, initjsapi, SaveWxImgFile } from '@/api/public'
  import { DrawImageToBase } from '@/utils/picReduce'
  import { SelectByContractID } from '@/api/contract/contractAddPer'
  import { imageOnload, filesBase64, parseTime, verifyData, isWeChat } from '@/utils/index'
  import { getCookies } from '@/utils/auth'
  import { vipfgj } from '@/common/js/config'
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        ContractID: '',     // 有ContractID就是编辑
        param: {        // 要上传的数据
          todo: 'Contract',
          type: 'insertData',
          valiurl: document.URL,
          needpurview: true,
          ContractKind: '',
          Trade: '',
          Status: '',
          ContractDate: parseTime(new Date(), '{y}-{m}-{d}'),
          ContractNo: '',
          belongerID: '',     // 选中的归属人
          partiesID: '',      // 选中的签约人
          PicSrc: '',         // 图片
          Usage: '',
          EstateID: '',
          EstateName: '',
          Square: '',
          Price: '',
          PriceUnit: '',
          CustName: '',
          CustMobile: '',
          CustTel: '',
          CustAdd: '',
          CustCard: '',
          OwnerName: '',
          OwnerMobile: '',
          OwnerTel: '',
          OwnerAdd: '',
          OwnerCard: '',
          Content: '',
          ObjName: '',    // 归属人，部门名+空格+用户名
          DeptID: '',     // 归属人，部门ID
          EmpID: '',     // 归属人id
          DeptIDM: '',     // 签约人部门id
          EmpIDM: '',     // 签约人id
          RoomID: '',     // 房号ID
          Address: '',    // 地址：楼盘加房号
        },
        ContractKindData: [
          {
            label: '一手房',
            value: '一手房',
          }, {
            label: '二手房',
            value: '二手房',
          },
        ],
        TradeData: [
          {
            label: '认购书',
            value: '认购书',
          }, {
            label: '购房合同',
            value: '购房合同',
          }, {
            label: '出售',
            value: '出售',
          }, {
            label: '出租',
            value: '出租',
          },
        ],
        StatusData: [],
        contractinputImage: [],     // 图片
        UsageData: [],
        DeptEmpData: [],              // 归属人数据
        isSelectDeptEmp: false,       // 归属人员选择
        currentSelectDeptEmp: -1,     // 当前选中的归属人员选择下标
        DeptEmpText: '',            // 归属人显示文字
        ContractText: '',            // 合同人显示文字
        DeptEmpType: '',            // 归属人和合同人公用选择器状态
        EstateData: [],              // 楼盘数据
        isSelectEstate: false,       // 楼盘选择
        currentSelectEstate: -1,       // 当前选中的楼盘选择下标
        RoomData: [],              // 销控数据
        isSelectRoom: false,       // 销控选择
        currentSelectRoom: -1,       // 当前选中的销控选择下标
        RoomText: '',       // 拼接成用来显示的房号
        isOverflowHidden: false,      // 是否允许html滑动
        isLoader: false,        // 显示隐藏加载中
        isContractNo: false,      // 记录合同编号是否存在冲突
        Audit: '-1',      // 审核状态
        AuditNote1: '',  // 初审意见
        AuditNote2: '',  // 复审意见
        isOnceUpload: false,      // 只提交一次
        FlagDeleted: false,       // 记录合同是否作废了
        swiperData: [],       // 图片全屏预览
        initialSlide: 0,      // 图片预览下标
        isLoaderShow: true,      // 加载成功后再显示
        isWeChats: false,   // 是否微信打开
        weChatImage: {},    // 保存微信上传图片的数据
      }
    },
    created() {
      this._SelectByName('PropertyUsage')   // 返回用途数据
      this._SelectByName('ContractStatus')  // 返回合同状态

      if (isWeChat()) {   // 判断是否微信打开
        this.isWeChats = true
        this.initWeChat()
      } 
    },
    activated () {
      this.ContractID = this.$route.query.id
      if (this.ContractID) {
        this.isLoaderShow = false
        this._SelectByID(this.ContractID)     // 编辑
      } 
      else {
        // 新建的时候获取cookie数据填入签约人
        this._empty()   // 路由已被缓存，新建要清空
        this.param.DeptIDM = getCookies('CDeptID')
        this.param.EmpIDM = getCookies('CEmpID')
        this.ContractText = getCookies('CDeptName') + ' ' + getCookies('CEmpName')
        this._GetEstateByKey()
      }
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenters     // 提示元素全局保存
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
      onUploadPic() {   // 选择图片
        let weChatImage = this.weChatImage
        let _this = this
        wx.chooseImage({
          count: 5,   // 设置一次能选择的图片的数量
          sizeType: ['original'],   // 指定是原图还是压缩,默认二者都有 compressed：缩略图
          sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机,默认二者都有
          success: function(res) {   // 微信返回了一个资源对象
            console.log(res)　　　　　　　　　 // res.localIds 是一个数组　保存了用户一次性选择的所有图片的信息
            // 多张图上传，要悠着点了
            weChatImage.localIds = res.localIds
            weChatImage.length = res.localIds.length
            _this.ulLoadToWechat(0)   // 先来一张，里面用递归
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      ulLoadToWechat(index) {   // 上传到微信服务器
        let weChatImage = this.weChatImage
        let _this = this
        wx.uploadImage({
          localId: weChatImage.localIds[index],
          success: function(res) {  // 上传图片到微信成功的回调函数   会返回一个媒体对象  存储了图片在微信的id
            // console.log('上传成功返回值', res)
            _this.iconLoadingPlus = 'el-icon-loading'
            SaveWxImgFile(res.serverId).then(res => {
              _this.iconLoadingPlus = 'el-icon-plus'
              if (res.data.result === 'success') {
                _this.contractinputImage.push({PhotoPath: res.data.path})
              } else {
                _this.$message.error('图片上传失败！', res.data.msg)
              }
              //递归
              index++
              if (index < weChatImage.length) {
                _this.ulLoadToWechat(index)
              }
            })
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      _SelectByID(ContractID) {     // 根据合同id获取合同
        SelectByID(ContractID).then(res => {
          this.isLoaderShow = true
          Object.assign(this.param, res.data.tempTable[0])
          this.FlagDeleted = this.param.FlagDeleted     // 是否作废了
          let item = this.param
          
          this.$refs.searchEstate.setQuery(item.EstateName)   // 拿到数据后，再去搜索楼盘信息

          // 拼接数据以供显示
          this.DeptEmpText = item.DeptName + ' ' + item.EmpName
          this.ContractText = item.DeptNameM + ' ' + item.EmpNameM
          if (!item.ContractDate) {
            item.ContractDate = parseTime(new Date(), '{y}-{m}-{d}')
          }
          // 图片
          let arrPic = item.PicSrc.split('|')
          let arrImg = []
          arrPic.forEach(img => {
            if (img) {
              arrImg.push({PhotoPath: img})
            }
          })
          this.contractinputImage = arrImg
          // 把地址里面的房号拆出来显示
          let room = item.Address.split(' ')
          for (let i = 1; i < room.length; i++) {
            if (room[i]) {
              this.RoomText += room[i] + ' '
            }
          }
          // 房号数据
          GetSalesDateToSelect(item.EstateID, this.ContractID).then(res => {
            if (res.data.result === 'success') {
              this.RoomData = res.data.tempTable 
              let arrRoom = res.data.tempTable
              for (let i = 0; i < arrRoom.length; i++) {
                if (arrRoom[i].RoomID === item.RoomID) {
                  // console.log(i)
                  this.onChangeRoom(arrRoom[i], i)
                }
              }
            }
            else if (res.data.result === '权限不足') {
              this.$message.error('权限不足')
              setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
            }
          })
          // 审核数据
          this.Audit = item.Audit
          this.AuditNote1 = item.AuditNote1
          this.AuditNote2 = item.AuditNote2
        })
      },
      onConfirm(callback) {   // 操作确定提醒
        if (callback.type === 'cance') {    // 合同作废
          let obj = {
            Status: '退单作废',
            FlagDeleted: '1'
          }
          this._auditUpContract(obj)
        } 
        else if (callback.type === 'removeImg') {   // 删除图片
          this.contractinputImage.splice(callback.index, 1)
        }
      },
      cancellation() {      // 作废
        this.$refs.confirms.show({type: 'cance', text: '确定作废吗？'})
      },
      firstTrial() {      // 初审
        if (this.Audit !== '0') {
          return
        }
        this.$prompt('请输入你的审核意见：', '初审', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (!verifyData(value, 'require')) {
            this.$message.error('内容不能为空')
            return
          }
          let date = parseTime(new Date())
          this.AuditNote1 += value + '-->' + date
          let obj = {
            Audit: '1',
            AuditNote1: value,
            AuditDate: date
          }
          this._auditUpContract(obj)
        }).catch(() => {})
      },
      repeatTrial() {      // 复审
        if (this.Audit !== '1') {
          return
        }
        this.$prompt('请输入你的复审意见：', '复审', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(({ value }) => {
          if (!verifyData(value, 'require')) {
            this.$message.error('内容不能为空')
            return
          }
          let date = parseTime(new Date())
          this.AuditNote2 += value + '-->' + date
          let obj = {
            Audit: '2',
            AuditNote2: value,
            AuditDate: date
          }
          this._auditUpContract(obj)
        }).catch(() => {})
      },
      reverseTrial() {      // 反审
        if (this.Audit !== '2') {
          return
        }
        let obj = {
          Audit: '0',
          AuditDate: parseTime(new Date())
        }
        this._auditUpContract(obj)
      },
      _auditUpContract(obj) {    // 审核操作
        let param = Object.assign({
          todo: 'Contract',
          type: 'upContract',
          valiurl: document.URL,
          needpurview: true,
          ContractID: this.ContractID
        }, obj)
        upContract(param).then(res => {
          if (res.data.result === 'success') {
            if (param.Audit === '1') {
              this.Audit = '1'
              this.$message.success('初审成功')
            } 
            else if (param.Audit === '2') {
              this.Audit = '2'
              this.$message.success('复审成功')
            }
            else if (param.Audit === '0') {
              this.Audit = '0'
              this.$message.success('反审成功')
            }
            else if (param.FlagDeleted === '1') {
              this.$message.success('成功作废！')
            }
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
      openChild(path) {     // 打开子页面
        this.$router.push({
          path: '/contractList/ContractAdd/' + path,
          query: {
            id: this.ContractID
          }
        })
      },
      save() {        // 保存
        // 保存之前先判断状态是不是判断确认，再判断分成比例是否100%
        if (this.param.Status === '判单确认') {
          this._SelectByContractID()
        } 
        else {
          this.saveUpdate()
        }
      },
      saveUpdate() {
        if (this.ContractID) {      // 有 ContractID 就去编辑，否则就去创建
          this._upContract()
          return
        }
        if (this.isContractNo) {   // 先判断是否检查过合同，检查过就直接去创建，否则再检查
          this._insertData()    // 去创建合同
        } else {
          // 先去检测合同是否存在
          this.loaderCenter.show()
          checkContractNoOnly(this.param.ContractNo, this.param.EstateID).then(res => {
            if (res.data.result === 'success') {      // 允许新建合同
              this._insertData()    // 去创建合同
            }
            else if (res.data.result === '权限不足') {
              this.$message.error('权限不足')
              setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
            }
            else if (res.data.result === 'faild') {    // 合同已存在
              this.$message.error('合同已存在，请修改合同编号')
            }
            this.loaderCenter.hide()
          })
        }
      },
      _insertData() {          // 新建合同
        let param = Object.assign({}, this.param)

        if (!this._requiredParam(param)) {      // 必填项
          return
        }
        
        param.ObjName = param.DeptName + ' ' + param.EmpName        // 归属人
        let pic = ''
        this.contractinputImage.forEach((item) => {     // 拼接图片
          if (item) {
            pic += item.PhotoPath + '|'
          }
        })
        param.PicSrc = pic
        if (this.isOnceUpload) {
          return
        }
        this.isOnceUpload = true
        this.loaderCenter.show()
        insertData(param).then(res => {
          if (res.data.result === 'success') {
            this.$message.success('合同录入成功！')
            this._empty()
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
          this.isOnceUpload = false
        }).catch(err => alert('异常：' + err))
      },
      _upContract() {     // 编辑合同
        let param = Object.assign({}, this.param)
        if (!this._requiredParam(param)) {      // 必填项
          return
        }
        // 不要上传审核意见
        param.AuditNote1 = ''
        param.AuditNote2 = ''
        param.ObjName = param.DeptName + ' ' + param.EmpName        // 归属人
        let pic = ''
        this.contractinputImage.forEach((item) => {     // 拼接图片
          if (item) {
            pic += item.PhotoPath + '|'
          }
        })
        param.PicSrc = pic
        param.type = 'upContract'     // 编辑的type和新建的不一样
        if (this.isOnceUpload) {
          return
        }
        this.isOnceUpload = true
        this.loaderCenter.show()
        upContract(param).then(res => {
          if (res.data.result === 'success') {
            this.$message.success('修改成功')

            // 修改成功之后，列表页面对应的数据也要同步更新
            this.setContractOneData(param)
          } 
          else {
            this.$message.error(res.data.msg)
          }
          this.isOnceUpload = false
          this.loaderCenter.hide()
        })
      },
      _requiredParam(param) {    // 必填项
        if (!param.ContractKind) {
          this.$message.error('请选择合同类别')
          return false
        }
        if (!param.Trade) {
          this.$message.error('请选择交易类型')
          return false
        }
        if (!param.Status) {
          this.$message.error('请选择合同状态')
          return false
        }
        if (!param.ContractNo) {
          this.$message.error('输入合同编号')
          return false
        }
        // if (!param.EmpID) {
        //   this.$message.error('请选择归属人员')
        //   return false
        // }
        if (!param.EmpIDM) {
          this.$message.error('请选择签约人员')
          return false
        }
        if (!param.Usage) {
          this.$message.error('请选择用途')
          return false
        }
        if (!param.EstateName) {
          this.$message.error('请选择楼盘')
          return false
        }
        if (!param.RoomID) {
          this.$message.error('请选择房号')
          return false
        }
        if (!verifyData(param.Square, 'number-dot')) {
          this.$message.error('请输入面积，只能是数字')
          return false
        }
        if (!verifyData(param.Price, 'number-dot')) {
          this.$message.error('请输入售价，只能是数字')
          return false
        }
        if (!verifyData(param.PriceUnit, 'number-dot')) {
          this.$message.error('请单价售价，只能是数字')
          return false
        }
        if (!param.CustMobile && !param.CustTel) {
          this.$message.error('请输入客户手机号或固话')
          return false
        }
        if (param.CustMobile) {
          if (!verifyData(param.CustMobile, 'phone')) {
            this.$message.error('手机号格式有误')
            return false
          }
        }
        if (!param.OwnerMobile && !param.OwnerTel) {
          this.$message.error('请输入业主手机号或固话')
          return false
        }
        if (param.OwnerMobile) {
          if (!verifyData(param.OwnerMobile, 'phone')) {
            this.$message.error('手机号格式有误')
            return false
          }
        }
        return true
      },
      onChangeSquare() {
        let item = this.param
        if (verifyData(item.Square, 'number-dot') && verifyData(item.PriceUnit, 'number-dot')) {
          let Price = (item.PriceUnit * item.Square / 10000).toFixed(2)
          this.$set(item, 'Price', Price)
          return    // 注意这里，如果两个值都存在，用单价计算总价即可
        }
        if (verifyData(item.Square, 'number-dot') && verifyData(item.Price, 'number-dot')) {
          let PriceUnit = (item.Price * 10000 / item.Square).toFixed(2)
          this.$set(item, 'PriceUnit', PriceUnit)
        }
      },
      onChangePrice() {     // 改变售价，计算单价 
        let item = this.param
        if (verifyData(item.Square, 'number-dot') && verifyData(item.Price, 'number-dot')) {
          let PriceUnit = (item.Price * 10000 / item.Square).toFixed(2)
          this.$set(item, 'PriceUnit', PriceUnit)
        }
      },
      onChangePriceUnit() {     // 改变单价，计算售价
        let item = this.param
        if (verifyData(item.Square, 'number-dot') && verifyData(item.PriceUnit, 'number-dot')) {
          let Price = (item.PriceUnit * item.Square / 10000).toFixed(2)
          this.$set(item, 'Price', Price)
        }
      },
      // 房号选项
      onChangeRoom(item, index) {
        console.dir(item)
        this.isSelectRoom = false
        this.isOverflowHidden = false
        this.currentSelectRoom = index
        this.param.RoomID = item.RoomID
        // 房号下面有面积、单价、和编号，用售价/面积=单价，数据里面没有值，就用房号里面的值
        if (!this.param.Square) {
          this.param.Square = item.Square
        }
        if (!this.param.Price) {
          this.param.Price = item.Price
        }
        if (!this.param.PriceUnit) {
          this.param.PriceUnit = (parseFloat(item.Price) * 10000 / parseFloat(item.Square)).toFixed(2)
        }
        this.param.PropertyNo = item.RoomNo
        // 拼接用来显示
        // console.log(item)
        this.RoomText = `${item.BuildingName} ${item.floor} ${item.RoomNo}`
        this.param.Address = `${this.param.EstateName}  ${this.RoomText}`
      },
      onCloseRoom() {
        this.isSelectRoom = false
        this.isOverflowHidden = false
      },
      onOpenRoom() {
        this.isSelectRoom = true
        this.isOverflowHidden = true
      },
      // 楼盘选项
      onChangeEstate(item, index) {   // 修改楼盘选择
        this.isOverflowHidden = false
        this.isSelectEstate = false
        this.currentSelectEstate = index
        this.currentSelectRoom = -1     // 改变楼盘的时候，还原房号下标
        this.param.EstateID = item.EstateID
        this.param.EstateName = item.EstateName
        this._GetSalesDateToSelect(item.EstateID)     // 根据楼盘ID去获取销控

        this._estateFillingOwner()      // 选中楼盘之后，把楼盘数据填入业主资料里
      },
      _estateFillingOwner() {     // 把楼盘数据填入业主资料
        let estateData = this.EstateData
        let item = this.param
        for (let i = 0; i < estateData.length; i++) {
          if (estateData[i].EstateID === item.EstateID) {
            console.log(estateData[i].DevCompany)
            item.OwnerName = estateData[i].DevCompany
            item.OwnerTel = estateData[i].DevTel
          }
        }
      },
      onCloseEstate() {     // 关闭楼盘选择
        this.isSelectEstate = false
        this.isOverflowHidden = false
      },
      onOpenEstate() {     // 打开楼盘选择
        this.isSelectEstate = true
        this.isOverflowHidden = true
      },
      queryEstate(newVal) {   // 搜索结果
        this._GetEstateByKey(newVal)
      },
      // 归属人员和签约人员选项
      onChangeDeptEmp(item, index) {        // 归属人员和合同签约人员
        // console.log(item)
        if (this.DeptEmpType === 'dept') {      // 归属人
          this.param.DeptID = item.DeptID
          this.param.DeptName = item.DeptName
          this.param.EmpID = item.EmpID
          this.param.EmpName = item.EmpName

          this.DeptEmpText = item.DeptName + ' ' + item.EmpName   // 拼接以供显示
        } 
        else {      // 合同人
          this.param.DeptIDM = item.DeptID
          this.param.EmpIDM = item.EmpID

          this.ContractText = item.DeptName + ' ' + item.EmpName    // 拼接以供显示
        }
        this.currentSelectDeptEmp = index
        this.isSelectDeptEmp = false
        this.isOverflowHidden = false
      },
      onCloseDeptEmp() {
        this.isSelectDeptEmp = false
        this.isOverflowHidden = false
      },
      onShowDeptEmp(type) {
        if (this.ContractID) {    // 如果是编辑状态，不允许修改签约人
          return
        }
        this.DeptEmpType = type
        this.isSelectDeptEmp = true
        this.isOverflowHidden = true
      },
      query(newVal) {   // 部门搜索结果
        // console.log(newVal)
        if (newVal) {
          this._GetEmployeeInfoByPara(newVal)
        }
      },
      openRemindTime() {    // 打开选择时间
        if(this.ContractID) {     // 如果是编辑状态，不允许修改日期
          return
        }
        this.$refs.picker.open()
      },
      RemindConfirm(time) {
        let times = parseTime(time, '{y}-{m}-{d}')     // 时间需要处理一下
        this.param.ContractDate = times
      },
      readFile(e) {     // 合同图片
        e = event || e
        this.VerifyPic = ''
        this.iconLoadingPlus = 'el-icon-loading'
        this.loaderCenter.show()
        filesBase64(e.target.files[0]).then(base => {     // 拿到图片
          return base
        }).then(base => {
          imageOnload(base).then(image => {
            let sm_pic = DrawImageToBase(image, 240, 160)     // 压缩
            return sm_pic
          }).then(sm_pic => {
            ImgUpLoad(base, sm_pic).then((res) => {            // 上传
              if (res.data.result === 'success') {
                this.contractinputImage.push({PhotoPath: res.data.path})
              } else {
                this.$message.error('图片上传失败！', res.data.msg)
              }
              this.loaderCenter.hide()
            })
            .catch(error => alert('操作失败！', error))
          })
          .catch(error => alert(error))
        })
        .catch(error => this.loaderCenter.hide())
      },
      removeImgUrl(index) {
        this.$refs.confirms.show({type: 'removeImg', index, text: '确定删除这张图片吗？'})
      },
      fullShowImg(index) {
        this.swiperData = this.contractinputImage
        this.initialSlide = index
        this.$refs.awesomeSwiper.show()
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj{join}` 是本地测试用的
        if (!paths) {
          return
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
      _checkContractNoOnly(ContractNo) {        // 这里只检测合同是否存在，并不做下一步操作
        this.isContractNo = false
        if (!this.ContractID && ContractNo) {     // 并且不是编辑修改的清空下
          checkContractNoOnly(ContractNo, this.param.EstateID).then(res => {
            this.isContractNo = false
            if (res.data.result === 'faild') {    // 合同已存在
              this.$message.error('合同已存在，请修改合同编号')
            }
            else if (res.data.result === 'success') {
              this.isContractNo = true
            }
          })
          .catch(err => alert('网络异常：' + err))
        }
      },
      _GetSalesDateToSelect(EstateID) {     // 根据楼盘ID获取销控
        GetSalesDateToSelect(EstateID).then(res => {
          if (res.data.result === 'success') {
            this.RoomData = res.data.tempTable
          } 
          else if (res.data.result === 'error') {     // 改变楼盘，没有数据，就清空
            this.RoomData = []
          }
          this.param.RoomID = ''
          this.RoomText = ''
          this.param.Address = ''
          this.param.Square = ''
          this.param.Price = ''
          this.param.PriceUnit = ''
          this.param.PropertyNo = ''
        })
        .catch(err => alert('网络异常：' + err))
      },
      _GetEstateByKey(key = '') {      // 关键字获取楼盘信息
        this.isLoader = true
        this.EstateData = []
        GetEstateByKey(key).then(res => {
          if (res.data.result === 'success') {
            this.EstateData = res.data.tempTable

            // 拿到楼盘后，如果没有业主资料，要把楼盘资料当默认的值填进去
            let estateData = res.data.tempTable
            let item = this.param
            for (let i = 0; i < estateData.length; i++) {
              if (estateData[i].EstateID === item.EstateID) {
                // 这一步还要判断值是否填写，没填才启用这个
                item.OwnerName = item.OwnerName ? item.OwnerName : estateData[i].DevCompany
                item.OwnerTel = item.OwnerTel ? item.OwnerTel : estateData[i].DevTel
              }
            }
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          this.isLoader = false
        }).catch(err => alert('异常：' + err))
      },
      _GetEmployeeInfoByPara(key) {       // 关键字获取部门人员数据
        this.isLoader = true
        this.DeptEmpData = []
        GetEmployeeInfoByPara(key).then(res => {
          if (res.data.result === 'success') {
            this.DeptEmpData = res.data.tempTable
          }
          this.isLoader = false
        })
        .catch(err => alert('网络异常：' + err))
      },
      _SelectByName(RefName) {        // 选项获取
        SelectByName(RefName).then(res => {
          if (RefName === 'PropertyUsage') {
            this.UsageData = res.data.tempTable
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.StatusData = res.data.tempTable
          }
        })
      },
      _SelectByContractID() {   // 已添加的分成数据
        this.loaderCenter.show()
        SelectByContractID(this.param.ContractID).then(res => {
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            let data = res.data.tempTable
            let answer = 0
            data.forEach(item => {
              if (item.FlagDeleted === 'False') {
                answer += parseFloat(item.CommRate)
              }
            })
            if (answer === 100) {   // 判断比例是不是100
              this.saveUpdate()
            } else {
              this.$message.error('业绩分成比例不是100%')
            }
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      back() {
        this.$router.back()
      },
      _empty() {      // 清空数据
        this.param = {
          todo: 'Contract',
          type: 'insertData',
          valiurl: document.URL,
          needpurview: true,
          ContractKind: '',
          Trade: '',
          Status: '',
          ContractDate: parseTime(new Date(), '{y}-{m}-{d}'),
          ContractNo: '',
          belongerID: '',     // 选中的归属人
          partiesID: '',      // 选中的签约人
          PicSrc: '',         // 图片
          Usage: '',
          EstateID: '',
          EstateName: '',
          Square: '',
          Price: '',
          PriceUnit: '',
          CustName: '',
          CustMobile: '',
          CustTel: '',
          CustAdd: '',
          CustCard: '',
          OwnerName: '',
          OwnerMobile: '',
          OwnerTel: '',
          OwnerAdd: '',
          OwnerCard: '',
          Content: '',
          ObjName: '',    // 归属人，部门名+空格+用户名
          DeptID: '',     // 归属人，部门ID
          EmpID: '',     // 归属人id
          DeptIDM: '',     // 签约人部门id
          EmpIDM: '',     // 签约人id
          RoomID: '',     // 房号ID
          Address: '',    // 地址：楼盘加房号
        }
        this.contractinputImage = []     // 图片
        this.DeptEmpText = ''            // 归属人显示文字
        this.ContractText = ''            // 合同人显示文字
        this.RoomText = ''       // 拼接成用来显示的房号
      },
      ...mapActions([
        'setContractOneData'
      ])
    },
    watch: {
      isOverflowHidden(newVal) {      // 监听isOverflowHidden值得变化，禁止滑动
        if (newVal) {
          document.getElementsByTagName('html')[0].style.overflow = 'hidden'
        } else {
          document.getElementsByTagName('html')[0].style.overflow = 'initial'
        }
      }
    },
    components: {
      Search,
      LoaderCenter,
      Loader,
      Empty,
      Confirm,
      AwesomeSwiper
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  @import '../../common/sass/variable';

  .contract-add {
    overflow-x: hidden;
    overflow-y: auto;
    -webkit-overflow-scrolling: touch;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    width: 100%;
    height: 100%;
    min-height: 100%;
    background-color: #f5f5f5;
    .header {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      z-index: 2010;
      .disabled {
        opacity: .6;
      }
    }
    .place {
      height: 45px;
      background-color: #f5f5f5;
    }
    .main-con {
      overflow: auto;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      top: 45px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    .info {
      margin-top: 10px;
      background-color: #fff;
      .title {
        padding: 12px;
        font-size: 16px;
        color: $color-blue;
        text-align: left;
        @include border-b-1px(0);
      }
      .list-wrap {
        padding: 0 12px;
      }
      .list {
        display: flex;
        align-items: center;
        padding-top: 4px;
        .name {
          display: inline-block;
          min-width: 70px;
          font-size: 14px;
          color: #5A5E66;
          text-align: right;
        }
        .input-wrap {
          flex: 1;
          @include border-b-1px(0);
        }
        .date {
          line-height: 40px;
          text-align: left;
        }
      }
    }
    .info-5 {
      margin-bottom: 20px;
      padding: 10px 0;
    }
    .audit {
      text-align: left;
      .list {
        margin: 10px;
        padding: 0 10px;
        box-shadow: 0 0 3px rgba(0, 0, 0, .1);
        background-color: #fff;
        .title {
          font-size: 16px;
          color: #333;
          line-height: 45px;
          @include border-b-1px(0);
        }
        .text {
          font-size: 14px;
          padding: 10px 0;
          line-height: 1.4;
        }
      }
    } 
    .contract-img {
      margin-top: 10px;
      padding: 10px 0;
      background-color: #fff;
      .list-wrap {
        display: flex;
        flex-wrap: wrap;
        margin-bottom: 10px;
        padding-left: 10px;
      }
      .list {
        position: relative;
        padding: 0;
        border: 1px dashed #d9d9d9;
        width: 120px;
        height: 80px;
        margin: 10px 8px 0 0;
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
        .add-icon {
          font-size: 24px;
          color: #d9d9d9;
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
    .select-box {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2222;
      background-color: #f5f5f5;
      .se-header {
        position: relative;
        z-index: 3;
        height: 40px;
        font-size: 16px;
        line-height: 40px;
        background-color: #fff;
        .close {
          position: absolute;
          top: 0;
          left: 0;
          width: 50px;
          font-size: 22px;
          color: #666;
          line-height: 40px;
          text-align: center;
        }
      }
      .search-wrap {
        height: auto;
      }
      .content {
        overflow: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        top: 90px;
        right: 0;
        bottom: 0;
        left: 0;
        z-index: 2;
        text-align: left;
        .item {
          position: relative;
          padding: 0 16px;
          line-height: 45px;
          @include border-b-1px(0);
          background-color: #fff;
          &.active {
            color: $color-blue;
            .check {
              display: block;
            }
          }
          .check {
            display: none;
            position: absolute;
            top: 0;
            right: 16px;
            font-size: 20px;
            font-weight: bold;
            color: $color-blue;
            line-height: 45px;
          }
          .space {
            margin-right: 4px;
          }
        }
      }
      &.room {
        .content {
          top: 50px;
        }
      }
    }
    .operating {
      position: absolute;
      bottom: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      background-color: #fff;
      box-shadow: 0 -1px 4px #e8e8e8;
      .oper-btn {
        margin: 6px;
        &.disabled {
          opacity: .5;
        }
      }
    }
    .pd-bottome {
      padding-bottom: 100px;
    }
    .flage-delete {
      font-size: 20px;
      font-weight: bold;
      color: $color-red;
    }
  }
</style>
