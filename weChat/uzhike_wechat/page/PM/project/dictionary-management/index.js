const {
  $Message
} = require('../../../../components/base/index');
import {
  $wuxBackdrop
} from '../../../../components/index';
import {
  GetEstateDictList
} from '../../../../api/project/dictionary-management';
import {
  MAP_KEY,
  URL_PATH
} from '../../../../utils/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      EstateID: '',
      ParentID: '',
      LevelType:1
    },
    buildingArray: [],
    unitArray: [],
    floorArray: [],
    selectedArray:[],
    listData:[],
    screenIndex:0,
    loading: false,
    scrollLower: true, // 显示上滑加载中
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let EstateID = options.EstateID
    let params = this.data.params
    params.EstateID = EstateID
    this.setData({
      EstateID
    })
    this.GetlistData() //获取默认列表
  },

  onReady: function() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.GetEstateDictList()
  },

  // 打开筛选项切换
  bindScreenClick(e) {
    let {  index } = e.currentTarget.dataset;
    let {  screenOpen  } = this.data;
    screenOpen ? '' : this.retainBackdrop(); // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      down: index,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { params, selectedArray } = this.data;
    let index = e.currentTarget.dataset.index 

    selectedArray[index-2] = e.detail.value
    params.LevelType = index
    params.ParentID = e.detail.value

    this.setData({
      selectedArray,
      params
    });

    this.GetEstateDictList(); // 获取项目列表
    this.bindBackdrop(); // 选中后收起筛选项
  },
  //默认列表
  GetlistData() {
    let { params, listData } = this.data

    wx.showLoading({ title: '加载中' });

    GetEstateDictList(params).then(res => {

      if (res.data.result === 'success') {
        let data = res.data.temptable || [];
        params.ParentID = data[0].EstateDictID
        params.LevelType = 2                     //获取单元

        GetEstateDictList(params).then(res => {

          if (res.data.result === 'success') {
            let data = res.data.temptable || [];
            params.ParentID = data[0].EstateDictID
            params.LevelType = 3                //获取楼层

            GetEstateDictList(params).then(res => {

              if (res.data.result === 'success') {
                let data = res.data.temptable || [];
                params.ParentID = data[0].EstateDictID
                params.LevelType = 4            //获取房号

                GetEstateDictList(params).then(res => {

                  wx.hideLoading();

                  if (res.data.result === 'success') {
                    let data = res.data.temptable || [];

                    data.forEach(item => {
                      listData.push({ DictName: item.DictName, ParentID: item.EstateDictID, Square: item.Square, PropertyUsage: item.PropertyUsage, Direction: item.Direction, Bedroom: item.Bedroom, Livingroom: item.Livingroom, ImgUrl: item.ImgUrl })
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
  // 分级获取字典列表
  GetEstateDictList() {
    let { params, screenIndex  } = this.data;
    let {buildingArray,unitArray,floorArray,listData} = this.data 
    if (screenIndex==1){
      unitArray = []
    } else if (screenIndex==2){
      floorArray = []
    } else if (screenIndex==3){
      listData = []
    }
    this.setData({
      loading: false
    });
    GetEstateDictList(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];
        
        data.forEach(item =>{
          if (screenIndex==0){
            buildingArray.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          } else if (screenIndex==1){
            unitArray.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          } else if (screenIndex==2){
            floorArray.push({ DictName: item.DictName, ParentID: item.EstateDictID })
          }else{
            listData.push({ DictName: item.DictName, ParentID: item.EstateDictID, Square: item.Square, PropertyUsage: item.PropertyUsage, Direction: item.Direction, Bedroom: item.Bedroom, Livingroom: item.Livingroom, ImgUrl: item.ImgUrl})
          }         
        })
        this.setData({
          buildingArray,
          unitArray,
          floorArray,
          listData,
          scrollLower:true,
          loading:true
        })
      } else {
        this.setData({
          listData: [],
          loading: true
        })
      };
    })
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

  //批量操作
  batchOperation(e){
    let EstateID = this.data.params.EstateID
    wx.navigateTo({
      url: '/page/PM/project/batch-edit/index?EstateID=' + EstateID,
    })
  },
  // 更多操作
  bindOpenMore(e) {
    let { id, name} = e.currentTarget.dataset
    let _this = this;

    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../dictionary-edit/index?EstateDictID=' + id + '&DictName=' + name,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个字典吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelProject(projectId);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          default:
            console.log('tapIndex错误')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
})