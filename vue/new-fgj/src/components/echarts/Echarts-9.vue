<template lang="html">
  <!-- 到访转化率 -->
  <section class="echarts">
    <div class="box" ref="echarts" style="width: 100%; height: 400px;" v-show="IsShow"></div>
    <empty v-show="!IsShow" :desc="desc"></empty>
  </section>
</template>

<script>
  import Empty from '@/base/Empty'
  import Echarts from '@/common/js/echarts.js'
  import { getEcharts } from '@/api/echarts/echarts.js'
  import { mapGetters, mapActions } from 'vuex'

  export default {
    data() {
      return {
        type: 'VisitConversionRateStatistics',   // 接口的type
        IsShow: true,
        desc: '没有满足筛选条件的结果',
        screenCond: {   // 保存当前的筛选条件
          dateType: 'week'      // 默认本周
        },
        myChart: null
      }
    },
    created () {
    },
    mounted () {
      this._getData(this.screenCond.dateType)   // 获取本周默认数据
      setTimeout(() => {
        this.myChart = Echarts.init(this.$refs.echarts)
      }, 20)
    },
    activated() {
      // console.log('当前部门', this.screenCond.bumen)
      this.setEchartCurrent(this.screenCond)      // 把当前选中筛选条件保存，传给筛选组件，以供显示

      this.setIsShowScreen({      // 显示部门和人员筛选
        timeType: true,
        SDeptNo: true,
        SEmpID: true
      })
    },
    computed: {
      ...mapGetters([
        'echartScreen'
      ])
    },
    methods: {
      _getData(dateType = 'week', obj = {}) {    // 获取数据
        // week （本周）| month （本月）| year （今年）
        if (this.myChart) {
          this.myChart.showLoading()
        }
        this.IsShow = true
        getEcharts(this.type, dateType, obj).then((res) => {     // dateType 默认本周 week
          this.setLoaderCenter(false)
          let data = res.data

          let opt = {}      // 图表参数

          if (dateType === 'week') {
            opt.zoomEnd = 100
          } else if (dateType === 'month') {
            opt.zoomEnd = 20
          } else if(dateType === 'year') {
            opt.zoomEnd = 50
          } else {
            opt.zoomEnd = 100
          }

          // data必须有值才更新图表，否则隐藏掉
          if (data.data && data.data.length) {
            this.initOption(data, opt)
          } else {
            this.IsShow = false
          }

          this.myChart.hideLoading()
        }).catch((error) => {
          this.setLoaderCenter(false)
          this.IsShow = false
          this.$message.error('请求失败', error)
        })
      },
      initOption(data, opt) {      // 指定图表的配置项和数据
        // data是数据，opt是修改参数
        let dataName = []
        let dataSeries = []
        let tooltipData = []

        // 因为筛选后的data数据个数是不一样的，所以通过这种方式赋值
        data.data.forEach((item) => {
          dataName.push(item.dataname)

          let baz = item.item[0].split(',')     // 最后一个是转化率，先拆分
          let last = Math.floor(baz[baz.length - 1]*100) / 100   // 最后一位保留两位小数
          baz[baz.length - 1] = last

          tooltipData.push(baz)          // 保存起来，用来显示

          let obj = {
            name: item.dataname,
            value: baz[1]         // 图形用到访
          }
          dataSeries.push(obj)
        })

        this.myChart.setOption({
          tooltip : {
            trigger: 'item',
            formatter: function (params) {
              let name = params.name
              let data = tooltipData[params.dataIndex]
              let str = `${name}<br/>录入：${data[0]}<br/>到访：${data[1]}<br/>转化率：${data[2]}<br/>`
              return str
            }
          },
          legend: {
            orient: 'vertical',
            left: 'left',
            data: dataName
          },
          grid: {
            top: '10%',
            left: '1%',
            right: '5%',
            containLabel: true
          },
          // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
          color: ['#409EFF', '#F56C6C', '#E6A23C', '#d48265'],
          textStyle: {
            color: '#333'
          },
          series : [
            {
              name: '到访转化率',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:dataSeries,
              itemStyle: {
                emphasis: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
          // series: dataSeries
        }, true)      // 设置 true 可以更新掉多余的data数据
      },
      ...mapActions([
        'setEchartCurrent',
        'setIsShowScreen',
        'setLoaderCenter'
      ])
    },
    watch: {
      echartScreen(newVal) {      // 监听筛选变化，只修改当前对应的页面
        if (newVal.name === '到访转化率') {
          // this.dateType = newVal.dateType
          // console.log('筛选条件改变了，去请求数据', newVal)
          this.screenCond = newVal      // 保存拿到的筛选条件，切换的是要再传给筛选组件，进行显示
          let obj = {
            dNo: newVal.SDeptNo,
            eID: newVal.SEmpID
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
