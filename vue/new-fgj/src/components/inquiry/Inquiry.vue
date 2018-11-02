<template lang="html">
  <!-- 客户列表 -->
  <section class="lc inquiry">
    <section class="color-bg" ref="top">
      <header class="lc header" @touchmove.prevent>
        <i class="el-icon-arrow-left icon" @click="back"></i>
        <h3 class="title">客户列表({{resultcount}})</h3>
        <a class="add-a right-btn" href="/client/Inquiry_add.html"><el-button type="primary">新建</el-button></a>
      </header>
      <!-- 搜索 -->
      <div class="lc b-search" @touchmove.prevent>
        <i class="el-icon-search"></i>
        <input class="search-input" v-model="likestr" type="text" placeholder="搜索关键字，如姓名，电话，标签...">
        <i class="el-icon-circle-close" v-show="likestr" @click="cleanLikestr"></i>
      </div>
      <!-- 筛选 -->
      <section class="screen">
        <div class="branch" @click="_visibleMake">
          <select-dept-name ref="deptNames" @onDeptName="onDeptName" :isOneDeptName="isOneDeptName"></select-dept-name>
        </div>
        <div class="branch">
          <select-emp-name 
            ref="empNames" 
            :DeptID="DeptID" 
            :disabled="disabled"
            @onEmpName="onEmpName" 
            @empVisibleChange="empVisibleChange"></select-emp-name>
        </div>
        <div class="branch-menu" @click="openMore">
          <span class="text">更多筛选</span>
          <i class="el-icon-menu"></i>
        </div>
      </section>
    </section>
    <!-- 列表 -->
    <div class="scroll-area" :style="{'bottom': listBottom}">
    <scroll
      ref="scrolls"
      :data="listData"
      :listemScroll="listemScroll"
      :probeType="probeType"
      :pullup="pullup"
      :bounce="bounce"
      :momentum="momentum"
      @scrollToEnd="upLoad">
      <section class="list-wrap">
        <div class="list"  v-for="(item, index) in listData" :key="index"
          :class="{'transLeft': item.InquiryID===touchLeft, 'transRight': item.InquiryID===touchRight, 'status-1': item.Status==='有效', 'status-2': item.Status==='暂缓', 'status-3': item.Status==='无效', 'status-4': item.Status==='失败'}"
          @touchstart.prevent="listTouchStart($event, item)"
          @touchmove.prevent="listTouchMove"
          @touchend="listTouchEnd"
          >
          <!-- 左边的按钮 -->
          <div class="list-btn-l" v-show="item.HasOperating === '1'">
            <span class="button brace" v-show="item.Status !== '无效'" @click="_upInquiry(item, '无效')"><i class="iconfont icon-wuxiaodingdan"></i>无效</span>
            <span class="button postpone" v-show="item.Status !== '暂缓'" @click="_upInquiry(item, '暂缓')"><i class="iconfont icon-dengdai"></i>暂缓</span>
            <span class="button valid" v-show="item.Status !== '有效'" @click="_upInquiry(item, '有效')"><i class="iconfont icon-dui"></i>有效</span>
          </div>
          <!-- 中间的内容 -->
          <div class="list-center" @click="openPage(item)">
            <div class="top">
              <div class="text-top">
                <h4 class="title">
                  <span class="privy" :class="{'privy2': item.Privy==='公'}">{{item.Privy}}</span>
                  <span class="title-span">{{item.CustName}}</span>
                  <small class="phone">{{item.CustMobile}}</small>
                </h4>
                <p class="nick-name">{{item.NickName}}</p>
              </div>
              <div class="percentage">
                <el-progress type="circle" :stroke-width="2" :width="32" :percentage="item.CompletePercent"></el-progress>
              </div>
            </div>
            <div class="tags">
              <span class="tag" v-for="(item, index) in item.Tag" :key="index" v-if="item">{{item}}</span>
            </div>
            <p class="remark" v-if="item.Remark">{{item.Remark}}</p>
            <div class="b-time">
              <p v-if="item.LastDeclareDate">报备时间：{{item.LastDeclareDate}}</p>
              <p v-if="item.LastVisitDate">到访时间：{{item.LastVisitDate}}</p>
              <p v-if="item.LastReceptionDate">接待时间：{{item.LastReceptionDate}}</p>
            </div>
            <div class="f-time">
              <p class="text-l">
                <span class="tag">{{item.DeptName}}</span>
                {{item.EmpName}}
                <em class="person" v-if="item.EmpID!==item.RegEmpID">{{item.RegPerson}}</em>
              </p>
              <p class="text-r" v-if="item.RegDate">录入：{{item.RegDate}}</p>
            </div>
            <!-- 多选 -->
            <div class="multiple" v-if="estateBtn && item.addCan && item.HasFiling==='1'" @click.stop="_checkCanDeclare(item)">
              <el-checkbox v-model="checked" :label="item.InquiryID"><i class="el-icon-success"></i></el-checkbox>
            </div>
            <!-- 不能选的 -->
            <div class="multiple-else" v-show="estateBtn" v-else @click.stop></div>
          </div>
          <!-- 右边的按钮 -->
          <div class="list-btn-r" v-show="item.HasOperating === '1'">
            <span class="button edit" v-show="item.Status!=='无效'" @click="_edit(item.InquiryID)"><i class="iconfont icon-editor"></i>编辑</span>
            <span class="button lc-follow" v-show="item.Status!=='无效'" @click="_follow(item.InquiryID)"><i class="iconfont icon-tianxiegenjin"></i>跟进</span>
          </div>
        </div>
        <!-- 加载中 -->
        <loader v-show="hasMore"></loader>
        <!-- 什么都没有 -->
        <empty v-show="!hasMore && !listData.length"></empty>
      </section>
    </scroll>
    </div>
    <!-- 更多筛选组件 -->
    <screen ref="screen" :IsHide="screenIsHide" :IsPrivy="PublicShow" :isOneOff="isOneOff" @select="onSelect" @empty="selectEmpty"></screen>
    <!-- 选择楼盘报备按钮 -->
    <section class="houses-btn" v-show="!estateBtn" @click="openEstate" ref="elDrag">
      <el-button type="primary">报备</el-button>
    </section>
    <!-- 选择楼盘 -->
    <select-estate 
      ref="estates" 
      :houseEstate="houseEstate" 
      :houseEstateUpper="houseEstateUpper"
       @onEstate="pitchEstate">
    </select-estate>
    <!-- 报备操作按钮 -->
    <transition name="foot-btn">
      <section class="foot-btn" v-show="estateBtn">
        <div class="current-text">当前选择的楼盘是：<span class="small">{{estateText}}</span></div>
        <el-button class="cancel" type="danger" @click="footCancel">取消</el-button>
        <el-button class="affirm" :disabled="isFilingBtn" type="success" @click="filing">
          <span v-show="!isFilingBtn">报备</span>
          <i class="el-icon-loading" v-show="isFilingBtn"></i>
        </el-button>
      </section>
    </transition>
    <!-- 报备成功进度 -->
    <el-dialog
      title="报备进度"
      :visible.sync="dialogVisible"
      width="80%"
      center
      :close-on-click-modal="false"
      :modal-append-to-body="false"
      :show-close="false"
      >
      <!-- :before-close="handleClose" -->
      <div class="dialog-body">
        <el-progress type="circle" :percentage="percentages.width"></el-progress>
        <div class="desc">
          <p class="text">报备成功：<span class="num">{{percentages.success}}</span></p>
          <p class="text">报备失败：<span class="num">{{percentages.error}}</span></p>
          <p class="text">共计：<span class="num">{{percentages.count}}</span></p>
        </div>
      </div>
      <span slot="footer">
        <el-button class="dialog-footer" type="primary" :disabled="isFilingBtn" @click="digAffirm">
          <span v-show="!isFilingBtn">确 定</span>
          <i class="el-icon-loading" v-show="isFilingBtn"></i></el-button>
      </span>
    </el-dialog>
    <!-- 一个遮罩，下拉筛选用到 -->
    <section class="lc-mask" v-show="IsMake" @click="closeMake"></section>
    <section class="lc-mask lc-mask-top" v-show="IsMake" @click="closeMake"></section>
    <!-- 操作等待中 -->
    <loader-center ref="loaders" :loaderStyle="loaderStyle"></loader-center>
    <!-- 一个白色遮罩，当跟进和详情互相跳转的时候，会看到底层的父级，可以用这个遮住父级，也就是一个障眼法 -->
    <div class="full-white" v-show="fullWhite"></div>
    <!-- 跟进和详情子路由 -->
    <transition name="transX">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  import SelectDeptName from '@/base/SelectDeptName'
  import SelectEmpName from '@/base/SelectEmpName'
  import Scroll from '@/base/BScroll'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import LoaderCenter from '@/base/LoaderCenter'
  import SelectEstate from '@/base/SelectEstate'
  import Screen from '@/base/Screen'
  import { customer, getDepartment, getEmployee, InquiryTag, upInquiry, getEstate, checkShow, CheckCanDeclare, TranFiling } from '@/api/inquiry/inquiry'
  import { prefixStyle, timeBounce } from '@/utils/index'
  import Inertia from '@/common/js/inertia'
  import { classie } from '@/common/js/dom'

  const transform = prefixStyle('transform')

  const loaderFooter = document.getElementById('loaderFooter')
  loaderFooter.style.display = 'block'
  loaderFooter.innerHTML = '客户报备列表正在加载中，如果长时间没有出现，点右上角三个点，在浏览器中打开'

  export default {
    beforeRouteUpdate(to, from, next) {
      // 跟进和详情互相跳转的时候，遮住父级
      if (to.name !== '客户列表' && from.name !== '客户列表') {
        this.fullWhite = true
      } else {
        this.fullWhite = false
      }
      next()
    },
    data() {
      return {
        likestr: '',    // 搜索值
        listData: [],    // 列表数据
        paramsItem: {     // 要传入的参数
          page: 1,         // 页数
          SDeptNo: '',
          SEmpID: '',
          likestr: '',
        },
        DeptID: '',       // 部门筛选ID
        disabled: true,    // 人员选项是否禁用
        houseEstate: [],      // 获取到的楼盘数据
        houseEstateUpper: '',   // 报备上限获取不到楼盘的提示
        estateVal: '',       // 选中的楼盘id
        estateText: '',       // 选中的楼盘名
        estateBtn: false,    // 报备操作按钮，决定是否报备状态
        checked: [],          // 选中的报备客户
        checkedStr: [],       // 选中最终要上传的客户数据
        checkedCount: 0,      // 可以报备的剩余总数
        hasMore: false,    // 数据加载中
        touch: {},     // 列表滑动
        touchLeft: 0,    // 当前可以滑动的值 left
        touchRight: 0 ,   // 当前可以滑动的值 right
        IsTouch: true,     // 操作列表是否可以滑动，选择楼盘报备，就不允许滑动
        dialogVisible: false,    // 报备进度弹窗
        percentages: {     // 进度
          width: 0,
          success: 0,
          error: 0,
          count: 0
        },
        affiliationSource: [],    // 我的公盘
        IsMake: false,       // 一个看不见的遮罩
        visibleMake: false,   // 监听部门筛选的展开和关闭
        resultcount: 0,        // 总数
        PublicShow: '0',         // 是否显示筛选里面的公盘，1显示，String类型
        fullWhite: false,    // 白色遮罩
        isFilingBtn: false,      // 防止重复报备，执行报备之后就禁用掉，成功后再开启
        isOneGetEstate: false,  // 点击报备按钮之后，再去拿楼盘数据
        isOneOff: false,   // 是否点击了筛选操作，再获取筛选项
        isOneDeptName: false,   // 是否点击了部门筛选，在获部门数据
        loaderStyle: {      // 等待提醒的样式
          top: '38%'
        },
      }
    },
    beforeCreate() {
      loaderFooter.innerHTML = 'inquiry--beforeCreate, 如果长时间没有出现，点右上角三个点，在浏览器中打开'
    },
    created() {
      loaderFooter.innerHTML = 'inquiry--created, 如果长时间没有出现，点右上角三个点，在浏览器中打开'

      this.listemScroll = true   // 派发滚动
      this.probeType = 2     // 不截流
      this.bounce = false     // 关闭弹动
      this.momentum = true   // 关闭快速滑动
      this.pullup = true      // 开启上滑加载
      // this.bounceTimes = 300   // 筛选滑动回弹速度

      this.screenIsHide = {   // 决定显示哪个筛选条件
        DatePeriod: true,
        timeOFClass: true,
        affiliation: true,
        tag: true,
        status: true,
        order: true,
        CustGrade: true,
        // rangPrice: true,
        // rangSquare: true
      }

      let source = this.$route.query.source   // 如果有，就拿到页面参数my，传过去
      if (source) {
        this.affiliationSource.push(source)
      }

      this._customer()    // 获取列表数据
      this._InquiryTag()      // 获取标签
    },
    beforeMount() {
      loaderFooter.innerHTML = 'inquiry--beforeMount, 如果长时间没有出现，点右上角三个点，在浏览器中打开'
    },
    mounted () {
      this.$nextTick(() => {
        this.inertia = new Inertia(this.$refs.elDrag, {'edge': false})
        this.loaders = this.$refs.loaders      // 提示元素全局保存
        this.elCascader = document.querySelector('.el-cascader')
      })

      loaderFooter.innerHTML = 'inquiry--mounted成功'
      setTimeout(() => {
        loaderFooter.style.display = 'none'
      }, 30)
    },
    computed: {
      listBottom() {      // 如果选择了报备，底部弹出按钮会遮挡45px，那么滚动也要空出45px
        return this.estateBtn ? '70px' : '0'
      }
    },
    methods: {
      openPage(item) {    // 打开详细页
        this.$router.push({
          path: '/inquiry/detail',
          query: {
            id: item.InquiryID
          }
        })
      },
      back() {        // 返回
        this.$router.back()
      },
      closeMake() {     // 关闭那个看不见的遮罩，下拉筛选用到
        this.IsMake = false
      },
      digAffirm() {     // 报备成功确认
        if (this.isFilingBtn) {   // 想点确定关闭弹窗，需要先等报备成功
          return
        }
        this.dialogVisible = false
        this.percentages = {        // 成功后清除掉一些数据
          width: 0,
          success: 0,
          error: 0,
          count: 0
        }
        this.checked = []
        this.checkedStr = []
        this.footCancel()       // 成功后，执行取消，还原一些值
      },
      filing() {    // 报备，就是它了
        if (!this.checked.length) {
          this.$message.error('操作失败，没有选中客户')
          return
        }
        this.isFilingBtn = true
        // this.loaders.show('正在报备')     // 开启等待
        this.dialogVisible = true
        let EstateID = this.estateVal   // 楼盘ID
        let estatename = ''            // 楼盘名称
        this.houseEstate.forEach((item) => {
          if (item.EstateID === this.estateVal) {
            estatename = item.EstateName
          }
        })
        this.percentages = {        // 先清除掉
          width: 0,
          success: 0,
          error: 0,
          count: 0
        }
        // 选中了多少个，就执行多少次
        let checked = this.checked
        let checkedStr = []

        // 通过checked拿checkedStr中选中的数据
        this.checked.forEach((id) => {
          for (let i = 0; i < this.checkedStr.length; i++) {
            if (this.checkedStr[i].InquiryID === id) {
              checkedStr.push(this.checkedStr[i])
              return        // 拿到了值就返回，以免重复
            }
          }
        })

        var InquiryID = ''            // 需要拼接起来用
        for (let i = 0; i < checked.length; i++) {
          InquiryID = checkedStr[i].InquiryID + ',' + checkedStr[i].CustName + ',' + checkedStr[i].CustMobile + ',' + checkedStr[i].openid + ',' + checkedStr[i].count

          TranFiling(InquiryID, EstateID, estatename).then((res) => {
            this.isFilingBtn = false
            // this.loaders.hide()     // 关闭等待
            // console.log(res)
            if (res.data.result === 'success') {
              this.percentages.success += 1     // 成功的个数
              this.percentages.count = checked.length
              this.percentages.width = parseInt(100 * this.percentages.success / this.percentages.count)
              this.$message.success('报备成功')
              // 报备成功后，状态改变，去掉 addCan
              for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].InquiryID === res.data.InquiryID) {
                  this.$set(this.listData[i], 'addCan', false)      // 成功后就不能再报备
                  return
                }
              }
            } else {
              this.percentages.error += 1
              this.$message.error(res.data.msg)
              // 如果报备失败后，状态改变成红色
              for (let i = 0; i < this.listData.length; i++) {
                if (this.listData[i].InquiryID === res.data.InquiryID) {
                  this.$set(this.listData[i], 'Status', '失败')       // 报备失败后，显示另一种状态
                  return
                }
              }
            }
          }).catch(err => {
            this.$message.error('报备失败，'+ err)
            this.loaders.hide()     // 关闭等待
          })
        }
      },
      _checkShow() {      // 判断是否显示报备勾选，第一步检测
        this.loaders.show('检测中')     // 开启等待
        let data = this.listData
        let inquiry = ''
        data.forEach((item) => {       
          inquiry += item.InquiryID + ','   // 把id拼接成一个字符串，传给后端，拿到可以报备的一个字符串
          item.addCan = false   // 每次检查都要先去掉所有可勾选
        })
        checkShow(this.estateVal, inquiry).then((res) => {
          this.loaders.hide()     // 关闭等待
          if (res.data.result === 'success') {
            let InquiryID = res.data.InquiryID

            data.forEach((item) => {
              if (InquiryID.indexOf(item.InquiryID) !== -1) {
                item.addCan = true
              }
            })

          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(err => {
          this.$message.error(err)
          this.loaders.hide()     // 关闭等待
        })
      },
      _checkCanDeclare(item) {      // 判断是否能够报备，第二步检测
        // 这里判断还可以报备的总数
        if (this.checked.length >= this.checkedCount) {
          this.checked.pop()
          this.$message.error('您已经达到报备上限，不能再选了！')
          return
        }

        // 事件里面有el-checkbox会执行两次，所以用这样的方式阻止重复请求
        if (!item.isOnceCheck) {
          item.isOnceCheck = true
          this.isFilingBtn = true     // 如果当网速很慢，选中客户之后，需要等待请求完成之后，才能进行报备操作
          CheckCanDeclare(item.InquiryID, this.estateVal, item.CustMobile).then((res) => {
            item.isOnceCheck = false
            this.isFilingBtn = false
              // console.log(res)
            if (res.data.result === 'success') {
              if (res.data && res.data.msg) {
                this.$message.warning(res.data.msg)
              }
              item.count = res.data.count      // 这个是后端返回的重客数量
              this.checkedStr.push(item)      // 管你是选中还是取消checked，把数据一股脑全部保存，报备的时候再筛出来
            } else {
              this.$message.error(res.data.msg)
              item.addCan = false     // 如果已存在报备记录，就修改掉状态

              for (let i = 0; i < this.checked.length; i++) {     // 如果检测失败，则删除对应的元素，因为是异常操作，所以不能直接删除最后一个
                if (this.checked[i] === item.InquiryID) {
                  this.checked.splice(i, 1)
                }
              }
            }
            // console.log(this.checked)
          })
        }
      },
      footCancel() {      // 取消报备
        this.checked = []
        this.checkedStr = []
        this.estateVal = ''     // 清空选中的楼盘
        this.estateBtn = false
        this.IsTouch = true     // 列表可以滑动了
      },
      openEstate() {    // 显示楼盘选项
        this.isOneGetEstate ? '' : this._getEstate()  // 点击报备按钮之后，再去拿楼盘数据
        this.$refs.estates.openEstate()
      },
      closeEstate() {   // 隐藏楼盘选项
        this.$refs.estates.closeEstate()
      },
      _getEstate() {      // 获取楼盘
        this.isOneGetEstate = true
        getEstate().then((res) => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.houseEstate = res.data.tempTable
          } else if (res.data.result === 'error') {
            this.houseEstateUpper = res.data.msg
            this.$message.error(res.data.msg)
          }
        }).catch((error) => {
          this.$message.error('网络异常' + error)
        })
      },
      _edit(id) {     // 编辑
        window.open('/client/Inquiry_add.html?id=' + id)
      },
      _follow(id) {     // 跟进
        this.$router.push({
          path: '/inquiry/follow',
          query: {
            id: id
          }
        })
      },
      _upInquiry(item, Status) {     // 修改状态
        let text = ''     // 提示文字
        if (Status === '暂缓') {
          text = '此操作将状态改为"暂缓"，确定吗？'
        } else if (Status === '有效') {
          text = '此操作将状态改为"有效"，确定吗？'
        } else if (Status === '无效') {
          text = '此操作将状态改为"无效"，确定吗？'
        }
        this.$confirm(text, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          upInquiry(item.InquiryID, Status).then((res) => {
            if (res.data.result === 'success') {
              this.$message.success('修改成功')
              item.Status = Status        // 修改成功之后，本地数据变化
            } else {
              this.$message.error('修改失败')
            }
          })
        })
      },
      listTouchStart (e, item) {
        this.touch.InquiryID = item.InquiryID      // 把当前操作的列表保存在touch中
        this.touch.status = item.Status     // 保存状态
        this.touch.HasOperating = item.HasOperating   // 是否有权限操作，1可以，0不可以

        if (this.touch.sides) {     // 第一次滑动的时候，判断如果已经存在滑动偏移，就取消
          this.touch.sides = false
          this.touch.initiated = false    // 开关
          this.touchRight = ''
          this.touchLeft = ''
          return
        }
        this.touch.initiated = true
        this.touch.current = e.currentTarget    // 当前元素，event输出是null，但是单独输出就有
        const touch = e.touches[0]
        this.touch.startX = touch.pageX
        this.touch.startY = touch.pageY
      },
      listTouchMove (e) {
        if (!this.touch.initiated || !this.IsTouch || this.touch.HasOperating === '0' || this.touch.status === '无效') {      // 开关
          return
        }
        const touch = e.touches[0]
        const deltaX = touch.pageX - this.touch.startX
        const deltaY = touch.pageY - this.touch.startY

        if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
          this.touch.sides = false
          return
        }

        // 判断是左还是右
        if (deltaX < -60) {
          this.touch.sides = 'r'
        } else if (deltaX > 60) {
          this.touch.sides = 'l'
        } else {
          this.touch.sides = false
        }

        // console.log(deltaX)
        let excur = 0
        if (this.touch.status === '无效') {     // 如果是无效，不能滑开状态操作
          excur = Math.max(Math.min(deltaX, 0), -160)
        } else {
          excur = Math.max(Math.min(deltaX, 160), -160)    // 取最大值和最小值
        }
        this.touch.current.style.transition = ''      // 滑动的时候清除过渡
        this.touch.current.style[transform] = `translate3d(${excur}px, 0, 0)`    // 同步滑动
      },
      listTouchEnd () {
        if (!this.IsTouch) {
          return
        }
        // 要么左，要么右，要么全部清除掉
        this.touch.current.style.transition = 'all .3s linear'      // 放手的时候添加过渡
        setTimeout(() => {      // 加延迟可以防止跳动
          this.touch.current.style[transform] = null
        }, 30)
        if (this.touch.sides === 'r') {
          this.touchLeft = this.touch.InquiryID
          this.touchRight = ''
        } else if (this.touch.sides === 'l') {
          this.touchLeft = ''
          this.touchRight = this.touch.InquiryID
        } else {
          this.touchRight = ''
          this.touchLeft = ''
        }
      },
      onSelect(obj) {      // 接收筛选条件
        // console.log(obj)
        this.paramsItem = Object.assign({}, this.paramsItem, obj)   // 合并筛选条件
        this.paramsItem.SearchDate = obj.DatePeriod   // 时间段
        this.paramsItem.DateType = obj.timeOFClass   // 时间选项
        this._customer()
      },
      selectEmpty(obj) {   // 清空筛选
        this.paramsItem = obj
        this.likestr = ''
        this.paramsItem.SDeptNo = ''
        this.paramsItem.SEmpID = ''
        this.$refs.deptNames.clearSDeptVal()    // 清空部门显示
        this.$refs.empNames.clearEmpName()     // 清除人员显示
        // this._customer()       // 清除人员操作里面有返回数据请求操作，所以不需要这条了
      },
      openMore() {    // 打开更多筛选
        this.isOneOff ? '' : this.isOneOff = true   // 打开筛选了，去获取筛选项
        this.$refs.screen.openMore()
        this.IsMake = false   // 顺便把下拉选择的遮罩也关掉
      },
      _InquiryTag() {   // 获取标签
        InquiryTag().then((res) => {
          this.tag = res.data.tempTable
        })
      },
      cleanLikestr() {    // 清除搜索内容
        this.likestr = ''
      },
      upLoad() {        // 下拉加载更多
        if (!this.hasMore) {
          return
        }
        this.paramsItem.page++
        this._commonCustomer('upLoad')
      },
      _customer() {       // 获取列表数据
        this.listData = []
        this.paramsItem.page = 1
        this.hasMore = true     // 加载中
        this._commonCustomer('load')
      },
      _commonCustomer(type) {     // 加载数据，和上滑加载更多数据公用方法，但是上滑加载是合并数据
        customer(this.paramsItem).then((res) => {
          if (res.data.result === 'success') {
            let datas = res.data.tempTable
            if (this.estateBtn && datas.length) {   // 判断是否触发了报备，如果是报备的情况下，数据要处理
              let inquiry = ''        // 只循环当前拿到的数据
              datas.forEach((item) => {
                inquiry += item.InquiryID + ',',
                item.addCan = false   // 每次检查都要先去掉所有可勾选
              })
              checkShow(this.estateVal, inquiry).then((res) => {
                if (res.data.result === 'success') {
                  let InquiryID = res.data.InquiryID

                  datas.forEach((item) => {
                    if (InquiryID.indexOf(item.InquiryID) !== -1) {
                      item.addCan = true
                    }
                  })
                  let ship = this._forData(datas)
                  // 首屏加载是覆盖，上滑加载是拼接
                  if (type === 'load') {
                    this.listData = ship
                  } else {
                    this.listData = this.listData.concat(ship)
                  }
                  this._checkMore(ship)
                }
              })
            } else {
              let ship = this._forData(datas)
              // 首屏加载是覆盖，上滑加载是拼接
              if (type === 'load') {
                this.listData = ship
              } else {
                this.listData = this.listData.concat(ship)
              }
              this._checkMore(ship)
            }

            // type = load 就是首屏获取数据
            if (type === 'load') {
              this.resultcount = res.data.resultcount    // 显示总数
              this.PublicShow = res.data.PublicShow      // 是否显示公盘筛选
              this.checkedCount = res.data.hasfiling    // 保存可报备总数
              if (this.$refs.scrolls) {
                this.$refs.scrolls.scrollTo(0, 0)     // 这是首页请求，要回到顶部
              }
            }
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        })
        .catch(err => alert('网络异常：' + err))
      },  
      _forData(data) {      // 处理数据
        let ship = data
        data.forEach((item, index) => {
          let parse = parseInt(item.CompletePercent) + parseInt(item.FollowModelPercent) + parseInt(item.FollowPercent)
          ship[index].CompletePercent = parse
          ship[index].Tag = item.Tag.split('|')    // 拆解tag
        })
        return ship
      },
      _checkMore(data) {    // 判断是否拿到更多数据
        if (!data) {
          return
        }
        if (!data.length || data.length < 10) {
          this.hasMore = false
          return
        }
      },
      onEmpName(newVal) {     // 选中的人员
        this.paramsItem.SEmpID = newVal
        this._customer()
      },
      onDeptName(newVal) {      // 选中的部门
        this.paramsItem.source = ''           // 当筛选部门的时候，清除掉掉my
        this.$refs.empNames.clearEmpName()    //当筛选部门的时候，清除选中的人员
        let len = newVal.length
        if (len) {
          this.disabled = false
          let DeptID = newVal[len - 1].split(',')[0]    // 根据id拿人员
          let SDeptNo = newVal[len - 1].split(',')[1]   // 同时保存部门编号，用来筛选
          this.DeptID = DeptID
          this.paramsItem.SDeptNo = SDeptNo
          this._customer()
        } else {
          this.disabled = true
          this.paramsItem.SDeptNo = ''
          this._customer()
        }
        this._visibleMake()
      },
      empVisibleChange(bool) {   // 人员下拉框出现/隐藏时触发
        this.IsMake = bool
      },
      _visibleMake() {    // 打开选项，显示遮罩
        this.isOneDeptName ? '' : this.isOneDeptName = true
        setTimeout(() => {
          let cascader = this.elCascader    // 部门用的是cascader
          let IsOff = false

          if (classie.hasClass(cascader, 'is-opened')) {
            IsOff = true
          }
          if (IsOff) {
            this.IsMake = true
          } else {
            this.IsMake = false
          }
        }, 30)
      },
      format(labels, selectedData) {      // 下拉筛选部门，自定义显示
        const index = labels.length - 1;
        const data = selectedData[index] || false
        return labels[index]
      },
      pitchEstate(item) {    // 选择楼盘
        this.estateVal = item.EstateID
        if (item.EstateID) {
          this.closeEstate()
          this.estateBtn = true   // 显示报备按钮
          this.IsTouch = false    // 不允许滑动列表操作
          this.touchRight = ''    // 清除已经滑动的状态
          this.touchLeft = ''
          this.estateText = item.EstateName  // 楼盘的中文名称
          this._checkShow()     // 检测一组数据是否可以报备
        }
      }
    },
    watch: {
      likestr(newVal) {   // 监听搜索
        if (this.timeGetList) {
          clearTimeout(this.timeGetList)
        }
        this.timeGetList = setTimeout(() => {
          this.paramsItem.likestr = newVal
          this._customer()   // 去筛选
        }, 300)
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
      }
    },
    components: {
      SelectDeptName,
      SelectEmpName,
      Scroll,
      Empty,
      Loader,
      LoaderCenter,
      Screen,
      SelectEstate
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  @import '../../common/sass/layout';

  .inquiry {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    overflow: hidden;
    height: 100%;
    text-align: left;
    background-color: #f5f5f5;
    .header {
      position: relative;
      text-align: center;
      .add-a {
        right: 10px;
        padding: 0;
        color: #fff;
        .el-button {
          padding: 8px 14px;
        }
      }
    }
    .color-bg {
      position: relative;
      z-index: 3;
      background-color: #f5f5f5;
    }
    .screen {
      display: flex;
      width: 100%;
      // @include border-b-1px(0);
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
      background-color: #fff;
      .branch {
        flex: 1;
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
    .scroll-area {
      position: absolute;
      top: 40px;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 1;
      padding-top: 95px;
    }
    .list-wrap {
      overflow: hidden;
      padding: 10px 5px;
      background-color: #f5f5f5;
    }
    .list {
      position: relative;
      margin-bottom: 10px;
      // transition: all .2s linear;
      &.transLeft {
        transform: translate3d(-160px, 0, 0) !important;
      }
      &.transRight {
        transform: translate3d(160px, 0, 0) !important;
      }
      .list-center {
        padding: 10px;
        box-shadow: 0 1px 6px rgba(0, 0, 0, 0.1);
        border-radius: 4px;
        width: 100%;
        background-color: #fff;
        .top {
          display: flex;
          .text-top {
            padding-right: 50px;
            .privy {
              display: inline-block;
              margin-right: 4px;
              border-radius: 50%;
              width: 16px;
              height: 16px;
              text-align: center;
              line-height: 16px;
              font-size: 12px;
              color: #fff;
              background: #F56C6C;
              &.privy2 {
                background: #67C23A;
              }
            }
            .nick-name {
              padding-top: 4px;
              font-size: 12px;
              color: #999;
              line-height: 1.2;
            }
          }
          .percentage {
            position: absolute;
            top: 10px;
            right: 10px;
          }
          .title {
            font-size: 16px;
            color: #2D2F33;
          }
          .title-span {
            padding-right: 10px;
          }
          .phone {
            font-size: 14px;
            color: #878D99;
          }
        }
        .tags {
          display: flex;
          flex-wrap: wrap;
          padding: 4px 4px 4px 0;
          .tag {
            margin: 6px 6px 0 0;
            padding: 2px 4px;
            border-radius: 3px;
            font-size: 14px;
            color: #409EFF;
            border: 1px solid #409EFF;
          }
        }
        .remark {
          padding-top: 10px;
          font-size: 13px;
          color: #878D99;
          line-height: 1.4;
          @include text-over-2();
        }
        .b-time {
          padding-top: 6px;
          padding-bottom: 10px;
          font-size: 14px;
          color: #5A5E66;
          line-height: 1.4;
        }
        .f-time {
          @include border-b-1px(100%);
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 10px;
          font-size: 14px;
          .tag {
            display: inline-block;
            margin-right: 2px;
            font-size: 12px;
            color: #FA5555;
          }
          .person {
            padding-left: 2px;
            font-size: 12px;
            font-style: normal;
            color: #878D99;
          }
        }
        .text-l {
          white-space: nowrap;
        }
        .text-r {
          color: #878D99;
          text-align: right;
        }
      }
      .list-btn-l {
        position: absolute;
        top: 0;
        padding-right: 10px;
        left: -160px;
        width: 160px;
        display: flex;
        .button {
          flex: 1;
        }
      }
      .list-btn-r {
        position: absolute;
        top: 0;
        padding-left: 10px;
        right: -160px;
        width: 160px;
        display: flex;
        .button {
          flex: 1;
          width: 80px;
        }
      }
      .list-btn-l,
      .list-btn-r {
        height: 100%;
        .button {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          // border-radius: 4px;
          height: 100%;
          font-size: 16px;
          color: #fff;
          &.edit {
            border-radius: 4px 0 0 4px;
            background-color: #33be85;
          }
          &.lc-follow {
            border-radius: 0 4px 4px 0;
            background-color: #509dec;
          }
          &.brace {
            border-radius: 4px 0 0 4px;
            background-color: #ff2255;
          }
          &.postpone {
            border-radius: 0 4px 4px 0;
            background-color: #f2a12f;
          }
          &.valid {
            border-radius: 0 4px 4px 0;
            background-color: #67ce67;
          }
        }
        .iconfont {
          padding-bottom: 4px;
          font-size: 22px;
        }
      }
      .defeated {
        display: none;
        position: absolute;
        top: 10px;
        right: 50px;
        z-index: 10;
        font-size: 16px;
        color: rgba(250, 85, 85, 1);
      }
      // 根据状态，修改颜色
      &.status-1 {
        .list-center {
          box-shadow: 0 1px 6px rgba(64, 158, 255, .6);
        }
      }
      &.status-2 {
        .list-center {
          box-shadow: 0 1px 6px rgba(235, 158, 5, .6);
          .title {
            color: rgba(235, 158, 5, 1);
          }
          .b-time {
            color: rgba(235, 158, 5, .8);
          }
          .tag {
            color: rgba(235, 158, 5, .7);
            border-color: rgba(235, 158, 5, .7);
          }
        }
      }
      &.status-3 {
        .list-center {
          box-shadow: 0 1px 6px rgba(135, 141, 153, .6);
          .title {
            color: rgba(135, 141, 153, 1);
          }
          .text-l {
            color: rgba(135, 141, 153, .9);
          }
          .b-time {
            color: rgba(135, 141, 153, .8);
          }
          .tag {
            color: rgba(135, 141, 153, .7);
            border-color: rgba(135, 141, 153, .7);
          }
          .text-r {
            color: rgba(135, 141, 153, .6);
          }
          .top {
            .text-top {
              .privy {
                background-color: rgba(135, 141, 153, .8);
              }
            }
          }
        }
      }
      &.status-4 {      // 失败
        .defeated {
          display: block;
        }
        .list-center {
          box-shadow: 0 1px 6px rgba(250, 85, 85, .6);
          background-color: rgba(250, 85, 85, .2);
          .title {
            color: rgba(250, 85, 85, 1);
          }
          .phone {
            color: rgba(250, 85, 85, 1);
          }
          .text-l {
            color: rgba(250, 85, 85, .9);
          }
          .b-time {
            color: rgba(250, 85, 85, .8);
          }
          .tag {
            color: rgba(250, 85, 85, .7);
            border-color: rgba(250, 85, 85, .7);
          }
          .text-r {
            color: rgba(250, 85, 85, .6);
          }
        }
      }
      // 勾选效果显示
      .multiple,
      .multiple-else,
      .el-checkbox {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 11;
        width: 100%;
        height: 100%;
        .el-checkbox__label {
          display: none;
        }
      }
    }
  }
  // 选择楼盘按钮
  .houses-btn {
    position: fixed;
    bottom: 50px;
    left: 15px;
    z-index: 3;
    .el-button {
      padding: 0;
      width: 50px;
      height: 50px;
      line-height: 50px;
      font-size: 16px;
      border-radius: 50%;
      box-shadow: 0 1px 4px 1px #B4BCCC;
    }
    @include MQ(SM) {
      .el-button {
        width: 46px;
        height: 46px;
        font-size: 14px;
        line-height: 46px;
      }
    }
  }
  // 报备操作按钮
  .foot-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    z-index: 10;
    background: rgba(255, 255, 255, .9);
    box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
    text-align: center;
    .current-text {
      @include border-b-1px(0);
      position: absolute;
      top: -30px;
      left: 0;
      width: 100%;
      height: 30px;
      line-height: 30px;
      background: rgba(255, 255, 255, .9);
      box-shadow: 0 -1px 3px rgba(0, 0, 0, 0.1);
      color: #666;
      .small {
        color: #333;
      }
    }
    .cancel {
      margin-right: 20%;
      margin-top: 5px;
    }
    .affirm {
      margin-top: 5px;
    }
    .el-icon-loading {
      width: 28px;
    }
  }
  .big-wrap {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 12;
    width: 100%;
    height: 100%;
  }
  .multiple {
    background: rgba(103, 194, 58, .5);
  }
  .multiple-else {
    background: rgba(255, 255, 255, .7);
  }
  // 报备进度弹窗
  .dialog-body {
    text-align: center;
    .text {
      font-size: 14px;
      .num {
        color: #FA5555;
      }
    }
  }

  // 遮罩
  .lc-mask {
    position: fixed;
    top: 142px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 4;
    // background-color: rgba(255, 255, 255, .5);
  }
  .lc-mask-top {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 85px;
    z-index: 4;
    // background-color: rgba(255, 255, 255, .5);
  }

  // 白色遮罩
  .full-white {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 6;
    width: 100%;
    height: 100%;
    background-color: white;
  }

  // 统一添加过渡
  .more-enter-active,
  .more-leave-active,
  .foot-btn-enter,
  .foot-btn-leave-to {
    transition: .3s all ease;
    .bg,
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
  // 报备按钮
  .foot-btn-enter,
  .foot-btn-leave-to {
    transform: translate3d(0, 140%, 0);
  }
  .dialog-footer {
    min-width: 73px;
    min-height: 40px;
  }
</style>
