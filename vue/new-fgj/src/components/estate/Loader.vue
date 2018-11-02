<template lang="html">
  <!-- 小球加载中 -->
  <section class="loader-wrap">
    <div class="loader">
      <span class="loader loader-quart"></span>
    </div>
    <p class="desc">{{desc}}</p>
  </section>
</template>

<script>
  export default {
    props: {
      desc: {        // 已此判断是返回上一个路由，还是隐藏掉，添加楼盘才用得到
        type: String,
        default: '加载中'
      }
    }
  }
</script>

<style scoped lang="scss">
  .loader-wrap {
    position: relative;
    .desc {
      position: fixed;
      top: 50%;
      left: 0;
      z-index: 20;
      padding-top: 30px;
      width: 100%;
      text-align: center;
      color: #878D99;
    }
  }
  .loader {
    display: inline-block;
    vertical-align: middle;
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 20;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
  }

  .loader-quart {
    border-radius: 50px;
    border: 6px solid rgba(0, 0, 0, 0.1);
    // border: 6px solid rgba(255, 51, 85, 0.4);
  }

  .loader-quart:after {
    content: '';
    position: absolute;
    top: -6px;
    left: -6px;
    bottom: -6px;
    right: -6px;
    border-radius: 50px;
    border: 6px solid transparent;
    // border-top-color: #FFF;
    border-top-color: #409EFF;
    animation: spin .6s linear infinite;
  }

  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
</style>
