
const { $Message } = require('../../../../components/base/index');
import { $wuxBackdrop } from '../../../../components/index';
import { GetEstateDictFilter, UpEstateDictByFilter } from '../../../../api/project/dictionary-edit';
import { MAP_KEY, URL_PATH } from '../../../../utils/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      ParentID:'',
      LevelType:1
    },
    listData:[],
    buildingArr: [],
    unitArr: [],
    floorArr: [],
    selectArray:['','',''],
    screenIndex:0,
    loading: false,
    scrollLower: true,    // 显示上滑加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { params } = this.data
    params = Object.assign(wx.getStorageSync('EstateDictFilter'),params)   //批量编辑填写的条件数据
    let EstateDictByFilter = wx.getStorageSync('EstateDictByFilter')  //批量编辑填写的内容数据
    console.log(EstateDictByFilter)
    this.setData({
      params,
      EstateDictByFilter,
    })
    this.GetEstateDictFilter()
  },

  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetlistData()
  },

  // 打开筛选项切换
  bindScreenClick(e) {
    console.log(e)
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;
    screenOpen ? '' : this.retainBackdrop(); // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      down: index,
      screenIndex: Number(index)
    });

  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { params, selectArray } = this.data;
    let { index } = e.currentTarget.dataset

    selectArray[index-2] = e.detail.value
    params.LevelType = index
    params.ParentID = e.detail.value

    this.setData({
      selectArray,
      params
    });
    this.bindBackdrop(); // 选中后收起筛选项
    this.GetEstateDictFilter(); // 获取字典数据(批量)
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
  //默认列表
  GetlistData(){
    let { params,listData } = this.data

    wx.showLoading({ title: '加载中' });

    GetEstateDictFilter(params).then(res => {  

      if (res.data.result === 'success') {    
        let data = res.data.temptable || [];
        params.ParentID = data[0].EstateDictID
        params.LevelType = 2                     //获取单元

        GetEstateDictFilter(params).then(res => {  

          if (res.data.result === 'success') {  
            let data = res.data.temptable || [];
            params.ParentID = data[0].EstateDictID
            params.LevelType = 3                //获取楼层

            GetEstateDictFilter(params).then(res => {  

              if (res.data.result === 'success') {   
                let data = res.data.temptable || [];
                params.ParentID = data[0].EstateDictID
                params.LevelType = 4            //获取房号

                GetEstateDictFilter(params).then(res => {

                  wx.hideLoading();

                  if (res.data.result === 'success') {
                    let data = res.data.temptable || [];
                      
                    data.forEach(item => {
                      listData.push({ DictName: item.DictName, ParentID: item.EstateDictID })
                    })
                    
                    this.setData({
                      listData,
                      scrollLower: true,
                      loading: true
                    })
                  } else {
                    $Message({ content: res.data.msg, type: 'error' });
                  }
                })

              } else {
                $Message({ content: res.data.msg, type: 'error' });
              }
            })

          } else {
            $Message({ content: res.data.msg, type: 'error' });
          }
        })

      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 根据条件获取字典数据(批量)
  GetEstateDictFilter() {
    let { params, screenIndex, buildingArr, unitArr, floorArr, listData} = this.data  

    GetEstateDictFilter(params).then(res => {
      if (screenIndex == 1) {
        unitArr = []
      } else if (screenIndex == 2) {
        floorArr = []
      } else {
        listData = []
      }
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];
        data.forEach(item => {
          if (screenIndex == 0) {
            buildingArr.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          } else if (screenIndex == 1) {
            unitArr.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          } else if (screenIndex == 2) {
            floorArr.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          } else {
            listData.push({ DictName: item.DictName, ParentID: item.EstateDictID})
          }
        })
        this.setData({
          buildingArr,
          unitArr,
          floorArr,
          listData,
          disabled: false,
          loading: false,
          params
        });
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //根据条件筛选批量修改字典数据(批量)
  UpEstateDictByFilter(e) {
    let params = this.data.EstateDictByFilter;
    let EstateID = wx.getStorageSync('EstateID')

    wx.showLoading({ title: '加载中' });
    UpEstateDictByFilter(params).then(res => {
      // console.log(res)
      wx.hideLoading();

      if (res.data.result === 'success') {
        $Message({ content: '编辑成功', type: 'success' });
        wx.navigateTo({
          url: '../dictionary-management/index?EstateID=' + EstateID,
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //返回上一页
  bindreturn(e) {
    wx.navigateBack({
      delta: 1,
    })
  },
  //点击完成 
  revise(e){
    this.UpEstateDictByFilter()
  }
})