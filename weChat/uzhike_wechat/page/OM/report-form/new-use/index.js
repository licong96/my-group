Page({
  data: {
    params: {

    },
    whoUseList: [], //谁可以使用
    sendTopList:[],  //发送给主管
    sendBottomList:[], //发送给员工
    depORemp:{}  //选中的人员信息
  },
  onLoad(options) {

  },
  onReady: function() {

  },
  onShow: function() {
    let { depORemp, whoUseList, sendTopList, sendBottomList } = this.data
    console.log(depORemp)
    if (depORemp.EmpID ==undefined) {   //depORemp为空时不操作
      return
    }
    let index = wx.getStorageSync('index')
    if(index == 0){
      whoUseList.push(depORemp)
    }else if(index == 1){
      sendTopList.push(depORemp)
    }else{
      sendBottomList.push(depORemp)
    }
    wx.removeStorageSync('index')
    console.log(whoUseList)
    this.setData({
      whoUseList,
      sendTopList,
      sendBottomList,
      depORemp:{}
    })
  },
  // 选择人物
  getPeople(e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('index', index)
    console.log(index)
    wx.navigateTo({
      url: '/page/public/select-dep-emp/index'
    })

  },

})