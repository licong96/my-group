<template lang="html">
  <!-- 财务收付 -->
  <section class="contract-add-fin">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">财务收付</h3>
    </header>
    <!-- 添加 -->
    <section class="add info">
      <ul class="list-wrap">
        <li class="list">
          <span class="name">应<em class="space-1"></em>实：</span>
          <div class="input-wrap">
            <el-select v-model="actualType" :popper-append-to-body="false" placeholder="选择应收应付或实收实付">
              <el-option v-for="(item, index) in actualTypeData" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list">
          <span class="name">款<em class="space-1"></em>类：</span>
          <div class="input-wrap">
            <el-select v-model="param.FeeType" :popper-append-to-body="false" placeholder="请选择款类">
              <el-option v-for="(item, index) in FeeTypeData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list">
          <span class="name">收<em class="space-1"></em>方：</span>
          <div class="input-wrap">
            <el-select v-model="param.FeeObject" :popper-append-to-body="false" placeholder="请选择收款方">
              <el-option v-for="(item, index) in FeeObjectData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list">
          <span class="name">应(实)收：</span>
          <div class="input-wrap">
            <el-input v-model="param.Money0" placeholder="输入金额（元）"></el-input>
          </div>
        </li>
        <li class="list">
          <span class="name">应(实)付：</span>
          <div class="input-wrap">
            <el-input v-model="param.Money1" placeholder="输入金额（元）"></el-input>
          </div>
        </li>
        <li class="list">
          <span class="name">付<em class="space-1"></em>方：</span>
          <div class="input-wrap">
            <el-select v-model="param.FeeSource" :popper-append-to-body="false" placeholder="请选择付款方">
              <el-option v-for="(item, index) in FeeObjectData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list">
          <span class="name">日<em class="space-1"></em>期：</span>
          <div class="input-wrap">
            <p class="el-input__inner date" @click="openRemindTime">{{param.FeeDate}}</p>
            <mt-datetime-picker
              ref="picker"
              type="date"
              @confirm="RemindConfirm">
            </mt-datetime-picker>
          </div>
        </li>
        <!-- 选中实收实付，显示下面的，不包括说明 -->
        <li class="list" v-show="actualType==='1'">
          <span class="name">单<em class="space-1"></em>据：</span>
          <div class="input-wrap">
            <el-input v-model="param.ReceiptNo" placeholder="输入单据号"></el-input>
          </div>
        </li>
        <li class="list" v-show="actualType==='1'">
          <span class="name">单<em class="space-1"></em>类：</span>
          <div class="input-wrap">
            <el-select v-model="param.ReceiptType" :popper-append-to-body="false" placeholder="请选择单类类型">
              <el-option v-for="(item, index) in ReceiptTypeData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list" v-show="actualType==='1'">
          <span class="name">银<em class="space-1"></em>行：</span>
          <div class="input-wrap">
            <el-select v-model="param.BankName" :popper-append-to-body="false" placeholder="请选择银行">
              <el-option v-for="(item, index) in BankNameData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list" v-show="actualType==='1'">
          <span class="name">方<em class="space-1"></em>式：</span>
          <div class="input-wrap">
            <el-select v-model="param.CashType" :popper-append-to-body="false" placeholder="请选择付款方式">
              <el-option v-for="(item, index) in CashTypeData" :key="index" :label="item.ItemValue" :value="item.ItemValue"></el-option>
            </el-select>
          </div>
        </li>
        <li class="list" v-show="actualType==='1'">
          <span class="name">POS 费：</span>
          <div class="input-wrap">
            <el-input v-model="param.FeePos" placeholder="输入金额（元）"></el-input>
          </div>
        </li>

        <li class="list">
          <span class="name">说<em class="space-1"></em>明：</span>
          <div class="input-wrap">
            <el-input v-model="param.Remark" placeholder="说明（最多三十个字）"></el-input>
          </div>
        </li>
      </ul>
      <el-button type="primary" class="save" @click="save">保存</el-button>
    </section>
    <!-- 查看已添加的财务收付 -->
    <div class="open-more" @click="isContractComm=true">查看财务收付</div>
    <transition name="transY">
      <section class="per-more" v-show="isContractComm">
        <div class="title">已添加的财务收付<i class="el-icon-close close" @click="isContractComm=false"></i></div>
        <div class="scroll-area">
          <scroll :data="ContractCommData" ref="contScroll">
            <section class="list-wrap">
              <div class="list" v-for="(item, index) in ContractCommData" :key="index"
                :class="{'transRight': index===touchRight}"
                @touchstart="listTouchStart($event, index, item)"
                @touchmove.prevent="listTouchMove"
                @touchend="listTouchEnd">
                <!-- 左边的按钮 -->
                <div class="list-btn-l">
                  <span class="button brace" v-show="item.FlagDeleted!=='True'" @click="onRemove(item, index)">作废</span>
                  <span class="button blue" v-show="item.FlagDeleted==='True'" @click="onStart(item, index)">启用</span>
                </div>
                <!-- 中间的内容 -->
                <div class="list-center" :class="{'status': item.FlagDeleted==='True'}">
                  <div class="item">
                    <span class="name">日期：</span>
                    <span class="desc">{{item.FeeDate}}</span>
                    <span class="type type-1" v-show="item.status===0">应收应付</span>
                    <span class="type type-2" v-show="item.status===1">实收实付</span>
                    <span class="feetype">{{item.FeeType}}</span>
                  </div>
                  <div class="item">
                    <span class="name" v-show="item.status===0">应收：</span>
                    <span class="name" v-show="item.status===1">实收：</span>
                    <span class="desc">{{item.Money0}}</span>
                    <span class="name">收方：</span>
                    <span class="desc">{{item.FeeObject}}</span>
                  </div>
                  <div class="item">
                    <span class="name" v-show="item.status===0">应付：</span>
                    <span class="name" v-show="item.status===1">实付：</span>
                    <span class="desc">{{item.Money1}}</span>
                    <span class="name">付方：</span>
                    <span class="desc">{{item.FeeSource}}</span>
                    <span class="differ">差额：{{item.Money0 - item.Money1}}</span>
                  </div>
                  <div class="item" v-show="item.Remark">
                    <span class="name">说明：</span>
                    <span class="desc">{{item.Remark}}</span>
                  </div>
                </div>
              </div>
              <empty v-show="!ContractCommData.length"></empty>
            </section>
          </scroll>
        </div>
      </section>
    </transition>
    <transition name="opacity">
      <div class="shade" v-show="isContractComm" @click="isContractComm=false"></div>
    </transition>
  </section>
