<template lang="html">
  <!-- 销控管理 -->
  <section class="lc control">
    <header class="lc header">
      <i class="el-icon-arrow-left icon" @click="back"></i>
      <div class="title" @click="openEstate">
        <h3 class="title-text">销控管理</h3>
        <div class="estate">[{{selectEstate.EstateName}}]</div>
        <i class="arrow"></i>
      </div>
      <i class="icon icon-right el-icon-plus" v-show="isJurisAdd==='1'" @click="openAddRoom"></i>
    </header>
    <!-- 切换状态 -->
    <div class="nav-state">
      <div class="nav-center">
        <span class="nav-list" :class="{'active': currentIndex===0}" @click="onNav(0)">在售房源</span>
        <span class="nav-list" :class="{'active': currentIndex===1}" @click="onNav(1)" v-show="isHideTab==='1'">订购房源</span>
        <span class="nav-list" :class="{'active': currentIndex===2}" @click="onNav(2)" v-show="isHideTab==='1'">售罄房源</span>
        <span class="nav-list" :class="{'active': currentIndex===3}" @click="onNav(3)" v-show="isHideTab==='1'">锁定房源</span>
        <em class="nav-line" :style="lineTranslate" v-show="isHideTab==='1'"></em>
      </div>
    </div>
    <!-- 内容 -->
    <div class="content">
      <div class="cont-box state-1" :class="{'active': currentIndex===0}">
        <ul class="cont-ul" v-show="roomData.status0.length">
          <li class="cont-li" v-for="(item, index) in roomData.status0" :key="index" @click="operation(item, index, false)">
            <div class="cont-text">
              <h4 class="title">
                {{item.RoomNo}}
                <em class="propty" v-if="item.PropertyType">[{{item.PropertyType | filterType}}]</em>
              </h4>
              <p class="area">{{item.Square}}㎡</p>
              <p class="price">{{item.PriceUnit}}元</p>
            </div>
          </li>
        </ul>
        <div class="empty-li">
          <empty desc="暂无在售房源数据" v-show="!roomData.status0.length && !isLoader"></empty>
        </div>
      </div>
      <div class="cont-box state-2" :class="{'active': currentIndex===1}">
        <ul class="cont-ul" v-show="roomData.status1.length">
          <li class="cont-li" v-for="(item, index) in roomData.status1" :key="index">
            <div class="cont-text">
              <h4 class="title">
                {{item.RoomNo}}
                <em class="propty" v-if="item.PropertyType">[{{item.PropertyType | filterType}}]</em>
              </h4>
              <p class="area">{{item.Square}}㎡</p>
              <p class="price">{{item.PriceUnit}}元</p>
            </div>
          </li>
        </ul>
        <div class="empty-li">
          <empty desc="暂无订购房源数据" v-show="!roomData.status1.length && !isLoader"></empty>
        </div>
      </div>
      <div class="cont-box state-3" :class="{'active': currentIndex===2}">
        <ul class="cont-ul" v-show="roomData.status2.length">
          <li class="cont-li"v-for="(item, index) in roomData.status2" :key="index">
            <div class="cont-text">
              <h4 class="title">
                {{item.RoomNo}}
                <em class="propty" v-if="item.PropertyType">[{{item.PropertyType | filterType}}]</em>
              </h4>
              <p class="area">{{item.Square}}㎡</p>
              <p class="price">{{item.PriceUnit}}元</p>
            </div>
          </li>
        </ul>
        <div class="empty-li">
          <empty desc="暂无售罄房源数据" v-show="!roomData.status2.length && !isLoader"></empty>
        </div>
      </div>
      <div class="cont-box state-4" :class="{'active': currentIndex===3}">
        <ul class="cont-ul" v-show="roomData.status3.length">
          <li class="cont-li"v-for="(item, index) in roomData.status3" :key="index" @click="operation(item, index, true)">
            <div class="cont-text">
              <h4 class="title">
                {{item.RoomNo}}
                <em class="propty" v-if="item.PropertyType">[{{item.PropertyType | filterType}}]</em>
              </h4>
              <p class="area">{{item.Square}}㎡</p>
              <p class="price">{{item.PriceUnit}}元</p>
            </div>
          </li>
        </ul>
        <div class="empty-li">
          <empty desc="暂无锁定房源数据" v-show="!roomData.status3.length && !isLoader"></empty>
        </div>
      </div>
      <loader v-show="isLoader"></loader>
    </div>
    <!-- 选择楼盘 -->
    <select-estate ref="estates" :houseEstate="getEstateData" @onEstate="pitchEstate"></select-estate>
    <!-- 更多楼栋 -->
    <div class="select">
      <!-- 楼栋 -->
      <transition name="room-list">
        <div class="room" v-show="IsRoom">
          <span 
            class="room-list" 
            :class="{'active': item.BuildingName===selectBuildingName}" 
            v-for="(item, index) in getBuildingData" 
            :key="index" 
            @click="selectRoom(item)">
              {{item.BuildingName}}
          </span>
        </div>
      </transition>
      <!-- 更多按钮 -->
      <span class="more" @click="onMore">{{selectBuildingName}}</span>
    </div>
    <!-- 修改按钮 -->
    <div class="edit" @click="editDialog = true" v-show="isJurisUp==='1'">
      <div class="edit-btn">编辑</div>
    </div>
    <loader-center ref="loaderCenters"></loader-center>
    <!-- 添加弹窗 -->
    <el-dialog custom-class="add-room" :title="dialogText" width="80%" :visible.sync="addDialog">
      <div class="add-wrap">
        <p class="edit-status" v-show="recordOper==='editRoom'">房号：{{LockRoomNo}}</p>
        <ul>
          <li class="add-list">
            <span class="add-name">楼盘名</span>
            <el-select class="add-input" v-model="salesData.EstateID" placeholder="请选择楼盘">
              <el-option
                v-for="(item, index) in getEstateData"
                :key="index"
                :label="item.EstateName"
                :value="item.EstateID">
              </el-option>
            </el-select>
          </li>
          <li class="add-list">
            <span class="add-name">类型</span>
            <el-select class="add-input" v-model="salesData.PropertyType" placeholder="请选择类型">
              <el-option
                v-for="(item, index) in PropertyTypeData"
                :key="index"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </li>
          <li class="add-list">
            <span class="add-name">栋座</span>
            <el-input class="add-input" v-model="salesData.Building" placeholder="输入栋座编号"></el-input>
          </li>
          <li class="add-list" v-show="recordOper !== 'editRoom'">
            <span class="add-name">房号</span>
            <el-input class="add-input" v-model="salesData.RoomNo" placeholder="按示例输入房号"></el-input>
          </li>
          <li class="description">示例：0103或0103-0110或0103,0105,0208,0203</li>
          <li class="add-list">
            <span class="add-name">面积</span>
            <el-input class="add-input" v-model="salesData.Square" @blur="onChangeSquare" placeholder="输入面积（㎡）"></el-input>
          </li>
          <li class="add-list">
            <span class="add-name">售单价</span>
            <el-input class="add-input" v-model="salesData.PriceUnit" @blur="onChangePriceUnit" placeholder="输入单价（元/㎡）"></el-input>
          </li>
          <li class="add-list">
            <span class="add-name">售总价</span>
            <el-input class="add-input" v-model="salesData.Price" @blur="onChangePrice" placeholder="输入总价（万/㎡）"></el-input>
          </li>
        </ul>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addDialog = false">取 消</el-button>
        <el-button type="primary" @click="addConfirm">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 选择一个编辑操作 -->
    <el-dialog title="选择操作" :visible.sync="editDialog" width="80%">
      <div class="edit-wrap">
        <ul>
          <li class="edit-list" @click="editRoom">修改房源数据</li>
          <li class="edit-list" @click="editStatus">修改房源状态</li>
          <li class="edit-list" @click="editLock">修改锁定（单个）</li>
          <li class="edit-list" @click="editLockAll">修改锁定（一层）</li>
        </ul>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 修改状态 -->
    <el-dialog title="修改状态" :visible.sync="editDialogStatus" width="80%">
      <div class="edit-wrap">
        <p class="edit-status">房号：{{salesData.RoomNo}}</p>
        <el-button type="warning" @click="editRommStatus('订购')">改为订购</el-button>
        <el-button type="danger" @click="editRommStatus('售罄')">改为售罄</el-button>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogStatus = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 锁定 -->
    <el-dialog :title="editDialogLockText" :visible.sync="editDialogLock" width="80%">
      <div class="edit-wrap">
        <p class="edit-status">房号：{{LockRoomNo}}</p>
        <el-switch 
          v-model="FlagLocked" 
          inactive-text="解锁"
          active-text="锁定" 
          active-color="#13ce66" 
          inactive-color="#ff4949"
          @change="changeLockSwitch"></el-switch>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogLock = false">取 消</el-button>
      </span>
    </el-dialog>
  </section>
