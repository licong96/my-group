<template lang="html">
  <!-- 管理流程 -->
  <section class="lc process">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">管理流程</h3>
      <i class="el-icon-plus right-span" @click="isProcessName = true"></i>
    </header>
    <!-- 流程列表 -->
    <section class="flow-cont">
      <p class="line"></p>
      <div class="flow-list" v-for="(item, index) in flowData" :key="index">
        <!-- 收缩栏 -->
        <div class="title" 
          :class="{'trans-right': index===touchRight, 'trans-left': index===touchLeft}"
          @click="onHasPack(item, index)"
          @touchstart="listTouchStart($event, index)"
          @touchmove="listTouchMove"
          @touchend="listTouchEnd">
          <div class="list-btn-l">
            <span class="button lc-default" v-show="item.IsDefault!=='1'" @touchend.stop="_setDefault(item)">设置默认</span>
            <span class="button lc-remove" v-show="item.IsDefault==='1'" @touchend.stop="_remDefault(item)">取消默认</span>
          </div>
          <p class="name">
            {{item.ProcessName}}
            <span class="small">{{item.value.length}}个步骤</span>
            <span class="default" v-show="item.IsDefault==='1'">默认</span>
          </p>
          <i class="el-icon-arrow-down arrow" :class="{'rotate': item.isShow}"></i>
          <!-- 右侧编辑和删除操作 -->
          <div class="list-btn-r">
            <span class="button lc-edit" @touchend.stop="_edit(index)">编辑</span>
            <span class="button lc-remove" @touchend.stop="_remove(item.ProcessModelNo, index)">删除</span>
          </div>
        </div>
        <ul class="wrap" v-show="item.isShow">
          <li class="list" v-for="(list, index) in item.value">
            <span class="num">{{index+1}}</span>
            <span class="desc">{{list.ProcessItemName}}</span>
          </li>
          <p class="list-line"><span class="content"></span></p>
        </ul>
      </div>
    </section>
    <!-- 加载中 -->
    <loader v-show="hasMore"></loader>
    <!-- 什么都没有 -->
    <empty v-show="!hasMore && !flowData.length"></empty>
    <confirm ref="confirms" text="是否删除当前流程？" @confirm="onConfirmRmove"></confirm>
    <!-- 添加流程名称 -->
    <el-dialog
      title="添加流程名称"
      :visible.sync="isProcessName"
      width="80%">
      <el-input class="import-input" v-model="ProcessName" placeholder="添加流程名称"></el-input>
      <el-input class="import-input type-input" v-model="ProcessType" placeholder="流程类型（表名）"></el-input>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_empty">取 消</el-button>
        <el-button type="primary" @click="onProcessName">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 流程步骤 -->
    <el-dialog
      :title="ProcessName"
      :visible.sync="isProcesStep"
      custom-class="dialog-step"
      :show-close="false"
      width="80%">
      <ul class="step-wrap">
        <i class="el-icon-plus" @click="onAddStep"></i>
        <li class="s-list" v-for="(item, index) in procesStepData.value">
          <span class="s-title">步骤{{index+1}}</span>
          <div class="s-box">
            <i class="el-icon-error" @click="onRemoveStep(index)"></i>
            <el-input class="s-input" v-model="item.ProcessItemName" placeholder="请输入步骤"></el-input>
            <span class="move">
              <i class="el-icon-caret-top caret" @click="onMoveUp(index)"></i>
              <i class="el-icon-caret-bottom caret" @click="onMoveDown(index)"></i>
            </span>
          </div>
        </li>
      </ul>
      <span slot="footer" class="dialog-footer">
        <el-button @click="_empty">取 消</el-button>
        <el-button type="primary" @click="onProcesStep">确 定</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Confirm from '@/base/Confirm'
  import { addANDuploader, GetProcessList, DelProcessModel, SetDefaultProcessTran } from '@/api/process/process'
  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data () {
      return {
        isProcessName: false,     // 添加流程名称显示隐藏
        ProcessName: '',         // 填写的流程名称
        ProcessType: '',        // 流程类型（表名）
        isProcesStep: false,     // 流程步骤显示隐藏
        procesStepData: {       // 填写的步骤数据，默认显示3个
          isShow: true,
          name: '',
          value: [
            {},{},{},
          ]
        },
        flowData: [
          // {
          //   isShow: true,
          //   name: '流程标题',
          //   ProcessType: '',      // 流程类型（表名）
          //   value: [
          //     { ProcessItemName: '一段描述流程的话'},
          //     { ProcessItemName: '一段描述流程的话'},
          //     { ProcessItemName: '一段描述流程的话'},
          //     { ProcessItemName: '一段描述流程的话'},
          //     { ProcessItemName: '一段描述流程的话'},
          //   ]
          // }
        ],       // 所有保存的流程
        touchRight: -1,     // 当前右滑元素
        touchLeft: -1,     // 当前左滑元素
        touch: {},         // 存储滑动
        isType: '新建',     // 表示添加还是编辑，默认添加
        editIndex: -1,       // 要编辑的数据index
        hasMore: true,      // 加载中
      }
    },
    created () {
      this._GetProcessList()
    },
    methods: {
      listTouchStart (e, index) {
        this.touch.index = index      // 把当前操作的列表保存在touch中

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = -1
          this.touchLeft = -1
          return
        }
        this.touch.initiated = true
        this.touch.current = e.currentTarget    // 当前元素，event输出是null，但是单独输出就有
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      listTouchMove (e) {
        if (!this.touch.initiated) {
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {
          this.touch.sides = false
          return
        }
        
        if (deltaX < -40) {
          this.touch.sides = 'r'
        } else if (deltaX > 40) {
          this.touch.sides = 'l'
        } else {
          this.touch.sides = false
        }

        let excur = excur = Math.max(Math.min(deltaX, 80), -160)
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`
      },
      listTouchEnd () {
        if (!this.touch.initiated) {
          return
        }
        this.touch.current.style.transition = 'all .2s linear'      // 放手的时候添加过渡
        setTimeout(() => {      // 加延迟可以防止跳动
          this.touch.current.style[transform] = null
        }, 20)
        // 要么左，要么右，要么全部清除掉
        if (this.touch.sides === 'r') {
          this.touchRight = this.touch.index
          this.touchLeft = ''
        } else if (this.touch.sides === 'l') {
          this.touchRight = ''
          this.touchLeft = this.touch.index
        } else {
          this.touchRight = ''
          this.touchLeft = ''
        }
      },
      onConfirmRmove(obj) {    // 确定删除
        // console.log(obj)
        DelProcessModel(obj.ProcessModelNo).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            // 成功后手动删除数据
            this.flowData.splice(obj.index, 1)
          }
          else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _setDefault(item) {      // 设置默认   0取消、1设置
        this._SetDefaultProcessTran(item, '1')
      },
      _remDefault(item) {      // 取消默认
        this._SetDefaultProcessTran(item, '0')
      },
      _SetDefaultProcessTran(item, des) {
        SetDefaultProcessTran(item.ProcessType, item.ProcessModelNo, des).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            if (des === '0') {
              item.IsDefault = '0'
            } else {
              item.IsDefault = '1'
            }
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _remove(ProcessModelNo, index) {   // 删除
        setTimeout(() => {
          this.$refs.confirms.show({ProcessModelNo, index})
        }, 30)
      },
      _edit(index) {     // 编辑
        setTimeout(() => {
          this.isType = '编辑'
          this.editIndex = index
          this.ProcessName = this.flowData[index].ProcessName
          this.ProcessType = this.flowData[index].ProcessType
          this.procesStepData = this.flowData[index]
          this.isProcessName = true
        }, 30)
      },
      _empty() {      // 清空一些数据
        this.isProcessName = false
        this.isProcesStep = false
        this.ProcessName = ''
        this.ProcessType = ''
        this.isType = '新建'
        this.editIndex = -1
        this.procesStepData = {
          ProcessName: '',
          ProcessType: '',
          isShow: true,
          value: [{},{},{}]
        }
      },
      onHasPack(item, index) {     // 是否显示隐藏具体步骤
        this.flowData[index].isShow = !item.isShow
      },
      onMoveUp(index) {     // 上移一位
        if (index < 0) {
          return
        }
        var arr = this.procesStepData.value
        arr[index] = arr.splice(index-1,1,arr[index])[0]
        this.$message('向上移动了一位')
      },
      onMoveDown(index) {      // 下移一位
        if (index >= this.procesStepData.value.length-1) {
          return
        }
        var arr = this.procesStepData.value
        arr[index] = arr.splice(index+1,1,arr[index])[0]
        this.$message('向下移动了一位')
      },
      onAddStep() {   // 添加一条步骤
        this.procesStepData.value.push({})
      },
      onRemoveStep(index) {    // 删除一条步骤
        this.procesStepData.value.splice(index, 1)
      },
      onProcesStep() {     // 确定添加流程步骤
        if (!this.procesStepData.value.length) {
          this.$message.error('步骤不能为空，请添加步骤')
          return
        }
        if (this.isType === '新建') {
          this._addANDuploader('InsertProcessModel')
        } 
        else if (this.isType === '编辑') {
          this._addANDuploader('UpProcessTran', this.flowData[this.editIndex].ProcessModelNo)
        }
      },
      onProcessName() {   // 确定流程名称
        // 输入完流程名称后，再输入具体流程
        if (!this.ProcessName) {
          this.$message.error('请输入流程名称')
          return
        }
        if (!this.ProcessType) {
          this.$message.error('流程类型（表名）')
          return
        }
        this.isProcessName = false
        this.isProcesStep = true
        this.procesStepData.ProcessName = this.ProcessName      // 保存名称
        this.procesStepData.ProcessType = this.ProcessType      // 流程类型（表名）
      },
      _addANDuploader(type, ProcessModelNo = '') {     // 新建和编辑流程模板， InsertProcessModel：新建，UpProcessTran：编辑
        var ProcessItemName = ''
        this.procesStepData.value.forEach((item) => {
          if (item.ProcessItemName) {
            ProcessItemName += item.ProcessItemName + '|'
          }
        })
        addANDuploader(type, this.ProcessType, this.ProcessName, ProcessItemName, ProcessModelNo).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            this._empty()
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => this.$message.error('catch:'+err))
      },
      _GetProcessList() {       // 获取流程列表数据
        GetProcessList().then(res => {
          if (res.data.result === 'success') {
            // 处理数据
            this.flowData = this._disposeData(res.data.tempTable)
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
          this.hasMore = false
        })
      },
      _disposeData(arr) {
        if (!arr.length) {
          return
        }
        var data = []
        let obj = {}
        arr.forEach((item) => {
          if (!obj[item.ProcessModelNo]) {
            obj[item.ProcessModelNo] = item
            obj[item.ProcessModelNo].isShow = false
            obj[item.ProcessModelNo].value = [{
              ProcessItemName: item.ProcessItemName,
              ProcessModelID: item.ProcessModelID,
            }]
          } 
          else {
            let list = {
              ProcessItemName: item.ProcessItemName,
              ProcessModelID: item.ProcessModelID
            }
            obj[item.ProcessModelNo].value.push(list)
          }
        })
        // console.log(obj)
        for (let key in obj) {
          data.push(obj[key])
        }
        console.log(data)
        return data
      },  
      back() {
        this.$router.back()
      }
    },
    components: {
      Loader,
      Empty,
      Confirm
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/mixin"; 
  @import "../../common/sass/variable"; 

  .process {
    min-height: 100%;
    .header {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 10;
      .el-icon-plus {
        font-size: 20px;
        color: $color-blue;
      }
    }
    .line {
      width: 100%;
      height: 6px;
      background-color: $color-gray;
    }
    .flow-cont {
      overflow-x: hidden;
      padding-top: 45px;
      .flow-list {
        background-color: $color-gray;
        @include border-b-1px(0);
      }
      .title {
        position: relative;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 16px;
        width: 100%;
        height: 40px;
        background-color: #fff;
        .name {
          display: flex;
          align-items: center;
          font-size: 16px;
          font-weight: 500;
          .small {
            padding-left: 10px;
            font-size: 14px;
            font-weight: normal;
            color: #666;
          }
          .default {
            margin-left: 6px;
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 12px;
            color: #fff;
            background-color: $color-blue;
          }
        }
        .arrow {
          font-size: 20px;
          color: #666;
          transition: all .3s;
          &.rotate {
            transform: rotate(-180deg)
          }
        }
        &.trans-right {
          transform: translate3d(-160px, 0, 0);
        }
        &.trans-left {
          transform: translate3d(80px, 0, 0);
        }
        .list-btn-r,
        .list-btn-l {
          display: flex;
          position: absolute;
          top: 0;
          right: -160px;
          width: 160px;
          height: 100%;
          .button {
            flex: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            width: 80px;
            height: 100%;
            font-size: 16px;
            color: #fff;
            &.lc-edit {
              background-color: $color-blue;
            }
            &.lc-remove {
              background-color: $color-red;
            }
            &.lc-default {
              background-color: $color-green;
            }
          }
        }
        .list-btn-l {
          right: auto;
          left: -80px;
          width: 80px;
        }
      }
      .wrap {
        position: relative;
        padding: 0 12px;
        text-align: left;
        .list-line {
          position: absolute;
          top: 0;
          left: 20px;
          z-index: 1;
          padding: 10px 0;
          width: 1px;
          height: 100%;
          .content {
            display: block;
            width: 100%;
            height: 100%;
            background-color: $color-blue;
          }
        }
        .list {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          min-height: 36px;
          .num {
            display: block;
            width: 16px;
            height: 16px;
            border-radius: 50%;
            font-size: 12px;
            background-color: $color-blue;
            color: #fff;
            line-height: 16px;
            text-align: center;
          }
          .desc {
            flex: 1;
            padding-left: 10px;
            font-size: 14px;
            color: #333;
            line-height: 1.4;
          }
        }
      }
    }
    .type-input {
      margin-top: 16px;
    }
    .dialog-step {
      .el-dialog__body {
        padding: 0;
      }
      .step-wrap {
        // text-align: left;
        .el-icon-plus {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 40px;
          height: 40px;
          font-size: 20px;
          font-weight: bold;
          text-align: center;
          line-height: 40px;
        }
        .s-list {
          margin-bottom: 10px;
        }
        .s-box {
          display: flex;
          align-items: center;
          .el-icon-error {
            width: 40px;
            height: 40px;
            font-size: 18px;
            color: $color-red;
            text-align: center;
            line-height: 40px;
          }
          .move {
            display: flex;
            flex-direction: column;
          }
          .caret {
            width: 30px;
            height: 20px;
            text-align: center;
          }
        }
      }
    }
  }
</style>
