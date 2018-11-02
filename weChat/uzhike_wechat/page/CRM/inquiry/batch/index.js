const { $Message } = require('../../../../components/base/index');
import { InsertDeclare, GetCustomerByIDs } from '../../../../api/inquiry/batch';
import _fgj from '../../../../utils/util';

/**
 * 选择项目，`DeclareType`字段允许全号或隐号报备，`0`是全号，`1`是隐号
 */

Page({
  data: {
    typeCut: 0,               // 当前选择的操作类型
    typeData: ['报备', '跟进', '接待', '作废', '滞缓', '删除'], // 操作项类型
    checkedData: [],          // 存储已选中的客户ID
    batchData: [],            // 批量操作的客户数据
    operationData: [],        // 存储已选中的客户数据，即将去操作的数据
    projectData: {},          // 选中的项目数据
    isAllChecked: true,       // 是否全选
    touch: {},                // 保存列表滑动的操作
    animationInquiryData: {}, // 报备结果面板动画
    animationShadeData: {},   // 遮罩动画
    isShowResult: false,      // 是否显示报备结果弹窗
    isShowShade: false,       // 是否显示遮罩
    loading: false,           // 加载中
    FillingPhone: [],         // 需要补齐全号的数据
  },
  onLoad: function (options) {
  },
  onReady: function () {
    // 这些操作没有必要立马执行，可以先放到任务队列中
    setTimeout(() => {
      this.createCanvasCircle();    // 创建canvas
      this.createAnimationFn();     // 创建动画
      this.allPhoneModal = this.selectComponent('#allPhoneModal');
    }, 100);
  },
  onShow: function () {
    // 获取需要批量操作的客户
    this.getStorageData();
  },
  // 打开项目列表，选择项目
  bindOpenProject() {
    wx.navigateTo({
      url: '../project/index'
    });
  },
  // 打开客户列表，继续添加客户
  bindOpenList() {
    let checkedData = this.data.checkedData;

    // 缓存已选中的客户
    wx.setStorage({
      key: 'checkedData',
      data: checkedData,
      success() {
        wx.navigateTo({
          url: '../../customer/list/index'
        });
      },
      fail(err) {
        console.log(err)
      }
    });
  },
  // 获取需要批量操作的客户
  getStorageData() {
    // 获取选中的项目数据
    wx.getStorage({
      key: 'projectData',
      success: function (res) {
        console.log('projectData', res.data)
        this.setData({
          projectData: res.data
        });
      }.bind(this),
    });

    // 获取选中的客户ID
    wx.getStorage({
      key: 'checkedData',
      success: function (res) {
        let checkedData = this.data.checkedData = res.data || [];

        // 没有选中客户
        if (!checkedData.length) {
          this.setData({
            isAllChecked: false
          });
          return false;
        }

        let batchData = [];
        let CustID = checkedData.join(',');

        GetCustomerByIDs({
          CustID
        }).then(res => {
          if (res.data.result === 'success') {
            let batchData = res.data.temptable;

            batchData.forEach(item => {
              if (checkedData.indexOf(item.CustID) !== -1) {
                item.checked = true;
              }
            });

            this.setData({
              batchData,
              loading: true
            });
          }
        });
      }.bind(this),
      fail: function(err) {
        this.setData({
          batchData: [],
          isAllChecked: false,
          loading: true,
        });
      }.bind(this)
    });
  },
  // 切换顶部类型选项
  bindTypeCut(e) {
    let index = e.currentTarget.dataset.index;

    if (index !== this.data.typeCut) {
      this.setData({
        typeCut: index
      })
    }
  },
  // 点击完成
  bindConfirm() {
    let { typeCut, typeData, operationData, checkedData, batchData, projectData } = this.data;

    operationData = batchData.filter(item => checkedData.indexOf(item.CustID) !== -1);    // 过滤选中的数据

    // 判断是否选择了项目或客户
    if (!projectData.ProjectName) {
      $Message({ content: '请选择项目', type: 'error' });
      return false;
    }
    if (!operationData.length) {
      $Message({ content: '请选择客户', type: 'error' });
      return false;
    }

    this.setData({
      operationData
    });

    if (typeData[typeCut] === '报备') {
      // 判断是否能够隐号报备
      this.isFillingPhone(operationData);
    }
  },
  /** 
   * 判断是否能够隐号报备
   * 判断项目中的DeclareType字段
   * 如果是`0`就需要全号报备 => 先检查已选中的客户号码，里面是否有隐号，有的话需要补齐号码；否则直接通过
   * 如果是`1`全号隐号都可以 => 提示用户是选择现有模式报备，还是全部隐号报备
   * 
   * @params { Array } operationData 选中的客户
   * @return { undefined } 这个函数并不返回数据，通过引用类型的特性，直接修改这个数组
   */
  isFillingPhone(operationData) {
    let projectData = this.data.projectData;
    let FillingPhone = [];
    
    switch (projectData.DeclareType) {
      // 需要全号报备
      case '0':
        FillingPhone = operationData.filter(item => item.Tel.indexOf('*') !== -1);    // 拿到隐号客户 !== -1

        /**
         * 判断是否有隐号客户，如果有要去补齐全号，如果没有直接执行报备操作
         */
        if (FillingPhone.length) {
          wx.showModal({
            title: '需要补全号码',
            content: '该项目要求全号报备，您需要补全客户的电话号码，是否补全？',
            showCancel: true,
            cancelText: '取消',
            cancelColor: '#333',
            confirmText: '去补全',
            confirmColor: '#ff6714',
            success: function (res) {
              if (res.confirm) {
                this.allPhoneModal.onShowModal();     // 打开补齐全号弹窗
                this.setData({
                  FillingPhone
                });
              }
            }.bind(this),
            fail: function (err) {
              console.log(err)
            }
          })
        } else {
          this.executeInquiry();      // 执行报备操作
        }
      break;
      // 全号隐号混合报备
      case '1':
        FillingPhone = operationData.filter(item => item.Tel.indexOf('*') === -1);    // 这里用的是 === -1

        /**
         * 这里全号隐号都可以报备，但是如果客户有全号，则弹出一个提示
         */
        if (FillingPhone.length) {
          wx.showModal({
            title: '系统提示',
            content: '您的报备中存在全号客户，请确认您的报备方式',
            showCancel: true,
            cancelText: '隐号报备',
            cancelColor: '#333',
            confirmText: '保持现有',
            confirmColor: '#333',
            success: function (res) {
              // 全部隐号报备
              if (res.cancel) {
                operationData.forEach(item => {
                  // 把全号处理成隐号，只留前5后2
                  item.Tel = item.Tel.replace(/(\d{5})(\d{4})(\d{2})/, function (a, b, c, d) {
                    return b + c.replace(/\d/g, '*') + d;
                  });
                });
                this.setData({
                  operationData
                });
                this.executeInquiry();      // 执行报备操作
              }
              // 保持现有
              if (res.confirm) {
                this.executeInquiry();      // 执行报备操作
              }
            }.bind(this),
            fail: function (err) {
              console.log(err)
            }
          })
        } else {
          this.executeInquiry();      // 执行报备操作
        }
      break;
      default:
        console.log('这是不可能的，这辈子都不可能');
    }
  },

  /**
   * 补齐全号操作
   */
  // 输入框 
  changeFillingInput(e) {
    let { index } = e.currentTarget.dataset;
    let FillingPhone = this.data.FillingPhone;

    FillingPhone[index].Tel = e.detail.value;

    this.setData({
      FillingPhone
    });
  },
  // 取消补齐全号
  bindAllPhoneCancel() {
    this.allPhoneModal.onHideModal();
  },
  // 确定补齐全号
  bindAllPhoneConfirm() {
    let { operationData, FillingPhone } = this.data;

    // 验证手机号
    let verify = FillingPhone.every(item => _fgj.verify(item.Tel, 'phone'));
    console.log('verify', verify)

    if (!verify) {
      $Message({ content: '手机号有误', type: 'error' });
      return false;
    }

    // 用补全的号码替换隐号
    operationData.forEach(item => {
      FillingPhone.forEach(list => {
        if (item.CustID === list.CustID) {
          item.Tel = list.Tel
        }
      }); 
    });

    this.setData({
      operationData,
      FillingPhone
    });

    this.allPhoneModal.onHideModal();   // 去掉弹窗

    this.executeInquiry();    // 执行报备操作
  },

  // 执行报备操作
  executeInquiry() {
    let { operationData, projectData } = this.data;
    let params = {};
    let onOff = true;

    this.animationInquiryShow();    // 执行模态框显示动画
    this.animationShadeShow();      // 执行背景显示动画

    console.log('最终要报备的项目', operationData)

    // 发送请求
    for (let i = 0, len = operationData.length; i < len; i++) {
      params = {
        ProjectID: projectData.ProjectID,
        CustID: operationData[i].CustID,
        CustTel: operationData[i].Tel
      };
      InsertDeclare(params).then(res => {
        if (res.data.result === 'success') {
          operationData[i].inquiryStatus = 1;     // 修改报备状态

          // 上传成功之后，删除对应的缓存数据，以及选中的客户
          if (i >= len - 1) {
            this.clearInquiryData();      // 清除已报备的客户和ID
          }
        } else {
          operationData[i].inquiryStatus = 2;
          $Message({ content: res.data.msg, type: 'error' });
        }
        this.setData({
          operationData
        });
      });
    }
  },
  /**
   * 报备成功之后，需要清除掉已报备的客户，保存没有报备的客户
   * 这里有 checkedData 缓存ID，也需要清除对应的
   * 我这里使用的是先获取原有的缓存数据，去掉已报备的，再覆盖上去
   */
  clearInquiryData() {
    let arrOldCheckedData = this.data.checkedData;
    let batchData = this.data.batchData;
    let _this = this;
    
    wx.getStorage({
      key: 'checkedData',
      success: function (res) {
        // 拿到未报备的客户ID
        let arrNewCheckedData = res.data.filter(item => arrOldCheckedData.indexOf(item) === -1);
        // 拿到未报备的客户数据
        let arrNewbatchData = batchData.filter(item => arrOldCheckedData.indexOf(item.CustID) === -1);

        // 重置数据
        wx.setStorage({
          key: 'checkedData',
          data: arrNewCheckedData,
          success() {
            _this.setData({
              checkedData: [],
              batchData: arrNewbatchData
            });
          },
          fail(err) {
            console.log(err)
          }
        });
      },
      fail: function (res) { }
    })
  },
  // 点击报备结果面板完成按钮
  bindResultConfirm() {
    this.animationInquiryHide();     // 执行隐藏动画
    this.animationShadeHide();       // 执行隐藏动画

    wx.showModal({
      title: '提示',
      content: '是留在这里继续操作还是去列表页？',
      confirmText: '去列表',
      cancelText: '留下来',
      success: function(res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../customer/list/index',
          })
        }
      }
    })
  },
  // 创建动画
  createAnimationFn() {
    // 创建报备结果面板动画
    this.animationInquiry = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
    // 创建遮罩动画
    this.animationShade = wx.createAnimation({
      duration: 300,
      timingFunction: 'ease',
    });
  },
  // 执行报备结果面板动画--显示
  animationInquiryShow() {
    let animation = this.animationInquiry;

    animation.opacity(1).translateY(0).step();

    this.setData({
      isShowResult: true
    });
    setTimeout(() => {
      this.setData({
        animationInquiryData: animation.export()
      });
    }, 30);
  },
  // 执行报备结果面板动画--隐藏
  animationInquiryHide() {
    let animation = this.animationInquiry;

    animation.opacity(0).translateY(50).step();

    this.setData({
      animationInquiryData: animation.export()
    });
    setTimeout(() => {
      this.setData({
        isShowResult: false
      });
    }, 300);
  },
  // 执行遮罩动画--显示
  animationShadeShow() {
    let animation = this.animationShade;

    animation.opacity(1).step();

    this.setData({
      isShowShade: true
    });
    setTimeout(() => {
      this.setData({
        animationShadeData: animation.export()
      });
    }, 30);
  },
  // 执行遮罩动画--隐藏
  animationShadeHide() {
    let animation = this.animationShade;

    animation.opacity(0).step();

    this.setData({
      animationShadeData: animation.export()
    });
    setTimeout(() => {
      this.setData({
        isShowShade: false
      });
    }, 300);
  },
  // 删除全部客户
  bindRemoveAll() {
    wx.removeStorage({
      key: 'checkedData',
      success: function (res) {
        this.setData({
          batchData: [],
          checkedData: [],
          isAllChecked: false
        });
      }.bind(this),
      fail: function (err) {
        console.log('err', err)
      }
    })
  },
  // 删除单个客户
  bindRemove(e) {
    let { item, index } = e.currentTarget.dataset;
    let { batchData, checkedData } = this.data;

    batchData.splice(index, 1);
    checkedData = checkedData.filter(list => item.CustID !== list);

    this.setData({
      batchData,
      checkedData
    });
  },
  // 选中客户
  checkboxChange(e) {
    let { batchData, projectData } = this.data;
    let ArrValue = e.detail.value;
    
    console.log('checkbox', ArrValue)

    // 先清空状态
    batchData.forEach(item => {
      item.checked = false
    });

    // 再添加状态
    for (let key of batchData) {
      if (ArrValue.indexOf(key.CustID) !== -1) {
        key.checked = true;
      }
    }

    this.data.checkedData = ArrValue;

    this.setData({
      batchData
    });

    // 判断是否每个都勾选了
    if (ArrValue.length === batchData.length) {
      this.setData({
        isAllChecked: true
      })
    } else {
      this.setData({
        isAllChecked: false
      })
    }
  },
  // 全选和取消全选
  checkboxChangeAll(e) {
    let { batchData, checkedData } = this.data;

    checkedData = [];   // 先清空

    if (!this.data.isAllChecked) {
      batchData.forEach(item => {
        item.checked = true;
        checkedData.push(item.CustID);
      });
    } else {
      batchData.forEach(item => {
        item.checked = false;
      });
      checkedData = [];
    }
    this.data.isAllChecked = !this.data.isAllChecked;
    
    console.log(checkedData)
    this.data.checkedData = checkedData;
    this.setData({
      batchData,
    });
  },
  // 列表滑动按下
  handlerStart(e) {
    let { batchData, touch } = this.data,
        { clientX, clientY } = e.touches[0];

    if (touch.sides) {
      // 已经有滑动，全部收起
      for (let i = 0, len = batchData.length; i < len; i++) {
        batchData[i].offsetLeft = 0;
      };
      this.setData({
        batchData
      });
      touch.sides = false
      return
    };
    touch.startX = clientX;
    touch.startY = clientY;
  },
  // 列表滑动
  handlerMove(e) {
    let { clientX, clientY } = e.touches[0],
        touch = this.data.touch,
        deltaX = clientX - touch.startX,
        deltaY = clientY - touch.startY;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {      // 如果是Y轴滑动，就不执行
      touch.sides = false;
      return;
    };

    if (deltaX < -60) {
      touch.sides = true;
    } else {
      touch.sides = false;
      return;
    }
  },
  // 列表滑动抬起
  handlerEnd(e) {
    let { batchData, touch } = this.data;
    let { id } = e.currentTarget.dataset;

    if (touch.sides) {
      for (let i = 0, len = batchData.length; i < len; i++) {
        if (batchData[i].CustID === id) {
          batchData[i].offsetLeft = -120;
          this.setData({
            batchData
          });
          touch.startX = 0;
          return;
        }
      };
    }
  },
  // 在报备面板上创建canvas弧形
  createCanvasCircle() {
    let ctx = wx.createCanvasContext('result_circle');

    ctx.beginPath();
    ctx.moveTo(0, 60);
    ctx.quadraticCurveTo(-10, -15, 140, 60);
    ctx.fillStyle = 'rgba(255, 255, 255, .1)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(30, 60);
    ctx.quadraticCurveTo(100, 10, 180, 70);
    ctx.fillStyle = 'rgba(255, 255, 255, .3)';
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(100, 60);
    ctx.quadraticCurveTo(340, -10, 160, 260);
    ctx.fillStyle = 'rgba(255, 255, 255, .2)';
    ctx.fill();

    ctx.draw();
  },

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
})