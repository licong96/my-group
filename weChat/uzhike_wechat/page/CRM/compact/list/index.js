
import { GetContractPageLists } from '../../../../api/compact/list';


Page({
  data: {
    params: {              // 筛选参数
      page: 1
    }, 
    listData: [],           // 列表数据
    downScreenData: [
      {
        name: '状态',
        current: '',
        type: 'status',
        data: [
          {
            label: '状态一',
            value: '状态一',
            checked: false
          },
          {
            label: '状态二',
            value: '状态二',
            checked: false
          },
          {
            label: '状态三',
            value: '状态三',
            checked: false
          },
        ]
      },
      {
        name: '类型',
        current: '',
        type: 'type',
        data: [
          {
            label: '类型一',
            value: '类型一',
            checked: false
          },
          {
            label: '类型二',
            value: '类型二',
            checked: false
          },
        ]
      },
      {
        name: '排序',
        current: '',
        type: 'sort',
        data: [
          {
            label: '排序一',
            value: '排序一',
            checked: false
          },
          {
            label: '排序二',
            value: '排序二',
            checked: false
          },
        ]
      },
      {
        name: '进度',
        current: '',
        type: 'progress',
        data: [
          {
            label: '进度一',
            value: '进度一',
            checked: false
          },
          {
            label: '进度二',
            value: '进度二',
            checked: false
          },
        ]
      },
    ],
    onceTime: null,         // 保存定时器
    loading: false,         // 数据加载中
    isListDataMore: true,   // 是否允许上滑加载更多列表数据
  },
  onLoad: function (options) {
    
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.GetContractPageLists();    // 获取合同列表
  },
  // 获取合同列表
  GetContractPageLists() {
    this.data.params.page = 1;
    GetContractPageLists(this.data.params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          loading: true,
          listData: data.temptable,
        });
      } else {
        this.setData({
          loading: true,
          listData: [],
        });
      }
      wx.hideLoading();
    });
  },
  // 上滑加载更多数据
  bindscrolltolower() {
    let { params, listData, isListDataMore } = this.data;

    if (!isListDataMore) {
      console.log('没有更多数据')
      return false;
    } 
    this.setData({
      loading: false
    });

    params.page++;
    GetContractPageLists(params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        let temptable = data.temptable || [];

        this.setData({
          listData: listData.concat(temptable),
          loading: true
        });
      } else {
        this.setData({
          loading: true
        });
        this.data.isListDataMore = false;
      };
    })
  },
  // 搜索返回结果，写了一个截留函数
  bindQuery(e) {
    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      this.data.params.likestr = e.detail.value;
      wx.showLoading({
        title: '搜索中'
      });
      this.GetContractPageLists();
    }, 300);
  },
  // 筛选项改变返回的值
  bindDownSelection(e) {
    let params = e.detail.value;
    console.log(params)
  },
  // 打开新建合同页面
  bindOpenNew() {
    wx.navigateTo({
      url: '../new-1/index'
    });
  },
  // 打开合同详细页
  bindOpenDetail(e) {
    let item = e.currentTarget.dataset.item;

    wx.navigateTo({
      url: '../detail/index?ContractID=' + item.ContractID
    });
  },

  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})