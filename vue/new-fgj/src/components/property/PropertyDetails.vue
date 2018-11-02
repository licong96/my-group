<template lang="html">
  <!-- 房源详情 -->
  <section class="property-details">
    <section class="head-fixed">
      <header class="lc header">
        <i class="el-icon-arrow-left icon" @click="back"></i>
        <h3 class="title">{{propertyData.EstateName}}</h3>
        <i class="el-icon-more right-span" @click="_openNav"></i>
      </header>
    </section>
    <!-- 右上角操作 -->
    <navigation ref="navMore" :IsEdit="IsEdit" @edit="edit"></navigation>
    <!-- 内容 -->
    <section class="max-auto">
      <div class="main">
        <scroll ref="scroll" :data="propertyArr">
        <div>
          <!-- 轮播图 -->
          <section class="swiper">
            <swiper :swiper-data="roomPhotoData" @load="_refresh"></swiper>
            <div class="swiper-bg"></div>
          </section>
          <section class="estate">
            <h3 class="name">{{propertyData.EstateName}}</h3>
            <p class="district">{{propertyData.DistrictName}}</p>
            <div class="tag-wrap">
              <span class="lc tag" :class="tagClass(index)" v-for="(tag, index) in tagData">{{tag}}</span>
            </div>
          </section>
          <section class="price">
            <ul class="price-wrap">
              <!-- 这里有出售和出租两种类型 -->
              <li class="price-list" v-show="propertyData.Trade==='出售'">
                <span class="title">售价</span>
                <span class="money">{{parseInt(propertyData.Price)}}{{propertyData.UnitName}}</span>
              </li>
              <li class="price-list" v-show="propertyData.Trade==='出租'">
                <span class="title">租价</span>
                <span class="money">{{parseInt(propertyData.RentPrice)}}{{propertyData.RentUnitName}}</span>
              </li>
              <li class="price-list">
                <span class="title">户型</span>
                <span class="money">{{propertyData.CountF}}房{{propertyData.CountT}}厅{{propertyData.CountW}}卫</span>
              </li>
              <li class="price-list">
                <span class="title">面积</span>
                <span class="money">{{propertyData.Square}}m²</span>
              </li>
            </ul>
          </section>
          <section class="info">
            <ul class="info-wrap">
              <li class="info-list">
                <span class="title">所在楼层：</span>
                <p class="desc">{{propertyData.Floor}}</p>
              </li>
              <li class="info-list">
                <span class="title">总<em style="margin-right: 2em"></em>层：</span>
                <p class="desc">{{propertyData.FloorAll}}</p>
              </li>
              <li class="info-list">
                <span class="title">状<em style="margin-right: 2em"></em>态：</span>
                <p class="desc">{{propertyData.Status}}</p>
              </li>
              <li class="info-list">
                <span class="title">交易类型：</span>
                <p class="desc">{{propertyData.Trade}}</p>
              </li>
              <li class="info-list">
                <span class="title">装修情况：</span>
                <p class="desc">{{propertyData.PropertyDirection}}</p>
              </li>
            </ul>
          </section>
          <section class="real">
            <ul class="real-wrap">
              <li class="real-list">
                <span class="title">物业用途：</span>
                <p class="desc">{{propertyData.PropertyUsage}}</p>
              </li>
              <li class="real-list">
                <span class="title">物业类型：</span>
                <p class="desc">{{propertyData.PropertyType}}</p>
              </li>
              <li class="real-list">
                <span class="title">物<em style="margin-right: .5em"></em>业<em style="margin-right: .5em"></em>费：</span>
                <p class="desc">{{propertyData.MgtPrice}}</p>
              </li>
            </ul>
          </section>
          <!-- 户型图 -->
          <section class="house">
            <p class="title">户型图</p>
            <div class="house-img-wrap">
              <img class="house-img" :src="smPath(item.PhotoPath)" alt="" v-for="(item, index) in housePhotoData">
            </div>
          </section>
          <section class="emp-name">
            <p class="emp">录入人：<span class="name">{{propertyData.EmpName}}</span></p>
            <p class="emp">录入部门：<span class="name">{{propertyData.DeptName}}</span></p>
          </section>
        </div>
        </scroll>
      </div>
    </section>
  </section>
</template>

