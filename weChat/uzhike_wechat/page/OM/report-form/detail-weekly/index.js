Page({
  data:{
    photoArray: ['../../../../images/emp-img.jpg', '../../../../images/emp-img.jpg', '../../../../images/emp-img.jpg'],
  },
  onLoad(){
    wx.setNavigationBarTitle({
      title: '王二小的周报'
    });
  },
  onshow:function(){

  },
  //跳转到创建模板
  goToDaily(e) {
    wx.navigateTo({
      url: '../new/index',
    })
  },
  //跳转到日报
  goToDaily(e){
    wx.navigateTo({
      url: '',
    })
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
   
})