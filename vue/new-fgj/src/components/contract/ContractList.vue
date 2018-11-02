<template lang="html">
  <!-- 合同列表 -->
  <section class="lc contract-list">
    <header class="lc header" @touchmove.prevent>
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">合同列表</h3>
      <el-button class="right-btn" type="primary" @click="openAdd">新建</el-button>
    </header>
    <!-- 搜索 -->
    <search ref="search" placeholder="可查合同编号，客户电话，位置，业主，客户，签约部门，签约人" @query="query"></search>
    <!-- 筛选 -->
    <div class="b-screen">
      <ul class="screen-wrap">
        <li class="screen-list" :class="{'active': activeIndex === 0}" @click="_showScreen(0)">
          <span class="l-title">{{CurrentProcessText}}</span>
          <i class="el-icon-caret-bottom"></i>
        </li>
        <li class="screen-list" :class="{'active': activeIndex === 1}" @click="_showScreen(1)">
          <span class="l-title">{{StatusText}}</span>
          <i class="el-icon-caret-bottom"></i>
        </li>
        <li class="screen-list" :class="{'active': activeIndex === 2}" @click="_showScreen(2)">
          <span class="l-title">{{EstateIDText}}</span>
          <i class="el-icon-caret-bottom"></i>
        </li>
        <li class="screen-list" @click="openMore">
          <span class="text">更多筛选</span>
          <i class="el-icon-menu"></i>
        </li>
      </ul>
      <!-- 下拉筛选 -->
      <transition name="transYT">
        <div class="c-screen" v-show="isScreen">
          <scroll ref="screenScroll">
            <article class="radios">
              <!-- 流程 -->
              <div class="area" v-show="activeIndex === 0">
                <el-radio-group class="screen-full" v-model="paramsItem.CurrentProcess" @change="searchChanges('流程', 'CurrentProcess')">
                  <el-radio class="screen-list" label="">不限</el-radio>
                  <el-radio class="screen-list" :label="item.ProcessItemName" v-for="(item, index) in CurrentProcessData" :key="index">{{item.ProcessItemName}}</el-radio>
                </el-radio-group>
              </div>
              <!-- 状态 -->
              <div class="price" v-show="activeIndex === 1">
                <el-radio-group class="screen-full" v-model="paramsItem.Status" @change="searchChanges('状态', 'Status')">
                  <el-radio class="screen-list" label="">不限</el-radio>
                  <el-radio class="screen-list" :label="item.ItemValue" v-for="(item, index) in StatusData" :key="index">{{item.ItemValue}}</el-radio>
                </el-radio-group>
              </div>
              <!-- 楼盘 -->
              <div class="types" v-show="activeIndex === 2">
                <el-radio-group class="screen-full" v-model="paramsItem.EstateID" @change="searchChanges('楼盘', 'EstateID')">
                  <el-radio class="screen-list" label="">不限</el-radio>
                  <el-radio class="screen-list" :label="item.EstateID" v-for="(item, index) in EstateData" :key="index">{{item.EstateName}}</el-radio>
                </el-radio-group>
              </div>
            </article>
          </scroll>
        </div>
      </transition>
    </div>
    <!-- 数据列表 -->
    <div class="scroll-area">
      <scroll 
        ref="scrolls"
        :data="listData"
        :pullup="pullup"
        :bounce="bounce"
        :momentum="momentum"
        @scrollToEnd="upLoad">
        <section class="list-wrap">
          <div class="list" v-for="(item, index) in listData" :key="index"
            :class="{'transLeft': index===touchLeft, 'transRight': index===touchRight}"
            @touchstart="listTouchStart($event, index, item.Status)"
            @touchmove.prevent="listTouchMove"
            @touchend="listTouchEnd"
            >
            <!-- 左边的按钮 -->
            <div class="list-btn-l">
              <span class="button edit" @click="onAddContract(item)">对账单</span>
            </div>
            <!-- 中间的内容 -->
            <div class="list-center" @click="openDetail(item)">
              <div class="img-wrap">
                <i class="iconfont icon-biaoqian1 corner-mark" v-show="item.IsSendMsg==='1'"><em class="text">喜报</em></i>
                <img :src="smPath(item.picSrc)" alt="" class="img">
              </div>
              <div class="content">
                <p class="title">
                  <span class="state">[{{item.Status}}]</span>
                  <span class="emp-name">{{item.Address}}</span>
                  <span class="comm-count" v-show="item.CommCount>0" :class="{'yellow': item.CommCount>1}">{{item.CommCount}}</span>
                </p>
                <div class="client">
                  <p class="put-text">
                    <span class="name">客户：</span>{{item.CustName}}
                  </p>
                  <p class="put-text owner">
                    <span class="name">业主：</span>{{item.OwnerName}}
                  </p>
                  <i class="el-icon-arrow-right icon"></i>
                </div>
                <div class="put">
                  <p class="put-text">
                    <span class="name">应收：</span>{{item.AllTotal}}元
                  </p>
                  <p class="put-text">
                    <span class="name">实收：</span>{{item.AllTotalAct}}元
                  </p>
                  <p class="put-text">
                    <span class="name">未收：</span>{{item.DifferencePrice | DifferencePriceToFixed}}元
                  </p>
                </div>
              </div>
            </div>
            <!-- 右边的按钮 -->
            <div class="list-btn-r">
              <span class="button blue" @click="onProcess(item)">流程</span>
            </div>
          </div>
          <!-- 加载中 -->
          <loader v-show="hasMore"></loader>
          <!-- 什么都没有 -->
          <empty v-show="!hasMore && !listData.length"></empty>
        </section>
      </scroll>
      <!-- 遮罩 -->
      <transition name="opacity">
        <div class="make" v-show="isScreen" @click="isScreen=false"></div>
      </transition>
    </div>
    <!-- 更多筛选组件 -->
    <screen ref="screen" :IsHide="screenIsHide" :isOneOff="isOneOff" @select="onSelect" @empty="selectEmpty"></screen>
    <!-- 选择公司 -->
    <select-estate ref="selectDept" :houseEstate="DeptData" title="选择公司" @onEstate="onSelectDept"></select-estate>
    <loader-center ref="loaderCenters"></loader-center>
    <confirm ref="confirms" @confirm="onConfirm"></confirm>
    <!-- 图片预览容器 -->
    <awesome-swiper :swiperData="swiperData" ref="awesomeSwipers"></awesome-swiper>
    <!-- 合同录入 -->
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import LoaderCenter from '@/base/LoaderCenter'
  import Confirm from '@/base/Confirm'
  import AwesomeSwiper from '@/base/AwesomeSwiper'
  import Search from '@/base/Search'
  import SelectEstate from '@/base/SelectEstate'
  import Screen from '@/base/Screen'
  import { getpagedata, GetDefaultProcessByType, SelectByContractID } from '@/api/contract/contractList'  
  import { SelectByName, estate } from '@/api/public'
  import { prefixStyle } from '@/utils/index'
  import { vipfgj } from '@/common/js/config'
  import { mapGetters } from 'vuex'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        listData: [],    // 列表数据
        paramsItem: {     // 获取数据列表
          todo: 'Contract',
          type: 'getpagedata',
          needpurview: true,
          valiurl: document.URL,
          page: 1,         // 页数
          likestr: '',
          CurrentProcess: '',    // 筛选选中的值
          Status: '',
          EstateID: '',
          Trade: '',
          SearchDate: '',
          Order: ''
        },
        CurrentProcessData: [],
        StatusData: [],
        EstateData: [],
        CurrentProcessText: '流程',    // 筛选标题文字同步修改
        StatusText: '状态',
        EstateIDText: '楼盘',
        isScreen: false,   // 是否显示筛选
        activeIndex: -1,   // 筛选切换
        hasMore: true,    // 数据加载中
        isOnceData: false,  // 加载更多数据开关
        touch: {},     // 列表滑动
        touchLeft: -1,    // 当前可以滑动的值 left
        touchRight: -1 ,   // 当前可以滑动的值 right
        IsTouch: true,     // 操作列表是否可以滑动，选择楼盘报备，就不允许滑动
        DeptData: [],     // 创建对账单的时候需要先选择公司
        ContractNo: '',   // 创建对账单的时候保存编号
        swiperData: [],   // 对账单图片预览
        isOneOff: false,   // 是否点击了筛选操作，再获取筛选项
      }
    },
    created() {
      this.bounce = false     // 关闭弹动
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载
      // this.bounceTimes = 300   // 筛选滑动回弹速度

      this.screenIsHide = {   // 决定显示哪个筛选条件
        DatePeriod: true,
        contractTrade: true,
        contractOrder: true
      }

      this._getpagedata()
      this._SelectByName('ContractStatus')  // 返回合同状态
      this._GetDefaultProcessByType()
      this._estate()
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenters = this.$refs.loaderCenters     // 提示元素全局保存
      })
    },
    computed: {
      ...mapGetters([
        'getContractOneData'
      ])
    },
    methods: {
      openMore() {    // 打开更多筛选
        this.isOneOff ? '' : this.isOneOff = true   // 打开筛选了，去获取筛选项
        this.isScreen = false
        this.$refs.screen.openMore()
      },
      onSelect(obj) {      // 接收筛选条件
        this.paramsItem.SearchDate = obj.DatePeriod
        this.paramsItem.Trade = obj.contractTrade
        this.paramsItem.Order = obj.contractOrder
        this._getpagedata()
      },
      selectEmpty() {   // 清空筛选
        this.paramsItem = {
          todo: 'Contract',
          type: 'getpagedata',
          needpurview: true,
          valiurl: document.URL,
          page: 1,
        }
        this.$refs.search.clear()
        this.CurrentProcessText = '流程'
        this.StatusText = '状态'
        this.EstateIDText = '楼盘'
        this.isScreen = false
        this._getpagedata()
      },
      upLoad() {      // 上滑加载更多
        if (!this.hasMore || this.isOnceData) {
          return
        }
        this.isOnceData = true      // 限制加载一次
        this.paramsItem.page++
        getpagedata(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            this.listData = this.listData.concat(res.data.tempTable)   // 拼在一起
            this._checkMore(res.data.tempTable)
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.isOnceData = false
        })
        .catch(err => alert('网络异常：' + err))
      },
      _getpagedata() {    // 获取数据
        this.listData = []
        this.paramsItem.page = 1
        this.hasMore = true     // 加载中
        // this.page, this.CurrentProcess, this.Status, this.Trade, this.SearchDate, this.likestr, this.EstateID
        getpagedata(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            this.listData = res.data.tempTable
            this._checkMore(res.data.tempTable)
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
      _checkMore(data) {    // 判断是否拿到更多数据，没有的话就不要再去滑动加载了
        if (!data.length || data.length < 10) {
          this.hasMore = false
          return
        }
      },
      onConfirm(obj) {     // 此公司已创建对账单,是否前往列表继续操作?
        // console.log(obj.ContractBillNo)
        this.$router.push({
          path: '/accountList',
          query: {
            ContractBillNo: obj.ContractBillNo
          }
        })
      },
      openAdd() {     // 去新建
        this.$router.push({
          path: '/contractList/ContractAdd'
        })
      },
      openDetail(item) {      // 去编辑
        this.$router.push({
          path: '/contractList/ContractAdd',
          query: {
            id: item.ContractID
          }
        })
      },
      onSelectDept(item) {      // 选择公司
        // console.log(item)
        if (item.HasBill === '1' && item.VerifyPic) {
          this.swiperData = [{ PhotoPath: item.VerifyPic }]
          this.$refs.awesomeSwipers.show()
        } 
        else if (item.HasBill === '1' && !item.VerifyPic) {
          // 提示去列表，还要根据编号把他找出来
          this.$refs.confirms.show({text: '此公司已创建对账单,是否前往列表继续操作?', ContractBillNo: item.ContractBillNo})
        }
        else {
          let d = `${item.DeptID},${item.DeptNo},${item.DeptType}`
          this.$router.push({
            path: '/account',
            query: {
              id: this.ContractNo,
              d: d
            }
          })
        }
      },
      onAddContract(item) {      // 新建对账单
        this.ContractNo = item.ContractNo
        this.swiperData = []
        this.loaderCenters.show()
        // 新建之前要判断是否有这个公司
        SelectByContractID(item.ContractID).then(res => {
          this.loaderCenters.hide()
          if (res.data.tempTable.length) {
            let data = res.data.tempTable
            data.forEach(item => {
              item.EstateName = item.EmpName
            })
            this.DeptData = data
            
            this.$refs.selectDept.openEstate()
          } else {
            this.$message.error('没有对应公司，不能创建对账单')
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      onProcess(item) {     // 去流程步骤页面
        this.$router.push({
          path: '/contractList/processDetail',
          query: {
            id: item.ContractID,
            type: 'Contract'
          }
        })
      },
      _showScreen(index) {   // 打开筛选
        // console.log(this.activeIndex, index)
        // 切换判断
        if (this.activeIndex === index && this.isScreen) {
          this.isScreen = false
          this.activeIndex = -1
        } else {
          this.isScreen = true
          this.activeIndex = index
        }
        setTimeout(() => {
          this.$refs.screenScroll.refresh()
        }, 20)
      },
      query(query) {     // 搜索
        this.paramsItem.likestr = query
        this._getpagedata()
      },
      back() {        // 返回
        this.$router.back()
      },
      inputBlur(e) {      // 收起键盘
        e.currentTarget.blur()
      },
      listTouchStart (e, index, status) {
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

        // 左右滑动限制
        let excur = Math.max(Math.min(deltaX, 80), -80)    // 取最大值和最小值

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
      _estate() {   // 获取楼盘
        estate().then(res => {
          if (res.data.result === 'success') {      // 允许新建合同
            this.EstateData = res.data.tempTable
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
      _InquiryTag() {   // 获取标签
        InquiryTag().then((res) => {
          this.tag = res.data.tempTable
        })
      },
      _GetDefaultProcessByType() {      // 获取流程筛选
        GetDefaultProcessByType('Contract').then(res => {
          this.CurrentProcessData = res.data.tempTable
        })
        .catch(err => alert('网络异常：' + err))
      },
      _SelectByName(RefName) {
        SelectByName(RefName).then(res => {
          if (RefName === 'ContractStatus') {
            this.StatusData = res.data.tempTable
          }
        })
        .catch(err => alert('网络异常：' + err))
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj{join}` 是本地测试用的
        if (!paths) {
          return
        }
        let arrImg = paths.split('|')
        let img = ''
        for (let i = 0; i < arrImg.length; i++) {
          if (arrImg[i]) {
            img = arrImg[i]
            return `${vipfgj}${img}`
          }
        }
      },
      // 封装筛选事件
      searchChanges(type, sub) {
        let text = sub + 'Text'
        let newVal = this.paramsItem[sub]

        this.isScreen = false
        this._getpagedata()
        console.log(newVal, type)
        if (newVal === '') {
          this[text] = type
          console.log(text)
        } else {
          if (type === '楼盘') {    // 楼盘有点特殊
            let estate = this.EstateData
            for (let i = 0; i < estate.length; i++) {
              if (estate[i].EstateID === newVal) {
                this.EstateIDText = estate[i].EstateName
                return
              }
            }
          } else {
            this[text] = newVal
          }
        }
      }
    },
    filters: {
      DifferencePriceToFixed(value) {
        if (value) {
          return parseFloat(value).toFixed(2)
        } else {
          return '0'
        }
      }
    },
    watch: {
      getContractOneData(newVal) {    // 修改后，列表数据同步
        let listData = this.listData
        let Status = this.paramsItem.Status
        let EstateID = this.paramsItem.EstateID

        for (let i = 0; i < listData.length; i++) {
          // 找到对应的数据
          if (listData[i].ContractID === newVal.ContractID) {
            // 判断修改之后的数据是否满足当前筛选条件
            if ((Status && Status !== newVal.Status) || (EstateID && EstateID !== newVal.EstateID)) {
              listData.splice(i, 1)
              return
            }
            let current = listData[i]
            if (newVal.Status) {
              current.Status = newVal.Status
              current.Address = newVal.Address
              current.CustName = newVal.CustName
              current.OwnerName = newVal.OwnerName
              current.AllTotal = newVal.AllTotal
              current.AllTotalAct = newVal.AllTotalAct
            }
            // CommCount是在业绩分成里面修改的，所以单独拿出来
            if (newVal.CommCount) {
              current.CommCount = newVal.CommCount
            }
          }
        }
      }
    },
    components: {
      Scroll,
      Empty,
      Loader,
      LoaderCenter,
      Search,
      SelectEstate,
      Confirm,
      AwesomeSwiper,
      Screen
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  @import '../../common/sass/layout';
  @import '../../common/sass/variable';

  .contract-list {
    min-height: 100%;
    background-color: #f5f5f5;
    .b-screen {
      .screen-full {
        width: 100%;
      }
      .screen-wrap {
        position: relative;
        z-index: 3;
        display: flex;
        width: 100%;
        height: 45px;
        @include border-b-1px(0);
        background-color: #fff;
        .screen-list {
          flex: 1;
          display: flex;
          justify-content: center;
          align-items: center;
          @include border-l-1px(100%);
          height: 45px;
          font-size: 14px;
          color: #878D99;
          &:after {
            height: 50%;
            top: 25%;
          }
          &:last-child {
            &:after {
              display: none;
            }
          }
          &.active {
            color: #409EFF;
            .el-icon-caret-bottom {
              color: #409EFF;
              transform: rotate(180deg);
              transform-origin: center center;
            }
          }
          .el-icon-caret-bottom {
            color: #B4BCCC;
            margin-left: 3px;
            transition: all .3s;
          }
          .l-title {
            max-width: 90px;
            @include text-over();
          }
        }
      }
    }
    .c-screen {
      position: relative;
      z-index: 2;
      overflow: hidden;
      height: 250px;
      background-color: #fff;
      text-align: left;
      .ivu-radio-group {
        display: block;
        width: 100%;
      }
      .screen-list {
        display: flex;
        align-items: center;
        margin: 0;
        border: none;
        @include border-b-1px(0);
        padding: 0 15px;
        width: 100%;
        height: 45px;
        font-size: 14px;
        &.is-checked,
        &.ivu-radio-wrapper-checked {
          background-color: #f2f5f8;
          &:before {
            content: '';
            position: absolute;
            width: 2px;
            height: 16px;
            background: #409EFF;
            left: 0;
            top: 50%;
            margin-top: -8px;
          }
        }
      }
    }
    .scroll-area {
      overflow: hidden;
      position: absolute;
      top: 140px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
    }
    .list-wrap {
      overflow: hidden;
      background-color: #f5f5f5;
    }
    .list {
      position: relative;
      background-color: #fff;
      &.transLeft {
        transform: translate3d(-80px, 0, 0) !important;
      }
      &.transRight {
        transform: translate3d(80px, 0, 0) !important;
      }
      @include border-b-1px(0);
      .list-btn-l {
        position: absolute;
        top: 0;
        left: -80px;
        width: 80px;
        display: flex;
        .button {
          flex: 1;
        }
      }
      .list-btn-r {
        position: absolute;
        top: 0;
        right: -80px;
        width: 80px;
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
          // border-radius: 4px;
          height: 100%;
          font-size: 16px;
          color: #fff;
          &.edit {
            background-color: #33be85;
          }
          &.blue {
            background-color: #509dec;
          }
        }
        .iconfont {
          padding-bottom: 4px;
          font-size: 22px;
        }
      }
    }
    .list-center {
      display: flex;
      padding: 10px;
      .img-wrap {
        position: relative;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 80px;
        height: 80px;
        background: url('../../common/img/loader.png') no-repeat center;
        background-size: 80px;
        .img {
          max-width: 100%;
        }
        .corner-mark {
          position: absolute;
          top: 0px;
          left: -2px;
          color: $color-red;
          .text {
            position: absolute;
            top: 0;
            left: -2px;
            width: 100%;
            font-size: 10px;
            font-style: normal;
            white-space: nowrap;
            line-height: 16px;
            text-align: center;
            color: #fff;
          }
        }
      }
      .content {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        padding-left: 10px;
        text-align: left;
        .title {
          font-size: 14px;
          color: #409EFF;
          .emp-name {
            padding-left: 4px;
          }
          .comm-count {
            display: inline-block;
            padding: 2px 4px;
            border-radius: 4px;
            background-color: $color-blue;
            font-size: 12px;
            color: #fff;
            &.yellow {
              background-color: $color-yellow;
            }
          }
          .room {
            padding-left: 4px;
          }
        }
        .put, .client {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .client {
          .put-text {
            font-size: 14px;
          }
        }
        .put-text {
          font-size: 12px;
          color: #333;
        }
        .name {
          color: #999;
        }
        .icon {
          color: #999;
        }
        .owner {
          max-width: 164px;
          @include text-over();
          @include MQ(SM) {
            max-width: 126px;
          }
        }
      }
    }
    .make {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 2;
      background-color: rgba(0, 0, 0, .4);
    }
  }
</style>
