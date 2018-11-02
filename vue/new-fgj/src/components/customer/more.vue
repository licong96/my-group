<template>
  <transition name="move">
    <div v-show="ERR_ON" class="moreOption" v-loading.body="loading">
      <div class="more-header">
        <i @click="hide()" class="el-icon-arrow-left"></i>
        <span class="title">更多</span>
        <span class="add">&nbsp;&nbsp;&nbsp;&nbsp;</span>
      </div>
      <!--部门-->
      <div class="block">
        <span class="title">部门</span>
        <Cascader
          :data="options4"
          placeholder="试试搜索：部门"
          v-model="SDeptNo"
          @on-change="arryValue.SEmpID=[]"
          clearable
          size="large"
          filterable
          transfer
          change-on-select
        ></Cascader>
      </div>
      <!--人员-->
      <div @click="selectMember()" class="block">
        <span class="title">人员</span>
        <Cascader
          :data="options4_member"
          placeholder="试试搜索：人员"
          v-model="arryValue.SEmpID"
          clearable
          size="large"
          filterable
          transfer
          change-on-select
        ></Cascader>
      </div>
      <!--标签-->
      <div class="block">
        <span class="title">标签</span>
        <Select v-model="arryValue.Tag" clearable>
          <Option v-for="item in options1" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>
      <!--状态-->
      <div class="block">
        <span class="title">状态</span>
        <Select v-model="arryValue.status">
          <Option v-for="item in options2" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>
      <!--排序-->
      <div class="block">
        <span class="title">排序</span>
        <Select v-model="arryValue.order">
          <Option v-for="item in options3" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>

      <!--分类-->
      <div class="block">
        <span class="title">分类</span>
        <Select v-model="arryValue.CustGrade" clearable>
          <Option v-for="item in options5" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>
      <!--总价-->
      <div class="block">
        <span class="title">总价</span>
        <Select v-model="arryValue.rangPrice">
          <Option v-for="item in options6" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>
      <!--面积-->
      <div class="block" id="last">
        <span class="title">面积</span>
        <Select v-model="arryValue.rangSquare" placement="top">
          <Option v-for="item in options7" :value="item.value" :key="item.value"
                  size="large">{{ item.label }}
          </Option>
        </Select>
      </div>
      <el-button @click="_goSearch()" type="primary">搜索</el-button>
    </div>
  </transition>
</template>

