
import { GetContractByID } from '../../../../api/compact/detail';


Page({
  data: {
    ContractID: '',           // 合同ID
    detail: {},           // 详细数据
    loading: false,           // 加载中
  },
  onLoad: function (options) {
    console.log(options)
    this.data.ContractID = options.ContractID || '84B5B092047148DB8FED11EC812B97F8';
    if (!options.ContractID) {
      wx.navigateBack();
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.GetContractByID(this.data.ContractID);       // 获取详细页数据
  },
  // 获取详细页数据
  GetContractByID(ContractID) {
    GetContractByID({
      ContractID
    }).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        let detail = data.temptable[0];

        this.filterData(detail);      // 过滤数据

        this.setData({
          detail,
          loading: true
        });
      } else {
        wx.navigateBack();
      }
    });
  },
  // 过滤数据
  filterData(data) {
    let CustInfo = data.CustInfo.split('|');        // 拆分客户信息
    let OwnerInfo = data.OwnerInfo.split('|');      // 拆分业主信息

    data.CustName = CustInfo[0];
    data.CustTel = CustInfo[1];
    data.CustNumber = CustInfo[2];

    data.OwnerName = OwnerInfo[0];
    data.OwnerTel = OwnerInfo[1];
    data.OwnerNumber = OwnerInfo[2];
    data.ContractDates = data.ContractDate.split(' ')[0];
  },
  // 显示更多操作
  bindActionSheet() {
    let _this = this;
    
    wx.showActionSheet({
      itemList: ['编辑'],
      success: function(res) {
        console.log(res)
        switch (res.tapIndex) {
          case 0:
            wx.navigateTo({
              url: `../new-1/index?ContractID=` + _this.data.ContractID
            });
            break;
          case 1:
            wx.navigateTo({
              url: `../financial-add/index?ContractID=` + _this.data.ContractID
            });
            break;
          default:
            console.log('这是不可能的');
        }
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },
  // 编辑
  bindEdit(e) {
    let path = e.currentTarget.dataset.path;

    console.log(path)

    wx.navigateTo({
      url: `../new-${path}/index?ContractID=` + this.data.ContractID
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
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