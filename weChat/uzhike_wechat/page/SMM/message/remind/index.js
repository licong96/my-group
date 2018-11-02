
import { GetNotifyDetailPageList } from '../../../../api/message/list';

/**
 * 接待提醒和报备提醒的布局是一样的，所有共用这个页面
 */

Page({
  data: {
    params: {
      Source: '',       // 当前的消息类型
      page: 1
    },
    listData: [],     // 数据列表
  },
  onLoad: function (options) {
    console.log(options)
    this.data.params.Source = options.Source || '';
    
    // 如果是接待提醒，修改title
    if (options.Source === 'reception') {
      wx.setNavigationBarTitle({
        title: '接待提醒'
      });
    }

    this.GetNotifyDetailPageList();     // 获取数据
  },
  onReady: function () {

  },
  onShow: function () {
  },
  // 获取数据
  GetNotifyDetailPageList() {
    GetNotifyDetailPageList(this.data.params).then(res => {
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;

        this.filterListData(temptable);     // 过滤数据

        this.setData({
          listData: temptable
        });
      }
    });
  },
  // 过滤数据
  filterListData(temptable) {
    temptable.forEach(item => {
      // 处理发送时间
      let date = new Date(item.RegDate);
      item.sendDate = `${date.getMonth() + 1}月${date.getDay()}日 ${date.getHours()}:${date.getMinutes()}`;

      // 处理内容
      if (typeof item.NContent === 'string') {
        let NContent = JSON.parse(item.NContent);
        item.NContentTitle = NContent.Title;
        item.NContentContent = NContent.Content;
      }
    });
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