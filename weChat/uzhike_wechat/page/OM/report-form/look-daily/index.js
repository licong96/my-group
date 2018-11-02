Page({
  data:{
    typeCut: 0,               // 当前选择的操作类型
    typeData:['全部','未读','我发起','日报','周报','月报','月工作计划']
  },
  onLoad(){

  },
  onshow:function(){

  },
  // 切换顶部类型选项
  bindTypeCut(e) {
    let index = e.currentTarget.dataset.index;

    if (index !== this.data.typeCut) {
      this.setData({
        typeCut: index
      })
    }
  },

  // 更多操作
  bindOpenMore(e) {
    this.moreOperation(e.currentTarget.dataset.estateId);
  },
  // 列表更多操作
  moreOperation(EstateID) {
    let _this = this;

    wx.showActionSheet({
      itemList: ['查看所有日志', '跟进', '分享', '删除'],
      success: function (res) {
        // console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../new/index?EstateID=' + EstateID,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个楼盘吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelEstate(EstateID);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          case 2:
            // 添加字典
            wx.navigateTo({
              url: '/page/PM/project/add-dictionary/index?EstateID=' + EstateID,
            });
            break;
          case 3:
            // 字典管理
            wx.navigateTo({
              url: '/page/PM/project/dictionary-management/index?EstateID=' + EstateID,
            });
            break;
          default:
            console.log('tapIndex错误')
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
  * 用户点击右上角分享
  */
  onShareAppMessage: function () {
    
  }
})