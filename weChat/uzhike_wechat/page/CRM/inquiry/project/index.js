
const { $Message } = require('../../../../components/base/index');
import { $wuxBackdrop } from '../../../../components/index';
import _fgj from '../../../../utils/util';
import { GetCanDeclareProject, GetDeclareListToPage } from '../../../../api/inquiry/project';
import { InsertDeclare } from '../../../../api/inquiry/batch';
import { URL_PATH } from '../../../../utils/config';

import pickerData from './pickerData';      // 筛选数据

Page({
  data: {
    tabCut: '0',          // 列表切换
    projectData: [],      // 项目列表数据
    queryProject: {},     // 项目列表筛选参数
    inquiryData: [],      // 报备列表数据
    queryInquiry: {       // 报备列表筛选参数
      page: 1
    },
    onceTime: null,       // 保存定时器
    isInquiryMore: true,  // 是否有更多报备列表数据
    isLoading1: false,    // 项目列表是否加载完毕
    isLoading2: false,    // 报备列表是否加载完毕
    downScreenData: [     // 筛选组件的数据
      {
        name: '项目',
        current: '',
        type: 'ProjectID',
        data: []
      },
      {
        name: '状态',
        current: '',
        type: 'IsExp',
        data: pickerData.IsExp
      },
      {
        name: '排序',
        current: '',
        type: 'order',
        data: pickerData.order
      },
    ],
  },
  onLoad: function (options) {
    let tabCut = options.tabCut || '0';         // 默认显示报备项目页

    /**
     * 根据tabCut参数，切换显示
     */
    this.setData({
      tabCut
    });
  },
  onReady: function () {
  },
  onShow: function () {
    this.data.isInquiryMore = true;
    this.GetCanDeclareProject();    // 获取项目列表
    this.GetDeclareListToPage();    // 获取报备客户列表
  },
  // 列表切换
  bindTabCut(e) {
    let index = e.currentTarget.dataset.index;

    if (index !== this.data.tabCut) {
      this.setData({
        tabCut: index
      });
    }
  },

  /**
   * 报备项目功能
   */
  // 获取项目列表
  GetCanDeclareProject() {
    GetCanDeclareProject(this.data.queryProject).then(res => {
      if (res.data.result === 'success') {
        let downScreenData = this.data.downScreenData;
        let data = res.data.temptable;

        // 处理项目列表数据
        this.fillterProjectData(data);

        // 动态获取项目筛选条件
        downScreenData.forEach(item => {
          if (item.type === 'ProjectID') {
            item.data = [
              {
                label: '不限',
                value: '',
                checked: false
              },
            ].concat([], data);
          }
        });

        this.setData({
          projectData: data,
          downScreenData,
          isLoading1: true
        })
      } else {
        this.setData({
          projectData: [],
          isLoading1: true
        });
      }
    });
  },
  // 处理项目列表数据
  fillterProjectData(data) {
    // 添加label和value字段，用在筛选里面
    data.forEach(item => {
      item.label = item.ProjectName;
      item.value = item.ProjectID;
      item.CoverImgUrlPath = URL_PATH + item.CoverImgUrl;
    });
  },
  // 选择要报备的项目
  bindSelectProject(e) {
    let item = e.currentTarget.dataset.item;

    wx.setStorage({
      key: 'projectData',
      data: item,
      success() {
        wx.navigateTo({
          url: '../batch/index',
        });
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  // 项目列表搜索
  bindProjectQuery(e){
    let value = e.detail.value;
    let queryProject = this.data.queryProject;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      queryProject.likestr = value;
      this.GetCanDeclareProject();
    }, 300);
  },
  projectListLower() {
    console.log('projectListLower')
  },

  /**
   * 报备列表功能
   */
  // 获取报备客户列表
  GetDeclareListToPage() {
    let queryInquiry = this.data.queryInquiry;

    this.data.isInquiryMore = true;
    queryInquiry.page = 1;
    GetDeclareListToPage(queryInquiry).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理报备列表数据
        this.fillterInquiryData(data);

        this.setData({
          inquiryData: data,
          isLoading2: true
        })
      } else {
        this.setData({
          inquiryData: [],
          isLoading2: true
        });
      }
    });
  },
  // 处理报备列表数据
  fillterInquiryData(data) {
    data.forEach(item => {
      let ExpireDate = new Date(item.ExpireDate).getTime();
      let DeclareDate = new Date(item.DeclareDate).getTime();
      let hour = (ExpireDate - DeclareDate) / 1000 / 60 / 60;   // 计算还有多少个小时到期

      // 到期时间小于或等于一个小时，提醒
      if (hour <= 1) {
        item.expire = true;
      }
    });
  },
  // 加载更多报备列表
  inquiryListLower() {
    let { inquiryData, queryInquiry, isInquiryMore } = this.data;

    if (!isInquiryMore) {
      console.log('没有更多数据')
      return false;
    }

    queryInquiry.page++;
    GetDeclareListToPage(queryInquiry).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;

        // 处理报备列表数据
        this.fillterInquiryData(data);

        this.setData({
          inquiryData: inquiryData.concat([], data)
        });
      } else {
        this.data.isInquiryMore = false;
      }
    });
  },
  // 续报
  bindContinueInquiry(e) {
    let item = e.currentTarget.dataset.item;
    let params = {
      ProjectID: item.ProjectID,
      CustID: item.CustID,
      CustTel: item.Tel
    };
    wx.showLoading({
      title: '正在报备',
    });
    InsertDeclare(params).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: res.data.msg, type: 'success' });
        this.GetDeclareListToPage();
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    });
  },
  // 报备列表搜索
  bindInquiryQuery(e) {
    let value = e.detail.value;
    let queryInquiry = this.data.queryInquiry;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      queryInquiry.likestr = value;
      this.GetDeclareListToPage();
    }, 300);
  },
  // 报备列表筛选返回结果
  bindDownSelection(e) {
    let value = e.detail.value;
    let queryInquiry = this.data.queryInquiry;

    this.data.queryInquiry = Object.assign({}, queryInquiry, value);
    
    this.GetDeclareListToPage();
  },
  onHide: function () {
  
  },
  
})