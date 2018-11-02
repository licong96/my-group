<template lang="html">
  <!-- 快速审核 -->
  <section class="check-emp">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">审核</h3>
    </header>
    <section v-show="!isLoader && empData.EmpID">
      <div class="user-pic">
        <img :src="empData.picSrc" class="pic" alt="">
        <div class="user-text">
          <h4 class="name">微信名：{{empData.wxName}}</h4>
        </div>
      </div>
      <div class="info">
        <ul>
          <li class="list">
            <span class="name">姓名</span>
            <span class="desc">{{empData.EmpName}}</span>
          </li>
          <li class="list">
            <span class="name">部门</span>
            <span class="desc">{{empData.DeptName}}</span>
          </li>
          <li class="list">
            <span class="name">电话号码</span>
            <span class="desc">{{empData.Tel}}</span>
          </li>
          <li class="list">
            <span class="name">备注</span>
            <span class="desc">{{empData.Remark}}</span>
          </li>
        </ul>
      </div>
      <div class="check-btn" v-show="!isCheck" @click="onCheck">审核通过</div>
      <div class="check-btn pass" v-show="isCheck">审核已通过</div>
    </section>
    <!-- 加载中 -->
    <loader v-show="isLoader"></loader>
    <empty v-show="!isLoader && !empData.EmpID"></empty>
    <confirm ref="confirms" @confirm="confirm"></confirm>
  </section>
</template>

<script>
  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import Confirm from '@/base/Confirm'
  import { GetWaitingCheckEmpByID, upEmployee } from '@/api/employee/checkEmp'

  export default {
    data() {
      return {
        empData: {},        // 人员数据
        EmpID: '',          // 人员ID 
        isLoader: true,    // 加载中
        isCheck: false,     // 审核是否通过
      }
    },
    created () {
      var query = this.$route.query
      if (!query.id) {
        this.isLoader = false
        this.$message.error('非法访问！，没有ID');
        return
      }
      this.EmpID = query.id
      this._GetWaitingCheckEmpByID(query.id)
    },
    methods: {
      confirm() {     // 确定通过
        upEmployee(this.EmpID, this.empData.openid).then(res => {
          if (res.data.result === 'success') {
            this.$message.success('审核通过')
            this.isCheck = true
          } 
          else {
            this.$message.error(res.data.msg)
          }
        })
      },
      onCheck() {       // 审核通过
        this.$refs.confirms.show({text: '确定通过审核吗？'})
      },
      _GetWaitingCheckEmpByID(EmpID) {
        GetWaitingCheckEmpByID(EmpID).then(res => {
          this.isLoader = false
          if (res.data.result === 'success') {
            this.empData = res.data.tempTable[0]
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error(res.data.msg)
          }
        }).catch((error) => {
          this.$message.error('catch异常！', error)
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
  @import "../../common/sass/mixin";

  .check-emp {
    min-height: 100%;
    background-color: #f5f5f5;
    .header {
      box-shadow: 0 1px 2px #dedede;
    }
    .user-pic {
      display: flex;
      align-items: center;
      margin-top: 10px;
      padding: 16px;
      background-color: #fff;
      text-align: left;
      .pic {
        border-radius: 50%;
        width: 50px;
        height: 50px;
      }
      .user-text {
        padding-left: 16px;
        .name {
          font-size: 16px;
          color: #333;;
        }
        .wechat {
          padding-top: 8px;
          font-size: 14px;
          color: #999;
        }
      }
    }
    .info {
      margin-top: 10px;
      padding: 0 16px;
      background-color: #fff;
      text-align: left;
      .list {
        display: flex;
        justify-content: space-between;
        align-items: center;
        width: 100%;
        line-height: 36px;
        @include border-b-1px(0);
        font-size: 14px;
        .name {
          color: #666;
        }
        .desc {
          color: #333;
        }
      }
    }
    .check-btn {
      margin: 70px auto 0;
      border-radius: 6px;
      width: 80%;
      height: 36px;
      font-size: 16px;
      color: #fff;
      background-color: #33be85;
      line-height: 36px;
      text-align: center;
      &:active {
        background-color: #29b179;
      }
      &.pass {
        background-color: #999;
      }
    }
  }
</style>
