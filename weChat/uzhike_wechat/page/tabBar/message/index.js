
import { GetNotifyPageList } from '../../../api/message/list';

/**
 * 消息来源 Source:
 * Declare = 报备消息
 * System  = 系统消息
 */

Page({
  data: {
    params: {           // 筛选数据条件
      likestr: '',
      page: 1
    },
    listData: [],       // 消息列表数据
    loading: false,     // 数据加载中
    onceTime: null,     // 定时器
  },
  onLoad: function (options) {
    
  },
  onReady: function () {

  },
  onShow: function () {
    this.GetNotifyPageList();         // 获取列表数据
  },
  // 获取列表数据
  GetNotifyPageList() {
    GetNotifyPageList(this.data.params).then(res => {
      this.setData({
        loading: true
      });
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;
        
        this.filterListData(temptable);     // 过滤数据

        this.setData({
          listData: temptable
        });
      } else {
        this.setData({
          listData: []
        });
      }
    });
  },
  // 过滤数据
  filterListData(temptable) {
    let NContent = '';

    temptable.forEach(item => {
      // NContent是一个json字符串，要的东西都在里面
      if (this.isJson(item.NContent)) {
        item.desc = JSON.parse(item.NContent).Content;
      }

      // 判断来源消息类型，显示对应的图标和颜色
      switch (item.Source) {
        case 'Declare':    // 报备提醒
          item.SourceBg = 'bg--red';
          item.SourceIcon = 'icon-naozhong';
        break;
        case 'System':    // 系统消息
          item.SourceBg = 'bg--orange';
          item.SourceIcon = 'icon-tixing';
        break;
        default:
          item.SourceBg = '';
          item.SourceIcon = '';
      }
    });
  },
  /**
   * 检测字符串是否为JSON格式
   * @params { String } str 目标字符串
   * @returan { Boolean } 返回是否正确
   */
  isJson(str) {
    if (typeof str !== 'string') {
      return false
    }
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  },
  // 查看消息详细
  bindList(e) {
    let item = e.currentTarget.dataset.item;

    if (item.Source === 'Declare') {
      wx.navigateTo({
        url: '/page/SMM/message/remind/index?Source=' + item.Source
      });
    }
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      });
      this.GetNotifyPageList();
    }, 300);
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
    console.log('监听用户下拉动作')
    // wx.stopPullDownRefresh();
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