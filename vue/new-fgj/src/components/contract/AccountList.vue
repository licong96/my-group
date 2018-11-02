<template lang="html">
  <!-- 对账单列表 -->
  <section class="lc account-list">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">对账单列表</h3>
      <i class="el-icon-plus right-span" v-show="Verify==='1'" @click="openAccount"></i>
    </header>
    <!-- 搜索 -->
    <search ref="searchs" placeholder="关键字搜索" @query="query"></search>
    <!-- 筛选 -->
    <section class="screen">
      <div class="branch lc-sort">
        <Cascader
          :data="options1"
          placeholder="选择部门"
          v-model="SDeptNo"
          clearable
          change-on-select
          :render-format="format"
        ></Cascader>
      </div>
      <div class="branch estate">
        <Select v-model="EstateID" clearable placeholder="选择楼盘">
          <Option v-for="(item, index) in options2" :value="item.EstateID" :key="index">{{item.EstateName}}</Option>
        </Select>
      </div>
      <div class="branch estate">
        <Select v-model="Status" clearable placeholder="选择状态">
          <Option v-for="item in options3" :value="item.value" :key="item.value">{{item.label}}</Option>
        </Select>
      </div>
    </section>
    <!-- 数据列表 -->
    <div class="scroll-area">
      <scroll :data="listData" :bounce="bounce">
        <section class="list-wrap">
          <div class="list" v-for="(item, index) in listData" :key="index"
            :class="{'transLeft': index===touchLeft, 'transRight': index===touchRight}"
            @touchstart="listTouchStart($event, index, item.Status)"
            @touchmove.prevent="listTouchMove"
            @touchend="listTouchEnd"
            >
            <!-- 左边的按钮 -->
            <div class="list-btn-l">
              <span class="button brace" @click="_send(item, index)" v-show="Verify==='1' && ( item.Status !== '待生成' && item.Status !== '待审核' && item.Status !== '已审核')" v-text="textSend(item.Status)"></span>
              <span class="button valid" @click="_uploading(item, index)" v-if="Verify==='0'" v-show="item.Status==='待盖章' || item.Status==='已打回'">上传</span>
              <span class="button postpone" @click="_create(item, index)" v-show="Verify==='1' && (item.Status === '待生成' || item.Status === '待发送')">生成</span>
              <span class="button lc-follow" @click="_servants(item)" v-show="Verify==='1' && (item.Status === '已审核')">已结佣</span>
            </div>
            <!-- 中间的内容 -->
            <div class="list-center" @click="onPicSrc(item)">
              <div class="left">
                <h3 class="title">{{item.EstateName}}<span class="dept-name">{{item.DeptName}}</span></h3>
                <p class="desc">{{item.RegDate}}</p>
              </div>
              <div class="right">
                <h3 class="title">合同数：{{item.ContractNote}}</h3>
                <p class="desc" 
                  :class="{'status-1': item.Status==='待生成', 
                           'status-2': item.Status==='待发送', 
                           'status-3': item.Status==='待盖章',
                           'status-4': item.Status==='待审核',
                           'status-5': item.Status==='已审核',
                           'status-6': item.Status==='已打回'}" 
                  >{{item.Status}}</p>
                  <i class="el-icon-caret-bottom down-icon" :class="{'rotate': currentUpfold===index}"></i>
              </div>
              <div class="right-click" @click.stop="onUpfold(item, index)"></div>
            </div>
            <ul class="upfold" v-show="currentUpfold===index">
              <li class="up-list" v-for="(item, index) in upfoldData">
                <span class="desc">{{item.Address}}</span>
                <span class="desc">实结：{{ item.RealCommission | RealCommission }}</span>
              </li>
            </ul>
            <!-- 右边的按钮 -->
            <div class="list-btn-r">
              <span class="button edit" @click="_edit(item, index)" v-show="item.Status==='待生成' || item.Status==='待发送'">编辑</span>
              <span class="button lc-follow" @click="_audit(item, index)" v-show="Verify==='1' && item.Status=='待审核'">审核</span>
            </div>
          </div>
          <!-- 加载中 -->
          <loader v-show="hasMore"></loader>
          <!-- 什么都没有 -->
          <empty v-show="!hasMore && !listData.length"></empty>
        </section>
      </scroll>
    </div>
    <!-- 等待提醒 -->
    <loader-center ref="loaderCenter"></loader-center>
    <!-- 上传已盖章的合同 -->
    <el-dialog
      title="上传"
      :visible.sync="dialogUploader"
      width="90%"
      center
      :modal-append-to-body="false"
      :append-to-body="true"
      custom-class="dg-sign">
      <section class="dialog-sign">
        <div class="up-img">
          <input class="file" v-if="isWeChats" @click="onUploadPic">
          <input class="file" v-else type="file" accept="image/*" @change="readFile($event)">
          <img v-if="VerifyPic" :src="jointPath(VerifyPic)" class="avatar">
          <i v-else class="avatar-uploader-icon icon-large" :class="iconLoadingPlus"></i>
        </div>
        <p class="img-desc">上传图片</p>
      </section>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onUpLoadConfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 是否通过审核 -->
    <confirm ref="confirms" text="是否通过审核？" cancelBtnText="打回" confirmBtnText="通过" @cancel="onCancelAudit" @confirm="onConfirmAudit"></confirm>
    <!-- 已结佣 -->
    <confirm ref="confirmsTwo" @confirm="onConfirmServants"></confirm>
    <!-- 图片预览容器 -->
    <awesome-swiper :swiperData="swiperData" ref="awesomeSwiper"></awesome-swiper>
  </section>
