const { $Message } = require('../../../../components/base/index');
import { GetOpenID } from '../../../../api/login/login';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: ['人事', '行政', '市场', '技术', '总经办', '客服'],
    params: {
      needpurview: false
    },
    openID: '',
    isDisabled: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  // 获取用户信息
  bindGetUserInfo(e) {
    let { userInfo } = e.detail;
    let types = e.currentTarget.dataset.types;    // 需要跳转的页面路径

    // 必须要获取到用户信息
    if (!userInfo || this.data.isDisabled) {
      return
    }
    app.globalData.userInfo = userInfo;
    this.data.isDisabled = true;

    this.getCode(types);
  },
  // 获取code
  getCode(types) {
    const _this = this;

    wx.showLoading({
      title: '稍等',
    });
    wx.login({
      success(res) {
        if (res.code) {
          let data = {
            Code: res.code,
            needpurview: false
          };
          _this.getOpenID(data, types)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 根据code获取openid
  getOpenID(data, types) {
    GetOpenID(data).then(res => {
      wx.hideLoading();
      this.data.isDisabled = false;
      if (res.data.result === 'success') {

        app.globalData.openID = res.data.OpenID;

        wx.navigateTo({
          url: `../${types}/index`
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
})