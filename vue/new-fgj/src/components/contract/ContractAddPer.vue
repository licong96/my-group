<template lang="html">
  <!-- 业绩分成 -->
  <section class="lc contract-add-per">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">业绩分成</h3>
    </header>
    <!-- 添加 -->
    <section class="add info">
      <ul class="list-wrap">
        <li class="list">
          <span class="name">人员：</span>
          <div class="input-wrap" @click="onShowDeptEmp">
            <el-input v-model="DeptEmpText" readonly placeholder="请选择归属员 ..."></el-input>
          </div>
        </li>
        <li class="list">
          <span class="name">款类：</span>
          <div class="input-wrap">
            <el-select v-model="param.FeeType" :popper-append-to-body="false" placeholder="请选择款类">
              <el-option v-for="(item, index) in FeeTypeData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list">
          <span class="name">比例：</span>
          <div class="input-wrap">
            <el-input v-model="param.CommRate" placeholder="(0~100%)"></el-input>
          </div>
          <span class="unit">%</span>
        </li>
        <li class="list">
          <span class="name">说明：</span>
          <div class="input-wrap">
            <el-input v-model="param.Comment" placeholder="说明（最多三十个字）"></el-input>
          </div>
        </li>
      </ul>
      <el-button type="primary" class="save" @click="save">保存</el-button>
    </section>
    <loader-center ref="loaderCenters"></loader-center>
    <!-- 查看已添加的业绩分成 -->
    <div class="open-more" @click="isContractComm=true">查看业绩分成</div>
    <transition name="transY">
      <section class="per-more" v-show="isContractComm">
        <div class="title">
          已添加的业绩分成<i class="el-icon-close close" @click="isContractComm=false"></i></div>
        <div class="scroll-area">
          <scroll :data="ContractCommData" ref="contScroll">
            <section class="list-wrap">
              <div class="list" v-for="(item, index) in ContractCommData" :key="index"
                :class="{'transRight': index===touchRight}"
                @touchstart="listTouchStart($event, index)"
                @touchmove.prevent="listTouchMove"
                @touchend="listTouchEnd"
                >
                <!-- 左边的按钮 -->
                <div class="list-btn-l">
                  <span class="button brace" v-show="item.FlagDeleted!=='True'" @click="onRemove(item, index)">作废</span>
                  <span class="button blue" v-show="item.FlagDeleted==='True'" @click="onStart(item, index)">启用</span>
                </div>
                <!-- 中间的内容 -->
                <div class="list-center" :class="{'status': item.FlagDeleted==='True'}">
                  <p class="row">
                    <span class="name">人员：</span>
                    {{item.DeptName}} - {{item.EmpName}}
                  </p>
                  <p class="row">
                    <span class="name">款类：</span>
                    <span class="small">{{item.FeeType}}</span>
                    <span class="name">比例：</span>
                    <span class="small">{{item.CommRate}}%</span>
                  </p>
                  <p class="row" v-show="item.Comment">
                    <span class="name">说明：</span>
                    {{item.Comment}}
                  </p>
                </div>
              </div>
              <empty v-show="!ContractCommData.length"></empty>
            </section>
          </scroll>
        </div>
        <!-- 发送喜报 -->
        <div class="send-msg" @click="sendMsg">发送喜报</div>
      </section>
    </transition>
    <transition name="opacity">
      <div class="shade" v-show="isContractComm" @click="isContractComm=false"></div>
    </transition>
    <!-- 选项检索部门 -->
    <transition name="select">
      <section class="select-box" v-show="isSelectDeptEmp">
        <div class="se-header">
          <i class="el-icon-close close" @click="onCloseDeptEmp"></i>检索人员
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
    <!-- 发送喜报 -->
    <glad-msg ref="gladMsg" :ContractCommData="ContractCommData"></glad-msg>
  </section>
</template>

