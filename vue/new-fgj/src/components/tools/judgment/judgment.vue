<template>
  <div class="customer-wrapper xb-judgment">
    <div class="top">
      <header class="lc header">
        <i class="el-icon-arrow-left icon" @click="_back"></i>
        <h3 class="title">判单工具</h3>
      </header>
      <Input v-model="input2" @on-enter="searchTel()" @on-blur="searchTel()" icon="ios-search-strong"
             placeholder="搜索关键字，如姓名，电话，标签..." style="width: 100%"></Input>
    </div>
    <div class="content">
      <div class="content-title">
        <Select v-model="estateValue" clearable  placeholder="请选择楼盘">
          <Option v-for="item in estateData" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
        <Select v-model="visitValue" clearable  placeholder="请选择到访方式">
          <Option v-for="item in visitDate" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
        <el-button @click="search()" size="small" type="success" style="margin-left: 5px">查询</el-button>
      </div>
        <!--列表-->
        <div class="customerWrapper page-loadmore-wrapper" ref="wrapper" v-loading.body="loading">
            <ul>
              <li class="item" v-for="(item,index) in customers" :key="index">
                <div class="el-checkbox-wrapper">
                  <el-checkbox v-show="checkShow" :label="item.InquiryID" @change="_check(item)">
                  </el-checkbox>
                </div>
                <div v-show="item.Remark&&!item.NickName" class="message" @click="tipShow(item,index)">{{item.Remark}}
                </div>
                <el-collapse :class="{'noStatus':item.Status==='无效','stopStatus':item.Status==='暂缓'}" accordion
                             @change="tipShow(item,index)">
                  <el-collapse-item>
                    <template slot="title">
                      <div :class="{'has': item.Remark !== ''}" style="height: 22px;flex: 1">
                        <p class="bold" style="font-size:14px">{{item.CustName}} </p>
                        <p class="limet" v-show="item.Remark">
                          {{item.NickName?item.NickName:item.Remark}}</p>
                      </div>
                      <span style="padding-right: 5px">{{item.CustMobile}}</span>
                      <span class="right">
                        <!--<i style="line-height: 44px" class="header-icon el-icon-information"></i>-->
                        <el-progress type="circle"
                                     :percentage="parseInt(item.CompletePercent!==''?item.CompletePercent:0)+parseInt(item.FollowPercent!==''?item.FollowPercent:0)+parseInt(item.FollowModelPercent!==''?item.FollowModelPercent:0)"
                                     :width="30" :stroke-width="3"></el-progress>
                      </span>
                    </template>
                    <p v-show="item.EmpName">录入：{{item.EmpName}}-{{item.RegDate}}</p>
                    <p v-show="item.LastDeclareDate">最后报备：{{item.LastDeclareDate}}</p>
                    <p v-show="item.visitdate">最后到访：{{item.visitdate}}</p>
                    <p v-show="item.LastDeclareExpDate && item.LastDeclareExpDate !== undefined">
                      报备到期：{{item.LastDeclareExpDate}}</p>
                    <div class="wrapper">
                    </div>
                  </el-collapse-item>
                </el-collapse>
              </li>
            </ul>
        </div>
    </div>

    <!--筛选更多-->
    <v-more :options4="op" ref="more" v-on:moreValue="listGoSearch" :likestr="paramsItem.likestr"
            v-on:moreParams="listMoreParams"></v-more>
  </div>
</template>

