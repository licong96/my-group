// pages/project/apply-information/index.js
const { $Message } = require('../../../../components/base/index');
import { SubProjectUnion } from '../../../../api/project/partnership';
import _fgj from '../../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{

    },
    disabled: false,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ProjectID = options.ProjectID
    let params = this.data.params
    params.ProjectID = ProjectID
    this.setData({
      params
    })
  },

  onShow: function () {
  
  },
  //监听输入信息
  bindMessageChange(e){
    console.log(e.detail.value)
    let params = this.data.params
    params.Remark = e.detail.value
    this.setData({
      params
    })
  },
  //提交
  bindSubmit(e){
    let params = this.data.params
    let verify = this.verifyData(params);   // 验证数据
    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });
      SubProjectUnion(params).then(res => {
        this.setData({
          disabled: false,
          loading: false
        });
        if (res.data.result === 'success') {
          $Message({ content: '申请成功', type: 'success' });
          setTimeout(() => {
            wx.navigateBack();
          }, 1500);
        }
        else if (res.data.result === '权限不足') {
          $Message({ content: '权限不足，请先登录', type: 'success' });
        }
      })
    } else {
      $Message({ content: verify.msg, type: 'error' });
    }
  },
  // 验证数据
  verifyData(data) {
    console.log(data)
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.Remark, 'require')) {
      result.msg = '请填写信息';
      return result;
    };

    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  
})