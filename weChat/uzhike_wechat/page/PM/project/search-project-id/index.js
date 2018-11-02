import { GetCanDeclareProject } from '../../../../api/inquiry/project';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { // 筛选参数
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
    this.GetCanDeclareProject();
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
      this.GetCanDeclareProject();
    }, 300);
  },
  // 获取楼盘列表数据
  GetCanDeclareProject() {
    let { params } = this.data;

    this.setData({
      loading: true
    });

    GetCanDeclareProject(params).then(res => {
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
  //选择项目
  bindProjectSelector(e) {
    let { item } = e.target.dataset;

    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2]; // 上一个页面
    // 修改选中的项目
    prevPage.setData({
      ProjectData: item
    });
    wx.navigateBack();
  }
})