<template lang="html">
  <!-- 房源上传 -->
  <section class="lc property-add">
    <section class="head-fixed">
      <header class="lc header" @touchmove.prevent>
        <i class="el-icon-arrow-left icon" @click="back"></i>
        <h3 class="title">房源添加</h3>
        <span class="right-span" @click="accomplish">完成</span>
      </header>
    </section>
    <article class="main">
      <!-- 添加封面图 -->
      <section class="surfacet-wrap">
        <div class="surfacet" @click="addPicImage('.core-pic-image')">
          <img class="img" :src="smPathPicSrc" v-show="paramData.PicSrc">
          <i class="iconfont icon-shangchuantupian1"></i>
          <p class="desc">添加封面图</p>
        </div>
      </section>
      <!-- 基本资料 -->
      <section class="base-info">
        <p class="info-title">基本资料</p>
        <ul class="list-wrap">
          <li class="list">
            <span class="name">交易：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.Trade" placeholder="请选择">
                <el-option
                  v-for="(item, index) in Trade"
                  :key="index"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">类型：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.PropertyType" placeholder="请选择">
                <el-option
                  v-for="(item, index) in PropertyType"
                  :key="index"
                  :label="item.ItemValue"
                  :value="item.ItemValue">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">区域：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.DistrictName" filterable placeholder="请选择区域">
                <el-option v-for="(item, index) in DistrictName" :key="index" :label="item.DistrictName" :value="item.DistrictName"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">楼盘：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.EstateID" filterable placeholder="请选择楼盘">
                <el-option v-for="(item, index) in EstateID" :key="index" :label="item.EstateName" :value="item.EstateID"></el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">楼座单元：</span>
            <div class="input-wrap">
              <el-input v-model="paramData.Building" placeholder="如：1栋2单元302"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">户型：</span>
            <div class="input-wrap">
              <ul class="house-wrap">
                <li class="house-list">
                  <el-select v-model="paramData.CountF" placeholder="几房">
                    <el-option v-for="(item, index) in CountF" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <span class="desc">房</span>
                </li>
                <li class="house-list">
                  <el-select v-model="paramData.CountT" placeholder="几厅">
                    <el-option v-for="(item, index) in CountT" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <span class="desc">厅</span>
                </li>
                <li class="house-list">
                  <el-select v-model="paramData.CountW" placeholder="几卫">
                    <el-option v-for="(item, index) in CountW" :key="index" :label="item.label" :value="item.value"></el-option>
                  </el-select>
                  <span class="desc">卫</span>
                </li>
              </ul>
            </div>
          </li>
          <li class="list">
            <span class="name">面积：</span>
            <div class="input-wrap">
              <el-input v-model="paramData.Square" placeholder="m²"></el-input>
            </div>
            <span class="unit">m²</span>
          </li>
          <li class="list" v-if="this.paramData.Trade==='出租'">
            <span class="name">租价：</span>
            <div class="input-wrap">
              <el-input v-model="paramData.RentPrice" placeholder="元/月"></el-input>
              <!-- <el-input v-model="paramData.Price" placeholder="万元"></el-input> -->
            </div>
            <span class="unit">元/月</span>
            <!-- <span class="unit" v-else>万元</span> -->
          </li>
          <li class="list" v-if="this.paramData.Trade!=='出租'">
            <span class="name">售价：</span>
            <div class="input-wrap">
              <!-- <el-input v-model="paramData.RentPriceUnit" v-if="this.paramData.Trade==='出租'" placeholder="元/m²"></el-input> -->
              <el-input v-model="paramData.PriceUnit" placeholder="元/m²"></el-input>
            </div>
            <span class="unit">元/m²</span>
          </li>
          <li class="list">
            <span class="name">楼层：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.Floor" placeholder="请选择楼层">
                <el-option
                  v-for="(item, index) in Floor" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
            <div class="input-wrap margin-null">
              <el-input v-model="paramData.FloorAll" placeholder="请输入总层数"></el-input>
            </div>
          </li>
          <li class="list">
            <span class="name">装修：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.PropertyDirection" placeholder="0">
                <el-option
                  v-for="(item, index) in PropertyDirection" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">朝向：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.opt13" placeholder="0">
                <el-option
                  v-for="(item, index) in options13" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="list-tag">
            <div class="name">标签：</div>
            <div class="input-wrap">
              <el-checkbox-group v-model="pitchTag" size="mini">
                <el-checkbox :label="item.ItemValue" border v-for="(item, index) in Tag" :key="index"></el-checkbox>
              </el-checkbox-group>
            </div>
          </li>
        </ul>
      </section>
      <!-- 其他资料 -->
      <section class="rest-info">
        <p class="info-title">其他资料</p>
        <ul class="list-wrap">
          <li class="list">
            <span class="name">看房：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.opt14" placeholder="预约">
                <el-option
                  v-for="(item, index) in options14" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
          <li class="list">
            <span class="name">产权：</span>
            <div class="input-wrap">
              <el-select v-model="paramData.opt15" placeholder="预约">
                <el-option
                  v-for="(item, index) in options15" :key="index" :label="item.label" :value="item.value">
                </el-option>
              </el-select>
            </div>
          </li>
        </ul>
      </section>
      <!-- 房源图片 -->
      <section class="pic-info">
        <p class="info-title">房源图片</p>
        <div class="house">
          <p class="excuse">户型图（建议一张）</p>
          <ul class="list-wrap">
            <li class="list" v-for="(item, index) in houseUrl" :key="index" v-show="houseUrl.length">
              <i class="el-icon-error" @click="removeHouseUrl(index)"></i>
              <img class="img" :src="smPath(item.PhotoPath)" alt="">
            </li>
            <li class="list add" @click="addPicImage('.core-house-image')">
              <i class="add-icon el-icon-plus"></i>
            </li>
          </ul>
        </div>
        <div class="house indoor">
          <p class="excuse">室内图（建议每个空间一张）</p>
          <ul class="list-wrap">
            <li class="list" v-for="(item, index) in roomUrl" :key="index" v-show="roomUrl.length">
              <i class="el-icon-error" @click="removeRoomUrl(index)"></i>
              <img class="img" :src="smPath(item.PhotoPath)" alt="">
            </li>
            <li class="list add" @click="addPicImage('.core-room-image')">
              <i class="add-icon el-icon-plus"></i>
            </li>
          </ul>
        </div>
      </section>
    </article>
    <!-- 封面图上传裁切 -->
    <core-image className="core-pic-image" cropRation="1.333:1" @coreImage="corePicImage"></core-image>
    <!-- 户型图上传裁切 -->
    <core-image className="core-house-image" cropRation="1:1.333" @coreImage="coreHouseImage"></core-image>
    <!-- 室内图上传裁切 -->
    <core-image className="core-room-image" cropRation="1.333:1" @coreImage="coreRoomImage"></core-image>
    <!-- 确定组件 -->
    <confirm ref="confirm" @confirm="confirmClear" :text="confirmText"></confirm>
  </section>
