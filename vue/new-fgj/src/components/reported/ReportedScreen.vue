<template lang="html">
  <!-- 筛选 -->
  <section class="lc r-screen">
    <header class="head-title">
      <i class="el-icon-arrow-left icon" @click="_back"></i>
      <h3 class="title">筛选</h3>
      <span class="r-head-btn" @click="_empty">清空</span>
    </header>
    <section class="r-center">
      <!-- 公司先留着 -->
      <div class="r-list">
        <span class="title">公司：</span>
        <Select v-model="SDeptNo" filterable clearable placeholder="输入关键字搜索">
          <Option v-for="(item, index) in deparTmentData" :value="item.value" :key="index">{{ item.label }}</Option>
        </Select>
      </div>
      <div class="r-list">
        <span class="title">楼盘：</span>
        <el-select v-model="estate" placeholder="请选择楼盘" class="select">
          <el-option label="全部" value=""></el-option>
          <el-option
            v-for="(item, index) in estateData"
            :key="index"
            :label="item.EstateName"
            :value="item.EstateID">
          </el-option>
        </el-select>
      </div>
      <div class="r-list">
        <span class="title">时段：</span>
        <el-select v-model="filing" placeholder="请选择时间段" class="select">
          <el-option label="不限" value=""></el-option>
          <el-option
            v-for="(item, index) in filingData"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <div class="r-list">
        <span class="title">排序：</span>
        <el-select v-model="order" placeholder="请选择报备时间排序" class="select">
          <el-option
            v-for="(item, index) in orderData"
            :key="index"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </div>
      <!-- 确定按钮 -->
      <div class="r-btn">
        <el-button class="r-btn-w" type="primary" icon="el-icon-search" @click="search">搜索</el-button>
      </div>
    </section>
  </section>
</template>

<script>
  import { getDepartment, getEstate } from '@/api/reported/reported'
  import { mapActions } from 'vuex'

  export default {
    data() {
      return {
        deparTmentData: [],   // 公司数据
        estateData: [],     // 楼盘数据
        filingData: [      // 手动填写，时间段
          {
            label: '当天',
            value: 'day'
          },{
            label: '3天内',
            value: 'threeday'
          },{
            label: '本周',
            value: 'week'
          },{
            label: '本月',
            value: 'month'
          }
        ],
        orderData: [    // 手动填写，排序
          {
            label: '报备时间升序',
            value: 'DeclareDate-asc'
          },
          {
            label: '报备时间降序',
            value: 'DeclareDate-desc'
          }
        ],
        SDeptNo: '',     // 公司
        estate: '',      // 选中的楼盘
        filing: '',     // 选中的时段
        order: ''       // 选中的排序
      }
    },
    created() {
      this._getDeparTment()
      this._getEstate()
    },
    mounted() {
      // this.$nextTick(function () {
           // 获取输入框，监听focus和blur
      //   console.log(document.getElementsByClassName('ivu-select-input')[0])
      //   this.inputSDeptNo = document.getElementsByClassName('ivu-select-input')[0]

      //   this.inputSDeptNo.addEventListener('focus', function() {
      //     console.log('focus')
      //     console.log(document.getElementsByClassName('ivu-select-dropdown')[0])
      //   })
      //   this.inputSDeptNo.addEventListener('blur', function() {
      //     console.log('blur')
      //   })
      // })
    },
    methods: {
      search() {      // 搜索按钮
        // 处理 SDeptNo
        // console.log(this.SDeptNo)
        let number = this.SDeptNo
        if (this.SDeptNo) {
          let str = this.SDeptNo.split(',')
          number = str[1]
        }
        let obj = {
          SDeptNo: number,
          EstateID: this.estate,
          filing: this.filing,
          order: this.order
        }
        this.acscreen(obj)      // 这里只能用同步不能用异步
        this.$router.back()
      },
      _getDeparTment() {      // 获取公司数据
        getDepartment().then((res) => {
          this.deparTmentData = res.data
        })
      },
      _getEstate() {    // 获取楼盘数据
        getEstate().then((res) => {
          this.estateData = res.data.tempTable
        })
      },
      _empty() {      // 清空筛选数据
        this.SDeptNo = ''
        this.estate = ''
        this.filing = ''
        this.order = ''
      },
      _back() {
        this.$router.back()
      },
      ...mapActions([
        'acscreen'
      ])
    }
  }
</script>

<style scoped lang="scss">
  // mixin方法，因为不太好自己建文件，所以写在这里
  @mixin border-b-1px($cost) {
    position: relative;
    &:after{
      content: '';
      display: block;
      position: absolute;
      left: 0;
      bottom: $cost;
      z-index: 9;
      width: 100%;
      border-bottom: 1px solid rgba(203, 203, 203, 0.6); // #cbcbcb; 1px 边框的颜色很重要
      @media only screen and (-webkit-min-device-pixel-ratio: 2), only screen and (min-device-pixel-ratio: 2) {
        transform: scaleY(0.5);
        transform-origin: bottom;
      }
      @media only screen and (-webkit-min-device-pixel-ratio: 3), only screen and (min-device-pixel-ratio: 3) {
        transform: scaleY(0.333);
        transform-origin: bottom;
      }
    }
  }

  .r-screen {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 11;
    background-color: #fff;
    .head-title {
      @include border-b-1px(0);
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      width: 100%;
      height: 45px;
      line-height: 45px;
      background-color: #fff;
      .icon {
        width: 45px;
        line-height: 45px;
        color: #409EFF;
        font-size: 20px;
      }
      .title {
        flex: 1;
        font-size: 16px;
      }
      .r-head-btn {
        width: 45px;
        font-size: 14px;
        color: #FA5555;
      }
    }
    .r-center {
      .ivu-select-single .ivu-select-selection {
        border: 0;
      }
      text-align: left;
      .r-list {
        margin-top: 10px;
        padding:  0 16px;
        display: flex;
        align-items: center;
        .title {
          padding-right: 5px;
          font-size: 14px;
          color: #5A5E66;
        }
        .select {
          flex: 1;
          @include border-b-1px(0);
        }
      }
      .r-btn {
        margin-top: 100px;
        text-align: center;
        .r-btn-w {
          width: 60%;
        }
      }
    }
  }
</style>
