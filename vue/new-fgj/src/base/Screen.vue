<template lang="html">
  <!-- 侧边筛选 -->
  <transition name="more">
    <section class="lc-screen more-wrap" v-show="IsMore">
      <div class="bg" @click="closeMore"></div>
      <div class="more" @click.stop>
        <scroll :data="tag" ref="scrollMore">
        <div>
          <!-- 选择时间段 -->
          <section class="chunk staff" v-if="IsHide.DatePeriod">
            <h4 class="title">时间段</i></h4>
            <div class="radios">
              <!-- 开始时间 -->
              <p class="el-input__inner datetime" @click="openStartRemindTime">起始时间：{{startRemindTime}}</p>
              <p class="middle el-icon-sort"></p>
              <!-- 结束时间 -->
              <p class="el-input__inner datetime" @click="openEndRemindTime">结束时间：{{endRemindTime}}</p>
            </div>
          </section>
          <!-- 时间筛选，可以附带一个类型，筛选什么时间 -->
          <section class="chunk" v-if="IsHide.timeOFClass">
            <h4 class="title">时间筛选类型<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.timeOFClass" size="mini" :label="item.label" border v-for="(item, index) in timeOFClass" :key="index">{{item.text}}</el-radio>
            </div>
          </section>
          <section class="chunk" v-if="IsHide.affiliation">
            <h4 class="title">归属<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios g-checkbox">
              <Checkbox v-model="affiliation" label="">不限</Checkbox>
              <CheckboxGroup v-model="affiliationSource">
                <Checkbox label="my">我的</Checkbox>
              </CheckboxGroup>
              <CheckboxGroup v-model="affiliationPrivy" v-if="IsPrivy==='1'">
                <Checkbox label="0">公盘</Checkbox>
              </CheckboxGroup>
            </div>
          </section>
          <!-- 这个标签是客户列表的标签 -->
          <section class="chunk" v-if="IsHide.tag">
            <h4 class="title">标签<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios" v-show="tag.length">
              <el-radio v-model="paramsItem.Tag" size="mini" border label="">不限</el-radio>
              <el-radio v-model="paramsItem.Tag" size="mini" :label="item.value" border v-for="(item, index) in tag" :key="index">{{item.label}}</el-radio>
            </div>
            <loader v-show="!tag.length"></loader>
          </section>
          <!-- 这个标签是房源列表的标签 -->
          <section class="chunk" v-if="IsHide.propertyTag">
            <h4 class="title">标签<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.propertyTag" size="mini" border label="">不限</el-radio>
              <el-radio v-model="paramsItem.propertyTag" size="mini" :label="item.ItemValue" border v-for="(item, index) in propertyTag" :key="index">{{item.ItemValue}}</el-radio>
            </div>
          </section>
          <section class="chunk" v-if="IsHide.status">
            <h4 class="title">状态<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.status" size="mini" :label="item.value" border v-for="(item, index) in status" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <!-- 这个是客户列表的排序 -->
          <section class="chunk" v-if="IsHide.order">
            <h4 class="title">排序<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.order" size="mini" :label="item.value" border v-for="(item, index) in order" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <!-- 这个是房源的排序 -->
          <section class="chunk" v-if="IsHide.propertyOrder">
            <h4 class="title">排序<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.propertyOrder" size="mini" :label="item.value" border v-for="(item, index) in propertyOrder" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <section class="chunk" v-if="IsHide.CustGrade">
            <h4 class="title">分类<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.CustGrade" size="mini" :label="item.value" border v-for="(item, index) in CustGrade" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <section class="chunk" v-if="IsHide.rangPrice">
            <h4 class="title">总价<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.rangPrice" size="mini" :label="item.value" border v-for="(item, index) in rangPrice" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <section class="chunk" v-if="IsHide.rangSquare">
            <h4 class="title">面积<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.rangSquare" size="mini" :label="item.value" border v-for="(item, index) in rangSquare" :key="index">{{item.label}}</el-radio>
            </div>
          </section>
          <!-- 合同列表交易类型 -->
          <section class="chunk" v-if="IsHide.contractTrade">
            <h4 class="title">交易类型<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.contractTrade" size="mini" :label="item.label" border v-for="(item, index) in contractTrade" :key="index">{{item.text}}</el-radio>
            </div>
          </section>
          <!-- 合同列表排序 -->
          <section class="chunk" v-if="IsHide.contractOrder">
            <h4 class="title">排序<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio v-model="paramsItem.contractOrder" size="mini" :label="item.label" border v-for="(item, index) in contractOrder" :key="index">{{item.text}}</el-radio>
            </div>
          </section>
          <!-- 图表用到的排序 -->
          <section class="chunk" v-show="IsHide.timeType">
            <h4 class="title">时间周期<i class="icon-arrow el-icon-arrow-down" @click="_unfold($event)"></i></h4>
            <div class="radios">
              <el-radio-group v-model="paramsItem.timeType" size="mini" @change="changeTimeType">
                <el-radio border :label="item.value" v-for="(item, index) in timeType" :key="index">{{item.label}}</el-radio>
              </el-radio-group>
            </div>
          </section>
          <!-- 意向分，目前只有客户录入图表用到 -->
          <section class="chunk staff" v-show="IsHide.intention">
            <h4 class="title">意向分</h4>
            <el-select v-model="intentionVal" clearable placeholder="选择意向分" @change="changeintention">
              <el-option
                v-for="(item, index) in intention"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </section>
          <section class="chunk staff echarts-bm" v-show="IsHide.SDeptNo">
            <h4 class="title">部门筛选</h4>
            <el-cascader
              placeholder="请选择部门"
              popper-class="echarts-bm"
              :options="SDeptNo"
              v-model="SDeptNoVal"
              clearable
              :show-all-levels="false"
              :change-on-select="true"
              @change="changeDepar">
            </el-cascader>
          </section>
          <section class="chunk staff" v-show="IsHide.SEmpID">
            <h4 class="title">人员筛选</h4>
            <el-select v-model="SEmpIDVal" clearable placeholder="请选择人员" @change="changeSempID">
              <el-option
                v-for="(item, index) in SEmpID"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </section>
        </div>
        </scroll>
        <div class="more-btn">
          <span class="reset" @click="btnReset">重置</span>
          <span class="affirm" @click="btnAffirm">确认</span>
        </div>
      </div>
      <!-- 选择时间段组件 -->
      <div class="datetime-box" click.stop>
        <mt-datetime-picker ref="startPicker" type="datetime" :startDate="startTime" :endDate="currentTime" @confirm="startRemindConfirm"></mt-datetime-picker>
        <mt-datetime-picker ref="endPicker" type="datetime" :startDate="endstartDates" :endDate="currentTime" @confirm="endRemindConfirm"></mt-datetime-picker>
      </div>
    </section>
  </transition>
