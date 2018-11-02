
import _fgj from '../../../../utils/util';
const { $Message } = require('../../../../components/base/index');
import { InsertContract, UpContract } from '../../../../api/compact/new';
import { GetContractByID } from '../../../../api/compact/detail';

import pickerData from './pickerData';

/**
 * 新建合同分为4个页面，根据不同的权限来判断是否需要填写下一页
 * 如果没有下一步信息填写的权限，就直接新建合同
 * 如果有，缓存当前页面已填写的数据，到下一页中再获取出来，最终一起上传
 * 
 * 新建合同一共有四种权限判断
 * Base	基本录入  0：禁止  1：允许
 * Business	业务录入  0：禁止  1：允许
 * Customer	客户录入  0：禁止  1：允许
 * Finance	财务录入  0：禁止  1：允许
 */

Page({
  data: {
    ContractID: '',           // 合同ID，有的话就是编辑
    params: {},               // 存储用户选中和输入的数据
    permission: {},           // 获取到的权限
    pickerCustType: pickerData.CustType,
    pickerCustTypeIndex: 0,
    pickerOwnerType: pickerData.OwnerType,
    pickerOwnerTypeIndex: 0,
    disabled: false,            // 防止重复提交
  },
  onLoad: function (options) {
    this.data.ContractID = options.ContractID || '';
    if (options.ContractID) {
      this.GetContractByID(options.ContractID);     // 根据合同id获取合同信息，回填
    } else {
      this.getPrevParamsData();   // 获取上一页保存的数据
    }
  },
  // 获取上一页保存的数据
  getPrevParamsData() {
    let _this = this;
    let params = this.data.params;

    wx.getStorage({
      key: 'newCompactData',
      success: function (res) {
        console.log('上一页的数据', res)
        if (res.data) {
          _this.data.params = Object.assign({}, params, res.data);
          _this.setData({
            permission: res.data.permission
          });
        }
      },
      fail: function (res) {
        console.log('获取缓存失败', res);
        wx.navigateBack();
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {
  },
  // 根据合同id获取合同信息，回填
  GetContractByID(ContractID) {
    wx.showLoading({
      title: '加载中'
    });
    GetContractByID({
      ContractID
    }).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        let temptable = data.temptable[0],
          property = '',
          propertyIndex = '',
          index = 0,
          map = ['CustType', 'OwnerType'];      //需要回填的picker选项

        // picker控件数据回填
        for (let key of map) {
          if (temptable[key]) {
            property = 'picker' + key;
            propertyIndex = 'picker' + key + 'Index';
            index = this.backfillPicker(this.data[property], temptable[key]);
            this.setData({
              [propertyIndex]: index
            });
          }
        }

        this.filterData(temptable);      // 过滤数据

        this.setData({
          params: temptable
        });
      } else {
        wx.navigateBack();
      }
    })
  },
  /**
   * picker控件数据回填
   * @params { Array }  data    数据源
   * @params { String } target  已经选中的值
   * @return { Number } i       选中的值对应数据源的下标
   */
  backfillPicker(data, target) {
    for (let i = 0, length = data.length; i < length; i++) {
      if (data[i].value === target) {
        return i;
      }
    };
    return 0;
  },
  // 过滤数据
  filterData(data) {
    let CustInfo = data.CustInfo.split('|');        // 拆分客户信息
    let OwnerInfo = data.OwnerInfo.split('|');      // 拆分业主信息

    data.CustName = CustInfo[0];
    data.CustTel = CustInfo[1];
    data.CustNumber = CustInfo[2];

    data.OwnerName = OwnerInfo[0];
    data.OwnerTel = OwnerInfo[1];
    data.OwnerNumber = OwnerInfo[2];
    data.ContractDates = data.ContractDate.split(' ')[0];
  },
  // picker选项组件返回值
  bindPickerChange(e) {
    console.log(e)
    let { type, index } = e.detail;
    // let pickerData = 'picker' + type;               // 根据类型拼接成选项字段
    let pickerIndex = 'picker' + type + 'Index';    // 根据类型拼接成选项字段

    this.data[pickerIndex] = index;     // 这里我只修改下标，完成的时候再根据下标拿选中的值
  },
  // 输入框返回值
  bindFieldChange(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;

    this.data.params[type] = value;
  },
  /**
   * 点击完成 or 下一步
   */
  bindSubmit() {
    let data = this.data;
    let params = {};
    let result = null;

    /**
     * picker选择器要根据下标获取当前选中的数据，拼接起来
     * CustInfo：客户信息，按照固定格式：联系人|联系电话|身份证号，填写保存
     * OwnerInfo：业主信息，按照固定格式：业主|联系电话|证件号，填写保存
     */
    params = Object.assign({}, this.data.params, {
      CustType: data.pickerCustType[data.pickerCustTypeIndex].value,
      OwnerType: data.pickerOwnerType[data.pickerOwnerTypeIndex].value,
      CustInfo: data.params.CustName + '|' + data.params.CustTel + '|' + data.params.CustNumber,
      OwnerInfo: data.params.OwnerName + '|' + data.params.OwnerTel + '|' + data.params.OwnerNumber,
    });

    console.log(params)

    result = this.verifyData(params);
    // 验证数据
    if (!result.status) {
      $Message({ content: result.msg, type: 'error' });
      return false;
    }

    /**
     * 这里需要跟进权限判断是去下一步还是直接完成
     * Finance = '1' 表示有权限录入财务内容
     * 要排除编辑操作
     */
    if (!params.ContractID && params.permission.Finance === '1') {
      wx.navigateTo({
        url: '../new-4/index'
      });
      // 缓存当前填写的数据，下一步的时候再获取出来使用
      wx.setStorage({
        key: 'newCompactData',
        data: params,
        fail: function (res) {
          wx.navigateBack();
          console.log('糟糕！缓存失败', e);
        }
      });
      return false;
    }

    /**--------------------------- */

    // 防止重复点击
    if (this.data.disabled) {
      return false;
    }
    this.setData({
      disabled: true
    });
    wx.showLoading({
      title: '保存中'
    });

    if (params.ContractID) {
      this.UpContract(params);        // 编辑
    } else {
      this.InsertContract(params);    // 新建
    }
  },
  // 新建合同
  InsertContract(params) {
    InsertContract(params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '新建成功!', type: 'success' });
        setTimeout(() => {
          wx.redirectTo({
            url: '../list/index'
          });
        }, 1000);
      } else {
        this.setData({
          disabled: false
        });
        $Message({ content: data.msg, type: 'error' });
      }
    });
  },
  // 编辑合同
  UpContract(params) {
    UpContract(params).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '编辑成功!', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } else {
        this.setData({
          disabled: false
        });
        $Message({ content: data.msg, type: 'error' });
      }
    });
  },
  /**
   * 验证用户填写的数据
   * @params { Object } data    数据源
   * @return { Object } result  返回状态和提示
   */
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };

    if (!_fgj.verify(data.CustName, 'require')) {
      result.msg = '客户姓名有误';
      return result;
    };
    if (!_fgj.verify(data.CustTel, 'phone')) {
      result.msg = '客户电话有误';
      return result;
    };
    if (!_fgj.verify(data.CustNumber, 'IDCard')) {
      result.msg = '客户身份证号有误';
      return result;
    };
    if (!_fgj.verify(data.OwnerName, 'require')) {
      result.msg = '业主姓名有误';
      return result;
    };
    if (!_fgj.verify(data.OwnerTel, 'phone')) {
      result.msg = '业主电话有误';
      return result;
    };
    if (!_fgj.verify(data.OwnerNumber, 'IDCard')) {
      result.msg = '业主身份证号有误';
      return result;
    };

    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})