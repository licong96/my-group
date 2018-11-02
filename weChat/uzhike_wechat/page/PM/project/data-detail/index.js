// pages/project/data-detail/index.js
const { $Message } = require('../../../../components/base/index');
import {  GetProjectDataByID } from '../../../../api/project/new-data';
import { URL_PATH } from '../../../../utils/config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    more:0,
    imgCropperArray:[],
    params:{}
  },

  onLoad: function (options) {
    let projectDataID = options.projectDataID
    this.GetProjectDataByID(projectDataID)
    this.setData({
      projectDataID
    })    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
    
  },

  // 获取需要编辑的数据
  GetProjectDataByID(ProjectDataID) {
    console.log(ProjectDataID)
    let { params, imgCropperArray } = this.data;
    wx.showLoading({ title: '加载中' });

    GetProjectDataByID({
      ProjectDataID
    }).then(res => {
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let data = res.data.temptable
        let newObj = Object.assign({}, params, temptable);

        data.forEach(item => {
          let imgData = { src: URL_PATH + item.Url, ProjectFileID: item.ProjectFileID }
          imgCropperArray.push(imgData)
        })
        this.setData({
          params: newObj,
          imgCropperArray,
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
//查看更多图片
  bindClickMore(e){
    console.log(e)
    let more= this.data.more
    if(more==1){
      more=0
    }else{
      more=1
    }
    this.setData({
      more
    })
  },
})