</template>

<script>
  /*
  步骤：
    新增    等待生成
    生成    等待发送
    发送    等待盖章
    盖章上传   等待审核
    审核通过   已审核
    审核不通过  已打回  重复盖章上传到审核的状态

    已审核    已结佣
  注意：
    待生成和待发送的时候才允许编辑   否则不允许编辑修改
    状态为待盖章 和 已打回 才启用上传按钮

  Verify权限：
    Verify = 1 除了上传其他都可以
    Verify = 0 只能上传
  */
  
  import wx from 'weixin-js-sdk'
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Scroll from '@/base/BScroll'
  import Search from '@/base/Search'
  import LoaderCenter from '@/base/LoaderCenter'
  import Confirm from '@/base/Confirm'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import { GetDepartmentJson, estate, ImgUpLoad, initjsapi, SaveWxImgFile } from '@/api/public'
  import { GetContractBillData, ProducedContractBillPic, SendContractBill, UpContractBillPic, UpContractBillStatus } from '@/api/contract/accountList'  
  import { GetContractBillByNo } from '@/api/contract/account'
  import { prefixStyle, filesBase64, isWeChat } from '@/utils/index'
  import { vipfgj } from '@/common/js/config'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        options1: [],    // 部门数据
        options2: [],   // 楼盘数据
        options3: [     // 时段
          {
            value: "",
            label: "不限"
          },
          {
            value: "待生成",
            label: "待生成"
          },
          {
            value: "待发送",
            label: "待发送"
          },
          {
            value: "待盖章",
            label: "待盖章"
          },
          {
            value: "待审核",
            label: "待审核"
          },
          {
            value: "已审核",
            label: "已审核"
          },
          {
            value: "已打回",
            label: "已打回"
          }
        ],
        listData: [],    // 列表数据
        SDeptNo: [],     // 部门筛选，选中的值
        hasMore: false, // 数据加载中
        touch: {},       // 列表滑动
        touchLeft: '',    // 当前可以滑动的值 left
        touchRight: '',    // 当前可以滑动的值 right
        DeptID: '',       // 选中的部门ID
        EstateID: '',     // 楼盘筛选，选中的ID
        likestr: '',      // 搜索关键词
        Status: '',       // 状态
        Verify: '-1',       // 判断是哪方操作
        dialogUploader: false, // 上传合同弹窗
        VerifyPic: '',        // 上传合同图片地址
        upLoadContactBillNo: '',    // 上传合同的编号
        iconLoadingPlus: 'el-icon-plus',   // 图标上传状态和上传中状态的切换
        currentIndex: -1,      // 操作成功后，手动修改数据状态，这里记录哪条数据的下标
        swiperData: [],
        currentUpfold: -1,      // 展开显示一些信息
        upfoldData: [],         // 获取要展示的一些信息
        isWeChats: false,   // 是否微信打开
      }
    },
    created() {
      this.bounce = false     // 关闭弹动

      this._GetDepartmentJson()
      this._getEstate()

      if (isWeChat()) {   // 判断是否微信打开
        this.isWeChats = true
        this.initWeChat()
      }
    },
    activated() {
      let query = this.$route.query
      if (query.ContractBillNo) {      // 快速操作到对账单
        this.$refs.searchs.setQuery(query.ContractBillNo)
        this.likestr = query.ContractBillNo
      }
      this._GetContractBillData()     // 获取对账单列表
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenter     // 提示元素全局保存
      })
    },
    filters: {
      RealCommission(value) {
        return parseFloat(value).toFixed(2)
      }
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
        let _this = this
        wx.chooseImage({
          count: 1,   // 设置一次能选择的图片的数量
          sizeType: ['original'],   // 指定是原图还是压缩,默认二者都有 compressed：缩略图
          sourceType: ['album', 'camera'],  // 可以指定来源是相册还是相机,默认二者都有
          success: function(res) {   // 微信返回了一个资源对象
            _this.ulLoadToWechat(res.localIds[0])   // 只上传一张，就粗鲁一点了
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      ulLoadToWechat(localId) {   // 上传到微信服务器
        var _this = this
        wx.uploadImage({
          localId: localId,
          success: function(res) { // 上传图片到微信成功的回调函数   会返回一个媒体对象  存储了图片在微信的id
            // console.log('上传成功返回值', res)
            _this.iconLoadingPlus = 'el-icon-loading'
            SaveWxImgFile(res.serverId).then(res => {
              // console.log('返回的图片地址', res)
              _this.iconLoadingPlus = 'el-icon-plus'
              if (res.data.result === 'success') {
                _this.VerifyPic = res.data.path
              } else {
                _this.VerifyPic = ''
                _this.$message.error(res.data.msg)
              }
            })
          },
          fail: function(res) {
            alert(JSON.stringify(res));
          }
        })
      },
      openAccount() {     // 打开添加页面
        this.$router.push({
          path: '/account'
        })
      },
      _UpContractBillStatus(ContractBillNo, Status) {
        this.loaderCenter.show()
        UpContractBillStatus(ContractBillNo, Status).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            if (Status === '已审核') {
              this.listData[this.currentIndex].Status = '已审核'
            } 
            else if (Status === '已打回'){
              this.listData[this.currentIndex].Status = '已打回'
            } 
            else if (Status === '已结佣'){
              this.listData[this.currentIndex].Status = '已结佣'
            } 
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
        }).catch((error) => {
          alert('catch:', error)
        })
      },
      onConfirmAudit(obj) {      // 审核通过
        this._UpContractBillStatus(obj.ContractBillNo, '已审核')
      },
      onCancelAudit(obj) {     // 审核不通过
        this._UpContractBillStatus(obj.ContractBillNo, '已打回')
      },
      jointPath(path) {     // 拼接地址，用来预览图片，本地测试使用
        if (!path) {
          return
        }
        return `${vipfgj}${path}`
      },
      onUpLoadConfirm() {   // 确定上传合同图片
        if (!this.VerifyPic) {
          this.$message.error('请先上传合同图片')
          return
        }
        this.loaderCenter.show()
        UpContractBillPic(this.upLoadContactBillNo, this.VerifyPic).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            // 手动修改状态，并且清空一些数据
            this.listData[this.currentIndex].Status = '待审核'
            this.dialogUploader = false
            this.VerifyPic = ''
            this.upLoadContactBillNo = ''
            this.iconLoadingPlus = 'el-icon-plus'
            this._GetContractBillData()           // 图片上传之后重新获取数据，以更新跳转地址
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }  
          else {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
        }).catch((error) => {
          alert('catch:', error)
        })
      },
      readFile(e) {     // 合同图片
        e = event || e
        this.VerifyPic = ''
        this.iconLoadingPlus = 'el-icon-loading'
        this.loaderCenter.show()
        filesBase64(e.target.files[0]).then(base => {
          ImgUpLoad(base).then((res) => {
            if (res.data.result === 'success') {
              this.VerifyPic = res.data.path
            } else {
              this.VerifyPic = ''
              this.$message.error(res.data.msg)
            }
            this.iconLoadingPlus = 'el-icon-plus'
            this.loaderCenter.hide()
          })
        }).catch((error) => {
          alert('catch:', error)
        })
      },
      onUpfold(item, index) {      // 展开，去获取对应的数据
        if (this.currentUpfold === index) {
          this.currentUpfold = -1
        } 
        else {
          this.loaderCenter.show()
          GetContractBillByNo(item.ContractBillNo).then(res => {
            this.loaderCenter.hide()
            if (res.data.result === 'success') {
              this.upfoldData = res.data.tempTable
              this.currentUpfold = index
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
        }
      },
      onPicSrc(item) {      // 跳转
        // console.dir(item)
        if (item.PicSrc && (item.Status === '待发送' || item.Status === '待盖章' || item.Status === '已打回')) {   // 打开图片
          window.location.href = item.PicSrc
        } 
        else if (item.Status === '待审核' || item.Status === '已审核' || item.Status === '已结佣') {      // 打开对方上传的图片
          this.swiperData = [{ PhotoPath: item.VerifyPic }]
          this.$refs.awesomeSwiper.show()
        }
      },
      onConfirmServants(obj) {     // 确定结佣
        this._UpContractBillStatus(obj.ContractBillNo, '已结佣')
      },
      _servants(item) {     // 已结佣
        if (item.Status === '已审核') {
          this.$refs.confirmsTwo.show({text: '设置此状态会将相关合同状态设置为已结佣,是否继续？', ContractBillNo: item.ContractBillNo})
        }
      },
      _create(item, index) {     // 生成，发送出去后，就不能再生成了
        this.loaderCenter.show()
        ProducedContractBillPic(item.ContractBillNo).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            this.listData[index].Status = '待发送'
            this.currentIndex = index
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
        }).catch(err => {
          alert('catch', err)
        })
      },
      textSend(status) {
        return status === '已打回' ? '通知' : '发送'
      },
      _send(item, index) {         // 发送，只要不等于待生成，就一直能发送
        if (item.Status !== '待生成' && item.Status !== '待审核') {
          this.loaderCenter.show()
          SendContractBill(item.ContractBillNo).then(res => {
            if (res.data.result === 'success') {
              this.$message.success(res.data.msg)
              this.listData[index].Status = '待盖章'
              this.currentIndex = index
            } 
            else if (res.data.result === '权限不足') {
              this.$message.error('权限不足')
              setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
            }
            else {
              this.$message.error(res.data.msg)
            }
            this.loaderCenter.hide()
          }).catch(err => {
            alert('catch', err)
          })
        } else {
          this.$message.warning('当前状态不能发送')
        }
      },
      _uploading(item, index) {      // 上传
        if (item.Status === '待盖章' || item.Status === '已打回') {
          this.upLoadContactBillNo = item.ContractBillNo    // 保存到上传使用
          this.dialogUploader = true
          this.currentIndex = index
        } else {
          this.$message.warning('当前状态不能上传')
        }
      },
      _audit(item, index) {        // 审核
        if (item.Status === '待审核') {
          this.currentIndex = index
          this.$refs.confirms.show({ContractBillNo: item.ContractBillNo})
        } else {
          this.$message.warning('还没盖章上传，不能审核')
        }
      },
      _edit(item) {       // 编辑
        this.$router.push({
          path: '/account',
          query: {
            id: item.ContractBillNo     // 对账单号
          }
        })
      },
      listTouchStart (e, index, status) {
        this.touch.index = index      // 把当前操作的列表保存在touch中
        this.touch.status = status    // 保存状态

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
        var status = this.touch.status
        // 限制操作
        if (this.Verify === '0' && (status === '待生成' || status === '待发送' || status === '待审核' || status === '已审核')) {
          return
        }
        if (status === '已结佣') {
          return
        }
        if (!this.touch.initiated) {
          return
        }

        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
          this.touch.sides = false
          return
        }
        
        // 限制操作
        if (deltaX < 0 && this.Verify === '1' && status === '待盖章') {      // 待盖章，只能发送
          return
        }
        if (deltaX > 0 && this.Verify === '1' && status === '待审核') {     // 待审核，只能用审核功能，不能再左滑动
          return
        }
        if (deltaX < 0 && this.Verify === '1' && status === '已打回') {     // 已打回，只能用审核功能，不能再右滑动
          return
        }
        if (deltaX < 0 && this.Verify === '1' && status === '已审核') {     // 已审核，下一步已结佣
          return
        }
        
        // 判断是左还是右
        if (deltaX < -60 && this.Verify !== '0') {
          this.touch.sides = 'r'
        } else if (deltaX > 60) {
          this.touch.sides = 'l'
        } else {
          this.touch.sides = false
        }

        // 左右滑动限制
        let excur = 0
        if (this.Verify === '0') {
          excur = Math.max(Math.min(deltaX, 160), 0)    // 取最大值和最小值
        }
        else {
          excur = Math.max(Math.min(deltaX, 160), -160)    // 取最大值和最小值
        }

        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`    // 同步滑动
      },
      listTouchEnd () {
        if (!this.touch.initiated) {
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
      _GetContractBillData() {    // 数据列表
        this.touchRight = ''    // 滑动还原
        this.touchLeft = ''

        this.listData = []
        this.hasMore = true     // 加载中
        GetContractBillData(this.DeptID, this.EstateID, this.Status, this.likestr).then((res) => {
          if (res.data.result === 'success') {
            this.Verify = res.data.Verify
            // this.Verify = '0'   // 修改操作人，测试用
            this.listData = this._concatList(res.data.tempTable)
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          this.hasMore = false
        }).catch((error) => {
          alert('catch:', error)
        })
      },
      _concatList(arr) {   // 根据ContractBillNo对账单号 合并相同数据，显示合同数
        var data = []
        var obj = {}
        for (let i = 0; i < arr.length; i++) {
          if(!obj[arr[i].ContractBillNo]) {
            arr[i].ContractNote = 1
            obj[arr[i].ContractBillNo] = arr[i]
            data.push(arr[i])
          }
          else {
            data[data.length-1].ContractNote++
          }
        }
        return data
      },
      query(query) {     // 搜索
        this.likestr = query
        this._GetContractBillData()
      },
      format(labels, selectedData) {      // 下拉筛选部门，自定义显示
        const index = labels.length - 1;
        const data = selectedData[index] || false
        return labels[index]
      },
      _getEstate() {     // 获取楼盘数据
        estate().then((res) => {
          if (res.data.result === 'success') {
            this.options2 = res.data.tempTable
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _GetDepartmentJson() {    // 获取部门数据
        GetDepartmentJson().then((res) => {
          this.options1 = res.data
        })
      },
      back() {
        this.$router.back()
      }
    },
    watch: {
      SDeptNo(newVal) {      // 监听部门筛选
        // console.log(newVal)
        if (newVal.length) {
          let len = newVal.length
          let SDeptNo = newVal[len - 1].split(',')[0]
          this.DeptID = SDeptNo
          this._GetContractBillData()
        } else {
          this.DeptID = ''      // id全部等于空
          this._GetContractBillData()
        }
      },
      EstateID(newVal) {      // 监听楼盘
        this._GetContractBillData()   // 去筛选
      },
      Status(newVal) {      // 监听状态
        this._GetContractBillData()   // 去筛选
      }
    },
    components: {
      Loader,
      Empty,
      Scroll,
      Search,
      LoaderCenter,
      Confirm,
      AwesomeSwiper
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/variable';
  @import '../../common/sass/mixin';

  .account-list {
    overflow-x: hidden;
    width: 100%;
    min-height: 100%;
    .screen {
      position: relative;
      z-index: 2;
      text-align: left;
      display: flex;
      width: 100%;
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
      // overflow-x: hidden;
      overflow: hidden;
      position: absolute;
      top: 140px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      background-color: #f5f5f5;
    }
    .list-wrap  {
      padding-top: 10px;
      padding-bottom: 20px;
      .list {
        position: relative;
        background-color: #fff;
        &.transLeft {
          transform: translate3d(-160px, 0, 0) !important;
        }
        &.transRight {
          transform: translate3d(160px, 0, 0) !important;
        }
        @include border-b-1px(0);
      }
      .list-center {
        position: relative;
        display: flex;
        text-align: left;
        padding: 10px 16px;
        .left {
          flex: 2;
        }
        .right {
          flex: 1;
          position: relative;
          .down-icon {
            position: absolute;
            top: 0;
            right: 0;
            font-size: 16px;
            color: #999;
            transition: all .3s;
          }
          .rotate {
            transform: rotate(-180deg);
          }
        }
        .right-click {
          position: absolute;
          top: 0;
          right: 0;
          z-index: 3;
          width: 140px;
          height: 100%;
        }
        .title {
          font-size: 14px;
          color: #333;
          .dept-name {
            padding-left: 4px;
            font-size: 12px;
            color: #666;
          }
        }
        .desc {
          padding-top: 8px;
          font-size: 12px;
          color: #666;
          &.status-1 {
            color: #f2a12f;
          }
          &.status-2 {
            color: #ff2255;
          }
          &.status-3 {
            color: #00BCD4;
          }
          &.status-4 {
            color: #509dec;
          }
          &.status-5 {
            color: $color-green;
          }
          &.status-6 {
            color: $color-black;
          }
        }
        .down-btn {
          position: absolute;
          top: 0;
          right: 0;
        }
      }
      .upfold {
        border-bottom: 1px solid $color-blue;
        .up-list {
          display: flex;
          justify-content: space-around;
          padding: 8px 0;
          @include border-b-1px(100%);
          .desc {
            font-size: 14px;
            color: #555;
          }
        }
      }
      .list-btn-l {
        position: absolute;
        top: 0;
        left: -160px;
        width: 160px;
        display: flex;
        .button {
          flex: 1;
        }
      }
      .list-btn-r {
        position: absolute;
        top: 0;
        right: -160px;
        width: 160px;
        display: flex;
        .button {
          flex: 1;
          width: 80px;
        }
      }
      .list-btn-l,
      .list-btn-r {
        height: 100%;
        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          height: 100%;
          font-size: 16px;
          color: #fff;
          &.edit {
            background-color: #33be85;
          }
          &.lc-follow {
            background-color: #509dec;
          }
          &.brace {
            background-color: #ff2255;
          }
          &.postpone {
            background-color: #f2a12f;
          }
          &.valid {
            background-color: #67ce67;
          }
        }
      }
    }
    .icon-large {
      font-size: 20px;
    }
  }
</style>
