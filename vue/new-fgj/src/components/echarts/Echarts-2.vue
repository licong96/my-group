<template lang="html">
  <!-- 用户登陆时段 -->
  <section class="echarts">
    <empty desc="用户登陆时段暂无"></empty>
  </section>
</template>

<script>
  import Empty from '@/base/Empty'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    mounted () {
      setTimeout(() => {
        this.setLoaderCenter(false)
      }, 1000)
    },
    methods: {
      ...mapActions([
        'setLoaderCenter'
      ])
    },
    components: {
      Empty
    }
  }
</script>

<style scoped lang="scss">
</style>
