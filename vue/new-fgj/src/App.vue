<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>

<script>
  var loaderFooter = document.getElementById('loaderFooter')
  
  export default {
    data () {
      return {
        msg: 'Want something new?'
      }
    },
    created() {
      loaderFooter.innerHTML = 'created运行成功'
    },
    mounted() {
      loaderFooter.innerHTML = '可以点右上角三个点，在浏览器中打开'
      loaderFooter.style.display = 'none'
    },
    methods: {
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import 'common/css/reset.css'

  body, html
    height 100%

  #app
    font-family: 'Helvetica Neue',Helvetica,sans-serif;
    text-align: center;
    font-size: 14px;
    height 100%;
</style>
