<template lang="html">
  <!-- 首页 -->
  <section class="home" v-show="isShow">
    <p class="title">快捷导航</p>
    <ul class="list-wrap">
      <li class="list">
        <router-link to="inquiry">报备</router-link>
      </li>
      <li class="list">
        <router-link to="visit">辨客</router-link>
      </li>
      <li class="list">
        <router-link to="reception">接待</router-link>
      </li>
      <li class="list">
        <router-link to="transfer">公客池</router-link>
      </li>
      <li class="list">
        <router-link to="addition">楼盘添加</router-link>
      </li>
      <li class="list">
        <router-link to="estate">楼盘列表</router-link>
      </li>
      <li class="list">
        <router-link to="reported">报备大厅</router-link>
      </li>
      <li class="list">
        <router-link to="organization">组织架构</router-link>
      </li>
      <li class="list">
        <router-link to="install/addressList">通讯录</router-link>
      </li>
      <li class="list">
        <router-link to="tools/judgment">判单工具</router-link>
      </li>
      <li class="list">
        <router-link to="echarts/1">图表统计</router-link>
      </li>
      <li class="list">
        <router-link to="propertyAdd">房源新增</router-link>
      </li>
      <li class="list">
        <router-link to="propertyList">房源列表</router-link>
      </li>
      <li class="list">
        <router-link to="control">销控管理</router-link>
      </li>
      <li class="list">
        <router-link to="contractAdd">合同录入</router-link>
      </li>
      <li class="list">
        <router-link to="contractList">合同列表</router-link>
      </li>
      <li class="list">
        <router-link to="account">对账单</router-link>
      </li>
      <li class="list">
        <router-link to="accountList">对账单列表</router-link>
      </li>
      <li class="list">
        <router-link to="process">管理流程</router-link>
      </li>
    </ul>
  </section>
</template>

<script>
  import { getCookie } from '@/utils/auth'

  export default {
    data() {
      return {
        isShow: false
      }
    },
    created() {
      if (getCookie('CEmpID') !== 'D4A089A0DDAD4EA799433A6D19DAFF17') {
        this.$router.push({
          path: '/inquiry'
        })
      } else {
        this.isShow = true
      }
    },
    methods: {
    }
  }
</script>

<style scoped lang="scss">
  @import "../common/sass/variable";

  .home {
    .title {
      padding-top: 15px; 
      font-size: 14px;
    }
    .list-wrap {
      padding: 10px;
      display: flex;
      flex-wrap: wrap;
      .list {
        padding: 10px;
        width: 33.33%;
        font-size: 14px;
        a {
          display: block;
          box-shadow: 0 1px 4px 2px rgba(0, 0, 0, 0.1);
          border-radius: 4px;
          width: 100%;
          height: 50px;
          color: $color-text-3;
          line-height: 50px;
          background-color: #fff;
        }
      }
    }
  }
</style>