</template>

<script>
  /**
    传入IsHide里面的字段对应的值为true，表示不显示
    IsPrivy 1显示公盘，0不显示
  */
  import Scroll from '@/base/BScroll'
  import Loader from '@/base/Loader'
  import { InquiryTag, getDepartment, getEmployee } from '@/api/inquiry/inquiry'
  import { EstateTag } from '@/api/property/propertyAdd'
  import { classie } from '@/common/js/dom'
  import { parseTime } from '@/utils/index'

  export default {
    props: {
      IsHide: {       // 默认全部不渲染，要哪个就哪个值过来，值为true显示
        type: Object,
        default: () => {}
      },
      isOneOff: {   // 为true就是打开筛选，然后去获取筛选条件
        type: Boolean,
        default: false
      },
      IsPrivy: {    // 是否显示公盘，String类型 1显示， 0不显示
        type: String,
        default: '0'
      },
      current: {    // 当前选中的筛选值，用在图表里面
        type: Object,
        default: () => {}
      }
    },
    data() {
      return {
        paramsItem: {
          Tag: [],
          timeOFClass: 'i.RegDate',
        },    // 要传服务器的参数
        affiliation: false,     // 归属
        affiliationSource: [],
        affiliationPrivy: [],
        tag: [],          // 客户列表标签筛选
        propertyTag: [],          // 房源列表标签筛选
        timeOFClass: [{       // 时间段类型筛选
          label: 'i.RegDate',
          text: '录入时间'
        }, {
          label: 'i.ModDate',
          text: '更新时间'
        }, {
          label: 'i.LastDeclareDate',
          text: '报备时间'
        }, {
          label: 'i.LastVisitDate',
          text: '到访时间'
        }],
        status: [{       // 状态筛选
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
        order: [{       // 客户排序
          value: '',
          label: '不限'
        }, {
          value: 'i.regdate-asc',
          label: '录入时间升序'
        }, {
          value: 'i.regdate-desc',
          label: '录入时间降序'
        }, {
          value: 'i.LastFollowDate-asc',
          label: '最后跟进时间升序'
        }, {
          value: 'i.LastFollowDate-desc',
          label: '最后跟进时间降序'
        }, {
          value: 'i.moddate-asc',
          label: '修改时间升序'
        }, {
          value: 'i.moddate-desc',
          label: '修改时间降序'
        }],
        propertyOrder: [{   // 房源排序
          value: '',
          label: '不限'
        }, {
          value: 'p.Regdate-asc',
          label: '录入时间升序'
        }, {
          value: 'p.Regdate-desc',
          label: '录入时间降序'
        }, {
          value: 'p.lastfollowdate-asc',
          label: '跟进时间升序'
        }, {
          value: 'p.lastfollowdate-desc',
          label: '跟进时间降序'
        }],
        CustGrade: [{     // 分类排序
          value: '',
          label: '不限'
        }, {
          value: 'A',
          label: 'A类'
        }, {
          value: 'B',
          label: 'B类'
        }, {
          value: 'C',
          label: 'C类'
        }],
        rangPrice: [{      //总价
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
        rangSquare: [{    //面积
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
        }],
        contractTrade: [    // 合同列表交易类型
          {
            text: '不限',
            label: ''
          }, {
            text: '一手房',
            label: '一手房',
          }, {
            text: '二手房',
            label: '二手房',
          },
        ],
        contractOrder: [    // 合同列表排序
          {
            text: '不限',
            label: ''
          }, {
            text: '签约时间升序',
            label: 'ContractDate-ASC',
          }, {
            text: '签约时间降序',
            label: 'ContractDate-DESC',
          }, {
            text: '录入时间升序',
            label: 'RegDate-ASC',
          }, {
            text: '录入时间降序',
            label: 'RegDate-DESC',
          },
        ],
        timeType: [{       // 图表——用户注册筛选
          value: 'week',
          label: '本周'
        }, {
          value: 'month',
          label: '本月'
        }, {
          value: 'year',
          label: '今年'
        }],
        intention: [{      // 意向分
          value: '',
          label: '不限'
        }, {
          value: '0-60',
          label: '60分以下'
        }, {
          value: '60-100',
          label: '60分以上'
        }],
        intentionVal: '',      // 意向分选中的值
        SDeptNo: [],       // 部门筛选
        SEmpID: [],        // 人员筛选
        SDeptNoVal: [],   // 部门选中的值
        SEmpIDVal: '',   // 人员选中的值
        IsMore: false,     // 打开关闭更多筛选
        startTime: new Date('January 03,2017 01:00:00'),
        endstartDates: new Date(),
        currentTime: new Date(),  // 当前日期时间
        startRemindTime: '',   // 选中的开始时间
        endRemindTime: ''     // 选中的结束时间
      }
    },
    created () {
      // console.log(this.IsHide)
      // 只有当isOneOff第一次就为真的时候，才直接获取标签数据
      if (this.isOneOff) {
        if (this.IsHide.tag) { // 如果有tag，才能去获取标签
          this._InquiryTag()    // 获取客户标签
        }
        if (this.IsHide.propertyTag) {
          this._EstateTag()    // 获取房源标签
        }
        if (this.IsHide.SDeptNo) {
          this._getDepartment()   // 获取部门
        }
      }
    },
    mounted () {
      setTimeout(() => {
        // this.startDate = new Date()
      }, 20)
    },
    methods: {
      btnAffirm() {   // 确定更多筛选
        // 如果选择了时间段筛选，那就是是自定义，需要把时间拼接起来
        if (this.paramsItem.timeType === 'customize') {
          if (!this.startRemindTime) {
            this.$message.error('请选择起始时间')
            return
          } 
          if (!this.endRemindTime) {
            this.$message.error('请选择结束时间')
            return
          }
          this.paramsItem.DatePeriod = this.startRemindTime + '|' + this.endRemindTime
        }

        this.IsMore = false
        this.$emit('select', this.paramsItem)   // 把选中的数据发送出去
      },
      btnReset() {      // 重置筛选，全部清空
        this.paramsItem = {}
        this.affiliationSource = []    // 归属
        this.affiliationPrivy = []
        this.intentionVal = ''      // 清空意向值
        this.changeTimeType()     // 清除时间段
        this.IsMore = false

        if (this.IsHide.timeOFClass) {
          this.$set(this.paramsItem, 'timeOFClass', 'i.RegDate')    //  时间选项默认值
          console.log(this.paramsItem)
        }
        if (this.IsHide.timeType) {
          this.$set(this.paramsItem, 'timeType', 'week')    // 因为时间段默认是本周，所以即使清空，也要选上去
        }
        if (this.IsHide.SDeptNo) {   // 清空部门和人员的显示状态
          this.SDeptNoVal = []
          this.SEmpIDVal = ''
        }

        this.$emit('empty', this.paramsItem)     // 派发清空事件
      },
      openMore() {   // 打开更多筛选
        this.IsMore = true
        setTimeout(() => {
          this.$refs.scrollMore.refresh()
        }, 20)
      },
      closeMore() {   // 关闭更多筛选
        this.IsMore = false
      },
      changeTimeType(newVal) {      // 周期改变，清除时间段
        this.paramsItem.DatePeriod = ''
        this.startRemindTime = ''
        this.endRemindTime = ''
        this.endstartDates = this.currentTime
      },
      openStartRemindTime() {    // 打开选择时间
        this.$refs.startPicker.open()
      },
      openEndRemindTime() {    // 打开选择时间
        this.$refs.endPicker.open()
      },
      startRemindConfirm(time) {
        if (this.endRemindTime) {
          this.endRemindTime = ''         // 每次更改起始时间的时候，都清除掉已选的结束时间
        }
        this.endstartDates = time       // 结束时间的起始位置是开始时间，那么结束时间就不会大于开始时间
        let times = parseTime(time)     // 时间需要处理一下
        this.startRemindTime = times
        this.paramsItem.timeType = 'customize'    // 选择时间后，week等于customize
      },
      endRemindConfirm(time) {
        let times = parseTime(time)     // 时间需要处理一下
        this.endRemindTime = times
        this.paramsItem.timeType = 'customize'
      },
      _InquiryTag() {   // 获取客户标签
        InquiryTag().then((res) => {
          if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.tag = res.data.tempTable
          }
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
        })
      },
      _EstateTag() {    // 获取房源标签
        EstateTag().then(res => {
          if (res.data.tempTable) {
            this.propertyTag = res.data.tempTable
          }
        })
      },
      changeintention(newVal) {     // 意向分
        this.paramsItem.intention = newVal
      },
      changeDepar(newVal) {    // 选中的部门
        // console.log('选中的部门', newVal)
        let len = newVal.length
        let id = newVal[len - 1].split(',')[0]        // 根据id拿人员
        let SDeptNo = newVal[len - 1].split(',')[1]   // 同时保存部门id，用来筛选
        this.paramsItem.SDeptNo = SDeptNo
        this.SEmpIDVal = ''           // 选中部门后清除人员
        this.paramsItem.SEmpID = ''
        this.paramsItem.bumen = newVal      // 这里要保存部门，图表页面的时候好还原
        this._getEmployee(id)
      },
      changeSempID(newVal) {  // 选中的人员
        this.paramsItem.SEmpID = newVal     // 保存人员id，用来筛选
        this.paramsItem.bumen = this.SDeptNoVal   // 单独改变人员的时候，也要同步改变部门，都是为了切换显示，我也是日了
      },
      _getDepartment() {    // 获取部门分级
        getDepartment().then((res) => {
          if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.SDeptNo = res.data
          }
        }).catch((error) => {
          this.$message.error(error)
        })
      },
      _getEmployee(id) {    // 根据部门id获取人员
        getEmployee(id).then((res) => {
          this.SEmpID = eval(res.data)   // 拿到的是字符串，需要用 eval方法，用JSON.parse没用
        })
      },
      format(labels, selectedData) {      // 下拉筛选部门，自定义显示
        const index = labels.length - 1;
        const data = selectedData[index] || false
        return labels[index]
      },
      _unfold(e) {      // 是否展开更多选项
        // console.log(e)
        let grandFather = e.target.parentNode.parentNode
        let self = e.target

        if (classie.hasClass(grandFather, 'unfold')) {
          classie.removeClass(grandFather, 'unfold')
          classie.removeClass(self, 'rotate')
        } else {
          classie.addClass(grandFather, 'unfold')
          classie.addClass(self, 'rotate')
        }
        setTimeout(() => {
          this.$refs.scrollMore.refresh()
        }, 300)
      },
    },
    watch: {
      isOneOff(newVal) {      // 获取筛选条件
        if(!newVal) {
          return
        }
        if (this.IsHide.tag) { // 如果有tag，才能去获取标签
          this._InquiryTag()    // 获取客户标签
        }
        if (this.IsHide.propertyTag) {
          this._EstateTag()    // 获取房源标签
        }
        if (this.IsHide.SDeptNo) {
          this._getDepartment()   // 获取部门
        }
      },
      affiliation(newVal) {     // 归属筛选，如果选择不限就去掉其它选项
        if (newVal) {
          this.affiliationSource = []
          this.affiliationPrivy = []
          this.paramsItem.source = ''
          this.paramsItem.privy = ''
        }
      },
      affiliationSource(newVal) {
        if (newVal.length) {
          this.affiliation = false
          this.paramsItem.source = newVal[0]
        } else {
          this.paramsItem.source = ''
        }
      },
      affiliationPrivy(newVal) {
        if (newVal.length) {
          this.affiliation = false
          this.paramsItem.privy = newVal[0]
        } else {
          this.paramsItem.privy = ''
        }
      },
      current(newVal) {         // 通过不同页面传递的参数，选中对应的筛选条件
        // console.log('screen组件，要改变筛选的数据', newVal)
        this.$set(this.paramsItem, 'timeType', newVal.dateType)    // 这里要用vue的set方法，否则radios选中会有兼容问题
        if (newVal.bumen) {
          this.SDeptNoVal = newVal.bumen      // 把部门填充进去，再通过部门拿人员
          let id = this.SDeptNoVal[this.SDeptNoVal.length - 1].split(',')[0]        // 根据id拿人员
          this.paramsItem.SDeptNo = this.SDeptNoVal[this.SDeptNoVal.length - 1].split(',')[1]   // 同步修改部门数据
          this._getEmployee(id)
        } else {
          this.SDeptNoVal = []
          this.SEmpID = []        // 如果没有部门，也就要清除之前的人员数据
          this.paramsItem.SDeptNo = ''
        }
        if (newVal.SEmpID) {
          this.paramsItem.SEmpID = newVal.SEmpID
          this.SEmpIDVal = newVal.SEmpID        // 把人员填充进去
        } else {
          this.SEmpIDVal = ''
          this.paramsItem.SEmpID = ''
        }
        // 时间段
        if (newVal.dateType === 'customize') {
          let date = newVal.DatePeriod.split('|')
          this.startRemindTime = date[0]
          this.endRemindTime = date[1]
        }
        // 意向值
        if (newVal.intention) {
          this.intention = newVal.intention
        }
      }
    },
    components: {
      Scroll,
      Loader
    }
  }
</script>

<style scoped lang="scss">
  @import '../common/sass/mixin';
  @import '../common/sass/layout';

  .lc-screen {
    text-align: left;
    &.more-wrap {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 20;
      .bg {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
      }
      .more {
        position: absolute;
        top: 0;
        right: 0;
        z-index: 2;
        width: 72%;
        height: 100%;
        padding: 0 5px 15px 15px;
        padding-bottom: 55px;
        background: #fff;
      }
      .more-btn {
        display: flex;
        align-items: center;
        position: absolute;
        bottom: 0;
        left: 0;
        z-index: 3;
        width: 100%;
        height: 45px;
        .reset,
        .affirm {
          width: 50%;
          flex: 1;
          height: 45px;
          font-size: 16px;
          color: #fff;
          line-height: 45px;
          text-align: center;
          background-color: #EB9E05;
        }
        .affirm {
          background-color: #409EFF;
        }
      }
      .chunk {
        overflow: hidden;
        max-height: 85px;
        padding-top: 15px;
        transition: all .3s;
        &.unfold {
          max-height: 350px;      /*注意，这里为了加过渡动画，用了max-height，如果内容高度不能超过设置的最大值*/
          transition: all .3s;
        }
        &.staff {
          overflow: initial;
          max-height: none;
          margin-bottom: 10px;
          margin-top: 5px;
          .el-cascader,
          .el-select {
            margin-top: 10px;
          }
        }
        .title {
          position: relative;
          font-size: 14px;
          padding-bottom: 10px;
          @include border-b-1px(0);
          .icon-arrow {
            position: absolute;
            top: 0;
            right: 15px;
            font-size: 20px;
            color: #999;
            transition: all .3s;
            transform-origin: center;
            &:after {
              content: '';
              position: absolute;
              top: -5px;
              left: -10px;
              right: -10px;
              bottom: -5px;
            }
            &.rotate {
              transform: rotate(-180deg);
            }
          }
        }
        .radios {
          display: flex;
          flex-wrap: wrap;
          padding-top: 10px;
          white-space: normal;
          .el-button {
            margin: 0 10px 10px 0;
          }
          .datetime {
            line-height: 40px;
            background-color: #fff;
            color: #666;
          }
          @include MQ(SM) {
            .datetime {
              padding: 0 0 0 4px;
            }
          }
        }
        .middle {
          padding: 10px;
          width: 100%;
          text-align: center;
        }
      }
      .el-radio {
        margin: 0 10px 10px 0;
      }
      .el-radio.is-bordered+.el-radio.is-bordered {
        margin-left: 0;
      }
      .g-checkbox {
        .ivu-checkbox-wrapper {
          margin: 0 10px 10px 0;
          padding: 6px 15px 0 10px;
          border: 1px solid #dcdfe6;
          border-radius: 3px;
          height: 28px;
          color: #606266;
          font-weight: 500;
          line-height: 1;
          &.ivu-checkbox-wrapper-checked {
            border-color: #409EFF;
          }
        }
      }
    }
  }
  
  .more-enter-active,
  .more-leave-active  {
    transition: .3s all ease;
    .bg,
    .houses-center,
    .more {
      transition: .3s all ease;
    }
  }
  // 更多筛选
  .more-enter,
  .more-leave-to {
    .bg {
      opacity: 0;
    }
    .more {
      transform: translate3d(100%, 0, 0);
    }
  }
</style>
