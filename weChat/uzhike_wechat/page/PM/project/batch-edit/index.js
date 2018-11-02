// pages/project/batch-edit/index.js
const { $Message } = require('../../../../components/base/index');
import { GetEstateDictFilter } from '../../../../api/project/dictionary-edit';
import _fgj from '../../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      BuildingOdd:'0',
      UnitOdd:'0',
      FloorOdd:'0',
      RoomOdd:'0'
    },
    listData:[{
      title:'楼栋',
      odd:'BuildingOdd',
      beginIndex:'BuildingBeginIndex',
      endIndex:'BuildingEndIndex',
      Other:'BuildingOther',
      numberArry: [{
        label: '奇数',
        value: '0',
        checked: true
      }, {
        label: '偶数',
        value: '1',
        checked: false
      }],
    }, {
        title: '单元',
        odd: 'UnitOdd',
        beginIndex: 'UnitBeginIndex',
        endIndex: 'UnitEndIndex',
        Other: 'UnitOther',
        numberArry: [{
          label: '奇数',
          value: '0',
          checked: true
        }, {
          label: '偶数',
          value: '1',
          checked: false
        }],
      }, {
        title: '楼层',
        odd: 'FloorOdd',
        beginIndex: 'FloorBeginIndex',
        endIndex: 'FloorEndIndex',
        Other: 'FloorOther',
        numberArry: [{
          label: '奇数',
          value: '0',
          checked: true
        }, {
          label: '偶数',
          value: '1',
          checked: false
        }],
      }, {
        title: '房号',
        odd: 'RoomOdd',
        beginIndex: 'RoomBeginIndex',
        endIndex: 'RoomEndIndex',
        Other: 'RoomOther',
        numberArry: [{
          label: '奇数',
          value: '0',
          checked: true
        }, {
          label: '偶数',
          value: '1',
          checked: false
        }],
      }],
    selects: [
      { name: '0', value: '不限', checked: 'true' },
      { name: '1', value: '筛选'},
      { name: '2', value: '自定义' },
    ],
    numArray:['','','',''],
    selectedArray:[0,0,0,0],
  },

  onLoad: function (options) {

    let params = this.data.params
    this.setData({
      params
    })
  },

  onShow: function () {

  },
  //筛选切换
  radioChange(e){
    let { selectedArray, listData,params} = this.data
    let selected = e.detail.value
    let index = e.currentTarget.dataset.index
    selectedArray[index] = selected
    if (selected==1){          //筛选条件切换，将每个条件的输入内容置空
      let type = listData[index].Other
      params[type] = ''
    }else if(selected==2){
      let type1 = listData[index].beginIndex
      let type2 = listData[index].endIndex
      let type3 = listData[index].odd
      listData[index].numberArry[0].checked = false         //将选择的筛选都取消选中状态
      listData[index].numberArry[1].checked = false
      params[type1] = ''
      params[type2] = ''
      params[type3] = ''
    }
    this.setData({
      selectedArray,
      params,
      listData
    })
  },
  // 楼栋筛选奇偶数
  numChange(e){
    let {params} = this.data
    let {type,index} = e.currentTarget.dataset
    let value = e.detail.value
    params[type] = value

    this.setData({
      params
    })
  },
  //各个区间输入事件
  bindKeyInput(e){
    let type = e.currentTarget.dataset.type
    let {params} = this.data
    params[type] = e.detail.value
    this.setData({
      params
    })
  },

  //下一步
  bindSubmit(e){
    let params = this.data.params
    let EstateID = wx.getStorageSync('EstateID')
    params.EstateID = EstateID
    wx.setStorageSync('EstateDictFilter', params)
    wx.navigateTo({
      url: '../dictionary-edit/index?EstateID=' + EstateID,
    })
  }


})