const { $Message } = require('../../../../components/base/index');
import _fgj from '../../../../utils/util.js';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      EstateID:'',
      BuildingPrefixName:'',
      BuildingSuffixName:''
    },
    SelectedIndex:0,
    listArray: [{ //单独添加
      unit:'',
      floor:{first:'',second:''},
      room:{first:'',second:''}
    }],   
    listArray: [{ //批量添加
      unit: '',
      floor: { first: '', second: '' },
      room: { first: '', second: '' }
    }],
    huildingArray:{first:'',second:''},
    nameRules:['数字','字母','天干','地支'],
    BuildingNOLetArry: [ "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z" ], 
    BuildingNOTGArry : [ "甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸" ],
    BuildingNODZArry : [ "子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥" ],
    rulesIndex:'0',
    disabled: false,
    loading: false,
  },

  onLoad: function (options) {
    let params = this.data.params
    params.EstateID = options.EstateID
    wx.setStorageSync('EstateID', options.EstateID)
    this.setData({
      params
    })
  },

  onShow: function () {
    
  },
  //头部切换
  selectTab(e){
    let SelectedIndex = e.currentTarget.dataset.index
    this.setData({
      SelectedIndex
    })
  },
  //添加单元
  addUnit(e){
    console.log(e)
    let listArray = this.data.listArray;
    listArray.push({})
    this.setData({
      listArray,
    })
  },
  //删除单元
  delUnit(e){
    let listArray =  this.data.listArray
    let index = e.currentTarget.dataset.index
    console.log(index)
    listArray.splice(index, 1)
    console.log(listArray)
    this.setData({
      listArray,
    })
  },
  //楼栋名称输入
  bindNameInput(e){
    let type = e.currentTarget.dataset.type
    let params = this.data.params
    params[type] = e.detail.value
    this.setData({
      params
    })
    
  },
  // 单独添加楼栋输入
  bindBuildingInput(e){

  },
  //单元输入
  bindKeyInput(e){
    let value = e.detail.value
    let listArray = this.data.listArray
    let index = e.currentTarget.dataset.index
    console.log(listArray[index])
    listArray[index].unit = value
    console.log(listArray)
    this.setData({
      listArray
    })
  },
  //楼层房号起始输入
  bingFirstInput(e){
    let { index,type } = e.currentTarget.dataset
    let listArray = this.data.listArray
    let value = e.detail.value 

    if (listArray[index][type] == undefined) {
      listArray[index][type] = {}
    }
    listArray[index][type].first = value

    if (value && listArray[index][type].second) {
      if (Number(value) > Number(listArray[index][type].second)) {
        listArray[index][type].second = ''
        $Message({ content: '结束不能大于开始', type: 'error' })
      }
    }
    
    this.setData({
      listArray
    })

  },
  //楼层房号结束输入
  bingSecondInput(e) {
    let { index, type } = e.currentTarget.dataset
    let listArray = this.data.listArray
    let value = e.detail.value

    if (listArray[index][type] == undefined){
      listArray[index][type] = {}
    }
    listArray[index][type].second = value

    if (value && listArray[index][type].first){
      if (Number(value) < Number(listArray[index][type].first)) {
        listArray[index][type].second = ''
        $Message({ content: '结束不能大于开始', type: 'error' })
      }
    }
    
    this.setData({
      listArray
    })

  },
  //命名规则切换
  bindPickerChange(e){
    let huildingArray = this.data.huildingArray
    huildingArray = { first: '', second:'' }
    console.log(huildingArray)

    let index = e.detail.value
    this.setData({
      rulesIndex:index,
      huildingArray
    })
  },

  //数字、字母、天干、地支 楼栋区间输入
  bindArrayChange(e){
    console.log(e)
    let {huildingArray,index } = this.data
    let value = e.detail.value
    let type = e.currentTarget.dataset.type
    let { first,second} = ''

    huildingArray[type] = value

    if(type == 'first'){
      first = value
      second = huildingArray.second
    }else{
      first = huildingArray.first
      second = value
    }
    if(first != '' && second !=''){
      if (Number(first) >= Number(second)) {
        huildingArray.second = ''
        $Message({ content: '结束不能大于开始', type: 'error' })
      }
    }

    this.setData({
      huildingArray
    })
    console.log(huildingArray)
  },
  //提交
  bindSubmit(e) {
    let { listArray, huildingArray, params, index, BuildingNOLetArry, BuildingNOTGArry, BuildingNODZArry, SelectedIndex, rulesIndex} = this.data
    let buildingArr = []
    params.BuildingBeginNo = huildingArray.first
    if (SelectedIndex==0){
      params.BuildingEndNo = huildingArray.first
    }else{
      params.BuildingEndNo = huildingArray.second
    }
    

    //调用接口数据拼接
    let UnitArr = [], UnitFloorInterval = [], UnitRoomInterval = []
    for (var i = 0; i < listArray.length;i++){
      UnitArr.push(listArray[i].unit)
      UnitFloorInterval.push(listArray[i].floor.first +'-'+ listArray[i].floor.second)
      UnitRoomInterval.push(listArray[i].room.first + '-' + listArray[i].room.second)
    }
    params.UnitArr = UnitArr.join("|")
    params.UnitFloorInterval = UnitFloorInterval.join("|")
    params.UnitRoomInterval = UnitRoomInterval.join("|")
    params.BuildingNoType = rulesIndex
    

    let verify = this.verifyData(listArray);   // 验证单元输入数据
    let verify2 = this.verifyData2(params);   // 验证楼栋输入数据
    
    if (verify2.status && verify.status ) {
      //拼接预览楼栋数组
      for (var i = params.BuildingBeginNo; i <= params.BuildingEndNo;i++){
        if (rulesIndex==0){
          buildingArr.push(params.BuildingPrefixName + i + params.BuildingSuffixName)
        } else if (rulesIndex==1){
          buildingArr.push(params.BuildingPrefixName + BuildingNOLetArry[i] + params.BuildingSuffixName)
        } else if (rulesIndex==2){
          buildingArr.push(params.BuildingPrefixName + BuildingNOTGArry[i] + params.BuildingSuffixName)
        }else{
          buildingArr.push(params.BuildingPrefixName + BuildingNODZArry[i] + params.BuildingSuffixName)
        }
      }

      this.setData({
        disabled: true,
        loading: true,
        buildingArr,
        listArray,
        params
      });
      wx.setStorageSync('buildingArr', buildingArr)
      wx.setStorageSync('listArray', listArray)
      wx.setStorageSync('params', params)
      wx.navigateTo({
        url: '/page/PM/project/add-preview/index'
      })
 
    } else {
      if (!verify2.status){
        $Message({ content: verify2.msg, type: 'error' });
      }else{
        $Message({ content: verify.msg, type: 'error' });
      }
      
    }

  },
 
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    for(var i=0 ;i<data.length;i++){
      if (!_fgj.verify(data[i].unit, 'require')) {
        result.msg = '请填写单元';
        return result;
      };
      if (!_fgj.verify(data[i].floor.first, 'require')) {
        result.msg = '请填写楼层区间开始';
        return result;
      };
      if (!_fgj.verify(data[i].floor.second, 'require')) {
        result.msg = '请填写楼层区间结束';
        return result;
      };
      
      if (!_fgj.verify(data[i].room.first, 'require')) {
        result.msg = '请填写房号区间开始';
        return result;
      };
      if (!_fgj.verify(data[i].room.second, 'require')) {
        result.msg = '请填写房号区间结束';
        return result;
      }; 
    }
   
    result.status = true;
    result.msg = '验证通过';

    return result; 
  },
  // 验证数据
  verifyData2(data) {
    let SelectedIndex = this.data.SelectedIndex
    let result = {
      status: false,
      msg: '错误提示'
    };
    // if (!_fgj.verify(data.BuildingPrefixName, 'require')) {
    //   result.msg = '请填写楼栋前缀';
    //   return result;
    // }; 
    
      // if (!_fgj.verify(data.BuildingSuffixName, 'require')) {
      //   result.msg = '请填写楼栋后缀';
      //   return result;
      // }; 
    
    if (!_fgj.verify(data.BuildingBeginNo, 'require')) {
      result.msg = '请填写楼栋区间起止';
      return result;
    };
    if (SelectedIndex) {
    if (!_fgj.verify(data.BuildingEndNo, 'require')) {
      result.msg = '请填写楼栋区间结束';
      return result;
    }; 
    }
    
    result.status = true;
    result.msg = '验证通过';

    return result;
  }
})