
import { GetAllEmployee } from '../../../api/public';

Page({
  data: {
    listData: [],
    params: {             // 搜索内容
      likestr: ''
    },           
    onceTime: null,       // 定时器
    loading: true,        // 加载中
    onceHint: true,       // 显示搜索关键字提醒
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;
    let value = e.detail.value;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      if (value) {
        this.setData({
          onceHint: false
        });
        this.GetAllEmployee(params);
      } else {
        this.setData({
          onceHint: true,
          listData: []
        });
      }
    }, 300);
  },
  // 根据搜索的关键字获取列表数据
  GetAllEmployee(params) {
    this.setData({
      loading: false,
      listData: [],
    });
    GetAllEmployee(params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          listData: data.temptable,
          loading: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true
        })
      }
    });
  },
  // 点击选中
  bindClick(e) {
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];   // 获取上一个页面

    // 修改选中的人员，depORemp这个字段已经固定，不能修改，上一个页面必须要在data里面定义它
    prevPage.setData({
      depORemp: e.currentTarget.dataset.item
    });
    wx.navigateBack();
  },
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})