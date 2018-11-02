const { $Message } = require('../../../../components/base/index');
import { GetDefaultDepartment } from '../../../../api/organizational/department.js';
import { UpCompanyStep } from '../../../../api/login/register.js';
import { InsertDefaultDepartment } from '../../../../api/login/organization';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    listData: [],
    checked: [],
    CID: '',
    disabled: false,      // 防止重复点击
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.data.CID = options.CID || '';
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getDefaultDepartment()
  },
  // 绑定checkbox事件
  checkboxChange: function (e) {
    this.setData({
      checked: e.detail.value
    });
  },
  // 获取默认组织架构
  getDefaultDepartment () {
    wx.showLoading({
      title: '加载中',
    })
    let params = { needpurview: false };
    GetDefaultDepartment(params).then(res => {
      let data = res.data
      if(data.reslut === 'success') {
        this.setData({
          listData: data.tempTable
        })
      } else {
        $Message({ content: '网络错误', type: 'error'})
      }
      wx.hideLoading()
    })
  },
  // 完成
  complete () {
    this.UpCompanyStep();             // 修改注册公司进度
    this.InsertDefaultDepartment();   // 新增默认部门
  },
  /**
   * 新增默认部门
   */
  InsertDefaultDepartment() {
    let checked = this.data.checked;
    let DeptName = checked.join('|');
    
    if (this.data.disabled) {
      return
    }
    this.data.disabled = true;
    wx.showLoading({
      title: '保存中',
    });

    InsertDefaultDepartment({
      DeptName 
    }).then(res => {
      this.data.disabled = false;
      wx.hideLoading();
      if (res.data.result === 'success') {
        // '../add-workspace/index',   // 下一步应该是去选择工作区，但是现在暂时没有工作区
        wx.switchTab({
          url: '/page/tabBar/home/index',
        });
      } else {
        $Message({ content: res.data.msg, type: 'error' })
      }
    });
  },
  /**
   * 修改注册公司进度
   */
  UpCompanyStep() {
    let data = {
      CID: this.data.CID,
      Step: 2,            // 当前步骤改成2
      needpurview: false
    }
    UpCompanyStep(data).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        console.log('修改公司进度成功');
      } else {
        $Message({ content: data.msg, type: 'error' });
      }
    })
  }
})