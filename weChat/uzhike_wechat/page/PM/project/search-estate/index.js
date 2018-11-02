import { GetEstateList } from '../../../../api/estate-dict/list';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { // 筛选参数
      num: 10, //需要读取的数据条
      likestr:''
    },
    listData: [],
    onceTime: null,
    loading: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    this.GetEstateList();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  // 搜索返回结果
  bindQuery(e) {
    let { params } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      })
      this.GetEstateList();
    }, 300);
  },
  // 获取楼盘列表数据
  GetEstateList() {
    let { params } = this.data;

    this.setData({
      loading: true
    });

    GetEstateList(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        this.setData({
          listData: data,
          loading: false
        })
      } else {
        this.setData({
          listData: [],
          loading: false
        })
      };
    })
  },
  //选择楼盘
  bindEstateSelector(e) {
    let { name, id } = e.target.dataset;

    let Estate = {
      EstateName: name,
      EstateID: id
    }
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; // 上一个页面
    // 修改选中的楼盘
    prevPage.setData({
      Estate: Estate
    });
    wx.navigateBack();
  }
})