// pages/authorize/index.js
const { $Message } = require('../../../../components/base/index');
import { GetOpenID } from '../../../../api/login/login';

const app = getApp();

Page({
  data: {
  
  },
  onLoad: function (options) {

  },
  // 获取用户信息
  bindGetUserInfo(e) {
    let { userInfo } = e.detail;

    app.globalData.userInfo = userInfo
    
    this.getCode();
  },
  // 获取code
  getCode() {
    const _this = this;

    wx.showLoading({
      title: '正在登录',
    });
    wx.login({
      success(res) {
        if (res.code) {
          let data = {
            Code: res.code,
            needpurview: false
          };
          _this.getOpenID(data)
        }
      },
      fail(err) {
        console.log(err)
      }
    })
  },
  // 根据code获取openid
  getOpenID(data) {
    GetOpenID(data).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        let openID = res.data.openid;

        app.globalData.openID = openID;
        wx.setStorageSync('token', res.data.Token);
        $Message({ content: '登陆成功', type: 'success' });

        setTimeout(() => {
          wx.switchTab({
            url: '/pages/index/index'
          })
        }, 1200);
      } else {
        $Message({ content: res.data.msg, type: 'error' });
        setTimeout(() => {
          wx.navigateTo({
            url: '/pages/login/entry/index'
          });
        }, 1200);
      }
    })
  },
})