<script>
  import Scroll from '@/base/BScroll'
  import Swiper from '@/components/estate/Swiper'
  import Navigation from '@/base/Navigation'
  import { GetPropertyByID, GetPhotoByPropertyID } from '@/api/property/propertyDetails'
  import { vipfgj } from '@/common/js/config'

  export default {
    data() {
      return {
        roomPhotoData: [],
        housePhotoData: [],
        propertyData: {},
        propertyArr: [],    // 把数据给scroll组件一份
        tagData: [],        // tag
        DistrictName: '',   // 区域
        PropertyID: ''      // 当前id
      }
    },
    created() {
      this.IsEdit = true

      // console.log(this.$route)
      this.PropertyID = this.$route.params.id
      this._GetPropertyByID()
      this._GetPhotoByPropertyID()
    },
    methods: {
      edit() {    // 编辑
        console.log(this.PropertyID)
        this.$router.push({
          path: '/propertyAdd',
          query: {
            id: this.PropertyID
          }
        })
      },
      _openNav() {
        this.$refs.navMore.operNav()
      },
      _GetPropertyByID() {      // 获取数据
        GetPropertyByID(this.PropertyID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.propertyData = res.data.tempTable[0]
            this.propertyArr = res.data.tempTable

            let tagArr = this.propertyData.Tag.split('|')      // 拆分tag
            let newTag = []
            tagArr.forEach(tag => {
              if (tag) {
                newTag.push(tag)
              }
            })
            this.tagData = newTag

            this.roomPhotoData.unshift({PhotoData: `${vipfgj}${this.propertyData.PicSrc}`})    // 把封面图添加到轮播里
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error('数据请求失败，原因是：', res.data.msg)
          }
        }).catch(err => this.$message.error('网络异常：', err))
      },
      _GetPhotoByPropertyID() {   // 获取图片
        GetPhotoByPropertyID(this.PropertyID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            let tempTable = res.data.tempTable
            let house = []
            tempTable.forEach((item) => {
              if (item.PhotoName === '室内图') {
                item.PhotoData = vipfgj + item.PhotoPath      // 这里拼接的地址是本地预览使用，上线要删除掉
                this.roomPhotoData.push(item)     // 这里用添加是因为，我把封面图也加进去了
              }
              if (item.PhotoName === '户型图') {
                house.push(item)
              }
            })
            this.housePhotoData = house
          } else {
            this.$message.error('图片请求失败，原因是：', res.data.msg)
          }
        }).catch(err => this.$message.error('网络异常：', err))
      },
      tagClass(num) {     // tag 添加class颜色
        return `color-${num % 6}`
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
      back() {
        this.$router.back()
      }
    },
    components: {
      Scroll,
      Swiper,
      Navigation
    }
  }
</script>

<style scoped lang="scss">
  @import "../../common/sass/variable";
  @import "../../common/sass/mixin";

  .property-details {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 99;
    background-color: #f5f5f5;
    .head-fixed {
      position: fixed;
      top: 0;
      left: 0;
      z-index: 99;
      width: 100%;
      .header {
        background-color: #409EFF;
      }
      .right-span,
      .title,
      .icon {
        color: #fff;
      }
    }
    .max-auto {
      width: 100%;
      height: 100%;
    }
    .main {
      position: absolute;
      top: 0;
      left: 0;
      padding-top: 45px;
      width: 100%;
      height: 100%;
      text-align: left;
    }
  }
  .swiper {
    position: relative;
    overflow: hidden;
    min-height: 240px;
    max-height: 310px;
  }
  .swiper-bg {
    position: absolute;
    top: 0;
    left: 0;
    width:100%;
    height: 240px;
    background: url("../../common/img/logo_bg.png") no-repeat center;
  }
  .estate {
    padding: 15px;
    background-color: #fff;
    .name {
      font-size: 16px;
      font-weight: 600;
      color: $color-text-3;
    }
    .district {
      padding-top: 10px;
      font-size: 14px;
      color: $color-text-6;
    }
  }

  .lc.tag {
    display: inline-block;
    margin-right: 10px;
    margin-top: 10px;
    border-radius: 3px;
    padding: 3px 6px;
    font-size: 14px;
    font-weight: 400;
  }
  .price {
    margin-top: 10px;
    padding: 15px;
    background-color: #fff;
    .price-wrap {
      display: flex;
      .price-list {
        flex: 1;
        display: flex;
        flex-direction: column;
        text-align: center;
        @include border-l-1px(100%);
        &:last-child {
          &:after {
            display: none;
          }
        }
        .title {
          font-size: 14px;
          color: $color-text-9;
          text-align: center;
        }
        .money {
          padding-top: 6px;
          font-size: 16px;
          color: $color-red;
          text-align: center;
        }
      }
    }
  }
  .info {
    margin-top: 10px;
    // padding: 0 15px 15px;
    padding-bottom: 15px;
    background-color: #fff;
    .info-wrap {
      display: flex;
      flex-wrap: wrap;
    }
    .info-list {
      display: flex;
      padding-top: 15px;
      padding-left: 15px;
      width: 50%;
      font-size: 15px;
      .title {
        color: $color-text-9;
      }
      .desc {
        padding-left: 4px;
        flex: 1;
        color: $color-text-3;
      }
    }
  }
  .real {
    margin-top: 10px;
    padding: 0 15px;
    background-color: #fff;
    .real-list {
      display: flex;
      width: 100%;
      height: 45px;
      line-height: 45px;
      font-size: 15px;
      @include border-b-1px(0);
      .title {
        color: $color-text-9;
      }
      .desc {
        padding-left: 4px;
        color: $color-text-3;
      }
    }
  }
  .house {
    margin-top: 10px;
    padding: 15px;
    background-color: #fff;
    .house-img-wrap {
      margin-top: 10px;
    }
    .title {
      padding-bottom: 15px;
      font-size: 15px;
      color: $color-text-9;
      @include border-b-1px(0);
    }
    .house-img {
      margin-right: 10px;
      vertical-align: top;
      max-width: 100%;
    }
  }
  .emp-name {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 0 15px;
    height: 45px;
    background-color: #fff;
    font-size: 14px;
    .emp {
      padding-right: 20px;
      color: $color-text-9;
    }
    .name {
      color: $color-text-3;
    }
  }
</style>
