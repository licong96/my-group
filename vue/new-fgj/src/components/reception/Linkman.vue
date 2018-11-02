<template lang="html">
  <!-- 联系人 -->
  <section class="linkman">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">联系人</h3>
    </header>
    <div class="line"></div>
    <section class="flex-1" v-show="!isLoader && ReceptionData.EmpName">
      <!-- 接待人 -->
      <div class="reception">
        <div class="r-head"></div>
        <div class="r-body">
          <div class="left">
            <div class="info">
              <h4 class="name">{{ReceptionData.EmpName}}</h4>
              <span class="tag">{{type}}</span>
            </div>
            <p class="phone">(+86){{ReceptionData.Tel}}</p>
            <el-button class="btn" type="success" size="small"><a class="a" :href="tel">立即联系</a></el-button>
          </div>
          <img class="img" :src="ReceptionData.PicSrc" alt="">
        </div>
      </div>
      <!-- 客户信息 -->
      <div class="client">
        <h4 class="title">客户信息：</h4>
        <div class="info">
          <div class="list">
            <span class="name">姓名：</span>
            <span class="desc">{{ReceptionData.CustName}}</span>
          </div>
          <div class="list">
            <span class="name">报备楼盘：</span>
            <span class="desc">{{ReceptionData.EstateName}}</span>
          </div>
          <div class="list">
            <span class="name">电话：</span>
            <span class="desc">{{ReceptionData.Tel}}</span>
          </div>
          <div class="list">
            <span class="name">到访时间：</span>
            <span class="desc">{{ReceptionData.ReceptionDate}}</span>
          </div>
        </div>
      </div>
    </section>
    <!-- 其他到访 -->
    <section class="rest" v-show="!isLoader">
      <p class="title">今日其他到访</p>
      <p class="empty" v-if="!DeclareData.length">暂无其他到访</p>
      <ul class="wrap" v-if="DeclareData.length">
        <li class="list" v-for="(item, index) in DeclareData" :key="index" @click="openLink(item.ReceptionID)">
          <img :src="ReceptionData.PicSrc" alt="" class="img">
          <div class="text">
            <p class="name">客户：<span class="large">{{item.CustName}}</span></p>
            <p class="tel">{{item.CustMobile}}</p>
            <span class="more">查看更多》</span>
          </div>
        </li>
      </ul>
    </section>
    <!-- 加载中 -->
    <loader v-show="isLoader"></loader>
    <empty v-show="!isLoader && !ReceptionData.EmpName"></empty>
  </section>
</template>

<script>
  /** 
    主要功能是联系接待人
    接受两个值，一个是类型(type)，一个是类型对应的id
    type: '接待',
    id: {ReceptionID}
  */

  import Loader from '@/base/Loader'
  import Empty from '@/base/Empty'
  import { GetReceptionInfoByID, GetTodayOrderReception } from '@/api/reception/linkman'

  export default {
    data() {
      return {
        ReceptionData: {},
        DeclareData: [],
        type: '接待人',
        ReceptionID: '',
        isLoader: true,
      }
    },
    created () {
      var query = this.$route.query
      console.log(query)
      this.type = query.type ? query.type : this.type
      this.ReceptionID = query.id
      if (!query.id) {
        this.$message.error('非法访问！，没有ID');
        return
      }
      this._GetReceptionInfoByID(query.id)
    },
    computed: {
      tel() {
        return 'tel:' + this.ReceptionData.Tel
      }
    },
    methods: {
      openLink(ReceptionID) {    // 更多
        this.isLoader = true
        this._GetReceptionInfoByID(ReceptionID)
      },
      _GetReceptionInfoByID(ReceptionID) {  // 获取个人接待相关信息
        GetReceptionInfoByID(ReceptionID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.ReceptionData = res.data.tempTable[0]
            this._GetTodayOrderReception(res.data.tempTable[0].DeclareID)
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.$message.error(res.data.msg)
          }
          this.isLoader = false
        }).catch((error) => {
          this.$message.error('catch异常！', error)
        })
      },
      _GetTodayOrderReception(DeclareID) {  // 获取今日个人其他已接待客户信息
        GetTodayOrderReception(DeclareID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.DeclareData = res.data.tempTable
          } else {
            this.$message.error(res.data.msg)
          }
          this.isLoader = false
        })
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      Loader,
      Empty
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/variable";
  @import "../../common/sass/mixin";

  .linkman {
    display: flex;
    flex-direction: column;
    min-height: 100%;
    .header {
      box-shadow: 0 1px 3px #dedede;
    }
    .line {
      width: 100%;
      height: 8px;
      background: #ececec;
    }
    .reception {
      overflow: hidden;
      margin: 16px auto;
      box-shadow: 0px 1px 3px 0px rgba(169, 169, 169, 0.5);
      border-radius: 10px;
      width: 90%;
      text-align: left;
      .r-head {
        width: 100%;
        height: 22px;
        background-color: $color-green;
      }
      .r-body {
        display: flex;
        justify-content: space-between;
        padding-bottom: 24px;
        .left {
          padding-left: 12px;
        }
        .info {
          display: flex;
          align-items: center;
          padding-top: 18px;
        }
        .name {
          font-size: 18px;
          font-weight: 600;
          color: #222;
        }
        .tag {
          display: block;
          margin-left: 8px;
          padding: 2px 8px;
          border-radius: 10px;
          background-color: #ebf5ff;
          color: #8ac5ff;
        }
        .phone {
          margin-top: 8px;
          font-size: 14px;
          color: #b2b2b2;
        }
        .btn {
          margin-top: 14px;
          padding: 8px 28px;
          background-color: $color-green;
          .a {
            color: #fff;
          }
        }
        .img {
          margin: 14px 12px 0 0;
          width: 58px;
          height: 58px;
          border-radius: 50%;
        }
      }
    }
    .client {
      padding: 0 20px;
      text-align: left;
      .title {
        border-left: 2px solid $color-green;
        padding-left: 4px;
        font-size: 14px;
        color: #333;
      }
      .info {
        margin-top: 10px;
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
    }
    .rest {
      padding-bottom: 20px;
      width: 100%;
      .title {
        display: inline-block;
        position: relative;
        margin: 20px auto;
        font-size: 14px;
        height: 24px;
        line-height: 24px;
        color: $color-gray-b;
        &:after,
        &:before {
          position: absolute;
          content: "";
          top: 12px;
          left: -50px;
          width: 40px;
          height: 1px; 
          background-color: $color-gray-b;
        }
        &:before {
          left: auto;
          right: -50px;
        }
      }
      .empty {
        padding: 20px;
        font-size: 16px;
        color: $color-black;
      }
      .wrap {
        display: flex;
        flex-wrap: wrap;
        padding: 0 10px;
        .list {
          display: flex;
          padding: 14px 8px;
          box-shadow: 0px 1px 3px rgba(169, 169, 169, 0.5);
	        border-radius: 4px;
          width: 50%;
          background-color: #f7f7f7;
          .img {
            width: 40px;
            height: 40px;
          }
          .text {
            flex: 1;
            padding-left: 8px;
            text-align: left;
          }
          .name {
            font-size: 12px;
            color: #666;
          }
          .large {
            font-size: 14px;
            color: #333;
          }
          .tel {
            padding: 4px 0;
            font-size: 12px;
            color: #606060;
          }
          .more {
            font-size: 12px;
            color: $color-blue;
          }
        }
      }
    }
  }
</style>
