<template lang="html">
  <!-- 详细流程 -->
  <section class="process-detail">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">当前进度</h3>
    </header>
    <section class="flow" v-show="listData.length">
      <ul class="wrap">
        <li class="list" v-for="(item, index) in listData" :key="index" :class="{'active': item.Status==='1'}" @click="onChange(item, index)">
          <span class="num">{{item.ProcessItemIndex}}</span>
          <p class="desc">{{item.ProcessItemName}}</p>
          <span class="tag tag-1" v-show="item.Status==='1'">完成</span>
          <span class="tag tag-2" v-show="index===currentTag">正在进行</span>
        </li>
      </ul>
    </section>
    <!-- 加载中 -->
    <loader v-show="hasMore"></loader>
    <!-- 什么都没有 -->
    <empty v-show="!hasMore && !listData.length"></empty>
    <!-- 是否通过审核 -->
    <confirm ref="confirms" @confirm="onConfirmStep"></confirm>
  </section>
</template>

<script>
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Confirm from '@/base/Confirm'
  import { GetProcessByID, UpProcessStatus } from '@/api/process/processDetail'

  export default {
    data() {
      return {
        listData: [],    // 列表数据
        currentTag: 0,   // 当前进度 
        hasMore: true,   // 加载中
        param: {},      // 保存ID
        CanEdit: '0',     // 是否有权限更改状态
      }
    },
    activated() {
      // 合同ID，和 Contract
      let query = this.$route.query
      // console.log(query)
      this.param.TypeID = query.id
      this.param.ProcessType = query.type
      this._GetProcessByID(query.id, query.type)
    },
    methods: {
      _UpProcessStatus() {
        UpProcessStatus(this.param).then(res => {
          if (res.data.result === 'success') {
            this.$message.success(res.data.msg)
            // 成功后手动修改状态
            this.listData[this.currentTag].Status = '1'
            this.currentTag++
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      onChange(item, index) {
        if (this.CanEdit === '0') {
          this.$message.error('无操作权限')
          return
        }
        if (item.Status === '1') {
          return
        }
        if (index > this.currentTag) {
          this.$message.error('请先完成上一步操作')
          return
        }
        this.param.ProcessID = item.ProcessID
        this.$refs.confirms.show({text: '是否完成当前这一步'})
      },
      onConfirmStep() {
        this._UpProcessStatus()
      },
      _GetProcessByID(id, type) {
        GetProcessByID(id, type).then(res => {
          if (res.data.result === 'success') {
            let tempTable = res.data.tempTable
            let index = 0;
            this.listData = tempTable
            this.CanEdit = res.data.CanEdit
            // 拿到当前进度到了哪一步
            tempTable.forEach((item) => {
              if (item.Status === '1') {
                index++
              }
            })
            this.currentTag = index
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          this.hasMore = false     // 加载中
        })
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
  @import "../../common/sass/variable";

  .process-detail {
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
    background-color: $color-gray;
    .flow {
      margin-top: 10px;
      padding-top: 16px;
      background-color: #fff;
      text-align: left;
    }
    .list {
      position: relative;
      display: flex;
      align-items: flex-start;
      padding: 0 16px 16px;
      &.active {
        &:after,
        .num {
          background-color: $color-blue;
        }
        .desc {
          color: #333;
        }
      }
      &:after {
        content: "";
        position: absolute;
        top: 20px;
        bottom: 0;
        left: 26px;
        z-index: 1;
        width: 1px;
        background-color: #999;
      }
      &:last-child {
        &:after {
          display: none;
        }
      }
      .num {
        position: relative;
        z-index: 2;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        font-size: 12px;
        background-color: #999;
        color: #fff;
        line-height: 20px;
        text-align: center;
      }
      .desc {
        flex: 1;
        padding-left: 10px;
        padding-right: 50px;
        font-size: 14px;
        color: #999;
        line-height: 1.4;
        line-height: 20px;
      }
      .tag {
        position: absolute;
        top: 0;
        right: 10px;
        font-size: 12px;
        color: #666;
        line-height: 20px;
        &.tag-1 {
          color: $color-green;
        }
        &.tag-2 {
          color: $color-yellow;
        }
      }
    }
  }
</style>
