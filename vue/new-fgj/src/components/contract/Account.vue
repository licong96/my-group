<template lang="html">
  <!-- 对账单 -->
  <section class="lc account">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">对账单</h3>
      <span class="right-span" @click="save"><el-button type="primary" size="small">保存</el-button></span>
    </header>
    <!-- 选择公司和楼盘 -->
    <section class="company">
      <ul class="list-wrap">
        <li class="list">
          <span class="name">公司：</span>
          <div class="input-wrap dept-opacity">
            <el-cascader
              placeholder="搜索公司简称"
              :options="SDeptNo"
              v-model="SDeptNoVal"
              popper-class="account-cascader"
              filterable
              clearable
              :show-all-levels="false"
              :change-on-select="true"
              @focus="focusDepar"
              @change="changeDepar">
            </el-cascader>
          </div>
        </li>
      </ul>
      <el-button type="primary" class="add-contract" @click="onShowImport">插入合同</el-button>
    </section>
    <!-- 合同数据 -->
    <section class="contract">
      <div class="item" v-for="(item, index) in contractData" :key="index">
        <!-- 伸展title -->
        <sideslip
          ref="sideslips"
          :item="item" 
          :touchSides="touchSides"
          :paramRight="paramRight"
          :previousEl="previousEl"
          @onTouchSides="onTouchSides"
          @previous="previous"
          @onTouchStart="onTouchStart"
          >
          <div slot="center" class="title" @click="hasShow(item)">
            <span class="name">合同号：</span>
            <div class="input-wrap">
              <p class="el-input__inner contract-no">{{item.ContractNo}}</p>
            </div>
            <span class="arrow">
              <i class="el-icon-arrow-down" :class="{'rotate': item.isShow}"></i>
            </span>
          </div>
          <!-- 右侧按钮 -->
          <div class="side-right" slot="right" :style="paramRight.style" @touchstart.stop>
            <span class="button yellow" :style="paramRight.btnStyle1" @click="viewContract(item.ContractID)">合同预览</span>
            <span class="button red" :style="paramRight.btnStyle2" @click="closeContract(index)">删除</span>
          </div>
        </sideslip>  
        <ul class="list-wrap" v-show="item.isShow">
          <li class="list">
            <span class="name">客户名称：</span>
            <div class="input-wrap">
              <el-input v-model="item.CustName" readonly placeholder="请输入客户名称"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">房号：</span>
            <div class="input-wrap">
              <el-input v-model="item.Address" readonly placeholder="请输入房号"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">面积 (㎡)：</span>
            <div class="input-wrap">
              <el-input v-model="item.Square" readonly placeholder="请输入面积"></el-input>
            </div>
            <span class="unit">㎡</span>
          </li>
          <li class="list">
            <span class="name">合同总价：</span>
            <div class="input-wrap">
              <el-input v-model="item.Price" readonly placeholder="请输入合同总价"></el-input>
            </div>
            <span class="unit">万</span>
          </li>
          <li class="list">
            <span class="name">签约日期：</span>
            <div class="input-wrap">
              <el-input v-model="item.ContractDate" readonly placeholder="请输入签约日期"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">分成比例：</span>
            <div class="input-wrap">
              <el-input v-model="item.CommRate" readonly placeholder="请输入分成比例"></el-input>
            </div>
            <span class="unit">%</span>
          </li>
          <li class="list">
            <span class="name">公寓佣金：</span>
            <div class="input-wrap">
              <el-input v-model="item.Commission" clearable placeholder="请输入公寓佣金" @blur="onChangeReal(item)"></el-input>
            </div>
            <span class="unit">元</span>
          </li>
          <li class="list">
            <span class="name">垫付金额：</span>
            <div class="input-wrap">
              <el-input v-model="item.AdvancePrice" clearable placeholder="请输入垫付金额" @blur="onChangeReal(item)"></el-input>
            </div>
            <span class="unit">元</span>
          </li>
          <li class="list">
            <span class="name">扣除税点：</span>
            <div class="input-wrap">
              <el-input v-model="item.Taxation" clearable placeholder="请输入扣除税点" @blur="onChangeReal(item)"></el-input>
            </div>
            <span class="unit">%</span>
          </li>
          <!-- 实结佣金 = 公寓佣金 - 垫付客户金额 - 扣除税点 -->
          <li class="list">
            <span class="name">实结佣金：</span>
            <div class="input-wrap">
              <el-input v-model="item.RealCommission" placeholder="请输入实结佣金" @blur="onChangeReal(item)"></el-input>
            </div>
            <span class="unit">元</span>
          </li>
          <li class="list remark">
            <span class="name">备注：</span>
            <div class="input-wrap">
              <textarea class="textarea" rows="3" cols="6" v-model="item.Remark" placeholder="备注"></textarea>
            </div>
          </li>
        </ul>
      </div>
    </section>
    <!-- 合同号弹窗 -->
    <el-dialog
      title="选择合同号"
      custom-class="account-dialog"
      :visible.sync="isImport"
      width="80%">
      <div class="wrap-list">
        <p class="lists" v-for="(item, index) in contractNumber" :key="index" @click="onAddAccount(item.ContractNo)">{{item.ContractNo}}</p>
      </div>
      <p class="empty" v-show="!contractNumber.length">没有合同号</p>
    </el-dialog>
    <!-- 合同预览 -->
    <el-dialog
      title="合同预览"
      custom-class="account-dialog"
      :visible.sync="isViewContract"
      width="90%">
      <div class="view-contract">
        <ul class="info-wrap">
          <li class="info-list">
            <span class="title-weird">合同类别：</span>
            <span class="text">{{viewContractData.ContractKind}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">交易类型：</span>
            <span class="text">{{viewContractData.Trade}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">合同状态：</span>
            <span class="text">{{viewContractData.Status}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">合同日期：</span>
            <span class="text">{{viewContractData.ContractDate}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">合同编号：</span>
            <span class="text">{{viewContractData.ContractNo}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">归属人员：</span>
            <span class="text">{{viewContractData.DeptName}} {{viewContractData.EmpName}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">合同签约：</span>
            <span class="text">{{viewContractData.DeptNameM}} {{viewContractData.EmpNameM}}</span>
          </li>
          <li class="info-list-weird img-list" v-show="viewContractData.imageData">
            <div class="img-wrap" v-for="(item, index) in viewContractData.imageData" :key="index" @click="fullShowImg(index)">
              <img class="img" :src="smPath(item.PhotoPath)" alt="">
            </div>
          </li>
          <li class="info-list-weird">
            <span class="title">用途：</span>
            <span class="text">{{viewContractData.Usage}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">地址：</span>
            <span class="text">{{viewContractData.Address}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">面积 (㎡)：</span>
            <span class="text">{{viewContractData.Square}}㎡</span>
          </li>
          <li class="info-list-weird">
            <span class="title">售价 (万)：</span>
            <span class="text">{{viewContractData.Price}}万</span>
          </li>
          <li class="info-list-weird">
            <span class="title">单价 (元)：</span>
            <span class="text">{{viewContractData.PriceUnit}}元</span>
          </li>
          <li class="info-list-weird">
            <span class="title">房源编号：</span>
            <span class="text">{{viewContractData.PropertyNo}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">客户姓名：</span>
            <span class="text">{{viewContractData.CustName}}</span>
          </li>
          <li class="info-list-weird" v-show="viewContractData.CustMobile">
            <span class="title">客户手机：</span>
            <span class="text">{{viewContractData.CustMobile}}</span>
          </li>
          <li class="info-list-weird" v-show="viewContractData.CustTel">
            <span class="title">客户固话：</span>
            <span class="text">{{viewContractData.CustTel}}</span>
          </li>
          <li class="info-list-weird">
            <span class="title">业主姓名：</span>
            <span class="text">{{viewContractData.OwnerName}}</span>
          </li>
          <li class="info-list-weird" v-show="viewContractData.OwnerMobile">
            <span class="title">业主手机：</span>
            <span class="text">{{viewContractData.OwnerMobile}}</span>
          </li>
          <li class="info-list-weird" v-show="viewContractData.OwnerTel">
            <span class="title">业主固话：</span>
            <span class="text">{{viewContractData.OwnerTel}}</span>
          </li>
          <li class="info-list-weird" v-show="viewContractData.Content">
            <span class="title">备注：</span>
            <span class="text">{{viewContractData.Content}}</span>
          </li>
          <li class="info-list-weird">
            <h4 class="per-title">业绩分成人员</h4>
            <div class="per-center" v-for="(item, index) in ContractCommData" :key="index">
              <p class="row"><span class="name">人员：</span>{{item.DeptName}} - {{item.EmpName}}</p>
              <p class="row">
                <span class="name">款类：</span>
                <span class="small">{{item.FeeType}}</span>
                <span class="name">比例：</span>
                <span class="small">{{item.CommRate}}%</span>
              </p>
              <p class="row" v-show="item.Comment">
                <span class="name">说明：</span>{{item.Comment}}
              </p>
            </div>
          </li>
        </ul>
      </div>
    </el-dialog>
    <!-- 提示 -->
    <confirm ref="confirm" @confirm="onConfirm"></confirm>
    <!-- 等待 -->
    <loader-center ref="loaderCenter"></loader-center>
    <awesome-swiper :swiperData="swiperData" :initialSlide="initialSlide" ref="awesomeSwiper"></awesome-swiper>
  </section>
</template>

<script>
  import Confirm from '@/base/Confirm'
  import LoaderCenter from '@/base/LoaderCenter'
  import Sideslip from '@/base/Sideslip'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import { GetDepartmentJson } from '@/api/public'
  import { SelectByID } from '@/api/contract/contractAdd'
  import { SelectByContractID } from '@/api/contract/contractAddPer'
  import { GetContractByNo, InsertContractBillTran, GetContractBillByNo, UpContractBillTran, GetContractByDeptID } from '@/api/contract/account'
  import { verifyData } from '@/utils/index'
  import { vipfgj } from '@/common/js/config'

  export default {
    data() {
      return {
        touchSides: '',     // 滑动组件
        previousEl: null,
        paramRight: {
          isSides: true,      // 是否允许滑动
          style: {
            width:  '160px',
            right: '-160px',
          },
          btnStyle1: {
            width: '100px'
          },
          btnStyle2: {
            width: '60px'
          }
        },
        contractData: [   // 合同数据
          // {
          //   isShow: true,   // 展开和收起
          // }
        ],
        SDeptNo: [],        // 公司数据
        SDeptNoVal: [],     // 公司选中的值
        DeptID: '',        // 从公司选中的值中筛选出ID
        DeptName: '',      // 选中的公司名称
        EstateData: [],      // 楼盘数据
        contractNumber: [],   // 根据楼盘ID获取所有合同号
        isImport: false,      // 打开合同号弹窗
        ContractBillNo: '',     // 如果有对账单号，并且没有t=i就是编辑
        ContractDept: [],       // 默认部门值，有就是快速创建，而不是编辑
        isOnceAccount: false,     // 限制每次只插入一次合同
        viewContractData: {},     // 预览合同数据
        ContractCommData: [],     // 预览合同业绩分成数据
        isViewContract: false,     // 预览合同弹窗
        swiperData: [],       // 图片全屏预览
        initialSlide: 0,      // 图片预览下标
      }
    },
    created() {
      this.ContractBillNo = this.$route.query.id
      this.ContractDept = this.$route.query.d       // 部门，这里是一个字符串
      if (this.ContractDept) {
        this.DeptID = this.ContractDept.split(',')[0]   // 保存部门ID
      }

      // 编辑
      if (this.ContractBillNo && !this.ContractDept) {
        this._GetContractBillByNo(this.ContractBillNo)
      }
      // 快速创建 
      else if (this.ContractBillNo && this.ContractDept) {
        console.log(this.DeptID)
        this._GetContractByNo(this.ContractBillNo, this.DeptID)
      }
      this._GetDepartmentJson()
    },
    mounted() {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenter     // 提示元素全局保存
      })
    },
    methods: {
      onTouchStart(item) {      // 开始的时候，要判断当前这条数据的状态，能显示多少按钮和大小
        console.log(item.status)
      },
      previous(el) {
        this.previousEl = el
      },
      onTouchSides(Bool) {
        this.touchSides = Bool
      },
      clearTouchEl() {
        this.touchSides = ''
        this.previousEl.el.style[transform] = `translate3d(0, 0, 0)`    // 清除上一个
      },
      onChangeReal(item) {      // 计算实结佣金
        if (verifyData(item.Commission, 'number-dot') && verifyData(item.AdvancePrice, 'number-dot') && verifyData(item.Taxation, 'number-dot')) {
          let RealCommission = item.Commission - item.AdvancePrice - item.Taxation
          this.$set(item, 'RealCommission', RealCommission)
        }
      },
      _GetContractBillByNo(ContractBillNo) {      // 获取要编辑的对账号数据
        GetContractBillByNo(ContractBillNo).then(res => {
          if (res.data.result === 'success') {
            this.contractData = res.data.tempTable

            // 编辑时选中的部门
            var data = res.data.tempTable[0]
            this.SDeptNoVal = [`${data.DeptID},${data.DeptNo},${data.DeptType}`]
            this.changeDepar(this.SDeptNoVal)
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
      _UpContractBillTran(content, ContractBillNo) {      // 编辑对账号
        this.isOnceAccount = false
        UpContractBillTran(content, ContractBillNo).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            
            this.$refs.confirm.show({type: 'list', text: '编辑成功！是否去对账单列表？'})
          } 
          else {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
        })
      },
      save() {      // 保存
        if (!this.contractData.length) {
          this.$message.error('请添加对账单')
          return
        }
        if (!this.DeptID) {
          this.$message.error('请选择公司')
          return
        }

        let content = ''
        // 批量新增，拼接成一个字符串，项之间用，分割 合同之间用|分割  顺序和单个插入一样
        let contractData = this.contractData 
        for (let i = 0; i < contractData.length; i++) {
          let item = contractData[i]

          if (item.Commission && !verifyData(item.Commission, 'number-dot')) {
            this.$message.error('公寓佣金必须是数字')
            return
          }
          if (item.AdvancePrice && !verifyData(item.AdvancePrice, 'number-dot')) {
            this.$message.error('垫付客户金额必须是数字')
            return
          }
          if (item.Taxation && !verifyData(item.Taxation, 'number-dot')) {
            this.$message.error('扣除税点必须是数字')
            return
          }
          if (item.RealCommission && !verifyData(item.RealCommission, 'number-dot')) {
            this.$message.error('实结佣金必须是数字')
            return
          }

          // 实结佣金 = 公寓佣金 - 垫付客户金额 - 扣除税点
          // item.RealCommission = item.Commission - item.AdvancePrice - item.Taxation

          let single = ''     // 单个数据，注意顺序
          let obj = {}
          obj.ContractID = item.ContractID
          obj.DeptID = this.DeptID        // 注意这里是全局公司ID也叫部门ID
          obj.Commission = item.Commission
          obj.AdvancePrice = item.AdvancePrice
          obj.Taxation = item.Taxation
          obj.RealCommission = item.RealCommission
          obj.Remark = item.Remark
          for (var key in obj) {
            single += obj[key] ? obj[key] + ',' : ' ' + ','
          }
          content += single + '|'
        }

        if (this.isOnceAccount) {   // 禁止执行多次的位置很重要
          return
        }
        this.isOnceAccount = true
        this.loaderCenter.show()
        if (this.ContractBillNo && !this.ContractDept) {       // 有ID并且没有传部门就是编辑，否则就是添加
          this._UpContractBillTran(content, this.ContractBillNo)
        } 
        else {
          this._InsertContractBillTran(content)
        }
      },
      _InsertContractBillTran(content) {   // 新增对账单批量
        InsertContractBillTran(content).then(res => {
          this.isOnceAccount = false
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            // 成功之后清除合同数据
            this.contractData = []
            this.$refs.confirm.show({type: 'list', text: '新增成功！是否去对账单列表？'})
            this._empty()
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else if (res.data.result === 'error') {
            this.$message.error(res.data.msg)
          }
          this.loaderCenter.hide()
        })
        .catch(err => alert('网络异常：' + err))
      },
      _GetContractByNo(number, DeptID) {      // 根据合同编号获取内容
        // console.log(number)
        GetContractByNo(number, DeptID).then(res => {
          this.isOnceAccount = false
          if (res.data.result === 'success') {
            var data = res.data.tempTable[0]
            this.contractData.push({
              isShow: true,         // 默认展开
              ContractNo: data.ContractNo,    // 合同号填进去
              ContractID: data.ContractID,   // 合同ID填进去
              CustName: data.CustName,
              CustMobile: data.CustMobile,
              Price: data.Price,
              ContractDate: data.ContractDate,
              Address: data.Address,
              Square: data.Square,
              CommRate: data.CommRate
            })
            
            this._empty()
            // 添加成功后，在合同选项里，删除这条合同号，防止重复添加
            let contNum = this.contractNumber
            for (let i = 0; i < contNum.length; i++) {
              if (number === contNum[i]) {
                contNum.splice(i, 1)
                return
              }
            }
          }
          else if (res.data.result === 'error') {
            this.$message.error(res.data.msg)
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      _empty() {     // 统一清空一些数据
        this.isImport = false
      },
      cancel() {    // 取消合同号
        this._empty()
      },
      onShowImport() {      // 打开合同号弹窗
        if (!this.DeptID) {
          this.$message.error('请先选择公司')
          return
        }
        let ContractID = ''
        let Status = '判单确认'
        this.contractData.forEach((item) => {
          ContractID += item.ContractID + ','
        })
        this._GetContractByDeptID(ContractID, this.DeptID, Status)
      },
      onAddAccount(number) {    // 插入合同号，也就是在data里面添加一条数据
        if (this.isOnceAccount) {
          return
        }
        this.isOnceAccount = true
        // 不能重复添加合同号
        var contr = this.contractData
        for (var i = 0, len = contr.length; i < len; i++) {
          if (number === contr[i].ContractNo) {
            this.$message.error('合同号已存在，不能重复添加')
            return
          }
        }
        this._GetContractByNo(number, this.DeptID)    // 根据合同号获取相关数据
      },
      _hasNumber(number) {      // 不能添加相同的合同
        var contr = this.contractData
        var bool = false
        for (var i = 0, len = contr.length; i < len; i++) {
          if (number === contr[i].ContractNo) {
            bool = true
          }
        }
        return bool
      },
      onConfirm(obj) {     // 提示确定事件
        if (obj.index || obj.index === 0) {
          this.contractData.splice(obj.index, 1)
        } 
        else if (obj.type === 'change') {    // 便更公司后清空
          this.contractData = []
        } 
        else if (obj.type === 'list') {   // 跳列表
          this.$router.push({
            path: '/accountList'
          })
        }
      },
      fullShowImg(index) {    // 预览图片
        this.swiperData = this.viewContractData.imageData
        this.initialSlide = index
        this.$refs.awesomeSwiper.show()
      },
      viewContract(contractID) {      // 预览合同
        this.loaderCenter.show('加载中')
        this._SelectByID(contractID)
        this._SelectByContractID(contractID)
      },
      _SelectByID(contractID) {   // 获取合同数据
        SelectByID(contractID).then(res => {
          this.viewContractData = res.data.tempTable[0]
          this.isViewContract = true

          // 处理图片
          if (this.viewContractData.PicSrc) {
            let arrImg = this.viewContractData.PicSrc.split('|')
            let arr = []
            arrImg.forEach(item => {
              if (item) {
                arr.push({PhotoPath: item})
              }
            })
            this.viewContractData.imageData = arr
          }
        })
      },
      _SelectByContractID(contractID) {     // 获取已添加的分成数据
        SelectByContractID(contractID).then(res => {
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            this.ContractCommData = res.data.tempTable
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
      closeContract(index) {   // 删除当前账单
        this.$refs.confirm.show({index: index, text: '是否删除这条账单？'})
      },
      hasShow(item) {   // 显示隐藏切换
        this.$set(item,'isShow', !item.isShow)
      },
      focusDepar() {      // 部门获得焦点时触发
        if (this.contractData.length && this.DeptID) {
          this.$refs.confirm.show({type: 'change', text: '变更公司会清除已添加的合同，确定吗？'})     // // 判断是否变更公司
        }
      },
      changeDepar(newVal) {    // 选中的部门
        // console.log(newVal)
        if (!newVal.length) {
          this.DeptID = ''
          return
        }
        let len = newVal.length
        this.DeptID = newVal[len - 1].split(',')[0]   // 同时保存部门id
      },
      _GetContractByDeptID(ContractID, DeptID, Status) {
        this.loaderCenter.show()
        GetContractByDeptID(ContractID, DeptID, Status).then(res => {
          if (res.data.result === 'success') {
            this.contractNumber = res.data.tempTable
            this.isImport = true
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
          this.loaderCenter.hide()
          alert('catch: ', err)
        })
      },
      _GetDepartmentJson() {    // 获取部门
        GetDepartmentJson(1).then(res => {
          if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.SDeptNo = res.data
            setTimeout(() => {
              if (this.ContractDept) {
                this.SDeptNoVal = [this.ContractDept]   // 这里是一个字符串
                this.changeDepar(this.SDeptNoVal)
              }
            }, 30)
          }
        })
      },
      smPath(paths) {
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
      back() {
        this.$router.back()
      }
    },
    components: {
      Confirm,
      LoaderCenter,
      Sideslip,
      AwesomeSwiper
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/mixin";
  @import "../../common/sass/variable";

  .account {
    min-height: 100%;
    background-color: $color-gray;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
    }
    .company {
      padding: 60px 0 15px 0;
      background-color: #fff;
      .list {
        .name {
          min-width: 50px;
        }
      }
    }
    .add-contract {
      margin-top: 16px;
    }
    .contract {
      margin-top: 10px;
      padding-bottom: 20px;
      .contract-no {
        line-height: 40px;
        text-align: left;
      }
      .item {
        margin-top: 10px;
        .name {
          line-height: 40px;
        }
        .title {
          display: flex;
          @include border-b-1px(0);
          background-color: #fff;
          .input-wrap {
            flex: 1;
            padding-left: 10px;
          }
          .arrow {
            width: 40px;
            height: 40px;
            font-size: 20px;
            color: #999;
            line-height: 40px;
            i {
              transition: all .3s;
            }
          }
          i.rotate {
            transform: rotate(-180deg);
            transform-origin: center;
          }
        }
      }
    }
    .list-wrap {
      position: relative;
      padding: 0 15px 10px 15px;
      background-color: #fff;
      .dept-opacity {
        position: relative;
        // z-index: 3;
        // opacity: 0;
      }
      .dept-name {
        // @include border-b-1px(0);
        position: absolute;
        top: -6px;
        left: 0;
        z-index: 2;
        width: 100%;
        font-size: 14px;
        background-color: #fff;
        text-align: center;
      }
    }
    .list {
      display: flex;
      align-items: center;
      padding-top: 5px;
      .name {
        display: inline-block;
        min-width: 76px;
        font-size: 14px;
        color: #5A5E66;
        text-align: right;
      }
      .input-wrap {
        flex: 1;
        margin-left: 10px;
        @include border-b-1px(0);
        &.margin-null {
          margin: 0;
          padding-left: 10px;
        }
      }
      .unit {
        flex: 1;
        display: inline-block;
        height: 40px;
        color: #666;
        line-height: 40px;
        @include border-b-1px(0);
      }
    }
    .remark {
      .name {
        align-self: flex-start;
      }
    }
    .textarea {
      border: 0;
      padding: 10px;
      width: 100%;
      height: 120px;
      font-size: 14px;
      line-height: 1.4;
      border: 1px solid rgba(203, 203, 203, 0.6);
      resize: none;
      outline: none;
    }
    .import-input {
      @include border-b-1px(0);
      .el-input__inner {
        text-align: center;
      }
    }
    .account-dialog {
      .wrap-list {
        @include border-b-1px(0);
        .lists {
          font-size: 16px;
          color: #333;
          line-height: 40px;
          text-align: center;
          @include border-b-1px(100%);
        }
      }
      .empty {
        line-height: 40px;
        font-size: 14px;
        color: #999;
      }
    }
    .view-contract {
      text-align: left;
      .info-wrap {
        display: flex;
        flex-wrap: wrap;
        .info-list {
          width: 50%;
          padding: 6px 0;
          .title {
            font-size: 14px;
            color: #83868f;
          }
          .text {
            font-size: 14px;
            color: #0c0d0e;
          }
        }
        .info-list-weird {
          overflow: hidden;
          width: 100%;
          padding: 6px 0;
          background-color: #fff;
          font-size: 14px;
          .title {
            width: 75px;
            color: #83868f;
          }
          .text {
            flex: 1;
            color: #0c0d0e;
          }
        }
        .img-list {
          display: flex;
          flex-wrap: wrap;
        }
        .img-wrap {
          overflow: hidden;
          justify-content: center;
          display: flex;
          align-items: center;
          margin-right: 10px;
          width: 100px;
          height: 100px;
        }
        .img {
          width: 100%;
          vertical-align: top;
        }
      }
      .per-title {
        font-size: 14px;
        color: $color-blue;
        @include border-b-1px(0);
      }
      .per-center {
        padding: 4px 16px;
        @include border-b-1px(0);
        .row {
          color: #333;
        }
        .name {
          font-size: 14px;
          color: #999;
        }
        .small {
          padding-right: 30px;
        }
      }
    }
  }
</style>
