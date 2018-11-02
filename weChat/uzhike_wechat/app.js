//app.js
App({

  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch: function() {
    // this.isToken();    // 验证是否有token
    
    // setTimeout(() => {
    //   wx.navigateTo({
    //     url: '/page/CRM/customer/follow/index',
    //     // url: '/page/CRM/compact/financial-add/index',
    //     // url: '/page/public/select-dep-emp/index',
    //   });
    // }, 1000)
  },

  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow: function(options) {
    // console.log('app onShow')

    console.log('globalData', this.globalData)
  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function() {
    // 每次退出都要清除token
    // wx.removeStorageSync('token');     // 开发环境暂时关闭
  },

  /**
   * 验证是否有token
   */
  isToken() {
    var token = wx.getStorageSync('token');
    if (!token) {
      wx.navigateTo({
        url: '/page/SMM/login/entry/index'
      });
    } else {
      this.globalData.token = token;
    }
  },
  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    openID: '',
    token: 'B0qWl/j/Kk3kDEfRN89y2WJaIb7FobMbL52AVem09yz89ug7KP/oInciFF5zc9G9u8CrX6M7qepo7y9Q6Qe/fueyrr5wnfJHk8inPfmnZ2AnqprAVS7l2SRpcjnRMt56SBRJuSE2JjbNrsVVQs3141UadsYELQMNfzA9eOvH3n86x7u8cvwL0DblLdd5hQ9Y38D5crOsz6kDsJXAklMlhm8laRUriJn2uN6pm2IvYXQf7iTfS9NkFgZ5k0RNk/RI94H/vEiNVVD8W/zXPwdvLqa6QzgCuTwjYVSkI3fg3HsZPsEVcu2duTLTSt9kxtP/XtAOvMrqnpiEe+Ln0vmpep5fkRtVMIR6WBfvjx7+YSv6KHFr73XEX1Qs75ctoQ5Y855rT6mJYf95WxriVzrAwd+aYfcbKVdGX15tomp9VraCUPty9xGbahR1CVvlQ6Yx80aq6BiOLCZ0MJ7STRjxEvRF05Dx0K+Nxvyp2RBVCi20s4PJBHb9B4saYYNjlS/za6G6RdLN02Ar3vaKzQ+JKzjEnKUMcpQpmEFZjfgj3T7UcomHs8kbKKfbGHokH08EmAILXLqnEJpJgSrUe+eie0LZ32Ayf47OK3s6wHi2yzA1qP+YrFVxW3wAY8wb9hlW5stU79wqLQqgpSn8nRQXnLVGDz6p2vlbR09j8TPfpvKKFZUEcEOnlkI9IzTVHgQ2XdnC+0xOoAkTtCqB5G/giiBaGSIYgjNk/u6s7+Jsz0LeKIlx3lpjsTQyE9DaXqCrODgxTnf6seiNwZr6NmpZvkXlS8U6H+KXxkJt+BHUt8s2veeTi2rNZCGZmwBNjjo950lu/Lncdu/3WSKBFfhXMg==',
  },
  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function(msg) {

  },
  //去重数组
  removeSameArray(arr) {
    var unique = {};
    arr.forEach(function(a) {
      console.log(JSON.stringify(a))
      unique[JSON.stringify(a)] = 1
      console.log(unique)
    });
    arr = Object.keys(unique).map(function(u) {
      return JSON.parse(u)
    });
    return arr
  }
})