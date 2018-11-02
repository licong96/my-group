<template lang="html">
  <!-- 添加楼盘 -->
  <section class="addition">
    <transition name="header">
      <div class="d-header" @touchmove.prevent.stop>
        <i class="el-icon-arrow-left icon" @click="_back"></i>
        <h3 class="title">{{textTitle}}</h3>
        <el-button class="right-btn" type="primary" @click="upload">{{textBtn}}<i class="el-icon-upload el-icon--right"></i></el-button>
      </div>
    </transition>
    <article class="addition-main">
      <scroll 
        :data="OfferData"
        :probeType="probeType" 
        :listemScroll="listemScroll" 
        @scroll="scrollPos" 
        ref="scroll">
      <div>
      <section class="addition-1">
        <div class="cover">
          <div class="cover-bg" :style="coverBG"></div>
          <!-- 淘汰的裁切 -->
          <!-- 这个是占位符不具备任何功能 -->
          <div class="crop-placeholder" @click="onChangeAvatar">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </div>
          <p class="text">上传封面图片</p>
        </div>
        <div class="name-price">
          <ul class="list-wrap">
            <li class="list">
              <span class="title">名称：</span>
              <div class="input-wrap">
                <input type="text" class="input" v-model="estateName" placeholder="请填写楼盘名称">
              </div>
            </li>
            <li class="list">
              <span class="title">均价：</span>
              <div class="input-wrap">
                <input type="tel" class="input" v-model.number="postData.Price" placeholder="单位(元/m²)">
              </div>
            </li>
            <li class="list">
              <span class="title">电话：</span>
              <div class="input-wrap">
                <input type="tel" class="input" v-model="postData.DevTel" placeholder="请填写联系电话">
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="addition-2">
        <ul class="list-wrap">
          <li class="list">
            <span class="title">优惠：</span>
            <div class="input-wrap">
              <el-select v-model="postData.Offer" placeholder="请选择优惠">
                <el-option label="暂无" value=""></el-option>
                <el-option :label="item.ItemValue" :value="item.ItemValue" v-for="(item, index) in OfferData" :key="index"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="title">区域：</span>
            <div class="input-wrap">
              <el-select v-model="postData.DistrictName" placeholder="请选择区域">
                <el-option :label="item.DistrictName" :value="item.DistrictName" v-for="item in DistrictNameData" :key="item.DistrictID"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="title">类型：</span>
            <div class="input-wrap">
              <el-select v-model="postData.PropertyUsage" placeholder="请选择区域">
                <el-option :label="item.ItemValue" :value="item.ItemValue" v-for="(item, index) in PropertyUsageData" :key="index"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="title">类别：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.PropertyType" placeholder="请填写建筑类别">
            </div>
          </li>
        </ul>
      </section>
      <section class="addition-3">
        <ul class="list-wrap">
          <li class="list">
            <span class="title">地址：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.Address" placeholder="请填写详细地址">
            </div>
            <i class="el-icon-location-outline" @click="openBMap"></i>
          </li>
        </ul>
      </section>
      <section class="addition-4">
        <div class="title">
          <span>户型：</span>
          <span class="add-block" @click="dialog">添加<i class="el-icon-arrow-right"></i></span>
        </div>
        <div class="house-main">
          <ul class="house-wrap">
            <li class="house-list" v-for="(item, index) in styleData" :key="index">
              <div class="operation">
                <i class="el-icon-close" @click="closeHouse(index)"></i>
              </div>
              <div class="house-img-wrap">
                <img class="house-img" :src="item.picSrc" alt="">
              </div>
              <div class="text">
                <p class="t-title">{{item.CountF}}房{{item.CountT}}厅{{item.CountW}}卫</p>
                <p class="total">建面：{{item.Square}}m²</p>
                <p class="money">参考均价：{{item.Price?item.Price:0}}元/m²</p>
              </div>
            </li>
          </ul>
        </div>
      </section>
      <section class="addition-5">
        <ul class="list-wrap">
          <li class="list">
            <span class="title">楼栋总数：</span>
            <div class="input-wrap">
              <input class="input" type="tel" v-model="postData.BuildingAll">
            </div>
          </li>
          <li class="list">
            <span class="title">总户数：</span>
            <div class="input-wrap">
              <input class="input" type="tel" v-model="postData.Room">
            </div>
          </li>
          <li class="list">
            <span class="title">面积(m²)：</span>
            <div class="input-wrap">
              <input class="input" type="tel" v-model="postData.Square">
            </div>
          </li>
        </ul>
      </section>
      <section class="addition-6">
        <ul class="list-wrap">
          <li class="list">
            <span class="title">开发商：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.DevCompany" placeholder="请填写开发商">
            </div>
          </li>
          <li class="list">
            <span class="title">预售许可证：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.License" placeholder="请填写预售许可证">
            </div>
          </li>
          <li class="list">
            <span class="title">产权年限：</span>
            <div class="input-wrap">
              <input type="tel" class="input" v-model="postData.OwnYear" placeholder="请填写产权年限(年)">
            </div>
          </li>
        </ul>
      </section>
      <section class="addition-7">
        <ul class="list-wrap">
          <li class="list">
            <span class="title">物业公司：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.MgtCompany" placeholder="请填写物业公司">
            </div>
          </li>
          <li class="list">
            <span class="title">物业费：</span>
            <div class="input-wrap">
              <input type="text" class="input" v-model="postData.MgtPrice" placeholder="请填写物业费">
            </div>
          </li>
          <li class="list">
            <span class="title">绿化率(%)：</span>
            <div class="input-wrap">
              <input type="tel" class="input" v-model="postData.BuildingDensity" placeholder="请填写绿化率">
            </div>
          </li>
          <li class="list">
            <span class="title">容积率(%)：</span>
            <div class="input-wrap">
              <input type="tel" class="input" v-model="postData.FAR" placeholder="请填写容积率">
            </div>
          </li>
        </ul>
      </section>
      <section class="addition-8">
        <div class="title">
          标签：<span class="small">多选</span>
        </div>
        <el-checkbox-group v-model="postData.Tag" size="mini">
          <el-checkbox :label="item.ItemValue" border v-for="(item, index) in TagData" :key="index"></el-checkbox>
        </el-checkbox-group>
      </section>
      <section class="addition-9">
        <textarea class="textarea" v-model="postData.EstateIntro" rows="3" cols="6" placeholder="请填写项目简介"></textarea>
      </section>
      <section class="addition-9">
        <textarea class="textarea" v-model="postData.FloorAll" rows="3" cols="6" placeholder="请填写楼层状况"></textarea>
      </section>
      <section class="addition-9">
        <textarea class="textarea" v-model="postData.ParkingSpace" rows="3" cols="6" placeholder="请填写停车位"></textarea>
      </section>
      <section class="addition-9">
        <textarea class="textarea" v-model="postData.Environment" rows="3" cols="6" placeholder="请填写周边配套"></textarea>
      </section>
      <section class="addition-9">
        <textarea class="textarea" v-model="postData.Transportation" rows="3" cols="6" placeholder="请填写交通设施"></textarea>
      </section>
      <section class="addition-10">
        <p class="title">上传轮播图：</p>
        <div class="up-wrap">
          <div class="up-list" v-for="(item, index) in slideData" :key="index">
            <i class="el-icon-close" @click="closeSllide(index)"></i>
            <img :src="item.PhotoData" class="avatar">
          </div>
          <div class="up-avatar" ref="upAvatar" @click="onChangeSwiper">
            <i class="avatar-uploader-icon" :class="avatarLoad"></i>
          </div>
        </div>
      </section>
    </div>
    </scroll>
    </article>
    <!-- 封面图上传，这是机智，如果不用外面容器打开裁切，会出现兼容性的问题 -->
    <vue-core-image-upload
      class="avatar-input"
      :maxWidth="750"
      :compress="50"
      crop-ratio="1.5:1"
      crop="local"
      :cropBtn="{'ok': '确定', 'cancel': '取消'}"
      @imagechanged="imagechangedAvatar"
      @errorhandle="errorhandle"
      inputAccept="image/jpg,image/jpeg,image/png"
      :max-file-size="2097152"
      :isXhr="false"
      text="">
    </vue-core-image-upload>
    <el-dialog
      title="上传封面图"
      center
      :visible.sync="avatarDialog"
      width="80%">
      <div class="avatar-box" @click="onUpAvatarImg">
        <i class="avatar-uploader-icon el-icon-plus"></i>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="avatarDialog = false">取 消</el-button>
      </span>
    </el-dialog>

    <!-- 轮播图上传事件，和上面一样 -->
    <vue-core-image-upload
      class="avatar-swiper"
      :maxWidth="750"
      :compress="50"
      crop-ratio="1.5:1"
      crop="local"
      :cropBtn="{'ok': '确定', 'cancel': '取消'}"
      @imagechanged="imagechangedRoom"
      @errorhandle="errorhandle"
      inputAccept="image/jpg,image/jpeg,image/png"
      :max-file-size="2097152"
      :isXhr="false"
      text="">
    </vue-core-image-upload>
    <el-dialog
      title="上传轮播图"
      center
      :visible.sync="swiperDialog"
      width="80%">
      <div class="avatar-box" @click="onUpSwiperImg">
        <i class="avatar-uploader-icon el-icon-plus"></i>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="swiperDialog = false">取 消</el-button>
      </span>
    </el-dialog>
    <!-- 百度地图 -->
    <div class="add-map" :class="{'map-transX': IsBMap}" :style="mapHeight" v-if="IfBMap">
      <b-map :addBack="addBack" ref="BaiduMap" @transitionx="closeBMap" @point="point" @location="location" @mapInitOk="mapInitOk"></b-map>
    </div>
    <!--  v-if="IfBMap" v-show="IsBMap" -->
    <!-- 添加楼盘弹出框 -->
    <el-dialog title="添加户型" :visible.sync="dialogFormVisible" width="80%">
      <div class="add-house">
        <vue-core-image-upload
          class="btn-crop"
          :maxWidth="375"
          :compress="50"
          crop-ratio="1:1.3"
          crop="local"
          :cropBtn="{'ok': '确定', 'cancel': '取消'}"
          @imagechanged="imagechanged"
          @errorhandle="errorhandle"
          inputAccept="image/jpg,image/jpeg,image/png"
          :max-file-size="2097152"
          :isXhr="false"
          text="">
          <!-- <mu-raised-button class="demo-raised-button" label="上传logo或者图片" icon="cloud_upload" primary /> -->
          <img v-if="this.houser.picSrc" :src="this.houser.picSrc" class="avatar">
          <i v-else class="avatar-uploader-icon" :class="avatarLoad"></i>
        </vue-core-image-upload>
        <p>图片必传</p>
        <div class="i-number">
          <ul>
            <li class="i-number-list">
              <span class="title">房：</span>
              <div class="i-number-input">
                <input type="tel" class="ivu-input-number" v-model="houser.CountF">
              </div>
            </li>
            <li class="i-number-list">
              <span class="title">厅：</span>
              <div class="i-number-input">
                <input type="tel" class="ivu-input-number" v-model="houser.CountT">
              </div>
            </li>
            <li class="i-number-list">
              <span class="title">卫：</span>
              <div class="i-number-input">
                <input type="tel" class="ivu-input-number" v-model="houser.CountW">
              </div>
            </li>
            <li class="i-number-list">
              <span class="title">面积：</span>
              <div class="i-number-input">
                <input type="tel" class="ivu-input-number" v-model="houser.Square">
              </div>
            </li>
            <li class="i-number-list">
              <span class="title">均价：</span>
              <div class="i-number-input">
                <input type="tel" class="ivu-input-number" v-model="houser.Price">
              </div>
            </li>
          </ul>
        </div>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogOk">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 上传中，和加载中 -->
    <div>
    <transition name="el-fade-in-linear">
      <div class="add-loader" v-show="addLoader">
        <loader :desc="loaderText"></loader>
      </div>
    </transition>
    </div>
    <!-- 上传成功 -->
    <el-dialog
      :title="dialogTitle"
      :visible.sync="dialogVisible"
      width="71%" top="50%" center>
      <div class="dialog-main">
        <i class="el-icon-success"></i>
        <p class="desc">{{loaderDialog}}</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="loaderOk">是 的</el-button>
      </span>
    </el-dialog>
    <img src="" id="imgvessel" alt="" width="100" height="100">
  </section>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import BMap from '@/components/estate/BMap'
  import Loader from '@/components/estate/Loader'
  import VueCoreImageUpload from 'vue-core-image-upload'
  import { getDistrict, getProperty, getTaG, getOffer } from '@/api/estate/estate'
  import { getEstatePhoto, getestatebyid, getByEstate } from '@/api/estate/EstateDetail'
  import { ImgUpLoad, AddEstate, removeRoom, removePhoto } from '@/api/estate/estateAdd'
  import { DrawImageToBase } from '@/utils/picReduce'
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
        EstateID: '',   // 当前楼盘ID
        textTitle: '楼盘添加',
        textBtn: '上传',
        imageUrl: '',     // 封面图片展示src
        OfferData: [],       // 优惠券数据
        DistrictNameData: [],     // 拿到的区域数据
        PropertyUsageData: [],    // 类型
        TagData: [],
        styleData: [],        // 户型
        houser: {         // 新建户型，临时存储
          picSrc: '',
          CountF: '',
          CountT: '',
          CountW: '',
          Square: '',
          Price: '',
        },
        slideData: [],        // 轮播图
        estateName: '',    // 楼盘名字，用来地图定位
        postData: {     // 要传的数据
          picSrc: '',
          EstateName: '',
          Price: '',
          DevTel: '',
          Offer: '',
          DistrictName: '',
          PropertyUsage: '',
          PropertyType: '',
          Address: '',
          roomvalue: '',     // 户型数据
          roompic: '',       // 户型封面图
          BuildingAll: '',
          Room: '',
          Square: '',
          DevCompany: '',
          License: '',
          OwnYear: '',
          MgtCompany: '',
          MgtPrice: '',
          BuildingDensity: '',
          FAR: '',
          Tag: [],
          EstateIntro: '',
          FloorAll: '',
          ParkingSpace: '',
          Environment: '',
          Transportation: '',
          piclis: '',
          Lat: '',
          Lng: '',
          EstateID: ''
        },
        dialogVisible: false,   // 成功弹出框
        bgBlack: false,      // 全屏背景黑色，图片裁切用到
        IsBMap: false,      // 显示隐藏地图
        IfBMap: false,      // 初始化地图
        dialogFormVisible: false,
        addLoader: false,   // 上传中 loader
        dialogTitle: '上传成功',
        loaderDialog: '查看上传成功的楼盘？',
        iconImgLoading: false,    // 图片上传时候，把图标加改成加载中
        sliderValue: 1,        // 图片裁切用到的滑块
        loaderText: '上传中',
        avatarTop: false,       // 上传封面图，正真的上传块
        avatarBom: false,     // 上传轮播图，正真的上传块
        avatarDialog: false,    // 
        swiperDialog: false
      }
    },
    created() {
      this.addBack = true     // 是的，添加楼盘的地图
      if (this.$route.query.id) {     // 判断是否有传过来的楼盘id，有就是编辑了
        // console.log(this.$route.query.id)
        this.postData.EstateID = this.$route.query.id
        this._edit()
      }
      this.probeType = 3
      this.listemScroll = true
      this._getDistrict()
      this._getProperty()
      this._getTaG()
      this._getOffer()
    },
    mounted () {
      this.$nextTick(() => {
        this.upAvatar = this.$refs.upAvatar   // 轮播图上传组件
      })
      setTimeout(() => {
        this.winHeight = window.innerHeight
        this.IfBMap = true    // 1.5秒之后再初始化地图，可以加快首屏速度
      }, 1500)
    },
    computed: {
      coverBG() {       // 封面背景
        return `background-image: url(${this.postData.picSrc})`
      },
      avatarLoad() {    // 上传图片里面的图标变化
        if (this.iconImgLoading) {
          return 'el-icon-loading'
        } else {
          return 'el-icon-plus'
        }
      },
      mapHeight() {
        // let height = window.innerHeight
        return `height: ${this.winHeight}px`
      },
      ...mapGetters([
        'estateEdit'
      ])
    },
    methods: {
      scrollPos(pos) {
      },
      _edit() {      // 这就是编辑了
        let editData = this.estateEdit
        
        this.addLoader = true
        this.loaderText = '加载中'

        // 修改title和按钮文字
        this.textTitle = '楼盘编辑'
        this.textBtn = '保存'

        if (editData.EstateID) {        // 有值就不用再去获取了
          this._editProcessing(editData)
        } else {    // 没有传过来值，就去获取吧
          let obj = {}
          let stateData = {}
          let photoData = {}
          let styleData = {}
          let record = 0      // 等到第三次大家都拿到值了再统一处理
          
          getEstatePhoto(this.postData.EstateID).then((res) => {
            photoData = res.data.tempTable
            record ++
            if (record === 3) {
              obj = Object.assign(stateData, {slideData: photoData}, {styleData: styleData})
              this._editProcessing(obj)
            }
          })
          getestatebyid(this.postData.EstateID).then((res) => {
            stateData = res.data.tempTable[0]
            // 处理tag
            let tag = res.data.tempTable[0].Tag.split('|')
            let arr = []
            tag.forEach((item) => {
              if (item) {
                arr.push(item)
              }
            })
            stateData.Tag = arr
            record ++
            if (record === 3) {
              obj = Object.assign(stateData, {slideData: photoData}, {styleData: styleData})
              this._editProcessing(obj)
            }
          })
          getByEstate(this.postData.EstateID).then((res) => {
            styleData = res.data.tempTable
            record ++
            if (record === 3) {
              obj = Object.assign(stateData, {slideData: photoData}, {styleData: styleData})
              this._editProcessing(obj)
            }
          })
        }
      },
      _editProcessing(editData) {     // 把要编辑的数据填上去
        this.postData = editData
        this.estateName = this.postData.EstateName
        // 处理tag
        if (editData.Tag.length) {
          let tagArr = []
          editData.Tag.forEach((item) => {
            if (item) {
              tagArr.push(item)
            }
          })
          this.postData.Tag = tagArr
        }
        this.imageUrl = editData.picSrc
        this.styleData = editData.styleData
        this.slideData = editData.slideData
        this.scrollRefresh()
        this.addLoader = false
      },
      scrollRefresh() {     // 初始化scroll
        setTimeout(() => {
          this.$refs.scroll.refresh()
        }, 30)
      },
      closeSllide(index) {     // 删除轮播图
        let _this = this
        this.$confirm("您确定要删除这张图片？")
        .then(() => {
          if (_this.slideData[index].PhotoID) {
            removePhoto(_this.slideData[index].PhotoID).then((res) => {})
          }
          _this.slideData.splice(index, 1)
          _this.$message.message('图片删除成功！')
          _this.scrollRefresh()
        }).catch(() => {})
      },
      closeHouse(index) {   // 删除户型
        let _this = this
        this.$confirm("您确定要删除此户型？")
        .then(() => {
          if (_this.styleData[index].RoomID) {
            // 注意顺序问题，有RoomID，也要删除服务器上的
            removeRoom(_this.styleData[index].RoomID).then((res) => {})
          }
          _this.styleData.splice(index, 1)    // 清楚掉styleData的户型数据
          _this.$message.message('户型删除成功！')
          _this.scrollRefresh()
        }).catch(() => {})
      },
      dialogOk() {      // 添加户型
        if (!this.houser.picSrc) {
          this.$message.error('必须要上传户型图')
          return
        }
        this.styleData.push({
          picSrc: this.houser.picSrc,
          CountF: this.houser.CountF,
          CountT: this.houser.CountT,
          CountW: this.houser.CountW,
          Square: this.houser.Square,
          Price: this.houser.Price
        })
        // 清空归零
        this.houser.picSrc = ''
        this.houser.CountF = ''
        this.houser.CountT = ''
        this.houser.CountW = ''
        this.houser.Square = ''
        this.houser.Price = ''
        this.dialogFormVisible = false
        setTimeout(() => {
          this.scrollRefresh()
        }, 100)
      },
      dialog() {  // 添加户型弹出框
        this.dialogFormVisible = true
        this.iconImgLoading = false     // 把加载中图标改成加
      },
      location(loca) {    // 地址
        this.postData.Address = loca
      },
      point(obj) {    // 经纬度
        if (obj === 'error') {
          this.$message.error('地图上没有找到你输入的楼盘名')
        } else {
          this.postData.Lng = obj.lng
          this.postData.Lat = obj.lat
        }
      },
      openBMap() {    // 打开地图
        // 隐藏键盘
        // input.blur()
        let aInput = document.getElementsByTagName('input')
        for (let i = 0; i < aInput.length; i++) {
          aInput[i].blur()
        }
        this.IsBMap = true
      },
      closeBMap() {    // 关闭地图
        this.IsBMap = false
      },
      mapInitOk() {     // 地图初始化完成，拿到返回状态，再定位
        if (this.postData.Lng) {
          let obj = {
            lng: this.postData.Lng,
            lat: this.postData.Lat
          }
          this.$refs.BaiduMap.doLocate(obj)
        }
      },
      upload() {      // 上传
        if (!this.postData.EstateName) {
          this.$message.error('请填写楼盘名称')
          return
        }
        this.addLoader = true   // 显示上传中
        this.loaderText = '上传中'

        let tagStr = ''
        let tagGroup = this.postData.Tag
        if (tagGroup.length && tagGroup !== '|') {    // 不能等于 |
          tagGroup.forEach((item) => {     // 处理 tag
            if (item) {
              tagStr += '|' + item
            }
          })
        } else {     // 数组不能传空过去，因为会被过滤掉，至少也要一个 | 
          tagStr = '|'
        }
        this.postData.Tag = tagStr

        // 处理户型
        let roomvalue = ''    // 处理户型数据
        let roompic = ''      // 处理户型图片
        this.styleData.forEach((item) => {
          if (!item.RoomID) {     // 没有 ID 说明是添加的，那就需要上传，反之不用
            roomvalue += `|${item.CountF},${item.CountT},${item.CountW},${item.Square},${item.Price}`
            roompic += `|${item.picSrc}`
          }
        })

        this.postData.roomvalue = roomvalue
        this.postData.roompic = roompic
        /** 
         * this.styleData 存在本地，也是可以看到的
         * 添加户型： 
         *    上传户型图片填写数据 => 保存到本地的 this.styleData => 处理拿到字符串，roomvalue和roompic => 上传
         * 删除户型：
         *    1.本地删除
         *        选中要删除的户型 => 直接本地删除 this.styleData中对应的一项
         *    2.服务器删除
         *        选中要删除的户型 => 拿到户型 ID 发送请求删除 => 再删除 this.styleData中对应的一项
         * 编辑户型：
         *     要么上传，要么删除，不存在替换概念
         *     1.上传
         *        上传户型图片填写数据 => 保存到本地的 this.styleData => 处理拿到字符串（不能上传拿到的数据），roomvalue和roompic => 上传
         *     2.删除
         *        1.删除自己手动添加的数据 => 直接本地删除 this.styleData中对应的一项
         *        2.删除已有的数据，也就是根据 ID 拿到的数据 => 拿到户型 ID 发送请求删除 => 再删除 this.styleData中对应的一项
         * 
         *  拿到的数据有一个特点：有一个ID，自己添加的没有ID，我只要上传没有ID的户型，就可以进行区分
         */
        // 处理轮播图，和上面一个道理
        let slide = ''
        this.slideData.forEach((item) => {
          if (!item.PhotoID) {
            slide += '|' + item.PhotoData
          }
        })
        this.postData.piclis = slide

        if (this.postData.EstateID) {   // 通过是否有楼盘参数判断，是新增还是修改
          this._editEstate()
        } else {
          this._addEstate()
        }
      },
      _addEstate() {      // 新增
        AddEstate(this.postData, 'tran_insert').then((res) => {
          if (res.data.result === 'sucess') {
            this.EstateID = res.data.EstateID     // 保存ID
            this.addLoader = false  // 隐藏上传中
            this.dialogTitle = '上传成功！'
            this.loaderDialog = '去查看上传成功的楼盘？'
            this.dialogVisible = true   // 弹出提示框
            this.upSuccessClean()     // 成功后清空数据
            this.$refs.scroll.scrollTo(0, 0, 300)     // 这是首页请求，要回到顶部
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          }
          else {
            this.addLoader = false  // 隐藏上传中
            this.$message.error(`上传失败，${res.data.result}`)
          }
        })
      },
      _editEstate() {   //修改
        AddEstate(this.postData, 'upEstate').then((res) => {
          if (res.data.result === 'sucess') {
            this.EstateID = res.data.EstateID     // 保存ID
            this.addLoader = false  // 隐藏上传中
            this.dialogTitle = '编辑成功!'
            this.loaderDialog = '去查看编辑好的楼盘？'
            this.dialogVisible = true    // 弹出提示框
          } 
          else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } 
          else {
            this.addLoader = false  // 隐藏上传中
            this.$message.error(`编辑失败，${res.data.result}`)
          }
          // 处理 tag，方便再次修改
          if (this.postData.Tag === '|') {
            this.postData.Tag = []
          } else {
            let arr = []
            let tag = this.postData.Tag.split('|')
            tag.forEach((item) => {
              if (item) {
                arr.push(item)
              }
            })
            this.postData.Tag = arr
          }
        })
      },
      loaderOk() {    // 成功，后的弹出框，确认
        this.$router.replace({
          path: `/estate/${this.EstateID}`
        })
        this.dialogVisible = false
      },
      upSuccessClean() {     // 上传成功后，清除数据，可以再次上传
        let obj = {}
        this.imageUrl = ''
        this.styleData = []
        this.slideData = []
        for (let key in this.postData) {
          if (key === 'Tag') {
            obj[key] = []
          } else {
            obj[key] = ''
          }
        }
        this.postData = obj
        this.estateName = ''
        this.scrollRefresh()
      },
      _getOffer() {     // 获取优惠券
        getOffer().then((res) => {
          this.OfferData = res.data.tempTable
        })
      },
      _getTaG() {    // 获取标签条件
        getTaG().then((res) => {
          this.TagData = res.data.tempTable
          this.scrollRefresh()
        })
      },
      _getDistrict() {   // 获取区域条件
        getDistrict().then((res) => {
          if (res.data.tempTable) {
            this.DistrictNameData = res.data.tempTable
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        })
      },
      _getProperty() {    // 获取类型条件
        getProperty().then((res) => {
          this.PropertyUsageData = res.data.tempTable
        })
      },
      _back() {
        this.$router.back()
      },
      onChangeAvatar() {      // 上传封面弹窗
        this.avatarDialog = true
      },
      onUpAvatarImg() {
        this.avatarDialog = false
        setTimeout(() => {
          let avatar = document.getElementsByClassName('avatar-input')[0]
          let input = avatar.getElementsByTagName('input')[0]
          input.click()
        }, 100)
      },
      onChangeSwiper() {      // 上传轮播弹窗
        this.swiperDialog = true
      },
      onUpSwiperImg() {
        this.swiperDialog = false
        setTimeout(() => {
          let avatar = document.getElementsByClassName('avatar-swiper')[0]
          let input = avatar.getElementsByTagName('input')[0]
          input.click()
        }, 100)
      },
      imagechangedAvatar(res) {      // 封面图上传
        this.iconImgLoading = true
        this.imageUrl = res
        this._uploadImg(res, 300, 200, 'picSrc')
      },
      imagechanged (res) {    // 户型图片上传
        this.iconImgLoading = true
        this._uploadImg(res, 196, 256, 'house')
      },
      imagechangedRoom(res) {    // 轮播图上传
        this.iconImgLoading = true
        this._uploadImg(res, 219, 146, 'slide')
      },
      errorhandle (res) {     // 错误提示
        this.$message.error('上传失败，图片不能大于 2MB')
      },
      _uploadImg(pic, width, height, type) {      // 图片上传和压缩
        let _this = this
        let image = new Image()
        image.src = pic

        image.onload = function () {
          let sm_pic = DrawImageToBase(image, width, height)
          ImgUpLoad(pic, sm_pic).then((res) => {
            if (type === 'picSrc') {
              _this.postData.picSrc = res.data.path
            } else if (type === 'house') {
              _this.houser.picSrc = res.data.path
            } else if (type === 'slide') {
              _this.slideData.push({
                PhotoData: res.data.path
              })
            }
            _this.iconImgLoading = false     // 把图标加和加载中改回来
            _this.scrollRefresh()
          })
        }
      }
    },
    watch: {
      estateName(newVal) {
        this.postData.EstateName = newVal
        if (this.timeEName) {
          clearTimeout(this.timeEName)
        }
        this.timeEName = setTimeout(() => {
          if (newVal && this.$refs.BaiduMap) {
            this.$refs.BaiduMap.localSearch(newVal)   // 有值得话，每次更改楼盘名称都定位
          }
        }, 200)
      }
    },
    components: {
      Scroll,
      BMap,
      Loader,
      VueCoreImageUpload
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  .addition {
    overflow: hidden;
    width: 100%;
    height: 100%;
    background-color: #f5f5f5;
  }
  .d-header {
    overflow: hidden;
    @include border-b-1px(0);
    z-index: 11;
    max-width: 600px;
    margin: 0 auto;
    width: 100%;
    height: 45px;
    background-color: #fff;
    .icon {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 45px;
      height: 45px;
      color: #409EFF;
      font-size: 20px;
      line-height: 45px;
    }
    .right-btn {
      position: absolute;
      top: 6px;
      right: 5px;
      z-index: 2;
      padding: 8px 10px;
    }
    .title {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 1;
      padding: 0 60px;
      width: 100%;
      height: 45px;
      font-size: 16px;
      color: #2D2F33;
      line-height: 45px;
      @include text-over();
    }
  }
  .addition-main {
    position: absolute;
    top: 45px;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 1;
    overflow: hidden;
    max-width: 600px;
    margin: 0 auto;
    padding-bottom: 10px;
    background-color: #f5f5f5;
  }
  .addition-1 {
    background-color: #fff;
    .cover {
      overflow: hidden;
      position: relative;
      padding: 15px;
      @include border-b-1px(0);
      .cover-bg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background-size: cover;
        background-repeat: no-repeat;
        opacity: .4;
        filter: blur(3px);
      }
      .crop-placeholder {
        position: relative;
        z-index: 10;
        overflow: hidden;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 auto;
        border: 1px dashed #d9d9d9;
        width: 150px;
        height: 100px;
      }
      .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 150px;
        height: 100px;
        line-height: 100px;
        text-align: center;
      }
      .avatar {
        width: 150px;
        height: 100px;
        display: block;
      }
      .text {
        position: relative;
        z-index: 2;
        padding-top: 10px;
        font-size: 12px;
        color: #2D2F33;
      }
    }
  }
  .addition-2,
  .addition-3,
  .addition-4,
  .addition-5,
  .addition-6,
  .addition-7,
  .addition-8,
  .addition-9,
  .addition-10 {
    margin-top: 10px;
    background-color: #fff;
  }
  .addition-3 {
    .list-wrap {
      padding-right: 0;
      .list {
        .input-wrap {
          &:after {
            display: none;
          }
        }
      }
    }
    .el-icon-location-outline {
      width: 45px;
      height: 45px;
      font-size: 18px;
      color: #409EFF;
      line-height: 45px;
      text-align: center;
      @include border-l-1px(0);
    }
  }
  .addition-4 {
    padding: 0 15px;
    text-align: left;
    .title {
      display: flex;
      align-items: center;
      justify-content: space-between;
      height: 45px;
      font-size: 14px;
      color: #5A5E66;
      line-height: 45px;
    }
    .add-block {
      flex: 1;
      text-align: right;
    }
    .el-icon-arrow-right {
      padding-left: 3px;
      color: #b4bccc;
    }
  }
  .addition-5 {
    .input-wrap {
      text-align: right;
    }
  }
  .addition-5 {
    .title {
      width: 70px;
    }
  }
  .addition-6,
  .addition-7 {
    .list-wrap {
      .list {
        .title {
          width: 86px;
        }
      }
    }
  }
  .addition-8 {
    padding: 0 15px 15px 15px;
    text-align: left;
    .title {
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      color: #5A5E66;
      .small {
        font-size: 12px;
        color: #878D99;
      }
    }
    .el-checkbox.is-bordered {
      margin: 5px 5px;
    }
  }
  .addition-9 {
    text-align: left;
    .textarea {
      border: 0;
      padding: 15px;
      width: 100%;
      height: 150px;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      outline: none;
    }
  }
  .addition-10 {
    padding: 0 15px;
    text-align: left;
    .title {
      @include border-b-1px(0);
      height: 45px;
      line-height: 45px;
      font-size: 14px;
      color: #5A5E66;
    }
  }

  .list-wrap {
    padding: 0 15px;
    text-align: left;
    .list {
      display: flex;
      align-items: center;
      height: 45px;
      .title {
        font-size: 14px;
        color: #5A5E66;
      }
      .input-wrap {
        flex: 1;
        margin-left: 10px;
        outline: none;
        @include border-b-1px(0);
        .input {
          position: relative;
          width: 100%;
          height: 30px;
          font-size: 14px;
          color: #2D2F33;
          outline: none;
          // &:focus {
          //   border-bottom: 1px solid #409eff;
          // }
        }
      }
    }
  }
  // 上传封面
  .avatar-box {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    border: 1px dashed #d9d9d9;
    width: 150px;
    height: 100px;
    .el-icon-plus {
      font-size: 28px;
      color: #8c939d;
    }
  }
  // 上传轮播图
  .up-wrap {
    display: flex;
    flex-wrap: wrap;
    padding-bottom: 6px;
    background: #fff;
    .avatar-uploader {
      width: 100%;
      height: 100%;
      .avatar-uploader-icon {
        font-size: 18px;
      }
    }
    .up-list {
      position: relative;
      width: 86px;
      margin-right: 10px;
      margin-top: 10px;
      .el-icon-close {
        position: absolute;
        top: -5px;
        right: -5px;
        z-index: 2;
        padding: 3px;
        border-radius: 50%;
        font-size: 16px;
        color: #fff;
        background-color: #FA5555;
      }
      .avatar {
        vertical-align: top;
        width: 100%;
      }
    }
    .up-avatar {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 10px;
      border: 1px solid #eee;
      width: 86px;
      height: 57px;
    }
  }
  
  .add-house {
    .btn-crop {
      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto;
      border: 1px dashed #d9d9d9;
      width: 100px;
      height: 130px;
    }
    .avatar-uploader-icon {
      font-size: 28px;
      color: #8c939d;
      width: 120px;
      height: 80px;
      line-height: 80px;
      text-align: center;
    }
    .avatar {
      width: 100%;
      display: block;
    }
  }
  .house-wrap {
    @include border-b-1px(100%);
    .operation {
      position: absolute;
      top: 4px;
      right: 0;
      z-index: 10;
      .el-icon-close {
        padding: 3px;
        font-size: 18px;
        color: #fff;
        background-color: #FA5555;
        border-radius: 50%;
      }
    }
    .house-list {
      position: relative;
      display: flex;
      padding: 5px 0;
      @include border-b-1px(0);
      .house-img-wrap {
        width: 80px;
      }
      .house-img {
        width: 100%;
      }
      .text {
        flex: 1;
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding-left: 10px;
        height: auto;
        min-height: 60px;
        line-height: 20px;
      }
      .t-title {
        font-size: 14px;
        color: #5A5E66;
      }
      .total {
        font-size: 12px;
        color: #878D99;
      }
      .money {
        font-size: 14px;
        color: #FA5555;
      }
    }
  }
  .i-number {
    text-align: left;
    .i-number-list {
      display: flex;
      align-items: center;
      height: 40px;
      line-height: 40px;
      @include border-b-1px(0);
      .title {
        width: 50px;
        font-size: 14px;
        color: #5A5E66;
      }
      .i-number-input {
        text-align: right;
        flex: 1;
        .ivu-input-number {
          border: 0;
          width: 100%;
        }
        .ivu-input-number-input {
          width: 100%;
        }
      }
    }
  }

  // 地图
  .add-map {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 12;
    transition: all .3s;
    transform: translate3d(0, -100%, 0);
    &.map-transX {
      transform: translate3d(0, 0, 0)
    }
  }

  .el-dialog__wrapper {
    z-index: 80 !important;
    max-width: 600px;
    margin: 0 auto;
  }
  .add-loader {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 10;
    background-color: rgba(255, 255, 255, .8);
  }
  .dialog-main {
    text-align: center;
    display: flex;
    align-items: center;
    justify-content: center;
    .desc {
      padding-left: 5px;
      font-size: 16px;
      color: #5A5E66;
    }
    .el-icon-success {
      font-size: 20px;
      color: #67C23A;
    }
  }
  // 图片裁切的滑块
  .slider-block-btn {
    position: fixed;
    top: 10%;
    left: 10%;
    z-index: 101;
    width: 80%;
    .icon-out,
    .icon-in {
      padding: 8px 15px;
      margin: 0 20px;
      font-size: 20px;
    }
  }

  // 头部
  .header-enter-active,
  .header-leave-active {
    transition: .3s all ease;
  }
  .header-enter,
  .header-leave-to{
    transform: translate3d(-150%, 0, 0);
  }
  // 子页面动画
  .transX-enter-active,
  .transX-leave-active {
    transition: .3s all ease;
  }
  .transX-enter,
  .transX-leave-to{
    transform: translate3d(100%, 0, 0);
  }
</style>
