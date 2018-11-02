const { $Message } = require('../../../../components/base/index');
import { FileUpLoad, GetRefByName } from '../../../../api/public';
import { UpEstateDictByDictID, GetEstateDictFilter, GetEstateDictByDictID, UpEstateDictByFilter } from '../../../../api/project/dictionary-edit';
import _fgj from '../../../../utils/util.js';
import { URL_PATH } from '../../../../utils/config';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      Direction:'',
      PropertyUsage:'',
      Decoration:'',
      ImgUrl:''
    },
    single:1,  //0为个别编辑，1为批量编辑
    imgCropperArray:'',
    orientationsArray:['东','南','西','北','东南','西南','西北','东北'],
    PropertyUsageArray:[],
    DecorationArray:[]
  },

  onLoad: function (options) {
    console.log(options)
    let {params,single} = this.data
    let EstateDictID = options.EstateDictID  //根据id编辑修改单个字典数据
    let DictName = options.DictName  //单独修改或添加房号
    
    if (EstateDictID == undefined){
        single = 1
    }else{
      single = 0
    }

    if (single == 1){  //批量处理
      params = Object.assign(wx.getStorageSync('EstateDictFilter'),params)
      DictName = ''
      // this.GetEstateDictFilter()
    }else{                         //个别处理
      params.EstateDictID = EstateDictID
      this.GetEstateDictByDictID(EstateDictID)
    }  
    
    console.log(params) 
    this.setData({
      params,
      DictName,
      single
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.GetRefByName('PropertyUsage')
    this.GetRefByName('Decoration')
  },
  //根据引用名获取用途类型字段数据
  GetRefByName(RefName){
    let _this = this
    let { PropertyUsageArray, DecorationArray} = this.data
    GetRefByName({ RefName }).then(res => {
      // console.log(res)
      wx.hideLoading();

      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          if (RefName =='PropertyUsage'){
            PropertyUsageArray.push(item.ItemValue)
          }else{
            DecorationArray.push(item.ItemValue)
          }
          
        })
        _this.setData({
          PropertyUsageArray,
          DecorationArray
        })
      }
      else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })

  },
  //输入框输入事件
  bindNameChange(e){
    let params = this.data.params
    let type = e.currentTarget.dataset.type 
    params[type] = e.detail.value
    this.setData({
      params
    })
  },
  // 朝向,产权类型,装修下拉框
  bindPickerChange(e){
    let { params, orientationsArray, PropertyUsageArray,DecorationArray } = this.data
    let type = e.currentTarget.dataset.type
    if (type == 'Direction'){
      params.Direction = orientationsArray[e.detail.value]
    } else if (type == 'PropertyUsage'){
      params.PropertyUsage = PropertyUsageArray[e.detail.value]
    }else{
      params.Decoration = DecorationArray[e.detail.value]
    }
    
    this.setData({
      params
    })
    console.log(e.detail.value)
  },
  //添加图片
  bingAddImg(e) {
    let _this = this
    wx.chooseImage({
      count: 1, // 只能一张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        let tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(tempFilePaths)
      },
      fail(e) {
        console.log(e)
      }
    });
  },
  // 调用上传接口
  uploadFile(path) {
    let _this = this;
    let { params, imgCropperArray } = this.data;
    console.log(imgCropperArray)
    wx.showLoading({
      title: '上传中',
    });
    _this.setData({
      iconLoading: true
    })

    wx.uploadFile({
      url: FileUpLoad,
      filePath: path,
      name: 'file',
      success(res) {
        console.log(res)
        let data = JSON.parse(res.data);
        if (data.result === 'success') {
          imgCropperArray = URL_PATH + data.sm_path.replace(/\|/, '') // URL_PATH 拼接图片地址，用来显示
          params.ImgUrl = imgCropperArray
          _this.setData({
            params
          });

          // $Message({ content: '上传成功', type: 'success' });
        } else {
          $Message({
            content: '上传失败',
            type: 'error'
          });
        };
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        })
      },
      fail(error) {
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        });
        $Message({
          content: '图片上传失败',
          type: 'error'
        });
      }
    })
  },
  // 点击完成
  bindSubmit(e) {
    let { params, EstateDictID } = this.data

    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });

    if (params.EstateDictID==undefined) {
      wx.setStorageSync('EstateDictByFilter', params)
      wx.navigateTo({
        url: '/page/PM/project/add-Allpreview/index'
      })
      this.setData({
        disabled: false,
        loading: false
      });
      // this.UpEstateDictByFilter();      // 批量修改
    } else {
      this.UpEstateDictByDictID();      // 个别修改
    }
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }

  },
  //根据字典id获取字典数据(单个)
  GetEstateDictByDictID(EstateDictID){
    let params = this.data.params
    wx.showLoading({ title: '加载中' });

    GetEstateDictByDictID({ EstateDictID}).then(res => {
      // console.log(res)
      wx.hideLoading();

      if (res.data.result === 'success') {
        let data = res.data.temptable[0]
        params.Square = data.Square
        params.PropertyUsage = data.PropertyUsage
        params.Direction = data.Direction
        params.Bedroom = data.Bedroom
        params.Livingroom = data.Livingroom
        params.Decoration = data.Decoration

        this.setData({
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
  
  //根据id编辑修改单个字典数据(单个)
  UpEstateDictByDictID(e) {
    let params = this.data.params;
    let EstateID = wx.getStorageSync('EstateID')
    wx.showLoading({ title: '加载中' });
    UpEstateDictByDictID(params).then(res => {
      // console.log(res)
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
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

  // 验证数据
  verifyData(data) {
    console.log(data)
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.Square, 'require')) {
      result.msg = '请填写面积';
      return result;
    };
    if (!_fgj.verify(data.PropertyUsage, 'require')) {
      result.msg = '请选择产权类型';
      return result;
    };
    if (!_fgj.verify(data.Direction, 'require')) {
      result.msg = '请选择朝向';
      return result;
    };
    if (!_fgj.verify(data.Bedroom, 'require')) {
      result.msg = '请填写房间';
      return result;
    };
    if (!_fgj.verify(data.Livingroom, 'require')) {
      result.msg = '请填写客厅';
      return result;
    };
    if (!_fgj.verify(data.Decoration, 'require')) {
      result.msg = '请填写装修';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';

    return result;
  },
})