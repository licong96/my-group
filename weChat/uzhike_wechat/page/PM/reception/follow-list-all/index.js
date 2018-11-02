
import data from '../../../../utils/pickerData';    // 保存所有选项数据
const { $Message } = require('../../../../components/base/index');
import { $wuxBackdrop } from '../../../../components/index';
import { GetFollowToPage, GetFollowByID } from '../../../../api/reception/follow-list-all';
import { URL_PATH } from '../../../../utils/config';

import pickerData from './pickerData';

Page({
  data: {
    params: {           // 筛选参数集
      page: 1
    },
    listData: [],
    downScreenData: [     // 筛选组件的数据
      {
        name: '人员',
        current: '',
        type: 'dep',
        data: []
      },
      {
        name: '排序',
        current: '',
        type: 'order',
        data: pickerData.order
      },
      {
        name: '时间',
        current: '',
        type: 'time',
        data: []
      },
    ],
    onceTime: null,         // 存储定时器
    loading: false,
    scrollLower: false,     // 显示上滑加载中
    isShowFollow: false,    // 是否打开跟进遮罩
    fullFollowData: {},     // 跟进遮罩里面的详细数据
    isPlayAudio: -1,        // 当前要播放的录音下标
  },
  onLoad: function (options) {
  },
  onReady: function () {
    setTimeout(() => {
      this.innerAudioContext = wx.createInnerAudioContext();
    }, 300);
  },
  onShow: function () {
    this.GetFollowToPage();
  },
  // 获取所有跟进
  GetFollowToPage() {
    let params = this.data.params;

    params.page = 1;
    GetFollowToPage(params).then(res => {
      if (res.data.result === 'success') {
        this.setData({
          listData: res.data.temptable,
          loading: true
        });
      } else {
        this.setData({
          listData: [],
          loading: true
        });
      }
    });
  },
  // 加载更多跟进数据 
  bindscrolltolower() {
    let { params, listData } = this.data;

    this.setData({
      scrollLower: true
    });
    params.page++;
    GetFollowToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.setData({
          listData: listData.concat(data),
          scrollLower: false
        });
      } else {
        this.setData({
          scrollLower: false
        });
      };
    });
  },
  // 根据跟进id获取跟进
  bindShowFollow(e) {
    let id = e.currentTarget.dataset.id;

    // 打开遮罩层
    this.setData({
      isShowFollow: true,
      fullFollowData: {}
    });

    GetFollowByID({
      ProjectReceptionFollowID: id
    }).then(res => {
      if (res.data.result === 'success') {
        let temptable = res.data.temptable;

        // 把数据处理一通，再合并
        let fullFollowData = Object.assign({}, temptable[0], this.fiterFollowData(temptable));

        console.log('fullFollowData', fullFollowData)

        this.setData({
          fullFollowData
        });
      } else {
        this.setData({
        });
      }
    })
  },
  /**
   * 把拿到的跟进详细数据，处理成三种类型
   * @params { Array }  arrData         原数据
   * @return { Object } fullFollowData  返回一个对象
   */
  fiterFollowData(arrData) {
    let fullFollowData = {
      FollowContent: '',
      imageData: [],
      audioData: []
    };

    if (arrData[0].FollowContent) {
      fullFollowData.FollowContent = arrData[0].FollowContent;
    }
    arrData.forEach(item => {
      if (item.FileUrl && item.FileType === '图片') {
        fullFollowData.imageData.push(URL_PATH + item.FileUrl)
      }
      if (item.FileUrl && item.FileType === '语音') {
        fullFollowData.audioData.push({
          path: URL_PATH + item.FileUrl,
          time: item.Remark
        });
      }
    });

    return fullFollowData;
  },
  // 关闭遮罩层
  bindColseFollow() {
    this.setData({
      isShowFollow: false,
      isPlayAudio: -1
    });
    // 停止录音的播放
    this.innerAudioContext.stop();
  },
  // 查看历史接待
  bindOpenDetail(e) {
    wx.navigateTo({
      url: '../history-reception/index?ProjectReceptionID=' + e.currentTarget.dataset.id
    });
  },
  // 打开跟进页面
  bindOpenFollow(e) {
    wx.navigateTo({
      url: '../follow-list/index?ProjectReceptionID=' + e.currentTarget.dataset.id
    });
  },
  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.GetFollowToPage();     // 获取列表数据
    }, 300);
  },

  /**
   * 筛选功能
   */
  // 报备列表筛选返回结果
  bindDownSelection(e) {
    let value = e.detail.value;
    let params = this.data.params;

    this.data.params = Object.assign({}, params, value);

    this.GetFollowToPage();
  },
  // 预览图片
  bindPreviewImage(e) {
    let { current } = e.currentTarget.dataset;
    let imageData = this.data.fullFollowData.imageData

    wx.previewImage({
      current,
      urls: imageData || []
    });
  },
  // 播放语音
  bindPlayAudio(e) {
    let { item, index } = e.currentTarget.dataset;

    this.setData({
      isPlayAudio: index
    });

    // 播放录音
    this.innerAudioContext.stop();
    this.innerAudioContext.src = item.path;
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
})