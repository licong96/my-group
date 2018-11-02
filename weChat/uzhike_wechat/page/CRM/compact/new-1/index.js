
import _fgj from '../../../../utils/util';
const { $Message } = require('../../../../components/base/index');
import { 
  GetContractPurview, 
  InsertContract, 
  UpContract, 
  GetContractFileByID, 
  DelContractFileByIDs 
} from '../../../../api/compact/new';
import { GetContractByID } from '../../../../api/compact/detail';
import { FileUpLoad } from '../../../../api/public';
import { URL_PATH } from '../../../../utils/config';

import pickerData from './pickerData';

const DATE = new Date();                // 现在的时间
const NOW = _fgj.formatTimeDate(DATE);  // 处理格式成：2018-10-6

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
    depORemp: {},             // 选中的部门和人员数据
    endDate: NOW,             // 结束时间
    ContractDate: NOW,        // 合同日期，默认今天
    saveImageData: [],        // 保存上传的图片地址，上传到服务器
    viewImageData: [],        // 用来展示的图片地址，地址是本地的
    pickerContractKind: pickerData.ContractKind,
    pickerContractKindIndex: 0,
    pickerTrade: pickerData.Trade,
    pickerTradeIndex: 0,
    pickerStatus: pickerData.Status,
    pickerStatusIndex: 0,
    disabled: false,          // 防止重复提交
  },
  onLoad: function (options) {
    this.data.ContractID = options.ContractID || '';
    if (options.ContractID) {
      this.GetContractByID(options.ContractID);     // 根据合同id获取合同信息，回填
      this.GetContractFileByID(options.ContractID); // 根据合同id获取合同文件，图片
    } else {
      this.GetContractPurview();    // 获取新建合同所需权限
    }
  },
  onReady: function () {
    
  },
  onShow: function () {
    this.showContractSigner();    // 选择完签约人之后，同步视图数据
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
          map = ['ContractKind', 'Trade', 'Status'];      //需要回填的picker选项

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
          params: temptable
        });
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
  // 根据合同id获取合同文件，图片
  GetContractFileByID(ContractID) {
    GetContractFileByID({
      ContractID
    }).then(res => {
      let data = res.data;

      if (data.result === 'success') {
        let viewImageData = JSON.parse(JSON.stringify(data.temptable));
        // let saveImageData = JSON.parse(JSON.stringify(data.temptable));

        // 用来显示
        viewImageData.forEach(item => {
          item.path = URL_PATH + item.FileSrc;
          item.type = item.FileType;
        });

        this.setData({
          viewImageData
        });
      }
    });
  },
  // 获取新建合同所需权限，新建的时候才用到
  GetContractPurview() {
    GetContractPurview().then(res => {
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          permission: data
        });
      } else {
        wx.showModal({
          title: '获取权限失败',
          content: '糟糕',
          showCancel: true,
          cancelText: '取消',
          confirmText: '知道了',
          complete: function (res) {
            wx.navigateBack();
          },
        });
      }
    });
  },
  // 合同时间
  bindDateChange(e) {
    this.setData({
      ContractDate: e.detail.value
    });
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
  // 选择签约人
  bindOpenSelectDepEmp() {
    wx.navigateTo({
      url: '/page/public/select-dep-emp/index'
    });
  },
  /**
   * 选择完签约人之后，同步视图数据
   * 选择签约人是打开一个新的页面去操作
   * 选中人员之后，选择页面关闭，并且修改这个页面的数据
   * 当这个页面onShow的时候，我要同步修改视图数据
   */
  showContractSigner() {
    let { params, depORemp } = this.data;
    console.log(depORemp);

    if (depORemp.EmpName) {
      params.ContractSigner = depORemp.DeptName.trim() + '-' + depORemp.EmpName;
      this.setData({
        params
      });
    }
  },
  /**
   * 图片上传
   */
  bindUploadPicture(e) {
    let _this = this;

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths || [];

        wx.showLoading({
          title: '图片上传中',
        });

        tempFilePaths.forEach(item => {
          _this.uploadFile(item);
        });
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  // 调用图片上传接口
  uploadFile(path) {
    let _this = this;

    wx.uploadFile({
      url: FileUpLoad,
      filePath: path,
      name: 'file',
      success(res) {
        let data = JSON.parse(res.data);
        if (data.result === 'success') {
          let relativePath = data.path.replace(/\|/, '');     // 图片的相对路径
          let { saveImageData, viewImageData } = _this.data;
          // console.log(relativePath)

          // 这里面的图片地址是本地的，值用作显示，不用请求
          viewImageData.push({
            type: '图片',
            path
          });
          // 这里的图片地址是从后端返回的相对路径，需要保存到服务器
          saveImageData.push({
            type: '图片',
            path: relativePath
          });

          _this.setData({
            viewImageData,
            saveImageData
          });
        } else {
          $Message({ content: types + '上传失败', type: 'error' });
        };
        wx.hideLoading();
      },
      fail(error) {
        wx.hideLoading();
        $Message({ content: types + '上传失败', type: 'error' });
      }
    })
  },
  // 删除图片
  bindRemoveImg(e) {
    let index = e.currentTarget.dataset.index; 
    let viewImageData = this.data.viewImageData;
    let ContractFileID = viewImageData[index].ContractFileID;     // 拿到文件ID
    let _this = this;

    /**
     * 有ContractFileID表示这是编辑，需要去服务器上删除图片
     * 没有ID表示还没有上传，可以直接删除了
     */
    if (ContractFileID) {
      wx.showModal({
        title: '操作提示',
        content: '您确定要删除这张图片吗？',
        showCancel: true,
        cancelText: '取消',
        confirmText: '确定',
        success: function(res) {
          console.log(res)
          if (res.confirm) {
            _this.DelContractFileByIDs(ContractFileID, index);
          }
        },
        fail: function(res) {},
        complete: function(res) {},
      })
    } else {
      viewImageData.splice(index, 1); 
      this.setData({
        viewImageData
      });
    }
  },
  // 批量删除合同文件接口
  DelContractFileByIDs(ContractFileID, index) {
    let viewImageData = this.data.viewImageData;

    wx.showLoading({
      title: '删除中'
    });

    DelContractFileByIDs({
      FilesID: ContractFileID
    }).then(res => {
      let data = res.data;
      wx.hideLoading();

      if (data.result === 'success') {
        viewImageData.splice(index, 1);
        this.setData({
          viewImageData
        });
        $Message({ content: '图片删除成功', type: 'success' });
      } else {
        $Message({ content: '图片删除失败', type: 'error' });
      }
    });
  },

  /**
   * 点击完成 or 下一步
   */
  bindSubmit() {
    let data = this.data;
    let params = {};
    let Files = '';
    let result = null;

    // 处理文件地址-图片
    if (data.saveImageData.length) {
      data.saveImageData.forEach(item => {
        Files += item.path + ',' + item.type + '|';
      });
    }
    
    // picker 选择器要根据下标获取当前选中的数据，拼接起来
    params = Object.assign({}, this.data.params, {
      ContractDate: data.ContractDate,
      ContractKind: data.pickerContractKind[data.pickerContractKindIndex].value,
      Trade: data.pickerTrade[data.pickerTradeIndex].value,
      Status: data.pickerStatus[data.pickerStatusIndex].value,
      Files,
      permission: data.permission,        // 把获取到的权限也传过去
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
     * Business = '1' 表示有权限录入业务内容
     * 要排除编辑操作
     */
    if (data.permission.Business === '1') {
      wx.navigateTo({
        url: '../new-2/index'
      });
      // 缓存当前填写的数据，下一步的时候再获取出来使用
      wx.setStorage({
        key: 'newCompactData',
        data: params,
        fail: function(res) {
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

    if (params.ContractID) {
      this.UpContract(params);        // 编辑
    } else {
      this.InsertContract(params);    // 新建
    }
  },
  // 新建合同
  InsertContract(params) {
    InsertContract(params).then(res => {
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

    if (!_fgj.verify(data.ContractNo, 'require')) {
      result.msg = '请填写合同编号';
      return result;
    };
    if (!_fgj.verify(data.ContractSigner, 'require')) {
      result.msg = '请选择签约人';
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