</template>

<script>
  import { vipfgj } from '@/common/js/config.js'
  import CoreImage from '@/base/CoreImage'
  import Confirm from '@/base/Confirm'
  import { DrawImageToBase } from '@/utils/picReduce'
  import { imageOnload, jointTagStr } from '@/utils/index'
  import { SelectByCity, estate, ImgUpLoad } from '@/api/public'
  import { InsertPropertyData, InsertPropertyPhoto, PropertyUsage, EstateTag } from '@/api/property/propertyAdd'
  import { GetPropertyByID, GetPhotoByPropertyID } from '@/api/property/propertyDetails'

  /**
  * 交易类型决定售价和租价的显示 
  * 交易如果是空值，总价显示万元
  * 交易如果是出售，总价显示万元
  * 交易如果是出租，总价显示元/月
  */

  export default {
    data() {
      return {
        PropertyID: '',
        paramData: {
          todo: 'Property',
          type: 'InsertPropertyData',
          needpurview: true,
          valiurl: document.URL,
          PicSrc: '',
          Trade: '',
          PropertyType: '',
          DistrictName: '',
          EstateID: '',
          Building: '',     // 楼座单元
          Floor: '',
          CountF: '',
          CountT: '',
          CountW: '',
          Square: '',
          Price: '',          // 售价
          PriceUnit: '',      // 售单价
          RentPrice: '',      // 租价
          RentPriceUnit: '',  // 租单价
          FloorAll: '',
          PropertyDirection: '',
          Tag: [],
          opt13: '',
          opt14: '',
          opt15: ''
        },
        Trade: [    // 交易
          {
            label: '出售',
            value: '出售'
          },
          {
            label: '出租',
            value: '出租'
          }
        ],
        PropertyType: [],
        DistrictName: [],   // 区域
        EstateID: [],
        CountF: [],
        CountT: [],
        CountW: [],
        Floor: [
          {
            label: '底层',
            value: '底层'
          },
          {
            label: '中层',
            value: '中层'
          },
          {
            label: '高层',
            value: '高层'
          }
        ],
        PropertyDirection: [
          {
            label: '精装',
            value: '精装'
          },
          {
            label: '中装',
            value: '中装'
          }
        ],
        options13: [
          {
            label: '坐南朝北',
            value: '坐南朝北'
          },
          {
            label: '坐北朝南',
            value: '坐北朝南'
          }
        ],
        Tag: [],
        pitchTag: [],     // 当前勾选的tag标签
        options14: [
          {
            label: '预约',
            value: '预约'
          },
          {
            label: '来呀',
            value: '来呀'
          }
        ],
        options15: [
          {
            label: '40年',
            value: '40年'
          },
          {
            label: '50年',
            value: '50年'
          }
        ],
        houseUrl: [],     // 户型图
        roomUrl: [],       // 室内图
        confirmText: '是否删除当前图片？'    // confirm提示文字
      }
    },
    created() {
      console.log(this.$route.query.id)
      this.PropertyID = this.$route.query.id
      // 如果有id，就表示编辑
      if (this.PropertyID) {
        this._GetPropertyByID()
        this._GetPhotoByPropertyID()
      }

      this._estate()            // 获取楼盘
      this._SelectByCity()      // 获取区域
      this._PropertyUsage()     // 获取类型
      this._EstateTag()         // 获取标签
      this._initOption()
    },
    // activated () {    // 组件被缓存了，再次进入就会走这里
    // },
    mounted () {
      setTimeout(() => {
        this.confirm = this.$refs.confirm     // 保存确定提醒元素
      }, 20)
    },
    computed: {
      smPathPicSrc() {      // 封面图sm_src
        return this.smPath(this.paramData.PicSrc)
      }
    },
    methods: {
      initData() {      // 初始化数据，也就是清空掉了
        this.paramData = {
          todo: 'Property',
          type: 'InsertPropertyData',
          needpurview: true,
          valiurl: document.URL,
        }
        this.pitchTag = []
        this.houseUrl = []
        this.roomUrl = []
      },
      accomplish() {    // 点击完成
        // 判断是添加还是编辑
        if (this.PropertyID) {
          this._edit()
        } else {
          this._add()
        }
      },
      _edit() {   // 编辑
        this.paramData.type = 'UpPropertyData'      // 把type改成编辑
        this.paramData.PropertyID = this.PropertyID // 把当前ID传进去
      },
      _add() {    // 添加
        /**
         * 基本信息上传成功后，拿到propertyID，然后再上传户型图和室内图
         * 图片规格用逗号分割，用 | 表示一组：图片地址,'房源图 '| 图片地址,'室内图'
         */
        this.paramData.type = 'InsertPropertyData'
        if (!this.paramData.PicSrc) {
          this.$message.error('请上传封面图')
          return
        }
        if (!this.paramData.Trade) {
          this.$message.error('请选择交易类型')
          return
        }
        
        if (!this._isNumber(this.paramData.Square)) {
          this.$message.error('请输入面积，并且只能是数字')
          return
        }
        // 计算出售和出租的总价 => 单价 * 面积
        if (this.paramData.Trade === '出售') {
          if (!this._isNumber(this.paramData.PriceUnit)) {
            this.$message.error('请输入售价，并且只能是数字')
            return
          }
          this.paramData.Price = (this.paramData.PriceUnit * this.paramData.Square) / 10000
        } 
        else {
          if (!this._isNumber(this.paramData.RentPrice)) {
            this.$message.error('请输入租价，并且只能是数字')
            return
          }
          this.paramData.RentPriceUnit = this.paramData.RentPrice / this.paramData.Square
        }

        this.paramData.Tag = jointTagStr(this.pitchTag)   // 拼接tag成一个字符串
        
        // console.log(this.houseUrl)
        // console.log(this.roomUrl)
        // console.log(this.paramData)
        
        InsertPropertyData(this.paramData).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            return res.data.PropertyID
          } else {
            this.$message.error('添加失败，错误信息是：', res.data.msg)
          }
        })
        .then(PropertyID => {
          let PhotoPath = ''      // 最终拼接起来的要传的房源图片
          let houseStr = ''
          let roomStr = ''
          // 户型图
          if (this.houseUrl.length) {
            this.houseUrl.forEach((item) => {
              houseStr += `|${item.PhotoPath},户型图`
            })
          }
          // 室内图
          if (this.roomUrl.length) {
            this.roomUrl.forEach((item) => {
              roomStr += `|${item.PhotoPath},室内图`
            })
          }
          PhotoPath = houseStr + roomStr
          if (PhotoPath) {
            InsertPropertyPhoto(PropertyID, PhotoPath).then(res => {
              // console.log(res)
              if (res.data.result === 'success') {
                this.$message.success('添加成功')
                this.initData()
                window.scrollTo(0, 0)
                // this.confirmText = '是否去查看刚才添加的房源？'
                // this.confirm.show({type: 'success'})
              } else {
                this.$message.error(res.data.msg)
              }
            })
          }
        }).catch(error => this.$message.error(error))
      },
      _isNumber(number) {   // 判断是否为数字
        return /^\d+(\.\d+)?$/.test(number)
      },
      smPath(paths) {      // 拼接压缩图字符串， `vipfgj{join}` 是本地测试用的
        if (!paths) {
          return
        }
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
      confirmClear(val) {     // 再次确定操作
        if (val.type === 'house') {
          this.houseUrl.splice(val.index, 1)
        } else if (val.type === 'room') {
          this.roomUrl.splice(val.index, 1)
        } else if(val.type === 'back') {     // 放弃修改，关闭页面
          this.$router.back()
        } else if (val.type === 'success') {    // 查看详情
          // 
        }
      },
      removeRoomUrl(index) {        // 删除室内图
        this.confirmText = '是否删除当前室内图？'
        this.confirm.show({type: 'room', index})   // 开启提醒
      },
      removeHouseUrl(index) {        // 删除户型图
        this.confirmText = '是否删除当前户型图？'
        this.confirm.show({type: 'house', index})   // 开启提醒
      },
      imageUpload(base64, type, width, height) {     // 四个参数 base64、类别、压缩宽度、压缩高度
        // 这是图片裁切插件的bug，完成裁切后，body的overflow：hiddle，没去掉，影响滑动，我这里手动去掉它
        let oBody = document.getElementsByTagName('body')[0]
        oBody.style.overflow = 'initial'

        imageOnload(base64).then(image => {
          let sm_pic = DrawImageToBase(image, width, height)     // 压缩
          ImgUpLoad(base64, sm_pic).then((res) => {
            // console.log(res)
            if (res.data.result === 'success') {
              if (type === 'pic') {
                this.paramData.PicSrc = res.data.path
              } else if (type === 'house') {
                this.houseUrl.push({PhotoPath: res.data.path})
              } else if (type === 'room') {
                this.roomUrl.push({PhotoPath: res.data.path})
              }
            } else {
              this.$message.error('图片上传失败！', res.data.msg)
            }
          }).catch(error => this.$message.error('操作失败！', error))
        }).catch(error => this.$message.error(error))
      },
      corePicImage(base64) {                // 封面图裁切回调
        this.imageUpload(base64, 'pic', 200, 150)     // 四个参数 base64、类别、压缩宽度、压缩高度
      },
      coreHouseImage(base64) {
        this.imageUpload(base64, 'house', 84, 112)
      },
      coreRoomImage(base64) {
        this.imageUpload(base64, 'room', 112, 84)
      },
      addPicImage(className) {     // 触发上传裁切封面图
        let avatar = document.querySelector(className)
        let form = avatar.getElementsByTagName('input')[0]      // 主要是通过获取节点，添加事件
        form.click()
      },
      _SelectByCity() {   // 获取区域
        SelectByCity().then(res => {
          if (res.data.tempTable) {
            this.DistrictName = res.data.tempTable
          }
        })
      },
      _PropertyUsage() {    // 获取类型
        PropertyUsage().then(res => {
          if (res.data.tempTable) {
            this.PropertyType = res.data.tempTable
          }
        })
      },
      _EstateTag() {   // 获取标签
        EstateTag().then(res => {
          if (res.data.tempTable) {
            this.Tag = res.data.tempTable
          }
        })
      },
      _estate() {       // 获取楼盘
        estate().then(res => {
          if (res.data.result === 'success') {
            this.EstateID = res.data.tempTable
          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error(res.data.msg)
          }
        }).catch(error => this.$message.error(error))
      },
      _initOption() {   // 添加户型数据
        for (let i = 0; i < 10; i++) {
          let obj1 = {
            label: `${i} 房`,
            value: i
          }
          let obj2 = {
            label: `${i} 厅`,
            value: i
          }
          let obj3 = {
            label: `${i} 卫`,
            value: i
          }
          this.CountF.push(obj1)
          this.CountT.push(obj2)
          this.CountW.push(obj3)
        }
      },
      back() {
        // this.$router.back()
        this.confirmText = '是否放弃当前修改？'
        this.confirm.show({type: 'back'})
      },
      // 下面的是编辑
      _GetPropertyByID() {      // 获取数据
        GetPropertyByID(this.PropertyID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            this.paramData = res.data.tempTable[0]

            let tagArr = this.paramData.Tag.split('|')      // 拆分tag
            let newTag = []
            tagArr.forEach(tag => {
              if (tag) {
                newTag.push(tag)
              }
            })
            this.pitchTag = newTag

          } else if (res.data.result === '权限不足') {
            this.$message.error('权限不足')
            setTimeout("var referrer = '/Login.html?redirect=" + res.data.URL + "';if(referrer==''){referrer=document.referrer;}window.location.href=referrer;", 1000);
          } else {
            this.$message.error('数据请求失败，原因是：', res.data.msg)
          }
        }).catch(err => this.$message.error('catch', err))
      },
      _GetPhotoByPropertyID() {   // 获取图片
        GetPhotoByPropertyID(this.PropertyID).then(res => {
          // console.log(res)
          if (res.data.result === 'success') {
            let tempTable = res.data.tempTable
            let house = []
            tempTable.forEach((item) => {
              if (item.PhotoName === '室内图') {
                this.roomUrl.push(item)     // 这里用添加是因为，我把封面图也加进去了
              }
              if (item.PhotoName === '户型图') {
                house.push(item)
              }
            })
            this.houseUrl = house
          } else {
            this.$message.error('图片请求失败，原因是：', res.data.msg)
          }
        }).catch(err => this.$message.error('catch', err))
      }
    },
    watch: {
    },
    components: {
      CoreImage,
      Confirm
    }
  }
