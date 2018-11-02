const { $Message } = require('../../../../components/base/index');
import { GetUnionProjectToPage, DelProject } from '../../../../api/project/list';
import { URL_PATH } from '../../../../utils/config';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {     // 筛选参数
      page: 1,
    },
    listData: [],
    onceTime: null,
    loading: false,
    scrollLower: true,    // 显示上滑加载中
  },

  onLoad: function (options) {
    
  },

  onShow: function () {
    this.GetUnionProjectToPage();     // 获取项目列表数据
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
      this.GetUnionProjectToPage();
    }, 300);
  },

  // 获取楼盘列表数据
  GetUnionProjectToPage() {
    let { params } = this.data;

    this.setData({
      loading: false
    });

    params.page = 1;
    GetUnionProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];
        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
        });

        this.setData({
          listData: data,
          loading: true
        })
        console.log(this.data.listData)
      } else {
        this.setData({
          listData: [],
          loading: true
        })
      };
    })
  },

  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    console.log(e)
    let { params, listData } = this.data;
    this.setData({
      scrollLower: false
    });
    params.page++;
    GetUnionProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl;     // 拼接图片地址
        });
        this.setData({
          listData: listData.concat(data),
          scrollLower: true
        })
      } else {
        this.setData({
          scrollLower: true
        })
      };
    })
  },


  // 打开详细页
  bindOpenDetail(e) {
    wx.navigateTo({
      url: '../detail/index?ProjectDataID=' + e.currentTarget.dataset.id,
    })
  },
  //添加项目
  bingAddProject(e){
    wx.navigateTo({
      url:'../new/index'
    })
  },
  // 更多操作
  bindOpenMore(e) {
    this.moreOperation(e.currentTarget.dataset.projectId);
  },
  // 列表更多操作
  moreOperation(projectId) {
    let _this = this;

    wx.showActionSheet({
      itemList: ['编辑', '删除','添加资料','合作关系'],
      success: function (res) {
        console.log(res.tapIndex)
        switch (res.tapIndex) {
          case 0:
            // 去编辑
            wx.navigateTo({
              url: '../new/index?projectId=' + projectId,
            });
            break;
          case 1:
            // 删除
            wx.showModal({
              title: '删除提醒',
              content: '您确定要删除这个楼盘吗？',
              success: function (res) {
                if (res.confirm) {
                  _this.DelProject(projectId);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          case 2:
            // 添加资料
            wx.navigateTo({
              url: '../new-data/index?projectId=' + projectId,
            });
            break;
          case 3:
            // 合作关系
            wx.navigateTo({
              url: '../partnership/index?projectId=' + projectId,
            });
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
  // 删除项目
  DelProject(projectId) {
    wx.showLoading({
      title: '正在删除',
    });
    DelProject({
      projectId
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        this.GetEstatePage();     // 获取楼盘列表数据
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    })
  },
})