<script>
  import Search from '@/base/Search'
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Scroll from '@/base/BScroll'
  import LoaderCenter from '@/base/LoaderCenter'
  import GladMsg from './ContractAddPerGladMsg.vue'   // 发送喜报
  import { SelectByName } from '@/api/public'
  import { GetEmployeeInfoByPara } from '@/api/contract/contractAdd'
  import { insertData, SelectByContractID, upFlagDeleted } from '@/api/contract/contractAddPer'
  import { prefixStyle, verifyData } from '@/utils/index'
  import { mapGetters, mapActions } from 'vuex'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        param: {
          todo: 'ContractComm',
          type: 'insertData',
          valiurl: document.URL,
          needpurview: true,
          ContractID: '',         // 合同id
          DeptID: '',             // 部门id
          EmpID: '',             // 人员id
          FeeType: '',           // 款类
          CommRate: '',          // 分成比例
          Comment: '',          // 说明
        },
        DeptEmpData: [],            // 人员数据
        FeeTypeData: [],          // 款类数据
        DeptEmpText: '',
        currentSelectDeptEmp: -1,   // 当前选中的人员index
        isSelectDeptEmp: false,     // 是否打开人员选项
        isOverflowHidden: false,    // html禁止滑动
        isLoader: false,        // 显示隐藏加载中
        ContractCommData: [],       // 已添加的分成数据
        isContractComm: false,        // 显示已添加的业绩分成
        touch: {},     // 列表滑动
        touchRight: -1 ,   // 当前可以滑动的值 right
        IsTouch: true,     // 操作列表是否可以滑动，选择楼盘报备，就不允许滑动
      }
    },
    created () {
      this._SelectByName('FeeType')
    },
    activated () {
      this.param.ContractID = this.$route.query.id
      this._SelectByContractID()
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenters     // 提示元素全局保存
      })
    },
    computed: {
      ...mapGetters([
        'getContractOneData'
      ])
    },
    methods: {
      sendMsg() {   // 发送喜报
        this.$refs.gladMsg._parcet()
      },
      onStart(item) {     // 启用
        this._upFlagDeleted(item, 0)
      },
      onRemove(item) {      // 作废，0：启用  1：作废
        this._upFlagDeleted(item, 1)
      },
      _upFlagDeleted(item, FlagDeleted) {
        upFlagDeleted(item.CommID, FlagDeleted).then(res => {
          if (res.data.result === 'success') {
            if (FlagDeleted === 0) {
              item.FlagDeleted = 'False'
              this.$message.success('成功启用')
            } else {
              item.FlagDeleted = 'True'
              this.$message.success('成功作废')
            }
            this.countNumber()
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
      listTouchStart (e, index) {
        this.touch.index = index      // 把当前操作的列表保存在touch中

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = ''
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
        if (deltaX > 40) {
          this.touch.sides = 'r'
        } else {
          this.touch.sides = false
        }

        // 左右滑动限制
        let excur = Math.max(Math.min(deltaX, 80), 0)    // 取最大值和最小值

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
          this.touchRight = this.touch.index
        }  else {
          this.touchRight = ''
        }
      },
      save() {      // 保存
        // 必填
        if (!this.param.DeptID) {
          this.$message.error('请选择人员')
          return
        }
        if (!this.param.FeeType) {
          this.$message.error('请选择款类')
          return
        }
        if (!verifyData(this.param.CommRate, 'number-dot')) {
          this.$message.error('请输入比例')
          return
        }
        if (this.param.CommRate > 100) {
          this.$message.error('比例不能大于100%')
          return
        }
        if (this.param.Comment.length > 30) {
          this.$message.error('说明文字最多30个字')
          return
        }
        this.loaderCenter.show('正在添加')
        insertData(this.param).then(res => {
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            this.$message.success('添加成功')
            this._empty()
            this._SelectByContractID()      // 更新数据
          } else {
            this.$message.error('添加失败' + res.data.msg)
          }
        })
      },
      _empty() {      // 清除数据
        this.param.DeptID = ''             // 部门id
        this.param.EmpID = ''             // 人员id
        this.param.FeeType = ''           // 款类
        this.param.CommRate = ''          // 分成比例
        this.param.Comment = ''          // 说明
        this.DeptEmpText = ''
      },  
      onChangeDeptEmp(item, index) {        // 归属人员和合同签约人员
        console.log(item)
        this.param.DeptID = item.DeptID
        this.param.EmpID = item.EmpID

        this.DeptEmpText = item.DeptName + ' ' + item.EmpName   // 拼接以供显示

        this.currentSelectDeptEmp = index
        this.isSelectDeptEmp = false
        this.isOverflowHidden = false
      },
      onCloseDeptEmp() {
        this.isSelectDeptEmp = false
        this.isOverflowHidden = false
      },
      onShowDeptEmp(type) {
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
      _SelectByContractID() {   // 已添加的分成数据
        SelectByContractID(this.param.ContractID).then(res => {
          if (res.data.result === 'success') {
            this.ContractCommData = res.data.tempTable
            this.countNumber()    // 计算可分成个数
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
      countNumber() {   // 计算可分成个数
        let aHow = this.ContractCommData
        let number = 0
        for (let i = 0; i < aHow.length; i++) {
          if (aHow[i].FlagDeleted !== 'True') {
            number++
          }
        }
        let contractData = this.getContractOneData
        let newVal = Object.assign({}, contractData, {
          CommCount: number, 
          ContractID: this.param.ContractID
        })
        this.setContractOneData(newVal)
      },
      _SelectByName(refName) {
        SelectByName(refName).then(res => {
          this.FeeTypeData = res.data.tempTable
        })
      },
      _GetEmployeeInfoByPara(key) {       // 关键字获取部门人员数据
        this.isLoader = true
        this.DeptEmpData = []
        GetEmployeeInfoByPara(key).then(res => {
          if (res.data.result === 'success') {
            this.DeptEmpData = res.data.tempTable
          } else {
            this.$message.error(res.data.msg)
          }
          this.isLoader = false
        })
        .catch(err => alert('网络异常：' + err))
      },
      back() {
        this.$router.back()
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
      Loader,
      Empty,
      Scroll,
      LoaderCenter,
      GladMsg
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  @import '../../common/sass/variable';

  .contract-add-per {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2013;
    text-align: left;
    background-color: #f5f5f5;
    .info {
      margin-top: 10px;
      padding-bottom: 10px;
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
        position: relative;
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
        .unit {
          position: absolute;
          bottom: 0;
          right: 0;
          z-index: 3;
          width: 40px;
          height: 40px;
          text-align: center;
          line-height: 40px;
        }
      }
      .save {
        display: block;
        margin: 30px auto 0; 
        width: 50%;
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
      text-align: center;
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
    .open-more {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 45px;
      line-height: 45px;
      background-color: $color-blue;
      font-size: 16px;
      color: #fff;
      text-align: center;
    }
    .per-more {
      overflow: hidden;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 2011;
      width: 100%;
      height: 80%;
      background-color: #fff;
      .title {
        @include border-b-1px(0);
        position: relative;
        z-index: 10;
        line-height: 45px;
        font-size: 16px;
        color: #333;
        text-align: center;
        background-color: #fff;
        .close {
          position: absolute;
          top: 0;
          right: 0;
          width: 55px;
          height: 45px;
          font-size: 22px;
          color: #999;
          line-height: 45px;
        }
      }
      .scroll-area {
        position: absolute;
        top: 45px;
        right: 0;
        bottom: 40px;
        left: 0;
        z-index: 2;
        background-color: #f5f5f5;
      }
      .send-msg {
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 40px;
        font-size: 16px;
        color: #fff;
        text-align: center;
        line-height: 40px;
        background-color: $color-blue;
      }
      .list-wrap {
        overflow: hidden;
      }
      .list {
        position: relative;
        background-color: #fff;
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
          height: 100%;
          .button {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            height: 100%;
            font-size: 16px;
            color: #fff;
            &.blue {
              background-color: #509dec;
            }
            &.brace {
              background-color: #ff2255;
            }
          }
          .iconfont {
            padding-bottom: 4px;
            font-size: 22px;
          }
        }
      }
      .list-center {
        padding: 4px 16px;
        &.status {
          opacity: .8;
          background-color: #dcdcdc;
        }
        .row {
          padding: 6px 0;
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
    .shade {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 2010;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, .5);
    }
  }

  .select-enter-active,
  .select-leave-active {
    transition: .3s all ease;
  }
  .select-enter,
  .select-leave-to{
    transform: translate3d(0, 100%, 0);
  }
</style>
