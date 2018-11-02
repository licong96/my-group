<template lang="html">
  <!-- 楼盘详细页 -->
  <section class="b-detail">
    <div class="d-header">
      <i class="el-icon-arrow-left icon" @click="_back"></i>
      <h3 class="title">{{stateData.EstateName}}</h3>
      <i class="el-icon-more icon" @click="operNav"></i>
    </div>
    <transition name="nav">
      <div class="navigation-bg" v-show="navigation" @touchstart.prevent="closeNav">
        <div class="navigation" @touchstart.stop>
          <i class="el-icon-caret-top"></i>
          <div class="navigation-list" @click="edit" v-if="IsEdit">
            <i class="iconfont icon-editor"></i>
            <span class="text">编辑</span>
          </div>
          <div class="navigation-list" @click="upStick" v-if="IsUpStick">
            <i class="iconfont icon-zhiding1"></i>
            <span class="text">置顶</span>
          </div>
          <div class="navigation-list" @click="noStick" v-if="IsNoStick">
            <i class="iconfont icon-zhiding2"></i>
            <span class="text">取顶</span>
          </div>
          <div class="navigation-list" @click="onToAD" v-if="IsToAd">
            <i class="iconfont icon-guanggao"></i>
            <span class="text">广告</span>
          </div>
        </div>
      </div>
    </transition>
    <!-- 内容 -->
    <section class="d-main" v-loading.lock="fullscreenLoading">
      <scroll ref="scroll" :data="photoData">
      <div>
        <!-- 顶部轮播图 -->
        <section class="swiper">
          <swiper :swiper-data="photoData" @load="_refresh"></swiper>
        </section>
        <div class="top-text">
          <h3 class="title">{{stateData.EstateName}}<small class="distr">{{stateData.DistrictName}}</small> </h3>
          <p class="desc">{{stateData.Address}}</p>
          <div class="price">
            <span class="label">均价：</span>{{stateData.Price}}元/㎡
          </div>
          <div class="tag-group" v-show="IsTag">
            <span class="tag" :class="ifClass(index)" v-if="item" v-for="(item, index) in stateData.Tag">{{item}}</span>
          </div>
        </div>
        <!-- 优惠 -->
        <div class="discounts" v-if="stateData.Offer">
          <div class="discounts-text">
            <i class="iconfont icon-icon-yxj-discount"></i>{{stateData.Offer}}
          </div>
        </div>
        <!-- 户型 -->
        <section class="house-type" v-if="styleData.length">
          <h4 class="title">全部户型：</h4>
          <ul class="house-wrap">
            <li class="house-list" v-for="(item, index) in styleData" :key="index" @click="openRoom(index)">
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
        </section>
        <!-- 数据视图切换 -->
        <div class="cut-info">
          <span class="list" :class="{'active': isCutControl===0}" @click="isCutControl=0">基本信息</span>
          <span class="list" :class="{'active': isCutControl===1}" @click="onCutControl">在售房源</span>
          <em class="line" :style="lineTransform"></em>
        </div>
        <!-- 基本信息 -->
        <div class="info" v-show="isCutControl===0">
          <ul class="info-wrap">
            <li class="info-list-weird">
              <span class="title">类别：</span>
              <span class="text">{{stateData.PropertyType}}</span>
            </li>
            <li class="info-list">
              <span class="title">楼栋总数：</span>
              <span class="text">{{stateData.BuildingAll}}</span>
            </li>
            <li class="info-list">
              <span class="title">总户数：</span>
              <span class="text">{{stateData.Room}}</span>
            </li>
            <li class="info-list">
              <span class="title">预售许可证：</span>
              <span class="text">空</span>
            </li>
            <li class="info-list">
              <span class="title">绿化率：</span>
              <span class="text">{{stateData.BuildingDensity}}</span>
            </li>
            <li class="info-list">
              <span class="title">容积率：</span>
              <span class="text">{{stateData.FAR}}</span>
            </li>
            <li class="info-list">
              <span class="title">面积：</span>
              <span class="text">{{stateData.Square}}m²</span>
            </li>
            <li class="info-list-weird">
              <span class="title">开发商：</span>
              <span class="text">{{stateData.DevCompany}}</span>
            </li>
            <li class="info-list-weird">
              <span class="title">产权年限：</span>
              <span class="text">{{stateData.OwnYear}}</span>
            </li>
            <li class="info-list-weird">
              <span class="title">物业公司：</span>
              <span class="text">{{stateData.MgtCompany}}</span>
            </li>
          </ul>
        </div>
        <!-- 在售房源 -->
        <div class="control-info" v-show="isCutControl===1">
          <dl :class="{'more': isShowMore}" v-show="controlData.length">
            <dt class="title">
              <span class="list">栋座</span>
              <span class="list">房号</span>
              <span class="list">面积</span>
              <span class="list">单价</span>
              <span class="list">总格</span>
            </dt>
            <dd class="box" v-for="(item, index) in controlData" :key="index">
              <span class="list">{{item.BuildingName}}</span>
              <span class="list">{{item.RoomNo}}</span>
              <span class="list">{{item.Square}}㎡</span>
              <span class="list">{{item.PriceUnit}}元/㎡</span>
              <span class="list">{{item.Price}}万</span>
            </dd>
          </dl>
          <div class="show-more" v-show="isShowMore && controlData.length>10" @click="onShowMore">展开更多</div>
          <div class="show-more" v-show="!isShowMore" @click="onShowMore">收起更多</div>
          <loader v-show="!onceGetControl"></loader>
          <empty desc="暂时还没有销控数据" v-show="onceGetControl && !controlData.length"></empty>
        </div>
        <div class="info-block">
          <ul>
            <li class="info-block-list">
              <span class="title">物业费：</span>
              <span class="text">{{stateData.MgtPrice}}</span>
            </li>
            <li class="info-block-list">
              <span class="title">停车位：</span>
              <span class="text">{{stateData.ParkingSpace}}</span>
            </li>
            <li class="info-block-list">
              <span class="title">楼层状况：</span>
              <span class="text">{{stateData.FloorAll}}</span>
            </li>
          </ul>
        </div>
        <!-- 另一部分数据 -->
        <div class="brief">
          <p class="title">项目简介：</p>
          <p class="text">{{stateData.EstateIntro}}</p>
        </div>
        <div class="brief">
          <p class="title">周边交通：</p>
          <p class="text">{{stateData.Environment}}</p>
        </div>
        <!-- 百度地图 -->
        <div class="baidu-map">
          <div class="map-text">
            <span class="desc">地图位置：</span>
            <span class="more" @click="openMap">全屏查看<i class="el-icon-arrow-right"></i></span>
          </div>
          <div id="map" class="map" style="width: 100%; height: 280px;" ref="map"></div>
        </div>
        <div class="brief">
          <p class="title">配套设施：</p>
          <p class="text">{{stateData.Transportation}}</p>
        </div>
      </div>
      </scroll>
    </section>
    <!-- 全屏预览户型 -->
    <transition name="opacity">
      <section class="room-full" v-if="IsRoomFull" @click="closeRoom">
        <swiper 
          :room-data="styleData" 
          :styles="roomStyle" 
          :loop="roomLoop" 
          :autoplay="roomAutoplay" 
          :initial-slide="initialSlide"
        ></swiper>
      </section>
    </transition>
    <!-- 子路由 -->
    <transition name="transX">
      <keep-alive>
        <router-view></router-view>
      </keep-alive>
    </transition>
  </section>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import Swiper from '@/components/estate/Swiper'
  import Empty from '@/base/Empty'
  import Loader from '@/base/Loader'
  import { getEstatePhoto, getestatebyid, getByEstate } from '@/api/estate/EstateDetail'
  import { getUpIsTop } from '@/api/estate/estate'
  import { GetSalesDate } from '@/api/control/control'
  import { mapMutations } from 'vuex'
  import { prefixStyle } from '@/utils/index'

  const transform = prefixStyle('transform')

  export default {
    data() {
      return {
        estateID: '',     //  楼盘ID
        photoData: [],   // 图片数据
        stateData: {},  // 楼盘数据
        styleData: [],   // 户型数据
        navigation: false,
        fullscreenLoading: true,   // 加载中loading
        IsRoomFull: false,      // 户型图全屏预览
        initialSlide: 0,       // 户型全屏预览从第几位开始
        controlData: [],       // 销控管理数据
        isCutControl: 0,      // 切换基本信息和销控信息
        onceGetControl: false,  // 只加载一次销控数据
        isShowMore: true,      // 显示更多信息
      }
    },
    created() {
      this.estateID = this.$route.params.id
      this._getEstatePhoto()
      this._getestatebyid()
      this._getByEstate()
      this.roomStyle = 'room'
      this.roomLoop = false
      this.roomAutoplay = 0
    },
    activated() {     // 编辑页面会来之后，会执行这里
      console.log('activated')
      this.estateID = this.$route.params.id
      this._getEstatePhoto()
      this._getestatebyid()
      this._getByEstate()
    },
    mounted() {
    },
    computed: {
      lineTransform() {     // 切换下划线标记的位置
        return `${transform}: translateX(${this.isCutControl * 100}%)`
      },
      IsTag() {     // 判断是否有标签
        if (!this.stateData.Tag) {
          return false
        }
        if (this.stateData.Tag.length === 1 && !this.stateData.Tag[0]) {
          return false
        } else {
          return true
        }
      },
      IsReport() {      // 是否允许报备，以及下面的操作
        if (parseInt(this.stateData.IsOnline) === 1 && parseInt(this.stateData.HasFiling) > 0) {
          return true
        } else {
          return false
        }
      },
      IsEdit() {
        return parseInt(this.stateData.EditEstate) === 1 ? true : false
      },
      IsUpStick() {
        return parseInt(this.stateData.ToUp) === 1 ? true : false
      },
      IsNoStick() {
        return parseInt(this.stateData.ToDown) === 1 ? true : false
      },
      IsToAd() {
        return parseInt(this.stateData.ToAD) === 1 ? true : false
      }
    },
    methods: {
      onShowMore() {    // 显示更多
        this.isShowMore = !this.isShowMore
      },
      onCutControl() {      // 切换到数据管理
        this.isCutControl = 1
        if (!this.onceGetControl) {   // 只加载一次
          this._GetSalesDate()
        }
      },
      _GetSalesDate() {   // 加载销控管理数据
        GetSalesDate(this.estateID).then(res => {
          if (res.data.result === 'success') {
            this.controlData = res.data.tempTable
          } else {
            // this.$message.error(res.data.msg)
          }
          this.onceGetControl = true
        })
      },
      openRoom(index) {      // 户型全屏预览
        this.initialSlide = index
        this.IsRoomFull = true
      },
      closeRoom() {       // 关闭户型全屏预览
        this.IsRoomFull = false
      },
      edit() {    // 编辑
        // 详细页已获取到数据，没必要再获取，拼接到一起，传过去编辑
        let obj = Object.assign(this.stateData, {slideData: this.photoData}, {styleData: this.styleData})
        this.setEstateEdit(obj)
        this.$router.push({
          path: '/addition',
          query: {
            id: this.estateID     // 把楼盘id传过去
          }
        })
        this.closeNav()
      },
      upStick() {   // 置顶
        this.onUpIsTop(this.estateID, 'up')
      },
      noStick() {   // 取顶
        this.onUpIsTop(this.estateID, 'down')
      },
      onUpIsTop(id, op) {   // 置顶或取消置顶， 楼盘 id ，up置顶，down取顶
        getUpIsTop(id, op).then((res) => {
          this.closeNav()
          // console.log(res)
          if (res.data.result === 'success' && op === 'up') {
            this.$message.success('置顶成功')
          } else if (res.data.result === 'success' && op === 'down') {
            this.$message.success('取顶成功')
          } else {
            this.$message.error('操作失败')
          }
        })
      },
      onToAD() {    // 广告
        window.location.href = `/AD/ADAdd.html?v=20170915&ADTitle=${this.stateData.EstateName}&ADImage=${this.stateData.picSrc}&ADUrl=/estate/${this.estateID}/estate/estate_detail.html?EstateID=${this.estateID}`
      },
      operNav() {   // 打开右上角操作
        this.navigation = true
      },
      closeNav() {  // 关闭右上角操作
        this.navigation = false
      },
      _getEstatePhoto() {     // 图片
        getEstatePhoto(this.estateID).then((res) => {
          this.photoData = res.data.tempTable
        })
      },
      _getestatebyid() {     // 数据
        getestatebyid(this.estateID).then((res) => {
          this.stateData = res.data.tempTable[0]
          // 处理tag
          let tag = res.data.tempTable[0].Tag.split('|')
          let arr = []
          tag.forEach((item) => {
            if (item) {
              arr.push(item)
            }
          })
          this.stateData.Tag = arr
          this.baiduMap(this.stateData.Lng, this.stateData.Lat)
          this.fullscreenLoading = false
        }).catch((error) => {
          this.$message.error('请求失败，网络错误！')
        })
      },
      _getByEstate() {     // 户型
        getByEstate(this.estateID).then((res) => {
          // console.log(res)
          this.styleData = res.data.tempTable
        })
      },
      ifClass(num) {     // tag 添加class颜色
        return `color-${num % 5}`
      },
      _refresh() {   // 重新计算scroll
        if (this.scrollTime) {
          clearTimeout(this.scrollTime)
        }
        this.scrollTime = setTimeout(() => {
          if (this.$refs.scroll) {
            this.$refs.scroll.refresh()
          }
        }, 200)
      },
      _back() {
        this.$router.back()
      },
      baiduMap(lng, lat) {      // 百度地图
        let mp = new BMap.Map(this.$refs.map)
        mp.enableScrollWheelZoom(true)
        mp.centerAndZoom(new BMap.Point(lng, lat), 18)
        var marker = new BMap.Marker(new BMap.Point(lng, lat))
        mp.addOverlay(marker)
        mp.addControl(new BMap.NavigationControl())
      },
      openMap() {   // 打开全屏地图
        this.setBMap({
          Lng: this.stateData.Lng,
          Lat: this.stateData.Lat
        })
        this.$router.push({
          path: `/estate/${this.estateID}/bmap`
        })
      },
      ...mapMutations({
        setBMap: 'SET_B_MAP',
        setEstateEdit: 'SET_ESTATE_EDIT'
      })
    },
    watch: {
      photoData(newVal) {         // 数据更新后，重新计算scroll
        newVal && this._refresh()
      },
      stateData(newVal) {
        newVal && this._refresh()
      },
      styleData(newVal) {
        newVal && this._refresh()
      }
    },
    components: {
      Scroll,
      Swiper,
      Empty,
      Loader
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .b-detail {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 11;
    max-width: 600px;
    margin: 0 auto;
    overflow: hidden;
    background-color: #f5f5f5;
    .d-header {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 45px;
      @include border-b-1px(0);
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
      .el-icon-more {
        left: auto;
        right: 0;
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
    .navigation-bg {
      position: fixed;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
      z-index: 9;
      background-color: transparent;
    }
    .navigation {
      position: absolute;
      top: 45px;
      right: 5px;
      z-index: 10;
      text-align: left;
      border-radius: 4px;
      box-shadow: 0 0 15px 2px rgba(144, 144, 144, 0.3);
      background-color: #fff;
      .el-icon-caret-top {
        position: absolute;
        right: 6px;
        top: -16px;
        font-size: 24px;
        color: #fff;
      }
      .navigation-list {
        display: flex;
        align-items: center;
        width: 100%;
        &:last-child {
          .text {
            &:after {
              display: none;
            }
          }
        }
        .iconfont {
          padding: 0 15px;
          font-size: 18px;
          color: #5A5E66;
        }
        .text {
          display: block;
          width: 100px;
          height: 45px;
          line-height: 45px;
          font-size: 14px;
          color: #5A5E66;
          @include border-b-1px(0);
        }
      }
    }
    .swiper {
      overflow: hidden;
      position: relative;
      min-height: 200px;
    }
  }
  .d-main {
    position: absolute;
    top: 45px;
    bottom: 0;
    z-index: 1;
    padding-bottom: 10px;
    width: 100%;
    text-align: left;
    .top-text {
      padding: 15px;
      background-color: #fff;
      .title {
        font-size: 16px;
        font-weight: 600;
        color: #2D2F33;
        line-height: 1.4;
        .distr {
          margin-left: 5px;
          padding: 1px 3px;
          border: 1px solid #409eff;
          border-radius: 4px;
          font-size: 12px;
          color: #409eff;
        }
      }
      .desc {
        padding-top: 8px;
        font-size: 14px;
        color: #878D99;
      }
      .price {
        padding-top: 10px;
        font-size: 16px;
        font-weight: 600;
        color: #FA5555;
        .label {
          font-size: 14px;
          color: #878D99
        }
      }
      .tag-group {
        padding-top: 10px;
        .tag {
          display: inline-block;
          margin-right: 6px;
          margin-top: 5px;
          border-radius: 2px;
          padding: 4px 4px;
          font-size: 12px;
          font-weight: 400;
          &.color-0 {
            background-color: rgba(242,161,47,0.15);
            color: rgb(242,161,47);
          }
          &.color-1 {
            background-color: rgba(51,190,133,0.15);
            color: rgb(51,190,133);
          }
          &.color-2 {
            background-color: rgba(103,206,103,0.15);
            color: rgb(103,206,103);
          }
          &.color-3 {
            background-color: rgba(123,189,255,0.15);
            color: rgb(123,189,255);
          }
          &.color-4 {
            background-color: rgba(255,34,85,0.15);
            color: rgb(255,34,85);
          }
        }
      }
    }
    .discounts {
      margin-top: 10px;
      padding: 15px;
      background-color: #fff;
      .discounts-text {
        display: flex;
        align-items: center;
        padding: 10px;
        font-size: 14px;
        color: #f25;
        background: url('../../common/img/red_background.png') no-repeat;
        background-size: cover;
        .icon-icon-yxj-discount {
          font-size: 20px;
          padding-right: 10px;
        }
      }
    }
  }
  // 户型
  .house-type {
    margin-top: 10px;
    padding: 0 15px;
    background-color: #fff;
    .title {
      height: 40px;
      font-size: 14px;
      color: #83868f;
      line-height: 40px;
      @include border-b-1px(0);
    }
    .house-wrap {
      .house-list {
        display: flex;
        padding: 10px 0;
        @include border-b-1px(0);
        .house-img-wrap {
          width: 120px;
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
          min-height: 65px;
          line-height: 24px;
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
  }
  // 切换选项
  .cut-info {
    position: relative;
    display: flex;
    align-items: center;
    margin-top: 15px;
    background-color: #fff;
    @include border-b-1px(0);
    .list {
      flex: 1 1 50%;
      padding: 12px 0;
      font-size: 16px;
      color: #333;
      text-align: center;
      &.active {
        color: #409EFF;
      }
    }
    .line {
      position: absolute;
      left: 0;
      bottom: 1px;
      width: 50%;
      height: 2px;
      transition: all .3s;
      &:after {
        content: "";
        display: block;
        margin: 0 auto;
        width: 40px;
        height: 100%;
        background-color: #409eff;
      }
    }
  }
  .control-info {
    min-height: 120px;
    background-color: #fff;
    .lc-loader {
      padding-top: 44px;
    }
    .title {
      @include border-b-1px(0);
    }
    .title,
    .box {
      display: flex;
      .list {
        flex: 1;
        padding: 10px 0;
        font-size: 14px;
        font-weight: bold;
        color: #333;
        text-align: center;
        white-space: nowrap;
      }
    }
    .box {
      .list {
        font-weight: normal;
        color: #666;
      }
    }
    .more {
      max-height: 375px;
      overflow-y: hidden;
    }
    .show-more {
      width: 100%;
      height: 40px;
      line-height: 40px;
      font-size: 14px;
      color: #333;
      text-align: center;
    }
  }
  .info {
    // margin-top: 10px;
    padding: 10px 15px;
    background-color: #fff;
    .info-wrap {
      display: flex;
      flex-wrap: wrap;
      .info-list {
        width: 50%;
        padding: 6px 0;
        .title {
          font-size: 14px;
          color: #83868f;
        }
        .text {
          font-size: 14px;
          color: #0c0d0e;
        }
      }
    }
  }
  .info-list-weird {
    width: 100%;
    padding: 6px 0;
    background-color: #fff;
    font-size: 14px;
    .title {
      width: 75px;
      color: #83868f;
    }
    .text {
      flex: 1;
      color: #0c0d0e;
    }
  }
  .info-block {
    margin-top: 10px;
    background-color: #fff;
    .info-block-list {
      display: flex;
      padding: 12px 15px;
      @include border-b-1px(0);
      font-size: 14px;
      line-height: 1.5;
      .title {
        width: 75px;
        color: #83868f;
      }
      .text {
        flex: 1;
        color: #5A5E66;
      }
    }
  }
  .brief {
    margin-top: 10px;
    padding: 15px;
    background: #fff;
    .title {
      font-size: 14px;
      color: #83868f;
    }
    .text {
      padding-top: 10px;
      font-size: 14px;
      line-height: 1.5;
      color: #5A5E66;
    }
  }
  .foot-btn {
    position: fixed;
    bottom: 0;
    left: 0;
    z-index: 3;
    width: 100%;
    height: 50px;
    background-color: #fff;
    text-align: left;
    .foot-btn-wrap {
      @include border-b-1px(99%);
      display: flex;
      align-items: center;
      .foot-btn-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 50px;
        font-size: 12px;
        color: #83868f;
        @include border-l-1px(100%);
        &.last-child {
          &.after {
            display: none;
          }
        }
        &.down-stick {
          flex: 2;
          color: #fff;
          background-color: #ff9402;
        }
        &.up-stick {
          flex: 2;
          color: #fff;
          background-color: #FA5555;
        }
        .iconfont {
          font-size: 18px;
          padding-bottom: 4px;
        }
      }
    }
  }
  .baidu-map {
    margin-top: 10px;
    background-color: #fff;
    .map-text {
      display: flex;
      justify-content: space-between;
      font-size: 14px;
      color: #83868f;
      .desc,
      .more {
        padding: 0 15px;
        height: 45px;
        line-height: 45px;
      }
    }
  }
  // 户型轮播预览
  .room-full {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 20;
    display: flex;
    align-items: center;
    background-color: rgba(0, 0, 0, .95);
    .swiper-wrap {
      width: 100%;
    }
  }

  .nav-enter-active,
  .nav-leave-active {
    transition: .3s all ease;
  }
  .nav-enter,
  .nav-leave-to{
    transform-origin: right top;
    transform: scale(0);
  }
</style>
