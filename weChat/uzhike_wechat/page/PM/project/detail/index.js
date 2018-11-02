// pages/project/detail/index.js
const { $Message } = require('../../../../components/base/index');
import { GetProjectDataList, DelProjectDataAndFile, GetProjectUnionByProject } from '../../../../api/project/detail';
import { GetProject } from '../../../../api/project/new';
import { URL_PATH } from '../../../../utils/config';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    ProjectID:'',
    SelectedIndex:0,
    GetPUnion: {  //根据项目获取合作状态

    },
    status:{

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let ProjectID = options.ProjectDataID
    this.data.ProjectID = ProjectID
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let ProjectID = this.data.ProjectID
    this.GetProject(ProjectID)
   
  },
  //根据项目id获取数据
  GetProject(e) {
    let { ProjectID, GetPUnion} = this.data;
    GetPUnion.ProjectID = ProjectID
    wx.showLoading({ title: '加载中' });
    GetProject({
      ProjectID
    }).then(res => {

      if (res.data.result === 'success') {
        let msg = res.data.temptable[0];
        msg.CoverImgUrl = URL_PATH + msg.CoverImgUrl;     // 拼接图片地址
        msg.Tag = msg.Tag.split("|")
        GetPUnion.CID = msg.CID
        this.setData({
          msg,
          GetPUnion
        });
        this.GetProjectUnionByProject()
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  // 根据ID获取项目所有资料
  GetProjectDataList(ProjectID) {
    GetProjectDataList({
      ProjectID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;
        console.log(data)
        this.setData({
          dataList: data,
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //根据项目获取合作状态
  GetProjectUnionByProject(e){
    let GetPUnion = this.data.GetPUnion
    let status = this.data.status
    GetProjectUnionByProject(GetPUnion).then(res => {
      if (res.data.result === 'success') {
        status.CanUnion = res.data.CanUnion
        status.status = res.data.status
        this.setData({
          status
        })
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //tab选择
  selectTab(e){
    let SelectedIndex = e.currentTarget.dataset.index
    let ProjectID = this.data.ProjectID
    this.setData({
      SelectedIndex
    })
    if (SelectedIndex==2){
      this.GetProjectDataList(ProjectID)
    }
  },
 // 更多操作
  bindOpenMore(e) {
    this.moreOperation(e.currentTarget.dataset.projectDataId);
  },
  //跳转详情
  bindOpenDetail(e){
    let projectDataID = e.currentTarget.dataset.projectDataId
    wx.navigateTo({
      url: '../data-detail/index?projectDataID=' + projectDataID,
    });
  },
  // 列表更多操作
  moreOperation(projectDataID) {
    let _this = this;
    let ProjectID = this.data.ProjectID
    wx.showActionSheet({
      itemList: ['编辑', '删除'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../new-data/index?ProjectID='+ProjectID+'&projectDataID=' + projectDataID,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个资料吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelProjectDataAndFile(projectDataID);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
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
  // 删除资料及文件
  DelProjectDataAndFile(projectDataID) {
    wx.showLoading({
      title: '正在删除',
    });
    DelProjectDataAndFile({
      projectDataID
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        this.GetProjectDataList(this.data.ProjectID);     // 获取楼盘列表数据
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    })
  },
  //申请合作
  forCooperation(e){
    wx.navigateTo({
      url: '../apply-information/index?ProjectID=' + this.data.ProjectID
    });
  }
})