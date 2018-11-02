<template lang="html">
  <!-- 什么都没有搜到 -->
  <section class="lc-empty">
    <i class="iconfont icon-meiyougengduo1"></i>
    <p class="desc">{{desc}}</p>
  </section>
</template>

<script>
  export default {
    props: {
      desc: {
        type: String,
        default: '没有找到相关数据'
      }
    }
  }
</script>

<style scoped lang="scss">
  .lc-empty {
    padding: 30px;
    background: #fff;
    text-align: center;
    .iconfont {
      font-size: 60px;
      color: #878D99;
    }
    .desc {
      padding-top: 10px;
      font-size: 14px;
      color: #878D99;
    }
  }
</style>