<script type="text/ecmascript-6">
  import more from '@/components/customer/more.vue'
  import { customer } from '@/api/inquiry/inquiry'      // 黎聪加上的接口
  import {estate,GetDepartmentJson} from '@/api/public'

  const cityOptions = []
  export default {
    data () {
      return {
        estateData:[], // 选择楼盘
        estateValue:[], // 楼盘数据

        visitValue:[], // 到访方式
        visitDate:[{value:'到访',label:'到访'},{value:'约访',label:'约访'},{value:'带访',label:'带访'}], // 到访方式列表
        oldLikestr: '',
        loading: false,
        likestr: '',
        input2: '',
        op: [], // 部门数据
        list: [],
        // stop
        paramsItem: {
          page: 1,
          likestr:''
        }, // 获取的参数
        customers: [],
        checkShow: false
      }
    },
    mounted () {
      // 楼盘数据
      estate().then((res) => {
        if (res.data.result === '权限不足') {
          this.$message.error('权限不足')
          setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000)
          return
        } else if (res.data.result === 'success') {
          eval(res.data.tempTable).forEach((value, index) => {
            const ss = {
              value: value.EstateID,
              label: value.EstateName
            }
            this.estateData.push(ss)
          })
        } else if (res.data.result === 'error') {
          console.log(res.data.msg)
        }
      }).catch((err) => {
        console.log(err)
      })
    },
    methods: {
      // 初始化
      zero () {
        this.checkArray = []
        this.checkedCities = []
        this.value1 = []
        this.checkShow = false
        this.input2 = ''
      },
      handleIconClick (ev) {
        console.log(ev)
      },
      // 备注显示
      tipShow (item, index) {
        if (item.Remark&&!item.NickName) {
          console.log(document.getElementsByClassName('el-collapse-item__wrap')[index].style.display)
          if (document.getElementsByClassName('message')[index].style.display === 'block') {
            document.getElementsByClassName('message')[index].style.display = 'none'
          } else {
            if (document.getElementsByClassName('el-collapse-item__wrap')[index].style.display === 'none') {
              console.log(1)
              document.getElementsByClassName('message')[index].style.display = 'block'
              return
            }
          }
        }
      },
      search(){
        this.customers.forEach((value,index,array)=>{})
      },
      // 跳转到更多
      _toMore () {
        this.$refs.more.show()
        if (this.op !== this.oldop) {
          // 获取部门数据
          GetDepartmentJson().then((res) => {
            if (res.data.result === '权限不足') {
              this.open('没有权限，请登入')
              return
            } else {
              if(res.data !== ''){
              this.op = eval(res.data)
              this.oldop = this.op
              }
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      },
      // 获取筛选后的数据
      listGoSearch (data) {
        this.loading = true
        console.log(data)
        if (data) {
          this.loading = false
          this.customers = data
          this.customers.forEach((value, index, array) => {
            cityOptions.push(value.InquiryID)
          })
          console.log('data:' + this.customers)
        }
      },
      // 获取筛选后的参数
      listMoreParams (data) {
        if (data) {
          this.paramsItem = data
        }
      },
      // 搜索框
      searchTel () {
        this.paramsItem.likestr = this.input2
        this.paramsItem.page = 1
        if (!this.isCheckMobile(this.likestr) && this.checkNumber(this.likestr)) {
          this.open('请检查电话号码格式是否正确')
          this.loading = false
          return
        }
        if(this.input2 ==='' && this.oldLikestr === ''){
          return
        }
        this.loading = true
        customer(this.paramsItem).then((res) => {
          console.log(res)
          if (res.data.result === '权限不足') {
            this.open('没有权限，请登入')
            return
          } else if (res.data) {
            this.oldLikestr = this.input2
            this.customers = eval(res.data.tempTable)
            this.customers.forEach((value, index, array) => {
              cityOptions.push(value.InquiryID)
            })
            this.loading = false
          } else if ((res.data.result === 'error')) {
            console.log(res.data.msg)
            this.loading = false
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //验证字符串是否是数字
       checkNumber(theObj) {
          var reg = /^[0-9]+.?[0-9]*$/;
          if (reg.test(theObj)) {
            return true;
          }
          return false;
        },
      // 正则手机判断
      isCheckMobile (text) {
        let reg = /^(13[0-9]|147|15[0-9]|18[0-9]|17[0-9])([0-9]{8})$/
        let a = reg.test(text)
        let reg2 = /^([0-9]{4})$/
        let b = reg2.test(text)
        if (a) {
          return a
        } else if (b) {
          return b
        } else {
          return false
        }
      },
      // 返回
      _back () {
        window.history.go(-1)
      },
      // 提示
      open (msg) {
        this.$message(msg)
      },
    },
    components: {
      'v-more': more
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">

  .el-collapse-item__arrow
    flex: 0 0 13px;
    line-height: 44px;
    margin-right: 40px;
  .el-button + .el-button
    margin-left 0

  .el-dialog--tiny
    width 80%
    p
      padding 10px 0
  .el-button--small
    padding: 9px 12px;
  .el-button--small + .el-button--small
    margin-left 2px
  .customerWrapper
    .message
      position: absolute;
      display none
      top: 0;
      background: rgb(255, 255, 255);
      width: 200px;
      border: 1px solid #7e8c8d;
      left: 91px;
      padding 5px;
      border-radius 5px
      font-size 13px
    .limet
      font-weight: normal;
      font-size: 10px;
      display: inline-block;
      height: 22px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 151px
  .el-row
    height 44px
    line-height 44px

  .el-collapse-item__content
    padding 10px

  .el-collapse-item__header
    height auto
    display flex
    padding 0 9px
    justify-content space-between
    .el-collapse-item__header__arrow
      flex 0 0 13px
      line-height 44px
      margin-right 40px

  .customer-wrapper
    height: 100%
    position relative
  .customerWrapper.page-loadmore-wrapper
    margin-top 24px
    /*下拉*/
    .page-loadmore-wrapper
      overflow scroll
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .loading, .success, .before
      position: fixed;
      left: calc(50% - 16px);
      bottom: -35px;
    ul .loading
      animation: spin 1s linear infinite;
    .el-checkbox__label
      display none
    @keyframes spin
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    [v-cloak]
      display: none;
  .xb-judgment
    .top
      position fixed
      top 0
      left 0
      width 100%
      z-index 40
      background #f9f9f9
      .block-col-2.el-row
        background #fff

    .content
      position relative
      text-align left
      padding-top 80px
      z-index 30
      height: 100%
      .content-title
        position fixed
        background #f9f9f9
        top 80px
        left 0
        z-index 30
        width 100%
        display flex
        justify-content space-between
        padding 5px 10px
      .el-checkbox-group
        .customerWrapper
          margin-top 46px
          width 100%
          overflow-scrolling: touch

      li.item
        position relative
        display: flex
        justify-content space-between
        background #fff
        padding 5px 15px
        text-align left
        .el-collapse
          flex 1
        .el-checkbox-wrapper
          position absolute
          left 49px
          line-height 45px
          padding-right 5px
        .right
          color #007aff
          height: 30px;
          margin-top: 6px;
        .bold
          font-weight bold
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          width: 151px
        .has
          line-height 22px
        /*无效*/
        .noStatus
          .el-collapse-item__header
            color #ccc
            background #f8f8f8
            .right
              color #ccc
        /*暂缓*/
        .stopStatus
          .el-collapse-item__header
            color #f7ba2a
            .right
              color #f7ba2a
        .wrapper
          display flex
          flex-wrap wrap
          padding 10px 0
          .el-button
            margin-right 3px
            margin-bottom 2px

    .ivu-cascader
      display inline-block

    .ivu-select-placeholder, .ivu-select-selected-value
      font-size 14px !important

    .mint-loadmore-bottom
      text-align center
      span
        display: inline-block;
        transition: .2s linear;
        vertical-align: middle;
        .is-rotate
          transform: rotate(180deg);


</style>
