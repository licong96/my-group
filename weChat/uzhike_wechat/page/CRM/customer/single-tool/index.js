
import { GetAllReceptionByTel, GetAllDeclareByTel } from '../../../../api/customer/single-tool';

/**
 * 跟进号码搜索明细
 * 这里是两个切换，我简单粗暴的同时获取了两种数据，然后进行显示隐藏
 * 如果要做的更优化的话，可以只获取当前选中项的数据，当切换的时候，再去获取对应的数据，并且防止重复获取
 */

Page({
  data: {
    CustTel: '',        // 客户手机号
    receptionData: [],  // 接待数据
    inquiryData: [],    // 接待数据
    tabCut: 0,          // tab切换索引
    isLoading1: false,  // 接待加载中
    isLoading2: false,  // 报备加载中
    onceTime: null,     // 储存定时器
    onceHint: true,     // 显示搜索关键字提醒
  },
  onLoad: function (options) {
    let CustTel = this.data.CustTel = options.CustTel;

    wx.showLoading({
      title: '加载中'
    });
    this.GetAllReceptionByTel(CustTel);    // 根据电话号码获取所有到访记录
    this.GetAllDeclareByTel(CustTel);      // 根据电话号码获取所有报备记录
  },
  onReady: function () {

  },
  onShow: function () {
  },
  onHide: function () {
  },
  // 没有手机号的时候可以触发搜索
  bindQuery(e) {
    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      let CustTel = e.detail.value;
      if (CustTel) {
        this.setData({
          onceHint: false
        });
        this.GetAllReceptionByTel(CustTel);    // 根据电话号码获取所有到访记录
        this.GetAllDeclareByTel(CustTel);      // 根据电话号码获取所有报备记录
      } else {
        this.setData({
          onceHint: true,
          receptionData: [],
          inquiryData: []
        });
      }
    }, 300);
  },
  // 根据电话号码获取所有到访记录
  GetAllReceptionByTel(CustTel) {
    this.setData({
      receptionData: [],
      isLoading1: false
    });
    GetAllReceptionByTel({
      CustTel
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        this.setData({
          receptionData: res.data.temptable,
          isLoading1: true
        });
      } else {
        this.setData({
          receptionData: [],
          isLoading1: true
        });
      }
    })
  },
  // 根据电话号码获取所有报备记录
  GetAllDeclareByTel(CustTel) {
    this.setData({
      inquiryData: [],
      isLoading2: false
    });
    GetAllDeclareByTel({
      CustTel: CustTel
    }).then(res => {
      if (res.data.result === 'success') {
        this.setData({
          inquiryData: res.data.temptable,
          isLoading2: true
        });
      } else {
        this.setData({
          inquiryData: [],
          isLoading2: true
        });
      }
    })
  },
  // 列表切换
  bindTabCut(e) {
    let index = Number(e.currentTarget.dataset.index);

    if (index !== this.data.tabCut) {
      this.setData({
        tabCut: index
      });
    }
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


/**
 * 判断工具，主要目的是查看接待详细，和报备详细，
 * 有两个路口可以进入：
 *     第一个是客户列表，需要接收客户手机
 *     第二个是功能路口，没有传客户手机号进来
 * 要判断是否有手机号，有传手机号过来不显示搜索，没有就需要进行搜索
 */