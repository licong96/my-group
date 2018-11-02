Page({
  data:{
    arr:[]
  },
  onLoad(){

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
})