import Echarts from '@/common/js/echarts.js'
import { getEcharts } from '@/api/echarts/echarts.js'
import { mapGetters, mapActions } from 'vuex'

import Sideslip from "@/base/Sideslip";
import Loader from "@/base/Loader";
import Empty from "@/base/Empty";
import Scroll from "@/base/BScroll";
import LoaderCenter from "@/base/LoaderCenter";
import Confirm from "@/base/Confirm";
import {
  GetMessagePageListByType,
  MessageSetReader
} from "@/api/mail/mailList";
import { prefixStyle } from "@/utils/index";
const transform = prefixStyle("transform");

// 线形图表
export const MixinEcharts = {
  mounted() {
    setTimeout(() => {
      this._getData(this.screenCond.dateType)   // 获取本周默认数据
      this.myChart = Echarts.init(this.$refs.echarts)
    }, 20)
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
        if (res.data.result === 'success') {
          let data = res.data

          // 总数
          let arrStat = []
          data.data.forEach((list) => {
            let count = 0
            for (let i = 0; i < list.item.length; i++) {
              count += parseInt(list.item[i])
            }
            let obj = {
              dataname: list.dataname,
              count: count
            }
            arrStat.push(obj)
          })
          this.statistics = arrStat

          let opt = {}      // 图表参数
          let xlabLeng = data.xlab.length
          // 移动端缩放滑动
          if (xlabLeng <= 7) {
            opt.zoomEnd = 100
          } else if (xlabLeng > 7 && xlabLeng <= 14) {
            opt.zoomEnd = 70
          } else if (xlabLeng > 14 && xlabLeng <= 21) {
            opt.zoomEnd = 45
          } else if (xlabLeng > 21) {
            opt.zoomEnd = 20
          }
          
          // data必须有值才更新图表，否则隐藏掉
          if (data.data) {
            this.initOption(data, opt)
          } else {
            this.IsShow = false
          }

          this.myChart.hideLoading()
        } else {
          this.IsShow = false
          this.$message.error(res.data.result)
        }
      }).catch((error) => {
        this.setLoaderCenter(false)
        this.IsShow = false
        this.$message.error('catch捕获异常', error)
      })
    },
    initOption(data, opt) {      // 指定图表的配置项和数据
      // data是数据，opt是修改参数
      let dataName = []
      let dataSeries = []

      // 因为筛选后的data数据个数是不一样的，所以通过这种方式赋值
      data.data.forEach((item) => {
        dataName.push(item.dataname)

        let obj = {
          name: item.dataname,
          type: 'line',
          data: item.item,
          label: {
            normal: {
              show: true,
              position: 'top'
            }
          }
        }
        dataSeries.push(obj)
      })

      this.myChart.setOption({
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#6a7985'
            }
          }
        },
        legend: {
          data: dataName
        },
        grid: {
          top: '10%',
          left: '1%',
          right: '5%',
          containLabel: true
        },
        // color: ['#c23531','#2f4554', '#61a0a8', '#d48265', '#91c7ae','#749f83',  '#ca8622', '#bda29a','#6e7074', '#546570', '#c4ccd3'],
        color: ['#409EFF', '#F56C6C', '#E6A23C'],
        textStyle: {
          color: '#333'
        },
        xAxis: [
          {
            type: 'category',
            data: data.xlab
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        dataZoom: [
          {   // 这个dataZoom组件，默认控制x轴。
            type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: opt.zoomEnd         // 右边在 60% 的位置。
          },
          {   // 这个dataZoom组件，也控制x轴。
            type: 'inside', // 这个 dataZoom 组件是 inside 型 dataZoom 组件
            start: 0,      // 左边在 10% 的位置。
            end: opt.zoomEnd         // 右边在 60% 的位置。
          }
        ],
        series: dataSeries
      }, true)      // 设置 true 可以更新掉多余的data数据
    },
    ...mapActions([
      'setEchartCurrent',
      'setIsShowScreen',
      'setLoaderCenter'
    ])
  }
}


// 邮件列表
export const mailList = {
  data() {
    return {
      likestr: "", // 搜索
      // MessageType: "系统", // 类型
      page: 1, // 页数
      touchSides: "", // 滑动组件
      previousEl: null,
      paramRight: {
        isSides: true, // 是否允许滑动
        style: {
          width: "100px",
          right: "-100px"
        },
        btnStyle1: {
          width: "100px"
        }
      },
      listData: [], // 列表数据
      hasMore: true, // 数据加载中
      isOnceData: false // 限制重复加载
    };
  },
  created() {
    this.pullup = true; // 开启上滑加载更多
    this._GetMessagePageListByType(); // 获取数据
  },
  methods: {
    onReply(item) {
      // 标记已读
      MessageSetReader(item.MessageID).then(res => {
        if (res.data.result === "success") {
          this.$message.success("成功标记已读");
          item.UnReadCount = "0" // 未读数设为0
        } else if (res.data.result === "权限不足") {
          this.$message.error("权限不足");
          setTimeout(
            "var referrer = '/Login.html?redirect=" +
            res.data.URL +
            "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;",
            1000
          );
        } else {
          this.$message.error(res.data.msg);
        }
      });
    },
    scrollToEnd() {
      // 上滑加载更多
      if (this.isOnceData) {
        return;
      }
      this.isOnceData = true; // 限制加载一次
      this.hasMore = true;
      this.page++;
      GetMessagePageListByType(this.likestr, this.MessageType, this.page)
        .then(res => {
          this.hasMore = false;
          this.isOnceData = false;
          if (res.data.result === "success") {
            this.listData = this.listData.concat(res.data.tempTable); // 拼在一起
            this._checkMore(res.data.tempTable);
          } else if (res.data.result === "权限不足") {
            this.$message.error("权限不足");
            setTimeout(
              "var referrer = '/Login.html?redirect=" +
              res.data.URL +
              "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;",
              1000
            );
          } else {
            this.$message.error(res.data.msg);
          }
        })
        .catch(err => alert("网络异常：" + err));
    },
    _GetMessagePageListByType() {
      // 获取数据
      this.listData = [];
      this.page = 1;
      this.hasMore = true;
      this.isOnceData = true;
      GetMessagePageListByType(this.likestr, this.MessageType, this.page)
        .then(res => {
          this.hasMore = false;
          this.isOnceData = false;
          if (res.data.result === "success") {
            this.listData = res.data.tempTable;
            this._checkMore(res.data.tempTable);
          } else if (res.data.result === "权限不足") {
            this.$message.error("权限不足");
            setTimeout(
              "var referrer = '/Login.html?redirect=" +
              res.data.URL +
              "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;",
              1000
            );
          } else {
            this.$message.error(data.msg);
          }
        })
        .catch(err => alert("网络异常：" + err));
    },
    _checkMore(data) {
      // 判断是否拿到更多数据，没有的话就不要再去滑动加载了
      if (!data.length || data.length < 10) {
        this.isOnceData = true;
        return;
      }
    },
    onTouchStart(item) {
      // 开始的时候，要判断当前这条数据的状态，能显示多少按钮和大小
      if (item.UnReadCount === "0") {
        this.paramRight.isSides = false;
      } else {
        this.paramRight.isSides = true;
      }
    },
    previous(el) {
      this.previousEl = el;
    },
    onTouchSides(Bool) {
      this.touchSides = Bool;
    },
    clearTouchEl() {
      this.touchSides = "";
      this.previousEl.el.style[transform] = `translate3d(0, 0, 0)`; // 清除上一个
    }
  },
  components: {
    Sideslip,
    Loader,
    Empty,
    Scroll,
    LoaderCenter,
    Confirm
  }
}