</template>

<script>
  // 测试 COCO 0105 

  import Empty from '@/base/Empty'
  import Scroll from '@/base/BScroll'
  import Loader from '@/base/Loader'
  import LoaderCenter from '@/base/LoaderCenter'
  import SelectEstate from '@/base/SelectEstate'
  import { estate } from '@/api/public'
  import { 
    GetBuildingByEstateID, 
    GetSalesDate, 
    InsertBudlding, 
    InsertRoom,
    UpRoom,
  } from '@/api/control/control'
  import { verifyData } from '@/utils/index'

  export default {
    data() {
      return {
        roomData: {         // 房号数据
          status0: [],      // 在售
          status1: [],      // 订购
          status2: [],       // 售罄
          status3: [],       // 锁定
        },
        PropertyTypeData: [
          {
            label: '商铺',
            value: '商铺'
          },
          {
            label: '公寓',
            value: '公寓'
          },
          {
            label: '写字楼',
            value: '写字楼'
          },
        ],
        salesData: {},        // 添加房号填写的数据
        getEstateData: [],    // 获取楼盘数据
        getBuildingData: [],  // 根据楼盘获取到的楼栋数据
        selectEstate: {},     // 当前选中的楼盘
        selectBuildingName: '', // 当前选中的楼栋
        selectBuildingID: '', // 当前选中的楼栋ID
        currentIndex: 0,      // 当前切换的序列号
        IsRoom: false,        // 显示隐藏楼栋
        addDialog: false,     // 添加楼栋弹出框
        editDialogStatus: false,  // 修改状态弹出框
        dialogText: '生成房号', // 生成房号文字提示
        editDialog: false,    // 选择编辑操作弹窗
        editDialogLock: false,  // 锁定弹窗
        editDialogLockText: '修改锁定（单个）',  // 锁定弹窗
        LockRoomNo: '',   // 要修改的房号
        recordOper: '', // 记录当前选择的操作
        FlagLocked: false,    // 是否锁定
        isLoader: true,       // 数据加载中
        isJurisAdd: '0',    // 是否有添加的权限
        isJurisUp: '0',    // 是否有编辑的权限
        isHideTab: '0',      // 添加和编辑权限都不存在，只显示在售房源
      }
    },
    created() {
      this._getEstate()
    },
    mounted () {
      this.$nextTick(() => {
        this.loaderCenter = this.$refs.loaderCenters     // 提示元素全局保存
      })
    },
    computed: {
      lineTranslate() {   // 导航下面的line线
        return `transform: translate3d(${this.currentIndex*100}%, 0, 0)`
      }
    },
    filters: {
      filterType(data) {    // 过滤类型
        switch (data) {
          case '商铺':
            return '铺'
          break;
          case '写字楼':
            return '写'
          break;
          default:
            return '寓'
            break;
        }
      }
    },
    methods: {
      // 操作房源
      operation(item, index, lock) {
        // 判断是否有操作权限
        if (this.isJurisUp !== '1') {
          return
        }
        // 判断当前是什么操作
        if (!this.recordOper) {
          this.$message.warning('请先点击左下角的编辑按钮')
          return
        }
        if (item.Status !== '在售') {
          return
        }
        this.FlagLocked = lock
        this.salesData = Object.assign({}, item)
        this.salesData.Building = parseInt(item.BuildingName)
        this.salesData.EstateID = this.selectEstate.EstateID
        this.salesData.BuildingID = this.selectBuildingID

        if (this.recordOper === 'editRoom') {   // 修改房源状态
          this.addDialog = true
          delete this.salesData.RoomNo      // 不能传RoomNo
          this.LockRoomNo = item.RoomNo   // 保存房号，用来显示
        }
        else if (this.recordOper === 'editStatus') {  // 修改状态
          this.editDialogStatus = true
        }
        else if (this.recordOper === 'editLock') {  // 锁定单个
          this.editDialogLock = true
          delete this.salesData.RoomNo      // 不能传RoomNo
          this.LockRoomNo = item.RoomNo   // 保存房号，用来显示
        }
        else if (this.recordOper === 'editLockAll') {  // 锁定多个
          this.editDialogLock = true
          this.salesData.RoomNo = item.RoomNo.substring(0, 2) // 传整栋楼的前两位
          delete this.salesData.RoomID      // 不能传RoomID
          this.LockRoomNo = this.salesData.RoomNo   // 保存房号，用来显示
        }
      },
      // 锁定多个
      editLockAll() {
        this.$message.success('请点击一个房号进行锁定')
        this.recordOper = 'editLockAll'
        this.editDialog = false
        this.editDialogLockText = '修改锁定（一层）'
      },
      // 锁定单个
      editLock() {
        this.$message.success('请点击一个房号进行锁定')
        this.recordOper = 'editLock'
        this.editDialog = false
        this.editDialogLockText = '修改锁定（单个）'
      },
      // 锁定单个，改变
      changeLockSwitch(bool) {
        this.salesData.FlagLocked = Number(bool);
        this._UpRoom()
      },
      // 修改状态
      editStatus() {
        this.$message.success('请点击一个房号进行修改状态')
        this.recordOper = 'editStatus'
        this.editDialog = false
      },
      // 选择状态
      editRommStatus(status) {
        this.salesData.Status = status
        this._UpRoom()
      },
      // 修改房源数据
      editRoom() {
        this.$message.success('请点击一个房号进行修改数据')
        this.recordOper = 'editRoom'
        this.editDialog = false
        this.dialogText = '修改房源数据'
      },
      // 修改房源数据，发送请求
      _UpRoom() {
        let _upRoom = () => {
          this.loaderCenter.show('正在操作')
          UpRoom(this.salesData)
          .then(res => {
            this.addDialog = false
            this.editDialogLock = false
            if (res.data.result === 'success') {
              this.loaderCenter.hide()
              this.$message.success('操作成功！')
              // 成功后重新获取数据
              this._GetSalesDate(this.selectEstate.EstateID, this.selectBuildingName)
            } 
            else if (res.data.result === 'error') {
              this.$message.error(res.data.msg)
            } 
            else if (res.data.result === '权限不足') {
              this.$message.error('权限不足')
              setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
            }
          })
          .catch(err => {
            this.$message.error('网络异常'+ err)
          })
        }
        // 如果是根据楼层锁定，给个提示
        if (this.recordOper === 'editLockAll') {
          this.$confirm('此操作是针对一层楼, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            _upRoom()
          })
          .catch(() => {
            this.editDialogLock = false
          })  
        } else {
          _upRoom()
        }
      },
      openEstate() {
        let roomData = this.roomData
        if (roomData.status0.length || roomData.status1.length || roomData.status2.length) {
          // 切换选择楼盘之前，要先判断当前是否获取到了数据，网速慢的时候，发出去的请求可能会覆盖掉当前数据
          this.$refs.estates.openEstate()
        }
      },
      closeEstate() {
        this.$refs.estates.closeEstate()
      },
      pitchEstate(item) {   // 选择楼盘
        this.selectEstate = item
        this.closeEstate()
        this._GetBuildingByEstateID(item.EstateID)   // 修改楼盘后，重新获取栋座，再获取栋下面的房号
        this.recordOper = ''
      },
      _InsertRoom(BuildingID) {     // 生成房号
       this.salesData.BuildingID = BuildingID
        InsertRoom(this.salesData).then(res => {
          this.loaderCenter.hide()
          if (res.data.result === 'success') {
            this.$message.success('操作成功！')
            // 清空
            this.addDialog = false
            this.salesData = {}
            // 添加成功后，重新更新数据
            this._GetSalesDate(this.selectEstate.EstateID, this.selectBuildingName)
          }
          else if (res.data.result === 'error') {
            this.$message.error(res.data.msg)
          }
        })
      },
      _InsertBudlding(EstateID, BuildingName) {   // 添加楼栋返回栋座ID
        this.loaderCenter.show('稍等')
        InsertBudlding(EstateID, BuildingName).then(res => {
          if (res.data.result !== '权限不足') {
            this._InsertRoom(res.data.BuildingID)     // 拿到楼栋ID之后，再添加房号
          } 
          else {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
        }).catch(err => {
          this.$message.error('网络异常'+ err)
        })
      },
      onChangeSquare() {    // 改变面积，计算单价或总价
        let item = this.salesData
        let PriceUnit = parseFloat(item.PriceUnit)
        let Price = parseFloat(item.Price)
        
        if (verifyData(item.Square, 'number-dot') && verifyData(PriceUnit, 'number-dot')) {
          let Price = (PriceUnit * item.Square / 10000).toFixed(2) + '万'
          this.$set(item, 'Price', Price)
          return    // 注意这里，如果两个值都存在，用单价计算总价即可
        }
        if (verifyData(item.Square, 'number-dot') && verifyData(Price, 'number-dot')) {
          let PriceUnit = (Price * 10000 / item.Square).toFixed(2) + '元'
          this.$set(item, 'PriceUnit', PriceUnit)
        }
      },
      onChangePriceUnit() {     // 改变单价，计算总价
        let item = this.salesData
        let PriceUnit = parseFloat(item.PriceUnit)

        if (verifyData(item.Square, 'number-dot') && verifyData(PriceUnit, 'number-dot')) {
          let Price = (PriceUnit * item.Square / 10000).toFixed(2) + '万'
          this.$set(item, 'Price', Price)
        }
      },
      onChangePrice() {     // 改变总价，计算单价 
        let item = this.salesData
        let Price = parseFloat(item.Price)

        if (verifyData(item.Square, 'number-dot') && verifyData(Price, 'number-dot')) {
          let PriceUnit = (Price * 10000 / item.Square).toFixed(2) + '元'
          this.$set(item, 'PriceUnit', PriceUnit)
        }
      },
      addConfirm() {    // 生成房号和修改房号
        // console.log(this.salesData)
        var salesData = this.salesData
        if (!salesData.EstateID) {
          this.$message.error('请选择楼盘')
          return false
        }
        
        if (!salesData.Building || !verifyData(salesData.Building, 'number')) {
          this.$message.error('请输入栋座')
          return false
        }

        // 判断是否是修改
        if (this.recordOper !== 'editRoom') {
          if (!verifyData(salesData.RoomNo, 'require')) {
            this.$message.error('请输入房号')
            return false
          }
  
          // 验证房号 (-) ，一个区间的房号，前两位必须一样
          if (salesData.RoomNo.indexOf('-') !== -1) {
            if(!this._verifyRoom(salesData.RoomNo)) {
              this.$message.error('房号格式不正确，不能跨楼层添加')
              return false
            }
          }
        }

        // 面积、单价、总价有默认单位
        if (!verifyData(salesData.Square, 'number-dot')) {
          this.$message.error('请输入面积')
          return false
        }
        
        if (!verifyData(salesData.PriceUnit, 'require')) {
          this.$message.error('请输入单价')
          return false
        } else {
          salesData.PriceUnit = parseFloat(salesData.PriceUnit)   // 去掉单位
        }
        if (!verifyData(salesData.Price, 'require')) {
          this.$message.error('请输入总价')
          return false
        } else {
          salesData.Price = parseFloat(salesData.Price)
        }

        // 判断是不是修改
        if (this.recordOper === 'editRoom') {
          this._UpRoom();    // 修改房源数据
        } 
        else {
          // 先验证楼栋是否存在
          this._InsertBudlding(salesData.EstateID, salesData.Building)
        }

      },
      _verifyRoom(RoomNo) {   // 验证批量上传房号区间 （-），不能跨楼层添加
        if (!RoomNo) {
          return
        }
        var split = RoomNo.split('-')
        if (split.length !==2 ) {
          return false
        }
        if (split[0].substring(0, 2) !== split[1].substring(0, 2)) {
          return false
        }
        return true
      },
      selectRoom(item) {    // 切换楼栋
        let roomData = this.roomData
        // 拿到数据之后，才能切换，网速差的时候会被前面的数据覆盖
        if (roomData.status0.length || roomData.status1.length || roomData.status2.length) {
          this.selectBuildingName = item.BuildingName
          this.selectBuildingID = item.BuildingID
          this.IsRoom = false
          this._GetSalesDate(this.selectEstate.EstateID, this.selectBuildingName)    // 每次修改楼栋，都要更新数据
        }
      },
      openAddRoom() {
        this.recordOper = ''
        this.salesData = {}      // 先清空
        this.addDialog = true
        this.dialogText = '生成房号'
      },
      onMore() {
        this.IsRoom = !this.IsRoom
      },
      onNav(index) {
        this.currentIndex = index
      },
      _disState(arr) {      // 根据房源状态，把数据进行分类
        if (!arr) {
          return false
        }
        arr.forEach(item => {
          switch (item.Status) {
            case '在售':
              this.roomData.status0.push(item)
              break;
            case '订购':
              this.roomData.status1.push(item)
              break;
            default:
              this.roomData.status2.push(item)
              break;
          }
        })
        this.isLoader = false
        // setTimeout(() => {
        // }, 0)
      },
      _GetSalesDate(EstateID, BuildingName) {   // 根据楼盘ID和楼栋编号获取房号
        this.isLoader = true
        // 更新数据之前先清空
        this.roomData = {
          status0: [], 
          status1: [], 
          status2: [],
          status3: [],
        }
        GetSalesDate(EstateID, BuildingName).then(res => {
          if (res.data.result === 'success') {
            // 判断权限
            this.isJurisAdd = res.data.add
            this.isJurisUp = res.data.up
            if (res.data.add === '1' && res.data.up === '1') {
              this.isHideTab = '1'
            }
            // 把数据根据状态分开
            this._disState(res.data.tempTable)
          } else {
            this.isLoader = false
          }
        }).catch(err => {
          this.$message.error('catch'+ err)
          this.isLoader = false
        })
        // 单独去获取锁定房源
        GetSalesDate(EstateID, BuildingName, 1).then(res => {
          if (res.data.result === 'success') {
            this.roomData.status3 = res.data.tempTable
          } else {
            this.roomData.status3 = []
          }
        }).catch(err => {
          this.$message.error('catch'+ err)
        })
      },
      _GetBuildingByEstateID(id) {    // 根据楼盘ID获取楼栋
        this.isLoader = true
        this.roomData = {
          status0: [], 
          status1: [], 
          status2: [],
          status3: [],
        }
        GetBuildingByEstateID(id).then((res) => {
          if (res.data.result === 'success') {
            this.getBuildingData = res.data.tempTable
            this.selectBuildingName = this.getBuildingData[0].BuildingName   // 默认最新的楼栋
            this.selectBuildingID = this.getBuildingData[0].BuildingID   // 默认最新的楼栋
            this._GetSalesDate(id, this.selectBuildingName)
          } 
          else if (res.data.result === 'error') {     // 暂无数据
            this.getBuildingData = []   // 没有楼栋
            this.selectBuildingName = '空'
            this.selectBuildingID = ''
            this.isLoader = false
          }
        }).catch(err => {
          alert('请求异常：'+ err)
        })
      },
      _getEstate() {
        this.isLoader = true
        estate().then(res => {
          if (res.data.result === 'success') {
            this.getEstateData = res.data.tempTable
            this.selectEstate = this.getEstateData[0]         // 默认选中的楼盘
            this._GetBuildingByEstateID(this.selectEstate.EstateID)
          } 
          else if (res.data.result === 'error') {
            this.$message.error(res.data.msg)
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
        }).catch(err => {
          alert('楼盘请求异常：'+ err)
        })
      },
      back() {
        this.$router.back()
      }
    },
    components: {
      Empty,
      Scroll,
      Loader,
      LoaderCenter,
      SelectEstate
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/variable";
  @import "../../common/sass/mixin";
  @import "../../common/sass/layout";

  .control {
    position: relative;
    height: 100%;
    background-color: #f5f5f5;
    .header {
      .title {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0 50px;
        .title-text {
          font-weight: 700;
        }
        .estate {
          padding-left: 4px;
          font-size: 14px;
          font-weight: normal;
          @include text-over();
        }
        .arrow {
          margin: 4px 0 0 2px;
          border-width: 4px;
          border-style: solid;
          border-color:  #666 transparent transparent;
          width: 4px;
          height: 4px;
        }
      }
      .icon-right {
        left: auto;
        right: 0;
        font-size: 20px;
        font-weight: bold;
        color: $color-blue;
      }
    }
    .nav-state {
      position: relative;
      z-index: 5;
      display: flex;
      justify-content: center;
      // margin-top: 8px;
      @include border-b-1px(0);
      width: 100%;
      height: 35px;
      background-color: #fff;
      .nav-center {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
      }
      .nav-list {
        display: inline-block;
        width: 80px;
        height: 35px;
        line-height: 35px;
        font-size: 14px;
        text-align: center;
        &.active {
          color: $color-blue;
        }
      }
      .nav-line {
        position: absolute;
        left: 0;
        bottom: 2px;
        width: 25%;
        transition: all .3s;
        &:before {
          content: "";
          position: absolute;
          top: 0;
          left: 25%;
          border-radius: 2px;
          width: 50%;
          height: 2px;
          background-color: $color-blue;
        }
      }
    }
    .content {
      overflow-x: hidden;
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      padding-top: 88px;
      width: 100%;
      height: 100%;
      .cont-box {
        display: none;
        &.active {
          display: block;
        }
        &.state-2 {
          .cont-ul .cont-text {
            background-color: $color-yellow;
          }
        }
        &.state-3 {
          .cont-ul .cont-text {
            background-color: $color-red;
          }
        }
        &.state-4 {
          .cont-ul .cont-text {
            background-color: $color-blue;
          }
        }
        .propty {
          padding-left: 2px;
          font-style: normal;
          font-size: 14px;
        }
      }
      .cont-ul {
        display: flex;
        flex-wrap: wrap;
        padding: 6px;
        background-color: #fff;
        .cont-li {
          position: relative;
          padding: 6px;
          width: 25%;
        }
        @include MQ(SM) {
          .cont-li {
            width: 33.33%;
          }
        }
        .cont-text {
          padding: 12px 0;
          color: #fff;
          background-color: $color-green;
          .title {
            font-size: 14px;
          }
          .area {
            line-height: 22px;
            font-size: 12px;
          }
          .price {
            font-size: 12px;
          }
        }
      }
      .empty-li {
        margin: 0 auto;
      }
    }
    .select {
      position: fixed;
      bottom: 0;
      right: 0;
      z-index: 20;
      width: 42px;
      .room {
        overflow-x: hidden;
        overflow-y: auto;
        -webkit-overflow-scrolling: touch;
        position: absolute;
        bottom: 62px;
        right: 10px;
        width: 42px;
        max-height: 450px;
        display: flex;
        flex-direction: column;
        align-items: center;
        .room-list {
          margin-bottom: 10px;
          border-radius: 50%;
          width: 35px;
          height: 35px;
          font-size: 14px;
          color: #fff;
          background-color: rgba(0, 0, 0, .5);
          line-height: 35px;
          &.active {
            background-color: $color-blue;
          }
        }
      }
      .more {
        position: absolute;
        bottom: 20px;
        right: 10px;
        z-index: 20;
        border-radius: 50%;
        width: 42px;
        height: 42px;
        font-size: 22px;
        color: #fff;
        background-color: rgba(0, 0, 0, .5); 
        text-align: center;
        line-height: 42px;
      }
    }
    .add-room {
      .add-list {
        display: flex;
        align-items: cneter;
        margin-top: 10px;
        .add-name {
          min-width: 70px;
          font-size: 14px;
          color: #333;
          text-align: left;
          line-height: 40px;
        }
        .add-input {
          flex: 1;
        }
      }
      .description {
        padding-left: 70px;
        font-size: 14px;
        text-align: left;
      }
    }
    // 编辑按钮
    .edit {
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 20;
      padding: 20px;
      width: 42px;
      .edit-btn {
        width: 42px;
        height: 42px;
        line-height: 42px;
        font-size: 14px;
        border-radius: 50%;
        color: #fff;
        background-color: rgba(0, 0, 0, .5); 
      }
    }
    .edit-wrap {
      @include border-b-1px(100%);
      .edit-list {
        font-size: 16px;
        height: 46px;
        line-height: 46px;
        @include border-b-1px(0);
      }
    }
    .edit-status {
      padding: 10px;
      font-size: 16px;
    }
  }

  .room-list-enter-active,
  .room-list-leave-active {
    transition: all .3s;
  }
  .room-list-enter,
  .room-list-leave-to {
    transform: scale(0);
    transform-origin: bottom;
  }
</style>
