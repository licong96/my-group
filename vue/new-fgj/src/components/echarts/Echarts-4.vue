<template lang="html">
  <!-- 抢客图表 -->
  <section class="echarts">
    <div class="lc-statistics">
      <span class="list" v-for="(item, index) in statistics" :key="index" v-show="item.dataname && item.count!=0">{{item.dataname}}:{{item.count}}</span>
    </div>
    <div class="box" ref="echarts" style="width: 100%; height: 400px;" v-show="IsShow"></div>
    <empty v-show="!IsShow" :desc="desc"></empty>
  </section>
</template>

<script>
  import Empty from '@/base/Empty'
  import { MixinEcharts } from '@/common/js/mixin'

  export default {
    mixins: [MixinEcharts],
    data() {
      return {
        type: 'GrabInquiryStatistics',   // 接口的type
        IsShow: true,
        desc: '没有满足筛选条件的结果',
        screenCond: {   // 保存当前的筛选条件
          dateType: 'week'      // 默认本周，如果选择了时间段，那就是自定义，值是 customize
        },
        statistics: [],
        myChart: null
      }
    },
    activated() {
      // console.log('当前部门', this.screenCond.bumen)
      this.setEchartCurrent(this.screenCond)      // 把当前选中筛选条件保存，传给筛选组件，以供显示

      this.setIsShowScreen({      // 显示部门和人员筛选
        timeType: true,
        SDeptNo: true,
        SEmpID: true,
        DatePeriod: true
      })
    },
    watch: {
      echartScreen(newVal) {      // 监听筛选变化，只修改当前对应的页面
        if (newVal.name === '抢客图表') {
          // console.log('抢客图表,筛选条件改变了，去请求数据', newVal)
          this.screenCond = newVal      // 保存拿到的筛选条件
          let obj = {
            dNo: newVal.SDeptNo,
            eID: newVal.SEmpID,
            DatePeriod: newVal.DatePeriod
          }
          this._getData(newVal.dateType, obj)
        }
      }
    },
    components: {
      Empty
    }
  }
</script>

<style scoped lang="scss">
</style>
