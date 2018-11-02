<template lang="html">
  <!-- 房源列表 -->
  <section class="lc property-list max-auto">
    <section class="head-fixed">
      <div class="header-bg max-auto">
        <header class="lc header">
          <i class="el-icon-arrow-left icon" @click="back"></i>
          <h3 class="title">房源列表({{resultcount}})</h3>
          <!-- <span class="right-span">新建</span> -->
          <i class="right-span el-icon-plus" @click="openAdd"></i>
        </header>
        <!-- 搜索 -->
        <search placeholder="请输入客户电话后四位或全号查询" @query="query"></search>
        <!-- 筛选 -->
        <div class="screen max-auto" @click="_visibleMake">
          <div class="branch lc-sort">
            <Cascader
              :data="options1"
              placeholder="选择部门"
              v-model="section1Val"
              clearable
              change-on-select
              :render-format="format"
            ></Cascader>
          </div>
          <div class="branch estate" @click="_visibleMake">
            <Select v-model="section2Val" clearable :disabled="options2.length===0" placeholder="选择人员">
              <Option v-for="item in options2" :value="item.value" :key="item.value">{{item.label}}</Option>
            </Select>
          </div>
          <div class="branch-menu" @click="openMore">
            <span class="text">更多筛选</span>
            <i class="el-icon-menu"></i>
          </div>
        </div>
      </div>
    </section>
    <!-- 列表数据 -->
    <section class="main">
      <scroll
      :data="listData"
      :listemScroll="listemScroll"
      :pullup="pullup"
      :bounce="bounce"
      :momentum="momentum"
      @scrollToEnd="upLoad">
        <ul class="list-wrap">
          <li class="list" v-for="(item, index) in listData" :key="index" @click="openDetails(item.PropertyID)">
            <div class="top-center">
              <div class="img-wrap">
                <img class="img" :src="smPath(item.PicSrc)" alt="">
                <div class="label">
                  <i class="iconfont icon-biaoqian1" :class="{'success': item.Trade==='出租'}"></i>
                  <span class="text">{{item.Trade}}</span>
                </div>
              </div>
              <div class="text-center">
                <div class="top-title">
                  <h3 class="name">{{item.EstateName}}</h3>
                  <!-- <i class="el-icon-location-outline"></i> -->
                  <span class="text-r-top">no.98123</span>
                </div>
                <div class="area-wrap">
                  <span class="area-l">{{item.Square}}m²</span>
                  <span class="area-m">{{item.PropertyDirection}}</span>
                  <span class="area-r" v-show="item.Trade==='出售'">{{parseInt(item.Price)}}{{item.UnitName}}</span>
                  <span class="area-r" v-show="item.Trade==='出租'">{{parseInt(item.RentPrice)}}{{item.RentUnitName}}</span>
                </div>
                <div class="room-wrap">
                  <span>{{item.CountF}}房{{item.CountT}}厅{{item.CountW}}卫</span>
                  <span class="room-r" v-show="item.Trade==='出售'">{{parseInt(item.PriceUnit)}}元/m²</span>
                  <span class="room-r" v-show="item.Trade==='出租'">{{parseInt(item.RentPriceUnit)}}元/m²</span>
                </div>
                <div class="tag-wrap">
                  <span class="lc tag" :class="tagClass(index)" v-for="(tag, index) in item.Tag">{{tag}}</span>
                </div>
              </div>
            </div>
            <div class="bottom-time">
              <span class="in-left">录入：{{item.DeptName}}-<small class="small">{{item.EmpName}}</small></span>
              <span class="in-right">{{item.RegDate}}</span>
            </div>
          </li>
        </ul>
        <!-- 加载中 -->
        <loader v-show="hasMore"></loader>
        <!-- 什么都没有 -->
        <empty v-show="!hasMore && !listData.length" desc="没有找到相关房源"></empty>
      </scroll>
    </section>
    <!-- 更多筛选组件 -->
    <screen ref="screen" :IsHide="screenIsHide" :isOneOff="isOneOff" @select="onSelect" @empty="selectEmpty"></screen>
    <!-- 打开筛选后放置滑动的遮罩，一上一下 -->
    <div class="screen-make-top" v-show="IsScreen" @click="clearScreen"></div>
    <div class="screen-make" v-show="IsScreen" @click="clearScreen"></div>
    <!-- 子路由 -->
    <transition name="transX">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  import Search from '@/base/Search'
  import Scroll from '@/base/BScroll'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import Screen from '@/base/Screen'
  import { getpagedata, GetDepartmentJson, GetEmployeeJson } from '@/api/property/propertyList'
  import { classie } from '@/common/js/dom'
  import { vipfgj } from '@/common/js/config'

  export default {
    data() {
      return {
        listData: [],     // 列表数据
        paramsItem: {     // 要传入的参数
          todo: 'Property',
          type: 'getpagedata',
          needpurview: true,
          valiurl: document.URL,
          page: 1         // 页数
        },
        options1: [],    // 选择部门
        options2: [],   // 选择人员
        options3: [     // 时段
          {
            value: "不限",
            label: "不限"
          },
          {
            value: "day",
            label: "当天"
          },
          {
            value: "threeday",
            label: "3天内"
          },
          {
            value: "week",
            label: "本周"
          },
          {
            value: "month",
            label: "本月"
          }
        ],
        options4: [     // 排序
          {
            value: "ASC",
            label: "未接待、到访时间降序"
          },
          {
            value: "DFASC",
            label: "已接待、接待时间升序"
          },
          {
            value: "DFDESC",
            label: "已接待、接待时间降序"
          }
        ],
        section1Val: [],   // 部门筛选，选中的值
        section2Val: [],   // 人员筛选，选中的值
        filing: '',     // 时段
        order: '',      // 排序
        hasMore: false, // 加载中
        IsScreen: false, // 如果触发了筛选，那就打开这个透明的遮罩
        resultcount: 0,   // 总共拿到多少条数据
        isOneOff: true,   // 直接获取标签选项数据
      }
    },
    created () {
      this.listemScroll = false   // 派发滚动
      this.bounce = false     // 关闭弹动
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载

      this.screenIsHide = {   // 决定显示哪个筛选条件
        DatePeriod: true,
        propertyTag: true,
        status: true,
        propertyOrder: true,
        rangPrice: true,
        rangSquare: true
      }

      this._getpagedata()
      this._GetDepartmentJson()
      // ivu-visible      ivu-cascader-visible
      // ivu-select    选中后会添加这个class: ivu-select-visible
    },
    mounted() {
      this.$nextTick(() => {
        this.elCascader = document.querySelector('.ivu-cascader')   // 缓存元素
        this.elASelect = document.querySelectorAll('.ivu-select')
      })
    },
    methods: {
      openDetails(id) {     // 打开详细页
        this.$router.push({
          path: `/propertyList/${id}`
        })
      },
      clearScreen() {     // 关闭筛选遮罩
        this.IsScreen = false
      },
      _visibleMake() {
        /**
        这里的逻辑是：
          打开筛选后，要有一个透明的遮罩，盖住列表和上面搜索等地方，筛选完成之前不允许操作其他东西，点击这个遮罩可以收起筛选
          但是这个ui组件没有提供类似focus事件方法，让我监听到它是否打开和关闭，这就很烦
          我不能单纯用点击事件模拟，因为相互之间的切换会很烦
          但是我发现筛选是否打开，会有一个特点，就是多了一个class
          我可以判断有没有这个class，来区分是否打开了筛选，以此来显示透明遮罩
          部门class是          ivu-cascader-visible
          其他三个的class是    ivu-select-visible
         */
        setTimeout(() => {
          let cascader = this.elCascader    // 部门用的是cascader
          let aSelect = this.elASelect
          let IsOff = false

          if (classie.hasClass(cascader, 'ivu-cascader-visible')) {
            IsOff = true
          }
          for (let i = 0; i < aSelect.length; i++) {
            if (classie.hasClass(aSelect[i], 'ivu-select-visible')) {
              IsOff = true
            }
          }
          if (IsOff) {
            this.IsScreen = true
          } else {
            this.IsScreen = false
          }
        }, 20)
      },
      upLoad() {      // 上滑加载更多
        if (!this.hasMore) {
          return
        }
        this.paramsItem.page++
        getpagedata(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            let datas = this._splitTag(res.data.tempTable)
            this.listData = this.listData.concat(datas)   // 拼在一起
            this._checkMore(datas)
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _getpagedata() {    // 数据列表
        this.IsScreen = false     // 关闭筛选遮罩
        this.listData = []
        this.paramsItem.page = 1
        this.hasMore = true     // 加载中
        getpagedata(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            this.listData = this._splitTag(res.data.tempTable)
            this._checkMore(this.listData)
            this.resultcount = res.data.resultcount       // 总共多少条数据
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch((error) => {
          console.log(error)
          this.$message.error('错误信息：', error)
        })
      },
      _checkMore(data) {    // 判断是否拿到更多数据
        if (!data.length || data.length < 10) {
          this.hasMore = false
          return
        }
      },
      _splitTag(data) {        // 处理数据
        let arr = []
        if (data.length) {
          data.forEach(item => {
            let tagArr = item.Tag.split('|')      // 拆分tag
            let newTag = []
            tagArr.forEach(tag => {
              if (tag) {
                newTag.push(tag)
              }
            })
            item.Tag = newTag
            arr.push(item)
          })
        }
        return arr
      },
      tagClass(num) {     // tag 添加class颜色
        return `color-${num % 6}`
      },
      _GetEmployeeJson(id) {    // 根据部门id获取人员
        GetEmployeeJson(id).then((res) => {
          this.options2 = eval(res.data)   // 拿到的是字符串，需要用 eval方法，用JSON.parse没用
        })
      },
      _GetDepartmentJson() {
        GetDepartmentJson().then(res => {
          this.options1 = res.data
        })
      },
      format(labels, selectedData) {      // 下拉筛选部门，自定义显示
        const index = labels.length - 1;
        const data = selectedData[index] || false
        return labels[index]
      },
      selectEmpty(obj) {   // 清空筛选
        console.log('清空筛选', obj)
        this.paramsItem = {
          todo: 'Property',
          type: 'getpagedata',
          needpurview: true,
          valiurl: document.URL,
          likestr: ''
        }
        this.section1Val = []    // 只要清空部门，watch里面有清除人员操作
        this._getpagedata()
      },
      openMore() {    // 打开更多筛选
        this.$refs.screen.openMore()
      },
      onSelect(obj) {      // 接收筛选条件
        obj.Tag = obj.propertyTag     // 筛选拿到的是propertyTag
        obj.order = obj.propertyOrder     // 筛选拿到的是propertyOrder
        // delete obj.propertyTag
        // delete obj.propertyOrder
        this.paramsItem = Object.assign({}, this.paramsItem, obj)   // 合并筛选条件
        console.log(this.paramsItem)
        this._getpagedata()
      },
      query(newVal) {
        this.paramsItem.likestr = newVal
        this._getpagedata()
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj${join}` 是本地测试用的
        if (paths.includes('sm_')) {
          return `${vipfgj}${paths}`
        } else {
          let resol = paths.split('/')
          let leng = resol.length - 1
          resol[leng] = 'sm_' + resol[leng]
          let join = resol.join('/')
          return `${vipfgj}${join}`
        }
      },
      back() {
        this.$router.back()
      },
      openAdd() {
        this.$router.push({
          path: '/propertyAdd'
        })
      }
    },
    watch: {
      section1Val(newVal) {      // 监听部门筛选
        console.log(Boolean(newVal))
        this.paramsItem.SEmpID = ''     // 每次更改部门都要清除人员
        this.section2Val = ''         // 还有人员显示
        if (newVal.length) {
          let len = newVal.length
          let id = newVal[len - 1].split(',')[0]    // 根据id拿人员
          let SDeptNo = newVal[len - 1].split(',')[1]   // 同时保存部门id，用来筛选
          this.paramsItem.SDeptNo = SDeptNo
          // this._getpagedata()
          this._GetEmployeeJson(id)
        } else {
          this.options2 = []
          this.section2Val = ''       // 如果部门等于空，那么人员也就是空
          this.paramsItem.SDeptNo = ''      // id全部等于空
          this.paramsItem.SEmpID = ''
          this._getpagedata()
        }
      },
      section2Val(newVal) {      // 监听人员筛选，清空也要发送请求
        // console.log(newVal)
        this.paramsItem.SEmpID = newVal     // 保存人员id，用来筛选
        this._getpagedata()
      },
      filing(newVal) {      // 监听时段
        this.paramsItem.filing = newVal
        // this._getpagedata()   // 去筛选
      },
      order(newVal) {      // 监听排序
        this.paramsItem.order = newVal
        // this._getpagedata()   // 去筛选
      }
    },
    components: {
      Search,
      Scroll,
      Empty,
      Loader,
      Screen
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/variable";
  @import "../../common/sass/mixin";

  .property-list {
    min-height: 100%;
    background-color: #f5f5f5;
  }
  .header-bg {
    background-color: #f5f5f5;
  }
  .head-fixed {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 9;
    width: 100%;
    background-color: #fff;
    .header {
      background: #409EFF;
      .icon,
      .title,
      .right-span  {
        color: #fff;
      }
      .el-icon-plus {
        font-size: 20px;
      }
    }
    .screen {
      display: flex;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      width: 100%;
      text-align: left;
      background-color: #fff;
      .branch {
        flex: 1;
        overflow: hidden;
        .el-input__inner {
          text-align: center;
          border: 0;
        }
      }
      .branch-menu {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #5A5E66;
        .text {
          padding-right: 4px;
          font-size: 14px;
        }
      }
    }
  }
  .main {
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 1;
    width: 100%;
    height: 100%;
    padding-top: 150px;
    padding-bottom: 10px;
    background-color: #f5f5f5;
  }
  .list-wrap {
    padding: 0 6px;
    text-align: left;
    background-color: #f5f5f5;
    .list {
      position: relative;
      z-index: 1;
      margin-bottom: 10px;
      padding: 10px;
      box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      width: 100%;
      background-color: #fff;
    }
    .top-center {
      display: flex;
      padding-bottom: 10px;
      @include border-b-1px(0);
      .img-wrap {
        position: relative;
        width: 106px;
        height: 80px;
        .img {
          vertical-align: top;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .label {
          position: absolute;
          top: 0;
          left: 0;
        }
        .iconfont {
          position: absolute;
          top: 0;
          left: -4px;
          z-index: 2;
          font-size: 20px;
          color: $color-red;
          opacity: .9;
          &.success {
            color: $color-success;
          }
        }
        .text {
          position: absolute;
          top: 2px;
          left: 6px;
          z-index: 3;
          min-width: 40px;
          font-size: 12px;
          color: #fff;
        }
      }
      .text-center {
        flex: 1;
        padding-left: 10px;
        .top-title {
          position: relative;
          display: flex;
          flex-wrap: wrap;
        }
        .text-r-top {
          margin: -10px -10px 0 0;
          border-radius: 0px 0 0 20px;
          padding: 0 10px 0 16px;
          height: 20px;
          line-height: 20px;
          color: #fff;
          background: rgba(64, 158, 255, .9);
        }
        .name {
          flex: 1;
          font-size: 16px;
          color: $color-text-3;
          line-height: 1.2;
        }
        .area-wrap {
          display: flex;
          align-items: flex-end;
          padding-top: 4px;
          font-size: 14px;
          color: $color-text-9;
        }
        .area-m {
          padding-left: 10px;
        }
        .area-r {
          flex: 2;
          text-align: right;
          font-size: 16px;
          color: $color-red;
          font-weight: 600;
        }
        .room-wrap {
          display: flex;
          justify-content: space-between;
          padding-top: 7px;
          font-size: 14px;
          color: $color-text-6;
          .room-r {
            color: $color-red;
          }
        }
        .lc.tag {
          display: inline-block;
          margin-right: 5px;
          margin-top: 7px;
          border-radius: 2px;
          padding: 2px 4px;
          font-size: 11px;
          font-weight: 400;
        }
      }
    }
    .bottom-time {
      display: flex;
      justify-content: space-between;
      padding-top: 10px;
      font-size: 14px;
      .in-left {
        color: $color-text-6;
        .small {
          font-style: normal;
          padding: 0 3px;
          border-radius: 3px;
          border: 1px solid $color-blue;
          color: $color-blue;
          line-height: 1;
        }
      }
      .in-right {
        color: $color-text-9;
      }
    }
  }
  .screen-make-top {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 10;
    width: 100%;
    height: 92px;
    // background-color: rgba(255, 255, 255, .5);
  }
  .screen-make {
    position: fixed;
    top: 0;
    left: 0;
    z-index: 2;
    width: 100%;
    height: 100%;
    // background-color: rgba(255, 255, 255, .5);
  }
</style>
