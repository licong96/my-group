<template lang="html">
  <!-- 成交转化率暂无 -->
  <section class="echarts">
    <empty desc="成交转化率暂无"></empty>
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