</script>

<style scoped lang="scss">
  @import '../../common/sass/mixin';
  @import '../../common/sass/variable';

  .property-add {
    background-color: #f5f5f5;
    .head-fixed {
      position: fixed;
      z-index: 2001;
      width: 100%;
    }
    .header {
      background: #409EFF;
      .icon,
      .title,
      .right-span  {
        color: #fff;
      }
    }
    .main {
      padding-top: 45px;
      text-align: left;
    }
    .img {
      width: 100%;
      height: 100%;
      vertical-align: top;
      object-fit: cover;
    }
    // 封面图
    .surfacet-wrap {
      padding: 15px 20px;
      background-color: #fff;
      .surfacet {
        position: relative;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding: 30px 0;
        margin: 0 auto;
        border-radius: 4px;
        box-shadow: 0 0 4px 2px rgba(0, 0, 0, 0.1);
        width: 200px;
        height: 150px;
        color: #909399;
        .img {
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          z-index: 4;
        }
        .surfacet-file {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 2;
          width: 100%;
          height: 100%;
          opacity: 0;
        }
        .iconfont {
          font-size: 50px;
        }
        .desc {
          padding-top: 10px;
          font-size: 14px;
        }
      }
    }
    // 区块标签
    .info-title {
      display: inline-block;
      margin: 5px 0;
      border-radius: 0 20px 20px 0;
      padding: 8px 26px;
      background: #F56C6C;
      color: #fff;
    }
    .rest-info {
      .info-title {
        background: rgba(67, 193, 118, 1);
      }
    }
    // 基本信息
    .base-info,
    .rest-info {
      margin-top: 10px;
      background-color: #fff;
      .list-wrap {
        padding: 0 15px;
        @include border-b-1px(100%);
      }
      .list {
        display: flex;
        align-items: center;
        padding-top: 5px;
        .name {
          display: inline-block;
          min-width: 70px;
          font-size: 14px;
          color: #5A5E66;
          text-align: right;
        }
        .input-wrap {
          flex: 1;
          margin-left: 10px;
          @include border-b-1px(0);
          &.margin-null {
            margin: 0;
            padding-left: 10px;
          }
        }
        .unit {
          display: inline-block;
          flex: 1;
          height: 40px;
          line-height: 40px;
          @include border-b-1px(0);
        }
      }
      .list-tag {
        .name {
          padding-top: 16px;
          padding-bottom: 5px;
          width: 70px;
          font-size: 14px;
          color: #5A5E66;
          text-align: right;
        }
        .input-wrap {
          &:after {
            display: none;
          }
        }
        .el-checkbox.is-bordered {
          margin: 5px 5px;
        }
      }
      // 户型
      .house-wrap {
        display: flex;
        .house-list {
          flex: 1;
          display: flex;
          align-items: center;
          padding-right: 10px;
          color: $color-text-9;
          @include border-l-1px(100%);
          &:last-child {
            &:after {
              display: none;
            }
          }
        }
      }
    }
    // 房源图片
    .pic-info {
      margin-top: 10px;
      padding-bottom: 15px;
      background-color: #fff;
      .info-title {
        background: $color-blue;
      }
      .house {
        .excuse {
          padding: 10px 15px;
          font-size: 14px;
          color: $color-text-6;
          @include border-b-1px(0);
        }
        .list-wrap {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
          padding-left: 10px;
        }
        .list {
          position: relative;
          border: 1px dashed #d9d9d9;
          width: 84px;
          height: 112px;
          margin: 10px 8px 0 0;
        }
        .el-icon-error {
          position: absolute;
          top: -6px;
          right: -6px;
          z-index: 2;
          font-size: 22px;
          color: $color-danger;
          &:after {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            bottom: 2px;
            left: 0;
            z-index: -1;
            border-radius: 50%;
            background-color: #fff;
          }
        }
        .add {
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          .add-icon {
            font-size: 24px;
            color: #d9d9d9;
          }
        }
      }
      // 室内图
      .indoor {
        @include border-b-1px(100%);
        .list {
          width: 112px;
          height: 84px;
        }
      }
    }
  }
</style>
