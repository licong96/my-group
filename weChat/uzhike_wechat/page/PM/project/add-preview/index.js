const {  $Message } = require('../../../../components/base/index');
import {  $wuxBackdrop} from '../../../../components/index';
import { GenerateEstateDict } from '../../../../api/project/add-dictionary';
import {  MAP_KEY,  URL_PATH} from '../../../../utils/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    buildingArr: [],
    unitArr: [],
    floorArr: [],
    roomListArray:[],
    loading: true,
    scrollLower: true,    // 显示上滑加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let listArray = wx.getStorageSync('listArray')
    let buildingArr = wx.getStorageSync('buildingArr')

    let { unitArr, roomListArray} = this.data
    for(let i=0;i<listArray.length;i++){
      unitArr.push({ label: listArray[i].unit + '单元', value: i })
    }

    let floor = listArray[0].floor.first
    for (let i = listArray[0].room.first; i <= listArray[0].room.second;i++){
      roomListArray.push((floor < 10 ? '0' + Number(floor) : floor) + (i < 10 ? '0' + Number(i) : i))
    }

    this.setData({
      unitArr,
      listArray,
      roomListArray,
      buildingArr
    })
  },

  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  // 打开筛选项切换
  bindScreenClick(e) {
    let {  index  } = e.currentTarget.dataset;
    let {  screenOpen   } = this.data;

    screenOpen ? '' : this.retainBackdrop(); // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      down: index,
      screenIndex: Number(index)
    });
  },
  //楼栋下拉框
  builddingChange(e){
    let SelectedValue = e.detail.value
    this.setData({
      SelectedValue
    })
    this.bindBackdrop(); // 选中后收起筛选项
  },
  //单元改变事件
  bindUnitChange(e) {
    let { floorArr, listArray, roomListArray } = this.data;
    floorArr = []
    roomListArray = []    
    let unit = e.detail.value
    let first = listArray[e.detail.value].floor.first
    let second = listArray[e.detail.value].floor.second
    let first2 = listArray[e.detail.value].room.first
    let second2 = listArray[e.detail.value].room.second

    //楼层列表
    for(let i=first;i<=second;i++){
      floorArr.push({ label: Number(i) + '楼', value: i})
    }

    //房号列表
    for(let i = first2, j = 0; i <= second2; i++ , j++) {
      roomListArray.push((first < 10 ? '0' + Number(first) : first) + (i < 10 ? '0' + Number(i) : i))
    }
    console.log(floorArr)
    this.setData({
      floorArr,
      unit, 
      roomListArray
    });
    this.bindBackdrop(); // 选中后收起筛选项
  },
  //楼层改变事件
  bindFloorChange(e) {
    let { roomListArray, listArray, unit } = this.data;
    roomListArray = []
    let floor = e.detail.value
    let first = listArray[unit].room.first
    let second = listArray[unit].room.second
    for (let i = first; i <= second; i++) {
      roomListArray.push((floor < 10 ? '0' + Number(floor) : floor) + (i < 10 ? '0' + Number(i) : i))
    }
    this.setData({
      roomListArray,
      floor:floor+'楼'
    });
    // this.GetProjectToPage(); // 获取项目列表
    this.bindBackdrop(); // 选中后收起筛选项
  },
  // 更多筛选，重置
  bindScreenReset(data) {
    console.log(data)
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    console.log(data)
    this.GetProjectToPage(); // 获取楼盘列表数据
  },
  // 保持遮罩
  retainBackdrop() {
    this.$wuxBackdrop.retain()
  },
  // 释放遮罩
  releaseBackdrop() {
    this.$wuxBackdrop.release()

  },
  // 点击遮罩
  bindBackdrop() {
    this.releaseBackdrop();
    this.setData({
      screenOpen: false,
    });
  },
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    console.log(e)
    let { params, listData } = this.data;
    this.setData({
      scrollLower: false
    });
    params.page++;
    GetProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
          item.imgSrc = URL_PATH + item.CLogo;     // 拼接logo图片地址
        });

        this.setData({
          listData: data,
          loading: true
        })
        console.log(data)
      } else {
        this.setData({
          listData: [],
          loading: true,
          scrollLower: true
        })
      };
    })
  },
  // 新建字典
  GenerateEstateDict() {
    let params = wx.getStorageSync('params')
    let EstateID = wx.getStorageSync('EstateID')
    wx.showLoading({ title: '加载中' });
    console.log(params)
    GenerateEstateDict(params).then(res => {
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({ content: '新建成功', type: 'success' });
        wx.removeStorageSync('params')
        wx.navigateTo({
          url: '/page/PM/project/dictionary-management/index?EstateID=' + EstateID
        })
      }
      else if (res.data.result === '权限不足') {
        $Message({ content: '权限不足，请先登录', type: 'success' });
        this.setData({
          disabled: false,
          loading: false
        });
        setTimeout(() => {
          wx.navigateTo({
            url: '/page/SMM/login/entry/index'
          })
        }, 1500);
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //上一页
  bindreturn(e){
    wx.navigateBack({
      delta: 1
    })
  },
  //完成
  bindOver(e){
    
    this.GenerateEstateDict()
    
  }
})