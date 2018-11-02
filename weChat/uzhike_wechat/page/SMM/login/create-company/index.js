const { $Message } = require('../../../../components/base/index');
import { FileUpLoad } from '../../../../api/public';
import { RegCompany, RegCompanyValidate, GetCityIDByName } from '../../../../api/login/register.js';
import _fgj from '../../../../utils/util.js';
import { URL_PATH } from '../../../../utils/config';

const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    isSend: false,
    times: 30,
    timer: null,
    region: ['江西省', '南昌市', '高新区'],
    companyType: ['分销商', '开发商', '个体'],
    index: 0,
    cardType: ['营业执照', '身份证'],
    cardIndex: 0,
    params: {
      needpurview: false,		
      EmpName: '',		 // 名称
      Tel: '',	       // 电话
      PassWord: '',		 // 密码
      ValiNum: '',     // 验证码
      CityID: '',      // 城市id
      CName: '',       // 公司全称
      CShortName: '',	 // 公司简称
      CertType: '',    // 证件类型
      CertNO: '',      // 证件号码
      Address: '',      // 公司地址 
      CertImg: '',      // 证件图片   
    },
    CityID: '',
    isDisabled: false,    // 阻止重复提交
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCityIDByName();
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },
  // 选择图片并上传
  chooseImage() {
    const _this = this;
    let params = this.data.params;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths
        wx.showLoading({
          title: '图片加载中',
        })
        wx.uploadFile({
          url: FileUpLoad,
          filePath: tempFilePaths[0],
          name: 'file',
          success: function (res) {
            wx.hideLoading();
            let data = JSON.parse(res.data)
            if (data.result === 'success') {
              $Message({ content: '上传成功', type: 'success' });

              params.CertImg = URL_PATH + data.path.replace(/\|/, '');

              _this.setData({
                params
              })
            } else {
              $Message({ content: '上传失败', type: 'error' })
            }
          },
          fail: function (err) {
            $Message({ content: '网络错误' + err, type: 'error' })
          }
        })
      }
    })
  },
  // 立即创建
  create () {
    wx.showLoading({
      title: '加载中',
    });
    // this.getCityIDByName()
    let { region, companyType, cardType, index, cardIndex, CityID } = this.data;
    let params = this.data.params;
    let data = Object.assign({}, params, {
      Address: region,
      CertType: cardType[cardIndex],
      CityID,
      EmpImg: encodeURIComponent(app.globalData.userInfo.avatarUrl),
      OpenID: app.globalData.openID
    });
    let verify = this.verifyData(params)
    if (verify.status) {
      this.regCompany(data)
    } else {
      wx.hideLoading();
      $Message({ content: verify.msg, type: 'error'})   
    }
  },
  // 注册公司
  regCompany (data) {
    
    if (this.data.isDisabled) {
      return
    }
    this.data.isDisabled = true;

    RegCompany(data).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let { Token, CID } = res.data;

        // 保存Token
        $Message({ content: '创建成功', type: 'success' });
        app.globalData.token = Token;

        setTimeout(() => {
          this.data.isDisabled = false;
          wx.navigateTo({
            url: '../organization/index?CID=' + CID,
          });
        }, 1000);
      } else {
        this.data.isDisabled = false;
        $Message({ content: res.data.msg, type: 'error' });
      }
      wx.hideLoading();
    })
  },
  // 获取验证码
  getValiNum() {
    let params = {
      needpurview: false,
      Tel: this.data.params.Tel
    }
    if (!_fgj.verify(params.Tel, 'require')) {
      $Message({ content: '请输入手机号码', type: 'error' });
    } else if (!_fgj.verify(params.Tel, 'phone')) {
      $Message({ content: '请输入正确的手机号码', type: 'error' });
    } else {
      RegCompanyValidate(params).then(res => {
        let data = res.data
        if (data.result === 'success') {
          console.log(data.result)
          if (this.data.isSend) {
            return
          }
          this.setData({
            isSend: true
          })
          let num = this.data.times
          this.count(num)
        } else {
          console.log(data.msg)
        }
      })
    }
  },
  // 倒计时
  count(num) {
    // let timer = this.data.timer
    // console.log(num)
    this.data.timer = setTimeout(() => {
      this.count(num)
    }, 1000)
    if (num <= 1) {
      clearTimeout(this.data.timer)
      this.setData({
        times: 30,
        isSend: false
      })
    } else {
      num--;
      this.setData({
        times: num
      })
    }

  },
  // 选择地区
  bindRegionChange: function (e) {
    // console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value
    })
    this.getCityIDByName()
  },
  // 选择公司类型
  bindTypeChange: function (e) {
    let index = Number(e.detail.value);
    let cardIndex = 0;

    console.log(index)

    // 选择分销商和开发商时  证件类型默认选择营业执照    个体时  默认选择身份证
    if (index === 2) {
      cardIndex = 1;
    } else {
      cardIndex = 0;
    }

    this.setData({
      index,
      cardIndex
    });
  },
  // 选择证件类型
  bindCardChange: function (e) {
    this.setData({
      cardIndex: e.detail.value
    })
  },
  // 根据城市名匹配城市id
  getCityIDByName() {
    wx.showLoading({
      title: '加载中',
    });
    let data = {
      CityName: this.data.region[1],
      needpurview: false
    }
    GetCityIDByName(data).then(res => {
      let data = res.data
      if(data.result === 'success') {
        this.setData({
          CityID: data.CityID
        })
      }
      wx.hideLoading();
    })
  },
  // 监听input事件
  inputChange(e) {
    let { type } = e.currentTarget.dataset
    let params = this.data.params;
    params[type] = e.detail.value;
    this.setData({
      params
    })
  },
  // 校验数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.CName, 'require')) {
      result.msg = '请输入公司名称';
      return result;
    };
    if (!_fgj.verify(data.EmpName, 'require')) {
      result.msg = '请输入姓名';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'require')) {
      result.msg = '请输入电话';
      return result;
    };
    if (!_fgj.verify(data.Tel, 'phone')) {
      result.msg = '请输入正确的电话号码';
      return result;
    };
    if (!_fgj.verify(data.ValiNum, 'require')) {
      result.msg = '请输入验证码';
      return result;
    };
    if (!_fgj.verify(data.PassWord, 'require')) {
      result.msg = '请输入密码';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';
    return result;
  }
})