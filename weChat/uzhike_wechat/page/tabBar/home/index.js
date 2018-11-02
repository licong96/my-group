Page({

  /**
   * 页面的初始数据
   */
  data: {
    num: 1,
    city: '',
    weather: ''
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
  // 切换样式
  changeStyle (e) {
    this.setData({
      num: e.target.dataset.num
    })
  }
})