<script type="text/ecmascript-6">
  // import $ from 'jquery'
  import {InquiryTag,CustGrade} from '../../api/customer/more'
  import {GetEmployeeJson} from '../../api/public'
  import {customer} from '../../api/customer/customer'

  export default {
    props: {
      options4: {},
      likestr:{}
    },
    created () {
    },
    data () {
      return {
        loading: false,
        oldDep: [],
        ERR_ON: false,
        selectData: [],
        paramsItem: [],
        //筛选结果
        arryValue: {
          Tag: '',
          status: '',
          order: '',
          SEmpID: [],
          CustGrade: '',
          rangPrice: '',
          rangSquare: ''
        },
        SDeptNo: [],
        //标签
        options1: [],
        //状态
        options2: [{
          value: '',
          label: '不限'
        }, {
          value: '有效',
          label: '有效'
        }, {
          value: '暂缓',
          label: '暂缓'
        }, {
          value: '无效',
          label: '无效'
        }],
        //排序
        options3: [{
          value: '',
          label: '不限'
        }, {
          value: 'regdate-asc',
          label: '录入时间升序'
        }, {
          value: 'regdate-desc',
          label: '录入时间降序'
        }, {
          value: 'lastfollowdate-asc',
          label: '最后跟进时间升序'
        }, {
          value: 'lastfollowdate-desc',
          label: '最后跟进时间降序'
        }, {
          value: 'moddate-asc',
          label: '修改时间升序'
        }, {
          value: 'moddate-desc',
          label: '修改时间降序'
        }],
        //人员
        options4_member: [],
        //分类
        options5: [{
          value: 'A',
          label: 'A类'
        }, {
          value: 'B',
          label: 'B类'
        }, {
          value: 'C',
          label: 'C类'
        }],
        //总价
        options6: [{
          value: '',
          label: '不限'
        }, {
          value: '0-50',
          label: '0-50万'
        }, {
          value: '50-100',
          label: '50-100万'
        }, {
          value: '100-200',
          label: '100-200万'
        }, {
          value: '200-300',
          label: '200-300万'
        }, {
          value: '300-500',
          label: '300-500万'
        }, {
          value: '500-1000',
          label: '500-1000万'
        }],
        //面积
        options7: [{
          value: '',
          label: '不限'
        }, {
          value: '0-50',
          label: '0-50㎡'
        }, {
          value: '50-100',
          label: '50-100㎡'
        }, {
          value: '100-200',
          label: '100-200㎡'
        }, {
          value: '200-300',
          label: '200-300㎡'
        }, {
          value: '300-500',
          label: '300-500㎡'
        }]
      }
    },
    methods: {
      text(){
        console.log(0)
        document.getElementsByClassName('ivu-select-dropdown')[0].style.display = 'none'
      },
      handleNodeClick (data) {
      },
      show () {
        console.log(this.likestr)
        this.ERR_ON = true
        // 加载标签选项
        InquiryTag().then((res) => {
          if (res.data) {
            this.options1 = eval(res.data.tempTable)
            console.log(this.options1)
          } else {
            console.log('请求标签选项失败')
          }
        }).catch((err) => {
          console.log(err)
        })
        // 加载分类选项
        CustGrade().then((res) => {
          if (res.data) {
            this.options5 = eval(res.data.tempTable)
          } else {
            console.log('请求分类选项失败')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      hide () {
        this.ERR_ON = false
      },
      // 确认搜索
      _goSearch () {
        let len = ''
        let id = ''
        let SEmpID = ''
        let SDeptNo = ''
        if(this.SDeptNo.length !== 0){
         len = this.SDeptNo.length
         id = this.SDeptNo[len - 1].split(',')[1]
         SEmpID = this.arryValue.SEmpID[0]
         SDeptNo = this.SDeptNo[this.SDeptNo.length-1].split(',')[1]
        }
        console.log(SDeptNo)
        this.paramsItem = {
          page: 1,
          likestr: this.likestr,
          CustGrade: this.arryValue.CustGrade,
          SEmpID: SEmpID,
          SDeptNo: SDeptNo,
          Tag: this.arryValue.Tag,
          order: this.arryValue.order,
          rangSquare: this.arryValue.rangSquare,
          rangPrice: this.arryValue.rangPrice,
          status: this.arryValue.status
        }
        this.loading = true
        console.log(this.paramsItem)
        customer(this.paramsItem).then((res) => {
          if (res.data.tempTable) {
            this.selectData = eval(res.data.tempTable)
            this.$emit('moreValue', this.selectData)
            this.$emit('moreParams', this.paramsItem)
            this.loading = false
            this.hide()
          } else {
            console.log('请求失败')
          }
        }).catch((err) => {
          console.log(err)
        })
      },
      //选择人员
      selectMember () {
        if (this.oldDep !== this.SDeptNo && this.SDeptNo.length !== 0) { //判断是否改变了部门
          let len = this.SDeptNo.length
          let id = this.SDeptNo[len - 1].split(',')
          GetEmployeeJson(id[0]).then((res) => {
            if (res.data) {
              this.options4_member = eval(res.data)
              this.oldDep = this.SDeptNo
            } else {
              console.log('请求失败')
            }
          }).catch((err) => {
            console.log(err)
          })
        }
      }
    }
  }
</script>


<style lang="stylus" rel="stylesheet/stylus">
  .moreOption
    position: fixed;
    bottom: 0;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: 40;
    background #f9f9f9
    &.move-enter-active, &.move-leave-active
      transition all 0.2s linear
    &.move-enter, &.move-leave-active
      transform translate3d(100%, 0, 0)
    .more-header
      display flex
      justify-content space-between
      height 44px
      background #f9f9f9
      line-height 44px
      padding 0 10px
      i, .add
        line-height 44px
        color #007aff
    .el-cascader
    .block
      display flex
      padding 10px
      .title
        flex 0 0 50px
        line-height 36px
      .ivu-cascader, .el-cascader
        flex 1
        padding 0
    .el-button.el-button--primary
      width 90%
      position fixed
      bottom 10px
      left 5%

  .ivu-select-placeholder, .ivu-select-selected-value
    font-size 14px !important

  .ivu-select-dropdown.ivu-cascader-transfer
    white-space: normal !important

  .ivu-cascader-menu
    background #fff
</style>
