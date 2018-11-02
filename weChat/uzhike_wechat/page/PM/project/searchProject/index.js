const {
  $Message
} = require('../../../../components/base/index');
import {
  $wuxBackdrop
} from '../../../../components/index';
import {
  GetProjectToPage,
  DelProject
} from '../../../../api/project/list';
import {
  MAP_KEY,
  URL_PATH
} from '../../../../utils/config';
import {
  GetAllCityList,
  GetCityByStr,
  GetCityIDByName,
  GetDistrictByCityID
} from '../../../../api/public';

const QQMapWX = require('../../../../utils/qqmap-wx-jssdk.min.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: { // 筛选参数
      page: 1,
    },
    citySelector: {
      CityName: ''
    },
    index: 0,
    listData: [],
    DistrictName: [], // 区域
    selectedArray: {},
    selectedMoreArray: {},
    src: 'http://app.vipfgj.com/upfile/20180423/8465CEA278D34DC298FA7B87C7D908A9.jpg',
    typeData: [ // 类型
      {
        label: '请选择类型',
        value: '',
        checked: true
      },
      {
        label: '商铺',
        value: '商铺',
        checked: true
      },
      {
        label: '写字楼',
        value: '写字楼',
        checked: true
      },
      {
        label: '公寓',
        value: '公寓',
        checked: true
      },
      {
        label: '住宅',
        value: '住宅',
        checked: true
      }
    ],
    order: [ // 排序
      {
        label: '请选择排序',
        value: '',
        checked: true
      }, {
        label: '最新发布',
        value: 'RegDate-Desc',
        checked: true
      }, {
        label: '有效期最长',
        value: 'DeclareProtectDays-Desc',
        checked: true
      }
    ],
    screenOpen: false, // 是否打开筛选项
    screenIndex: -1, // 显示哪个筛选项
    DeclareTypeArray: [{
      label: '全号',
      value: 0
    }, {
      label: '全/隐号混合',
      value: 1
    }],
    CommissionModeArray: [{
      label: '体外刷筹',
      value: '体外刷筹'
    }, {
      label: '体内刷筹',
      value: '体内刷筹'
    }],
    NeedBringCustAarray: [{
      label: '需要',
      value: '1'
    }, {
      label: '不需要',
      value: '0'
    }],
    onceTime: null,
    loading: false,
    isLocation: false, // 获取位置
    scrollLower: true, // 显示上滑加载中
  },

  onReady: function() {
    this.$wuxBackdrop = $wuxBackdrop('#wux-backdrop', this);
    this.screenMore = this.selectComponent('#screenMore');
  },
  onLoad: function(options) {
    this.getSetting(); // 获取地理位置
  },

  onShow: function() {
    let {
      params,
      citySelector
    } = this.data;
    console.log(citySelector)
    // 判断是否选择了新的城市
    if (citySelector.CityID && citySelector.CityName !== params.CityName) {
      this.GetDistrictByCityID(citySelector.CityID);
      params.DistrictName = '';
      params.CityID = citySelector.CityID;
      this.setData({
        params
      });
    };
    this.GetProjectToPage(); // 获取楼盘列表数据
  },
  // 列表滚动到底部，加载下一页
  bindscrolltolower(e) {
    console.log(e)
    let {
      params,
      listData
    } = this.data;
    this.setData({
      scrollLower: false
    });
    params.page++;
    GetProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        console.log(res.data.temptable)
        let data = res.data.temptable || [];
        console.log(data)
        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl; // 拼接图片地址
          item.imgSrc = URL_PATH + item.CLogo; // 拼接logo图片地址
        });

        listData.concat(data)
        this.setData({
          listData,
          loading: true
        })
      } else {
        let data = res.data.temptable || [];
        listData.concat(data)

        console.log(111)
        this.setData({
          listData,
          loading: true,
          scrollLower: true
        })
      };
    })
  },
  //跳转详情
  bindOpenDetail(e) {
    let projectId = e.currentTarget.dataset.projectId
    wx.navigateTo({
      url: '../detail/index?ProjectDataID=' + projectId
    })
  },

  // 打开选择城市页面
  bindOpenCity() {
    wx.navigateTo({
      url: '../../estate-dict/city/index'
    })
  },
  // 搜索返回结果
  bindQuery(e) {
    let {
      params
    } = this.data;

    this.data.onceTime ? clearTimeout(this.data.onceTime) : '';
    this.data.onceTime = setTimeout(() => {
      params.likestr = e.detail.value;
      this.setData({
        params
      })
      this.GetProjectToPage();
    }, 300);
  },

  // 手动设置权限
  setLocation(e) {
    wx.openSetting({
      success: (res) => {
        if (res.authSetting['scope.userLocation']) {
          this.getLocation();
        }
      }
    })
  },
  // 获取地理位置
  getSetting() {
    let _this = this;

    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.userLocation']) {
          wx.authorize({
            scope: 'scope.userLocation',
            success() {
              // console.log('授权成功')
              _this.getLocation();
            },
            fail() {
              // console.log('取消授权')
              _this.setData({
                isLocation: true // 显示再次授权按钮
              })
            }
          })
        } else {
          _this.getLocation();
        }
      }
    })
  },
  // 获取经纬度
  getLocation() {
    wx.getLocation({
      type: 'gcj02',
      success: function(res) {
        this.locationMap(res.latitude, res.longitude);
      }.bind(this),
      fail(err) {
        $Message({
          content: err.errMsg,
          type: 'error'
        })
      }
    })
  },
  // 根据经纬度，定位
  locationMap(latitude, longitude) {
    // 实例化API核心类
    let map = new QQMapWX({
      key: MAP_KEY // 必填
    });
    // 调用接口
    map.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function(res) {
        let CityName = res.result.ad_info.city;
        let citySelector = this.data.citySelector;
        citySelector.CityName = CityName;

        this.setData({
          citySelector,
          isLocation: false
        });
        this.GetCityIDByName(CityName); // 根据城市名称获取城市ID
      }.bind(this),
      fail: function(err) {
        console.log(err);
      }
    });
  },
  // 根据城市名称匹配城市id
  GetCityIDByName(CityName) {
    let {
      citySelector
    } = this.data;

    GetCityIDByName({
      CityName
    }).then(res => {
      if (res.data.result === 'success') {
        let CityID = res.data.CityID;
        citySelector.CityID = CityID;
        citySelector.CityName = CityName;
        this.setData({
          citySelector
        });
        this.GetDistrictByCityID(CityID); // 根据城市ID获取区域数据
      } else {
        $Message({
          content: '没有获取到城市ID',
          type: 'error'
        })
      }
    })
  },
  // 根据城市ID获取区域数据
  GetDistrictByCityID(CityID) {
    GetDistrictByCityID({
      CityID
    }).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable;
        // data.unshift({CityName:'不限区域'})
        this.setData({
          DistrictName: data
        })
      } else {
        console.log(res.data.msg)
        // $Message({ content: res.data.msg, type: 'error' });
      }
    })
  },
  //获取项目列表
  GetProjectToPage(e) {
    let {
      params
    } = this.data;

    this.setData({
      loading: false
    });

    params.page = 1;
    GetProjectToPage(params).then(res => {
      if (res.data.result === 'success') {
        let data = res.data.temptable || [];

        data.forEach(item => {
          item.src = URL_PATH + item.CoverImgUrl; // 拼接图片地址
          item.imgSrc = URL_PATH + item.CLogo; // 拼接logo图片地址
        });

        this.setData({
          listData: data,
          loading: true
        })

      } else {
        this.setData({
          listData: [],
          loading: true
        })
      };
    })
  },
  // 打开筛选项切换
  bindScreenClick(e) {
    let {  index } = e.currentTarget.dataset;
    let {  screenOpen  } = this.data;

    this.screenMore.hide();
    screenOpen ? '' : this.retainBackdrop(); // 确保多次切换的情况下retainBackdrop只执行一次

    this.setData({
      screenOpen: true,
      down: index,
      screenIndex: Number(index)
    });
  },
  // 筛选radio改变事件
  bindRadioChange(e) {
    let {  params,  selectedArray  } = this.data;
    let {  type  } = e.currentTarget.dataset
    selectedArray[type] = e.detail.value
    let { value } = e.detail
    params[type] = value;

    this.setData({
      params,
      selectedArray
    });

    this.GetProjectToPage(); // 获取项目列表
    this.bindBackdrop(); // 选中后收起筛选项
  },
  bindRadioMoreChange(e) {
    console.log(e)
    let { params, selectedMoreArray } = this.data;
    let { type,  index } = e.currentTarget.dataset
    selectedMoreArray[type] = e.detail.value
    let { value } = e.detail
    params[type] = value;

    this.setData({
      selectedMoreArray,
      params
    });

  },
  // 更多筛选，重置
  bindScreenReset(data) {
    let { params, selectedMoreArray } = this.data
    selectedMoreArray = {}
    params.DeclareType = ''
    params.CommissionMode = ''
    params.NeedBringCust = ''
    this.setData({
      selectedMoreArray,
      params
    })
  },
  // 更多筛选，确定
  bindScreenConfirm(data) {
    this.GetProjectToPage(); // 获取楼盘列表数据
    this.bindBackdrop(); // 选中后收起筛选项
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
    this.moreOperation(e.currentTarget.dataset.projectId);
  },
  // 列表更多操作
  moreOperation(projectId) {
    let _this = this;

    wx.showActionSheet({
      itemList: ['编辑', '删除', '合作关系'],
      success: function(res) {
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
              content: '您确定要删除这个项目吗？',
              success: function(res) {
                if (res.confirm) {
                  _this.DelProject(projectId);
                } else if (res.cancel) {
                  console.log('用户点击取消')
                }
              }
            })
            break;
          case 2:
            // 合作关系
            wx.navigateTo({
              url: '../partnership/index?projectId=' + projectId,
            });
            break;
          default:
            console.log('tapIndex错误')
        }
      },
      fail: function(res) {
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
        $Message({
          content: '删除成功',
          type: 'success'
        });
        this.GetProjectToPage(); // 获取项目列表数据
      } else {
        $Message({
          content: '删除失败',
          type: 'error'
        });
      };
    })
  },
})