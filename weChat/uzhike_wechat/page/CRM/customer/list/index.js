
const { $Message } = require('../../../../components/base/index');
import { $wuxBackdrop } from '../../../../components/index';
import { GetCustPage } from '../../../../api/customer/list.js';
import { GetFollowByCustID } from '../../../../api/customer/follow-list.js';
import { URL_PATH } from '../../../../utils/config';

import pickerData from './pickerData';

Page({
  data: {
    listData: [],   // 列表数据
    params: {       // 筛选项
      page: 1,
      NeedType: '求购'
    },
    followOneData: {},    // 显示最新一条跟进数据
    isPlayAudio: -1,      // 当前正在播放的录音
    isOpenFollow: false,
    downScreenData: [     // 筛选组件的数据
      {
        name: '求购',
        current: '求购',
        type: 'NeedType',
        data: pickerData.NeedType
      },
      {
        name: '类型',
        current: '',
        type: 'FlagStatus',
        data: pickerData.FlagStatus
      },
      {
        name: '排序',
        current: '',
        type: 'order',
        data: pickerData.order
      },
      {
        name: '更多',
        current: '',
        type: 'more',
        data: []
      },
    ],
    screenData: [        // 更多筛选数据
      {
        title: '筛选年龄',
        type: 'Age',
        data: pickerData.Age
      }, {
        title: '筛选婚姻状况',
        type: 'Marriage',
        data: pickerData.pickerMarriage
      }, {
        title: '筛选子女状况',
        type: 'Children',
        data: pickerData.pickerChildren
      }, {
        title: '筛选收入水平',
        type: 'Income',
        data: pickerData.pickerIncome
      }, {
        title: '筛选工作职业',
        type: 'Occupation',
        data: pickerData.pickerOccupation
      }, {
        title: '筛选休息情况',
        type: 'Rest',
        data: pickerData.pickerRest
      }, {
        title: '筛选资产情况',
        type: 'Assets',
        data: pickerData.pickerAssets
      }, {
        title: '筛选投资情况',
        type: 'Investment',
        data: pickerData.pickerInvestment
      }, {
        title: '筛选决策人情况',
        type: 'Decision',
        data: pickerData.pickerDecision
      }, {
        title: '筛选看房经历',
        type: 'LookHouse',
        data: pickerData.pickerLookHouse
      }, {
        title: '筛选客户等级',
        type: 'Grade',
        data: pickerData.pickerGrade
      }, {
        title: '筛选客户来源',
        type: 'Source',
        data: pickerData.pickerSource
      }, {
        title: '筛选委托情况',
        type: 'Trust',
        data: pickerData.Trust
      },
    ],
    onceTime: null,
    loading: false,
    isInquiryMore: true,   // 是否有更多报备列表数据
    scrollLower: false,    // 显示上滑加载中
    checkedData: [],       // 存储批量操作选中的客户ID
  },
  onLoad: function (options) {
  },
  onReady: function () {
    setTimeout(() => {
      this.screenMore = this.selectComponent('#screenMore');
      this.innerAudioContext = wx.createInnerAudioContext();
    }, 100); 
  },
  onShow: function () {
    this.data.isInquiryMore = true;
    this.getCheckedData();    // 获取批量操作已选中的客户ID
  },
  // 获取批量操作已选中的客户ID
  getCheckedData() {
    wx.getStorage({
      key: 'checkedData',
      success: function (res) {
        // console.log('checkedData', res.data)
        if (res.data.length) {
          this.setData({
            checkedData: res.data
          });
        }
      }.bind(this),
      complete: function () {
        this.GetCustPage();     // 获取客户分页数据
      }.bind(this)
    });
  },
  onHide: function () {
  },
  // 获取客户分页数据
  GetCustPage() {
    let { params } = this.data;

    this.setData({
      loading: false
    });
    this.data.isInquiryMore = true;
    params.page = 1;
    GetCustPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.filterData(data);     // 处理分页数据

        console.log('data', data);

        this.setData({
          listData: data,
          loading: true,
          scrollLower: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true,
          scrollLower: true
        });
      };
    })
  },
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    let { params, listData, isInquiryMore } = this.data;

    if (!isInquiryMore) {
      console.log('没有更多数据')
      return false;
    }

    this.setData({
      scrollLower: false
    });
    params.page++;
    GetCustPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.filterData(data);     // 处理分页数据

        this.setData({
          listData: listData.concat(data),
          scrollLower: true
        });
      } else {
        this.setData({
          scrollLower: true
        });
        this.data.isInquiryMore = false;
      };
    })
  },
  // 处理分页数据
  filterData(data) {
    let { checkedData, params } = this.data;

    data.forEach(item => {
      for (let key of Object.keys(item)) {
        if (item.GNeedType === '1' && params.NeedType === '求购') {
          item[key.replace(/^G/, '')] = item[key];      // 去掉首字母，已做显示
          item.NeedType = '求购';
        }
        if (item.ZNeedType === '1' && params.NeedType === '求租') {
          item[key.replace(/^Z/, '')] = item[key];      // 去掉首字母，已做显示
          item.NeedType = '求租';
        }
        if (item.XNeedType === '1' && params.NeedType === '装修') {
          item[key.replace(/^X/, '')] = item[key];      // 去掉首字母，已做显示
          item.NeedType = '装修';
        }
      }

      // 批量操作是否选中
      if (checkedData.indexOf(item.CustID) !== -1) {
        item.checked = true;
      }
    });
  },
  // 打开添加页面
  bindOpenAdd() {
    wx.navigateTo({
      url: '../new/index'
    })
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.GetCustPage();
    }, 300);
  },
  // 列表筛选返回结果
  bindDownSelection(e) {
    let value = e.detail.value;
    let params = this.data.params;

    this.data.params = Object.assign({}, params, value);
    this.GetCustPage();
  },
  // 是否打开更多筛选 
  bindMoreSelection(e) {
    this.screenMore.show();
  },
  // 更多筛选，重置
  bindScreenReset(data) {
    // 清空筛选
    let params = {
      page: 1,
      NeedType: '求购'
    };

    // 清空已选中的列表
    let downScreenData = this.data.downScreenData;

    for (let obj of downScreenData) {
      if (obj.data.length) {
        obj.data.forEach(item => {
          item.checked = false
        });
      }
    }

    this.setData({
      params,
      downScreenData
    });
    this.GetCustPage();     // 获取列表数据
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    let option = data.detail.option;
    let params = this.data.params;
    
    this.data.params = Object.assign({}, params, option);
    this.GetCustPage();     // 获取列表数据
  },
  // 打开详细页
  bindOpenDetail(e) {
    let CustID = e.currentTarget.dataset.custid;

    wx.navigateTo({
      url: '../detail/index?CustID=' + CustID
    });
  },

  /**
   * 客户跟进操作
   */
  // 播放语音
  bindPlayAudio(e) {
    let { audio, index, audioIndex } = e.currentTarget.dataset;
    let currentIndex = index + '' + audioIndex;

    this.setData({
      isPlayAudio: currentIndex
    });

    // 播放录音
    this.innerAudioContext.stop();
    this.innerAudioContext.src = audio.path;
    this.innerAudioContext.play();
    this.innerAudioContext.onEnded(() => {
      this.setData({
        isPlayAudio: -1
      });
    });
    this.innerAudioContext.onError((res) => {
      this.setData({
        isPlayAudio: -1
      });
    });
  },
  // 显示跟进详细卡片
  bindShowFollow(e) {
    let { index, item } = e.currentTarget.dataset;
    let listData = this.data.listData;

    listData[index].isOpenFollow = true;
    listData[index].followLoading = false;    // 加载中
    
    this.setData({
      listData
    });
    this.GetFollowByCustID(item.CustID, index);
  },
  // 关闭跟进详细卡片
  bindCloseFollow(e) {
    let index = e.currentTarget.dataset.index;
    let listData = this.data.listData;
    
    listData[index].isOpenFollow = false;

    this.setData({
      listData
    })
  },
  // 根据客户ID获取跟进
  GetFollowByCustID(CustID, index) {
    let listData = this.data.listData;

    GetFollowByCustID({
      CustID,
      top: 1
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable[0] || {};

        this.filterFollowData(data);    // 处理跟进数据

        listData[index].followOneData = data;
        listData[index].followLoading = true;

        console.log(listData)

        this.setData({
          listData
        });
      } else {
        listData[index].followOneData = {};
        listData[index].followLoading = true;
        this.setData({
          listData
        });
      };
      console.log(listData)
    });
  },
  // 处理跟进数据
  filterFollowData(data) {
    if (data.FollowContent) {
      data.FollowContent = data.FollowContent;
    }
    if (data.FileUrl && data.FileType === '图片') {
      data.imageData = [URL_PATH + data.FileUrl];
    }
    if (data.FileUrl && data.FileType === '语音') {
      data.audioData = [{
        path: URL_PATH + data.FileUrl,
        time: data.Remark
      }];
    }
  },
  // 预览图片
  bindPreviewImage(e) {
    let { item, current } = e.currentTarget.dataset;
    
    wx.previewImage({
      current,
      urls: item || []
    });
  },
  // 查看更多跟进
  bindOpenFollowList(e) {
    let item = e.currentTarget.dataset.item;
    wx.navigateTo({
      url: '../follow-list/index?CustID=' + item.CustID
    });
  },
  // 打开更多操作
  bindshowActionSheet(e) {
    let item = e.currentTarget.dataset.item;
  },

  /**
   * 拨号
   */
  bindPhoneCall(e) {
    wx.makePhoneCall({
      phoneNumber: e.currentTarget.dataset.tel
    })
  },

  /**
   * 明细
   */
  bindOpenSingleTool(e) {
    let Tel = e.currentTarget.dataset.tel;

    wx.navigateTo({
      url: '../single-tool/index?CustTel=' + Tel
    });
  },

  /**
   * 处理报备相关功能
   */
  // 点击批量操作
  bindBatchOperation(e) {
    let { item, index } = e.currentTarget.dataset;
    let { listData, checkedData } = this.data;
    let subIndex = checkedData.indexOf(item.CustID);    // 当前点击的客户在已选中的数据里面的下标

    // 判断当前点击的客户是否已存在
    if (subIndex === -1) {
      checkedData.push(item.CustID);
      item.checked = true;
    } else {
      checkedData.splice(subIndex, 1);
      item.checked = false;
    }

    // 修改数据状态
    listData.splice(index, 1, item);

    this.setData({
      listData,
      checkedData
    });

    // 缓存选中的客户ID
    wx.setStorage({
      key: 'checkedData',
      data: checkedData
    });
  },
  // 点击浮动的操作按钮，去批量操作
  catchFixedBtn() {
    wx.navigateTo({
      url: '../../inquiry/batch/index',
    });
  },
})