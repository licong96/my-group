
import { GetLevelStock } from '../../../api/public';

/**
 * 搜索销控页面，返回选中的销控数据
 */

Page({
  data: {
    listData: [],
    params: {             // 搜索内容
      ProjectID: '',      // 项目ID，必传
      LevelType: '4',     // 数据级别  1：栋座  2：单元  3：楼层  4：房号
      likestr: ''
    },           
    onceTime: null,       // 定时器
    loading: true,        // 加载中
    onceHint: true,       // 显示搜索关键字提醒
  },
  onLoad: function (options) {
    if (!options.ProjectID) {
      wx.navigateBack();
    }
    this.data.params.ProjectID = options.ProjectID;
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
        this.GetLevelStock(params);
      } else {
        this.setData({
          onceHint: true,
          listData: []
        });
      }
    }, 300);
  },
  // 根据搜索的关键字获取列表数据
  GetLevelStock(params) {
    this.setData({
      loading: false,
      listData: [],
    });
    GetLevelStock(params).then(res => {
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

    // 修改选中的数据，LevelStock这个字段已经固定，不能修改，上一个页面必须要在data里面定义它
    prevPage.setData({
      LevelStock: e.currentTarget.dataset.item
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