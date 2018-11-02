const { $Message } = require('../../../../components/base/index');
import _fgj from '../../../../utils/util';
import { $wuxBackdrop } from '../../../../components/index';
import { GetProjectUnionCompanyToPage, UpProjectUnion } from '../../../../api/project/partnership';
import {  URL_PATH } from '../../../../utils/config';


Page({

  /**
   * 页面的初始数据
   */
  data: {
    params:{
      page:1,
      BeginDate: _fgj.beFormatTimeDate(new Date()),
      EndDate: _fgj.formatTimeDate(new Date()),
      FlagStatus:''
    },
    ProjectUnion:{  //合作关系

    },
    FlagStatusArray: [    // 类型
      {
        label: '请选择类型',
        value: '',
        checked: true
      },
      {
        label: '待审核',
        value: '待审核',
        checked: true
      },
      {
        label: '已合作',
        value: '已合作',
        checked: true
      },
      {
        label: '已拒绝',
        value: '已拒绝',
        checked: true
      }
    ],
    screenOpen: false,   // 是否打开筛选项
    listData: [],
    onceTime: null,
    loading: false,
    scrollLower: true,    // 显示上滑加载中
  },

  onLoad: function (options) {
    let params = this.data.params
    params.ProjectID = options.projectId

    this.GetProjectUnionCompanyToPage();
    console.log(_fgj.formatTimeDate(new Date()))
  },
  onReady: function () {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
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
      this.GetProjectUnionCompanyToPage();
    }, 300);
  },
  //分页获取项目所有合作公司
  GetProjectUnionCompanyToPage(e) {
    let { params } = this.data;

    this.setData({
      loading: false
    });

    params.page = 1;
    GetProjectUnionCompanyToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CLogo;     // 拼接图片地址
        });

        this.setData({
          listData: data,
          loading: true
        })
        console.log(data)
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
    GetProjectUnionCompanyToPage(params).then(res => {
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
  //日期选择
  bindTimeChange(e){
    console.log(e)
    let params = this.data.params
    let type = e.currentTarget.dataset.type
    params[type] = e.detail.value
    if (params.BeginDate > params.EndDate){
      $Message({ content: '开始时间不能大于结束时间', type: 'error' });
      params.BeginDate = ''
    }
    this.setData({
      params
    })
    this.GetProjectUnionCompanyToPage();
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    console.log(e)
    let { index } = e.currentTarget.dataset;
    let { screenOpen } = this.data;

    this.screenMore.hide();
    screenOpen ? '' : this.retainBackdrop();    // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      down: index,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let { params } = this.data;
    let { type } = e.currentTarget.dataset
    let { value } = e.detail;
    let SelectedValue = e.detail.value
    params[type] = value;

    this.setData({
      SelectedValue,
      params
    });
    this.GetProjectUnionCompanyToPage();     // 获取项目列表
    this.bindBackdrop();        // 选中后收起筛选项
  },
  // 更多筛选，重置
  bindScreenReset(data) {
    console.log(data)
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    console.log(data)
    this.GetProjectToPage();     // 获取楼盘列表数据
  },
  // 保持遮罩
  retainBackdrop() {
    this.$wuxBackdrop.retain()
  },
  // 释放遮罩
  releaseBackdrop() {
    this.$wuxBackdrop.release()

  },
  // 点击遮罩
  bindBackdrop() {
    this.releaseBackdrop();
    this.setData({
      screenOpen: false,
      down: 4
    });
  },
  // 更多操作
  bindOpenMore(e) {
    let { projectUnionId, status } = e.currentTarget.dataset
    let ProjectUnion = this.data.ProjectUnion
    ProjectUnion.ProjectUnionID = projectUnionId
    console.log(e.currentTarget.dataset)
    let _this = this;
    let itemListArray = []
    if (status == '待审核'){  
      itemListArray = ['同意','拒绝']
    }else if(status == '已拒绝'){
      itemListArray = ['同意']
    }else{
      itemListArray = ['终止合作']
    }

    wx.showActionSheet({
      itemList: itemListArray,
      success: function (res) {
        console.log(res.tapIndex)
        if (status == '待审核'){
          switch (res.tapIndex) {
            case 0:
              // 同意
              ProjectUnion.FlagStatus = '已合作'
              _this.UpProjectUnion(ProjectUnion)
              break;
            case 1:
              // 拒绝            
              ProjectUnion.FlagStatus = '已拒绝'
              _this.UpProjectUnion(ProjectUnion)
              break;
            default:
              console.log('tapIndex错误')
          }
        } else if (status == '已拒绝'){
          ProjectUnion.FlagStatus = '已合作'
          _this.UpProjectUnion(ProjectUnion)
        }else{
          ProjectUnion.FlagStatus = '已拒绝'
          _this.UpProjectUnion(ProjectUnion)
        }  
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  // 合作审核
  UpProjectUnion(ProjectUnion) {

    UpProjectUnion(ProjectUnion).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '审核成功', type: 'success' });
        this.GetProjectUnionCompanyToPage();     // 获取列表数据
      } else {
        $Message({ content: '审核失败', type: 'error' });
      };
    })
  },
})