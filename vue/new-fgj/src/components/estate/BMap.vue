<template lang="html">
  <!-- 百度地图 -->
  <section class="full-map">
    <div class="m-header">
      <i class="el-icon-arrow-left icon" @click="_back"></i>
      <h3 class="title">地图位置</h3>
    </div>
    <div class="map">
      <div id="map" ref="map" style="width: 100%; height: 100%;"></div>
    </div>
  </section>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    props: {
      addBack: {        // 已此判断是返回上一个路由，还是隐藏掉，添加楼盘才用得到
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        BMaps: null,
        local: null
      }
    },
    created() {
    },
    mounted() {
      setTimeout(() => {
        if (this.addBack) {
          this.addBaiduMap()
        }
      }, 20)
    },
    activated() {
      setTimeout(() => {
        if (!this.addBack) {
          this.baiduMap(this.BMap.Lng, this.BMap.Lat)
        }
      }, 20)
    },
    computed: {
      ...mapGetters([
        'BMap'
      ])
    },
    methods: {
      baiduMap(lng = 116.404, lat = 39.915) {      // 详细页的百度地图
        // console.log('详细页的地图')
        let mp = new BMap.Map(this.$refs.map)
        mp.enableScrollWheelZoom(true)
        mp.centerAndZoom(new BMap.Point(lng, lat), 18)
        var marker = new BMap.Marker(new BMap.Point(lng, lat))
        mp.addOverlay(marker)
        mp.addControl(new BMap.NavigationControl())
        mp.addControl(new BMap.GeolocationControl())
      },
      addBaiduMap() {
        // console.log('上传的地图')
        let _this = this
        this.BMaps = new BMap.Map('map')
        let point = new BMap.Point(115.91108, 28.678905)
        let gc = new BMap.Geocoder() //地址解析类

        this.BMaps.enableScrollWheelZoom(true)
        this.BMaps.centerAndZoom(point, 13)
        this.BMaps.addControl(new BMap.NavigationControl())
        this.BMaps.addControl(new BMap.GeolocationControl())

        this.local = new BMap.LocalSearch(this.BMaps, {
          renderOptions: { map: this.BMaps },
          onMarkersSet: function(res) {       // 搜索的返回结果，很多位置，取第一个的经纬度
            if (res[0]) {
              _this.$emit('point', res[0].point)
            } else {
              _this.$emit('point', 'error')
            }
          }
        })

        this.BMaps.addEventListener('click', function (e) {
          //解析地址并标注
          gc.getLocation(e.point, function (rs) {
            _this.BMaps.clearOverlays()     // 清除其他标注
            let marker = new BMap.Marker(new BMap.Point(e.point.lng, e.point.lat))
            _this.$emit('point', {lng: e.point.lng, lat: e.point.lat})
            _this.$emit('location', rs.addressComponents.district + rs.addressComponents.street + rs.addressComponents.streetNumber)
            _this.BMaps.addOverlay(marker)
            _this.BMaps.panTo(e.point)
            _this._back()
          })
        })
        // console.log('地图初始化完成')
        this.$emit('mapInitOk')       // 地图初始化完成，返回一个事件
      },
      localSearch(localvalue) {       // 搜索
        this.local.search(localvalue)
      },
      doLocate(obj) {     // 根据经纬度定位
        this.BMaps.clearOverlays()     // 清除其他标注
        var point = new BMap.Point(obj.lng, obj.lat)
        var marker = new BMap.Marker(point)
        this.BMaps.addOverlay(marker)
        this.BMaps.panTo(point)
      },
      _back() {
        if (this.addBack) {
          this.$emit('transitionx')
        } else {
          this.$router.back()
        }
      }
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';

  .full-map {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 12;
    width: 100%;
    height: 100%;
    background-color: #fff;
    .m-header {
      position: relative;
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
      .title {
        position: absolute;
        top: 0;
        left: 0;
        z-index: 1;
        width: 100%;
        height: 45px;
        font-size: 16px;
        color: #2D2F33;
        line-height: 45px;
      }
    }
    .map {
      position: absolute;
      top: 45px;
      right: 0;
      bottom: 0;
      left: 0;
    }
  }
</style>
