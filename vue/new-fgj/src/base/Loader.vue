<template lang="html">
  <!-- 数据加载中 -->
  <section class="lc-loader">
    <i class="el-icon-loading"></i>
    <p class="desc">{{desc}}</p>
  </section>
</template>

<script>
  export default {
    props: {
      desc: {
        type: String,
        default: '加载中...'
      }
    }
  }
</script>

<style scoped lang="scss">
  .lc-loader {
    padding: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    .el-icon-loading {
      font-size: 20px;
      animation: rotating 1s linear infinite
    }
    .desc {
      font-size: 12px;
      margin-left: 4px;
    }
  }
</style>
