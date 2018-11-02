
import _fgj from '../../../../utils/util';
const { $Message } = require('../../../../components/base/index');
import { InsertContract, UpContract } from '../../../../api/compact/new';
import { GetContractByID } from '../../../../api/compact/detail';
import { GetRefByName } from '../../../../api/public';

import pickerData from './pickerData';

/**
 * 新建合同分为4个页面，根据不同的权限来判断是否需要填写下一页
 * 如果没有下一步信息填写的权限，就直接新建合同
 * 如果有，缓存当前页面已填写的数据，到下一页中再获取出来，最终一起上传
 * 
 * 新建合同一共有四种权限判断
 * Base	基本录入  0：禁止  1：允许
 * Business	业务录入  0：禁止  1：允许
 * Customer	客户录入  0：禁止  1：允许
 * Finance	财务录入  0：禁止  1：允许
 */

Page({
  data: {
    ContractID: '',           // 合同ID，有的话就是编辑
    params: {},               // 存储用户选中和输入的数据
    permission: {},           // 获取到的权限
    ContractKind: '',         // 合同类别，（一手房、二手房，该产生决定房源ID是读取EstateMarket还是EstateStock）
    Estate: {},               // 选中的楼盘数据
    ProjectData: {},          // 选中的项目数据
    LevelStock: {},           // 保存选中的销控数据
    pickerFlagMortgage: pickerData.FlagMortgage,
    pickerFlagMortgageIndex: 0,
    pickerPropertyUsage: [],
    pickerPropertyUsageIndex: 0,
    disabled: false,            // 防止重复提交
  },
  onLoad: function (options) {
    this.data.ContractID = options.ContractID || '';
    if (options.ContractID) {
      this.GetContractByID(options.ContractID);     // 根据合同id获取合同信息，回填
    } else {
      this.getPrevParamsData();   // 获取上一页保存的数据
    }
    setTimeout(() => {
      this.GetRefByName('PropertyUsage');      // 根据引用名获取字典数据
    }, 300);
  },
  // 获取上一页保存的数据
  getPrevParamsData() {
    let _this = this;
    let params = this.data.params;

    wx.getStorage({
      key: 'newCompactData',
      success: function (res) {
        console.log('上一页的数据', res)
        if (res.data) {
          _this.data.params = Object.assign({}, params, res.data);
          _this.setData({
            permission: res.data.permission,
            ContractKind: res.data.ContractKind
          });
        }
      },
      fail: function (res) {
        console.log('获取缓存失败', res);
        wx.navigateBack();
      }
    })
  },
  onReady: function () {

  },
  onShow: function () {
    this.onShowPrOrEs();        // 打开选择楼盘或项目页面后回填操作
    this.onShowLevelStock();    // 打开选择项目页面后回填操作
  },
  // 根据合同id获取合同信息，回填
  GetContractByID(ContractID) {
    wx.showLoading({
      title: '加载中'
    });
    GetContractByID({
      ContractID
    }).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        let temptable = data.temptable[0],
            property = '',
            propertyIndex = '',
            index = 0,
            map = ['FlagMortgage', 'PropertyUsage'];      //需要回填的picker选项

        // picker控件数据回填
        for (let key of map) {
          if (temptable[key]) {
            property = 'picker' + key;
            propertyIndex = 'picker' + key + 'Index';
            index = this.backfillPicker(this.data[property], temptable[key]);
            this.setData({
              [propertyIndex]: index
            });
          }
        }
        this.setData({
          params: temptable,
          ContractKind: temptable.ContractKind
        });
        console.log(this.data.params);
      } else {
        wx.navigateBack();
      }
    })
  },
  /**
   * picker控件数据回填
   * @params { Array }  data    数据源
   * @params { String } target  已经选中的值
   * @return { Number } i       选中的值对应数据源的下标
   */
  backfillPicker(data, target) {
    for (let i = 0, length = data.length; i < length; i++) {
      if (data[i].value === target) {
        return i;
      }
    };
    return 0;
  },
  // 根据引用名获取字典数据
  GetRefByName(RefName) {
    GetRefByName({
      RefName
    }).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        let pickerData = 'picker' + RefName;

        this.filterRefName(data.temptable);     // 处理引用字典数据，通过引用类型的特性修改对象

        this.setData({
          [pickerData]: data.temptable
        });
      }
    });
  },
  /**
   * 处理引用字典数据，通过引用类型的特性修改对象
   * @params { Array } array  数据源
   */
  filterRefName(array) {
    if (!array.length) {
      return false;
    }
    array.forEach(item => {
      item.value = item.label = item.ItemValue;
    });
  },

  /**
   * 判断`ContractKind`合同类型
   * 一手房：读取 EstateMarket ，项目
   * 二手房：读取 EstateStock ，楼盘
   */
  bindOpenSelectPjOrEs() {
    let ContractKind = this.data.ContractKind;

    switch (ContractKind) {
      case '一手房':
        wx.navigateTo({
          url: '/page/PM/project/search-project-id/index',
        });
      break;
      case '二手房':
        wx.navigateTo({
          url: '/page/PM/project/search-estate/index',
        });
      break;
      default:
        console.log('这是不可能的');
    }
  },
  // 打开房号选择页面
  bindSearchLevelStock() {
    let { ProjectData, params } = this.data;

    if (!params.RealEstateID) {
      params.RealEstateID = ProjectData.ProjectID;
    }

    if (params.RealEstateID) {
      wx.navigateTo({
        url: '/page/public/search-level-stock/index?ProjectID=' + params.RealEstateID,
      });
    }
  },
  // 打开选择楼盘或项目页面后回填操作
  onShowPrOrEs() {
    let { ProjectData, Estate, params } = this.data;

    console.log('项目', ProjectData);
    console.log('楼盘', Estate);

    // 处理项目回填
    if (ProjectData && ProjectData.ProjectName && ProjectData.ProjectName !== params.ProjectName) {
      params.EstateName = ProjectData.ProjectName;
      params.RealEstateID = ProjectData.ProjectID;

      // 如果重新选择了项目，就要清空房号，重新选房号
      params.RealEstateDictID = '';
      params.RealEstateDictName = '';

      this.setData({
        params
      });
    }

    // 处理楼盘回填
    if (Estate && Estate.EstateName && Estate.EstateName !== params.EstateName) {
      params.EstateName = Estate.EstateName;
      params.RealEstateID = Estate.EstateID;

      // 如果重新选择了项目，就要清空房号，重新选房号
      params.RealEstateDictID = '';
      params.RealEstateDictName = '';

      this.setData({
        params
      });
    }
  },
  // 打开选择房号页面后回填操作
  onShowLevelStock() {
    let { LevelStock, params } = this.data;
    console.log('房号', LevelStock);

    if (LevelStock.EstateDictID) {
      params.RealEstateDictID = LevelStock.EstateDictID;      // 不动产ID
      params.RealEstateDictName = `${LevelStock.bDictName} ${LevelStock.uDictName}单元 ${LevelStock.fDictName}F ${LevelStock.rDictName}`;
      this.setData({
        params
      });
    }
  },
  // picker选项组件返回值
  bindPickerChange(e) {
    console.log(e)
    let { type, index } = e.detail;
    // let pickerData = 'picker' + type;               // 根据类型拼接成选项字段
    let pickerIndex = 'picker' + type + 'Index';    // 根据类型拼接成选项字段

    this.data[pickerIndex] = index;     // 这里我只修改下标，完成的时候再根据下标拿选中的值
  },
  // 输入框返回值
  bindFieldChange(e) {
    let type = e.currentTarget.dataset.type;
    let value = e.detail.value;

    this.data.params[type] = value;
  },
  /**
   * 点击完成 or 下一步
   */
  bindSubmit() {
    let data = this.data;
    let params = {};
    let result = null;

    // picker选择器要根据下标获取当前选中的数据，拼接起来
    params = Object.assign({}, this.data.params, {
      FlagMortgage: data.pickerFlagMortgage[data.pickerFlagMortgageIndex].value,
      PropertyUsage: data.pickerPropertyUsage[data.pickerPropertyUsageIndex].value,
    });

    console.log(params)

    result = this.verifyData(params);
    // 验证数据
    if (!result.status) {
      $Message({ content: result.msg, type: 'error' });
      return false;
    }

    /**
     * 这里需要跟进权限判断是去下一步还是直接完成
     * Customer = '1' 表示有权限录入客户内容
     * 要排除编辑操作
     */
    if (!params.ContractID && params.permission.Customer === '1') {
      wx.navigateTo({
        url: '../new-3/index'
      });
      // 缓存当前填写的数据，下一步的时候再获取出来使用
      wx.setStorage({
        key: 'newCompactData',
        data: params,
        fail: function (res) {
          wx.navigateBack();
          console.log('糟糕！缓存失败', e);
        }
      });
      return false;
    }

    /**--------------------------- */

    // 防止重复点击
    if (this.data.disabled) {
      return false;
    }
    this.setData({
      disabled: true
    });
    wx.showLoading({
      title: '保存中'
    });

    if (params.ContractID) {
      this.UpContract(params);        // 编辑
    } else {
      this.InsertContract(params);    // 新建
    }
  },
  // 新建合同
  InsertContract(params) {
    InsertContract(params).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '新建成功!', type: 'success' });
        setTimeout(() => {
          wx.redirectTo({
            url: '../list/index'
          });
        }, 1000);
      } else {
        this.setData({
          disabled: false
        });
        $Message({ content: data.msg, type: 'error' });
      }
    });
  },
  // 编辑合同
  UpContract(params) {
    UpContract(params).then(res => {
      wx.hideLoading();
      let data = res.data;
      if (data.result === 'success') {
        $Message({ content: '编辑成功!', type: 'success' });
        setTimeout(() => {
          wx.navigateBack();
        }, 1000);
      } else {
        this.setData({
          disabled: false
        });
        $Message({ content: data.msg, type: 'error' });
      }
    });
  },
  /**
   * 验证用户填写的数据
   * @params { Object } data    数据源
   * @return { Object } result  返回状态和提示
   */
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };

    if (!_fgj.verify(data.EstateName, 'require')) {
      result.msg = '请选择项目或楼盘';
      return result;
    };
    if (!_fgj.verify(data.Address, 'require')) {
      result.msg = '请填写楼盘详细地址';
      return result;
    };
    if (!_fgj.verify(data.SN, 'require')) {
      result.msg = '请填写不动产编号';
      return result;
    };
    if (!_fgj.verify(data.RECNO, 'require')) {
      result.msg = '请填写不动产权证号码';
      return result;
    };
    if (!_fgj.verify(data.Price, 'require')) {
      result.msg = '请填写挂牌价';
      return result;
    };
    if (!_fgj.verify(data.Square, 'require')) {
      result.msg = '请填写面积';
      return result;
    };

    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  onHide: function () {

  },
  onUnload: function () {

  },
  onPullDownRefresh: function () {

  },
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})