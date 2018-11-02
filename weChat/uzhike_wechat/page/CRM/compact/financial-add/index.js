
import _fgj from '../../../../utils/util';
const { $Message } = require('../../../../components/base/index');
import { InsertContractRP } from '../../../../api/compact/add-financial';

import pickerData from './pickerData';

const DATE = new Date();                // 现在的时间
const NOW = _fgj.formatTimeDate(DATE);  // 处理格式成：2018-10-6

/**
 * 
 */

Page({
  data: {
    params: {
      ContractID: '',           // 合同ID
    }, 
    endDate: NOW,               // 结束时间
    FeeDate: NOW,               // 合同日期，默认今天
    pickerRPType: pickerData.RPType,
    pickerRPTypeIndex: 0,
    pickerObjectType: pickerData.ObjectType,
    pickerObjectTypeIndex: 0,
    pickerFeeType: pickerData.FeeType,
    pickerFeeTypeIndex: 0,
    disabled: false,            // 防止重复提交
  },
  onLoad: function (options) {
    this.data.params.ContractID = options.ContractID || '';
    if (!options.ContractID) {
      // wx.navigateBack({});
    }
  },
  onReady: function () {

  },
  onShow: function () {
  },
  // picker选项组件返回值
  bindPickerChange(e) {
    console.log(e)
    let { type, index } = e.detail;
    // let pickerData = 'picker' + type;               // 根据类型拼接成选项字段
    let pickerIndex = 'picker' + type + 'Index';    // 根据类型拼接成选项字段

    // this.data[pickerIndex] = index;     // 这里我只修改下标，完成的时候再根据下标拿选中的值

    this.setData({
      [pickerIndex]: index
    });
  },
  // 输入框返回值
  bindFieldChange(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;

    this.data.params[type] = value;
  },
  // 收付款日期
  bindDateChange(e) {
    this.setData({
      FeeDate: e.detail.value
    });
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
      RPType: data.pickerRPType[data.pickerRPTypeIndex].value,
      ObjectType: data.pickerObjectType[data.pickerObjectTypeIndex].value,
      FeeType: data.pickerFeeType[data.pickerFeeTypeIndex].value,
    });

    console.log(params)

    result = this.verifyData(params);
    // 验证数据
    if (!result.status) {
      $Message({ content: result.msg, type: 'error' });
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

    this.InsertContractRP(params);    // 新建
  },
  // 新建合同
  InsertContractRP(params) {
    InsertContractRP(params).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '新建成功!', type: 'success' });
        setTimeout(() => {
          wx.navigateTo({
            url: '../financial-list/index'
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

    if (!_fgj.verify(data.Fee, 'require')) {
      result.msg = '请填写收付款金额';
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