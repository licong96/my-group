
import { InsertCustLink } from '../../../../api/customer/add-link.js';
import _fgj from '../../../../utils/util.js';
const { $Message } = require('../../../../components/base/index');

Page({
  data: {
    params: {
      PriCustID: '',
    },
    pickerLinkType: [
      {
        label: '请选择关系',
        value: ''
      }, {
        label: '父亲',
        value: '父亲'
      }, {
        label: '母亲',
        value: '母亲'
      }, {
        label: '儿子',
        value: '儿子'
      }, {
        label: '女儿',
        value: '女儿'
      }, {
        label: '丈夫',
        value: '丈夫'
      }, {
        label: '妻子',
        value: '妻子'
      },
    ],
    pickerLinkTypeIndex: 0,
    loading: false,
    disabled: false,
  },
  onLoad: function (options) {
    let PriCustID = options.CustID || '';
    if (!PriCustID) {
      wx.navigateBack()
    };
    let params = this.data.params;

    params.PriCustID = PriCustID;
  },
  onReady: function () {
    
  },
  onShow: function () {
  },
  // 监听input改变
  changeInput(e) {
    let { type } = e.currentTarget.dataset;
    let params = this.data.params;

    params[type] = e.detail.value;
  },
  // 监听下拉选项
  bindPickerChange(e) {
    let index = e.detail.value;
    let { params, pickerLinkType, pickerLinkTypeIndex } = this.data;

    params.LinkType = pickerLinkType[index].value;

    this.setData({
      pickerLinkTypeIndex: index
    });
  },
  // 完成
  submit() {
    let params = this.data.params;
    let verify = this.verifyData(params);

    // console.log(params)

    if (!verify.status) {
      $Message({ content: verify.msg, type: 'error' });
      return false;
    }

    if (this.data.disabled) {
      return false;
    }

    this.setData({
      loading: true,
      disabled: true,
    });
    wx.showLoading({ title: '添加中' });

    InsertCustLink(params).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        // 通过上一个页面，添加关联人
        let pages = getCurrentPages();
        let prevPage = pages[pages.length - 2]; // 上一个页面
        let linkData = prevPage.data.linkData;

        linkData.push(params);
        
        prevPage.setData({
          linkData
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } 
      else {
        this.setData({
          loading: false,
          disabled: false,
        });
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.CustName, 'require')) {
      result.msg = '请填写客户姓名';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '手机号码有误';
      return result;
    };
    if (!_fgj.verify(data.LinkType, 'require')) {
      result.msg = '请选择关系';
      return result;
    };

    result.status = true;
    result.msg = '验证通过';

    return result;
  }
})