</template>

<script>
  import Empty from '@/base/Empty'
  import LoaderCenter from '@/base/LoaderCenter'
  import Scroll from '@/base/BScroll'
  import { insertData, SelectByContractID, upFlagDeleted } from '@/api/contract/ContractAddFin'
  import { SelectByName } from '@/api/public'
  import { parseTime } from '@/utils/index'
  import { prefixStyle, verifyData } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        param: {
          todo: 'ContractCon',      // 应收应付: ContractCon, 实收实付: ContractAct
          type: 'insertData',
          valiurl: document.URL,
          needpurview: true,
          ContractID: '',       // 合同ID
          FeeType: '',
          FeeObject: '',
          FeeSource: '',
          Money0: '',
          Money1: '',
          FeeDate: parseTime(new Date(), '{y}-{m}-{d}'),
          Remark: '',
          ReceiptNo: '',
          ReceiptType: '',
          BankName: '',
          CashType: '',
          FeePos: '',
          FlagPos: '0',     // 是否填写了pos机手续费，0没填，1填了
        },
        actualType: '0',       // 选择应收应付或实收实付
        actualTypeData: [
          {
            label: '应收应付',
            value: '0'
          },
          {
            label: '实收实付',
            value: '1'
          }
        ],
        FeeTypeData: [],
        FeeObjectData: [],        // 收方和付方式一样的数据
        ReceiptTypeData: [],
        BankNameData: [],
        CashTypeData: [],
        ContractCommData: [],       // 已添加的财务收付数据
        isContractComm: false,        // 显示已添加的财务收付
        touch: {},     // 列表滑动
        touchRight: -1 ,   // 当前可以滑动的值 right
        IsTouch: true,     // 操作列表是否可以滑动，选择楼盘报备，就不允许滑动
      }
    },
    created () {
      // this.param.ContractID = this.$route.query.id
      this._SelectByName('FeeType')
      this._SelectByName('CashType')
      this._SelectByName('ReceiptType')
      this._SelectByName('BankName')
      this._SelectByName('FeeObject')
    },
    activated () {
      this.param.ContractID = this.$route.query.id
      this._SelectByContractID('ContractCon', this.param.ContractID)
      this._SelectByContractID('ContractAct', this.param.ContractID)
    },
    methods: {
      onStart(item) {     // 启用
        let todo = 'ContractCon'
        if (item.status === 1) {
          todo = 'ContractAct'
        }
        this._upFlagDeleted(todo, item, 0)
      },
      onRemove(item) {      // 作废，0：启用  1：作废
        let todo = 'ContractCon'
        if (item.status === 1) {
          todo = 'ContractAct'
        }
        this._upFlagDeleted(todo, item, 1)
      },
      _upFlagDeleted(todo, item, FlagDeleted) {
        upFlagDeleted(todo, item.FeeID, FlagDeleted).then(res => {
          if (res.data.result === 'success') {
            if (FlagDeleted === 0) {
              item.FlagDeleted = 'False'
              this.$message.success('成功启用')
            } else {
              item.FlagDeleted = 'True'
              this.$message.success('成功作废')
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
        if (this.actualType === '0') {      // 应收应付
          this.param.todo = 'ContractCon'
        } else {    // 实收实付
          this.param.todo = 'ContractAct'
          
          if (!this.param.FeeDate) {
            this.$message.error('请选择收付日期')
            return
          }
          if (!this.param.ReceiptNo) {
            this.$message.error('请输入单据号')
            return
          }
          if (!this.param.ReceiptType) {
            this.$message.error('请选择单类类型')
            return
          }
        }
        // 必填
        if (!this.param.FeeType) {
          this.$message.error('请选择款类')
          return
        }
        if (!this.param.FeeObject) {
          this.$message.error('请选择收款方')
          return
        }
        if (!verifyData(this.param.Money0, 'number-dot')) {
          this.$message.error('请输入收款金额，单位默认是元')
          return
        }
        if (this.param.Money1) {
          if (!verifyData(this.param.Money1, 'number-dot')) {
            this.$message.error('金额要为数字，单位默认是元')
            return
          }
        }
        if (!this.param.FeeSource) {
          this.$message.error('请选择付款方')
          return
        }
        // 判断是否有POS手续费
        if (this.param.FeePos) {
          this.param.FlagPos = '1'
        } else {
          this.param.FlagPos = '0'
        }
        this._insertData()
      },
      _insertData() {     // 新增财务数据
        insertData(this.param).then(res => {
          if (res.data.result === 'success') {
            this.$message.success('添加成功')
            this._empty()
            // 添加后重新获取数据
            this.ContractCommData = []
            this._SelectByContractID('ContractCon', this.param.ContractID)
            this._SelectByContractID('ContractAct', this.param.ContractID)
          }
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error('添加失败')
          }
        }).catch(err => alert('catch：' + err))
      },
      _SelectByName(refName) {
        SelectByName(refName).then(res => {
          if (refName === 'FeeType') {
            this.FeeTypeData = res.data.tempTable
          }
          else if (refName === 'CashType') {
            this.CashTypeData = res.data.tempTable
          }
          else if (refName === 'ReceiptType') {
            this.ReceiptTypeData = res.data.tempTable
          }
          else if (refName === 'BankName') {
            this.BankNameData = res.data.tempTable
          }
          else if (refName === 'FeeObject') {
            this.FeeObjectData = res.data.tempTable
          }
        })
      },
      _SelectByContractID(todo, ContractID) {   // 获取财务数据
        SelectByContractID(todo, ContractID).then(res => {
          var data = res.data.tempTable
          if (data.length) {
            data.forEach((item) => {      // 添加状态，以作区分
              if (todo === 'ContractCon') {
                item.status = 0
              } else {
                item.status = 1
              }
              this.ContractCommData.push(item)
            })
          }
        })
      },
      openRemindTime() {    // 打开选择时间
        this.$refs.picker.open()
      },
      RemindConfirm(time) {
        let times = parseTime(time, '{y}-{m}-{d}')     // 时间需要处理一下
        this.param.FeeDate = times
      },
      back() {
        this.$router.back()
      },
      _empty() {      // 添加后清空一些数据
        this.param.FeeType = ''
        this.param.FeeObject = ''
        this.param.FeeSource = ''
        this.param.Money0 = ''
        this.param.Money1 = ''
        this.param.Remark = ''
        this.param.ReceiptNo = ''
        this.param.ReceiptType = ''
        this.param.BankName = ''
        this.param.CashType = ''
        this.param.FeePos = ''
      }
    },
    components: {
      Scroll,
      Empty,
      LoaderCenter,
    }
  }
</script>

<style scoped lang="scss">
@import '../../common/sass/mixin';
  @import '../../common/sass/variable';

  .contract-add-fin {
    overflow: auto;
    -webkit-overflow-scrolling: touch;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 2013;
    text-align: left;
    background-color: #f5f5f5;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      width: 100%;
    }
    .info {
      position: relative;
      margin-top: 50px;
      padding-bottom: 100px;
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
      .save {
        display: block;
        margin: 30px auto 0; 
        width: 50%;
      }
    }
    .space-1 {
      display: inline-block;
      width: 1em;
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
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10;
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
        bottom: 0;
        left: 0;
        z-index: 2;
        background-color: #f5f5f5;
      }
      .list-wrap {
        overflow: hidden;
        background-color: #f5f5f5;
      }
      .list {
        margin-top: 6px;
        position: relative;
        background-color: #fff;
        &.transRight {
          transform: translate3d(80px, 0, 0) !important;
        }
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
        }
        .list-center {
          padding: 4px 10px;
          &.status {
            opacity: .8;
            background-color: #dcdcdc;
          }
        }
        .item {
          display: flex;
          align-items: center;
          padding: 6px 0;
          .name {
            color: #999;
            white-space: nowrap;
          }
          .desc {
            padding-right: 10px;
            min-width: 66px;
            color: #333;
            line-height: 1.2;
          }
          .type {
            display: inline-block;
            padding: 4px 6px;
            border-radius: 12px;
            font-size: 12px;
            color: #fff;
            background-color: $color-blue;
          }
          .type-2 {
            background-color: $color-success; 
          }
          .feetype {
            margin-left: auto;
            border: 1px solid $color-danger;
            padding: 2px 4px;
            border-radius: 2px;
            color: $color-danger;
          }
          .differ {
            margin-left: auto;
            color: #666;
          }
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
