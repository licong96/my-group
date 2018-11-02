<template lang="html">
  <!-- 我的报备 -->
  <section class="my-report">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <h3 class="title">我的报备</h3>
    </header>
    <!-- 导航 -->
    <nav class="nav"></nav>
  </section>
</template>

<script>
  export default {
    methods: {
      back() {
        this.$router.back()
      }
    }
  }
</script>

<style scoped lang="scss">
</style>
