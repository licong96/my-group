const { $Message } = require('../../../../components/base/index');
import { FileUpLoad } from '../../../../api/public';
import { URL_PATH } from '../../../../utils/config';
import { InserCustomerFollow, InserCustomerFollowFile, DelCustomerFollowFile } from '../../../../api/reception/follow';
import GUID from '../../../../utils/guid';

// 临时ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({
  data: {
    ProjectReceptionFollowID: guidstr,
    adjust: false,
    tempFilePath: '',
    keyboardHeight: 0,        // 键盘高度
    typeIndex: 0,             // 当前选中的类型下标
    typeItemWidth: 140,       // 当前类型项的宽度
    FollowContent: '',        // 跟进内容
    IsShowRecord: false,      // 是否打开录音
    recordStatus: 0,          // 当前录音的状态 0 => 准备录音, 1 => 正在录音, 2 => 录音结束
    recordPlay: false,        // 播放录音状态
    recordDesc: '点击开始录音', // 当前状态文字提醒
    recordDuration: 30000,     // 指定录音的时长，单位 ms 
    recordDurationTime: 0,     // 录音计时
    recordPath: {},           // 当前录音数据
    recordData: [],           // 保存的录音
    imageData: [],            // 保存图片数据
    Position: '',             // 地理位置
    IsShowShade: false,       // 是否显示遮罩
    currentRecordPlay: -1,    // 当前需要播放的单条语音
    nowDate: new Date(),      // 当前日期
    AlertDate: '',            // 提醒时间
    isSend: false,            // 是否能够发送，必须具备文字、图片、语音三种形式中的一种才能提交
  },
  onLoad: function (options) {
    // console.log(options)
    this.data.ProjectReceptionID = options.ProjectReceptionID || '';
    if (!options.ProjectReceptionID) {
      wx.navigateBack();
    }
  },
  onReady: function () {
    this.recorderManager = wx.getRecorderManager();
    this.innerAudioContext = wx.createInnerAudioContext();
  },
  onShow: function () {
    // 更新临时ID
    let guidstr = guid.newGUID().toUpperCase();
    this.data.ProjectReceptionFollowID = guidstr;
  },
  // 判断是否能够发送，文字、图片、语音三者中必须有一种才能发送
  isSendData() {
    let data = this.data;

    // 上传主体内容，必须有一样
    if (data.FollowContent || data.imageData.length || data.recordData.length) {
      this.setData({
        isSend: true
      });
    } else {
      this.setData({
        isSend: false
      });
    }
  },
  // 发送
  bindSend() {
    let data = this.data;
    let params = {};

    // 判断是否能够提交
    if (!this.data.isSend) {
      $Message({ content: '请上传跟进内容', type: 'error' });
      return false
    }

    params.ProjectReceptionFollowID = data.ProjectReceptionFollowID;
    params.ProjectReceptionID = data.ProjectReceptionID;
    params.FollowContent = data.FollowContent;

    this.InserCustomerFollow(params);
  },
  // 添加接待跟进主体
  InserCustomerFollow(params) {
    InserCustomerFollow(params).then(res => {
      if (res.data.result === 'success') {
        $Message({ content: '添加成功', type: 'success' });
        // this.emptyData();  // 成功后清空数据
        wx.navigateBack();
      } else {
        $Message({ content: '添加失败', type: 'error' });
      }
    })
  },
  // 成功后清空数据
  emptyData() {
    // 更新临时ID
    let guidstr = guid.newGUID().toUpperCase();
    this.data.ProjectReceptionFollowID = guidstr;

    this.setData({
      FollowContent: '',
      recordData: [],
      imageData: [],
      isSend: false,      // 不能发送
    });
  },
  // 输入框聚焦时触发
  bindfocusText(e) {
    this.setData({
      IsShowRecord: false,
    });
    setTimeout(() => {
      this.setData({
        keyboardHeight: e.detail.height || 0,
      });
    }, 30);
  },
  // 输入框失去焦点时触发
  bindblurText(e) {
    this.setData({
      keyboardHeight: 0,
    });
  },
  // 监听跟进内容输入
  bindInputText(e) {
    this.data.FollowContent = e.detail.value;
    this.isSendData();
  },

  // 上传图片
  updateImage(e) {
    let types = e.currentTarget.dataset.type;
    let _this = this;

    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: [types],
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        let tempFilePaths = res.tempFilePaths || [];

        wx.showLoading({
          title: '图片上传中',
        });

        tempFilePaths.forEach(item => {
          _this.uploadFile('图片', item);
        });
      },
      fail(e) {
        console.log(e)
      }
    })
  },
  // 调用图片上传接——有图片和语音两种，time是语音多有的秒数
  uploadFile(types, path, time = '') {
    let _this = this;

    wx.uploadFile({
      url: FileUpLoad,
      filePath: path,
      name: 'file',
      success(res) {
        let data = JSON.parse(res.data);
        if (data.result === 'success') {
          let path = data.path.replace(/\|/, '');

          if (types === '图片') {
            // 上传成功之后，调用文件上传接口，拿到图片返回地址
            _this.InserCustomerFollowFile('图片', path);
          }
          if (types === '语音') {
            _this.InserCustomerFollowFile('语音', path, time);
          }
        } else {
          $Message({ content: types + '上传失败', type: 'error' });
        };
      },
      fail(error) {
        console.log(error)
        wx.hideLoading();
        $Message({ content: types + '上传失败', type: 'error' });
      }
    })
  },
  // 删除图片
  bindRemoveImg(e) {
    let { id, index } = e.currentTarget.dataset;
    let imageData = this.data.imageData;

    wx.showLoading({ title: '正在删除'});

    DelCustomerFollowFile({
      ProjectReceptionFollowFileID: id
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '删除成功', type: 'success' });
        imageData.splice(index, 1);
        this.setData({
          imageData
        });
        this.isSendData();
      } else {
        $Message({ content: '删除失败', type: 'error' });
      };
    });
  },
  // 添加客户跟进文件，time是语音秒数
  InserCustomerFollowFile(FileType, FileUrl, time = '') {
    InserCustomerFollowFile({
      ProjectReceptionFollowID: this.data.ProjectReceptionFollowID,
      FileType,
      FileUrl,
      Remark: time
    }).then(res => {
      wx.hideLoading();
      if (res.data.result === 'success') {
        // $Message({ content: FileType + '上传成功', type: 'success' });
        let data = res.data;

        if (FileType === '图片') {
          let imageData = this.data.imageData;

          imageData.push({
            path: URL_PATH + FileUrl,     // 拼接地址，用作显示
            ProjectReceptionFollowFileID: data.ProjectReceptionFollowFileID
          });
          this.setData({
            imageData,
            isSend: true
          });
        }

        if (FileType === '语音') {
          let recordData = this.data.recordData;

          recordData.push({
            tempFilePath: URL_PATH + FileUrl,     // 拼接地址，用作显示
            ProjectReceptionFollowFileID: data.ProjectReceptionFollowFileID,
            time
          });
          this.setData({
            recordData,
            isSend: true
          });
        }
      } else {
        wx.hideLoading();
        $Message({ content: FileType + '上传失败', type: 'error' });
      };
    });
  },

  /**
   * 录音功能
   */
  // 打开录音容器
  bindOpenRecord() {
    this.setData({
      IsShowRecord: true,
      IsShowShade: true
    });
  },
  // 开始录音
  bindRecordStart() {
    let recordStatus = this.data.recordStatus;

    // 判断当前录音状态，再次点击的时候，进去下一步状态
    if (recordStatus === 0) {
      this.setData({
        recordStatus: 1,      // 修改状态为 1 正在录音
        recordDesc: '开始录音'
      });
      this.recordStart();
    }
    if (recordStatus === 1) {
      this.setData({
        recordStatus: 2,      // 修改状态为 2 结束录音
      });
      this.recorderManager.stop();
    }
    // 播放录音
    if (this.data.recordPath.tempFilePath && recordStatus === 2 && !this.data.recordPlay) {
      this.setData({
        recordPlay: true
      });
      this.audioPlay(this.data.recordPath.tempFilePath);
    }
  },
  // 开始录音
  recordStart() {
    this.recorderManager.start({
      duration: this.data.recordDuration,
      format: 'mp3'
    });
    this.recorderManager.onStart(() => {
      this.setData({
        recordDesc: '正在录音...'
      });
      // 计时
      let num = 1;
      this.data.time = setInterval(() => {
        if (this.data.recordDurationTime >= (this.data.recordDuration / 1000)) {
          clearInterval(this.data.time);
          return false;
        }
        this.setData({
          recordDurationTime: num++
        });
      }, 1000);
    });
    this.recordStop();
  },
  // 监听结束录音
  recordStop() {
    this.recorderManager.onStop((res) => {
      this.data.recordPath = res;     // 保存当前录音数据
      
      this.setData({
        recordDesc: '完成录音',
        recordStatus: 2
      });
      clearInterval(this.data.time);
    });
    this.recorderManager.onError((err) => {
      this.setData({
        recordDesc: err.errMsg || '录音错误'
      });
      clearInterval(this.data.time);
    });
  },
  // 播放录音
  audioPlay(path) {
    this.innerAudioContext.src = path;
    this.innerAudioContext.play();
    this.innerAudioContext.onPlay(() => {
      this.setData({
        recordDesc: '正在播放录音'
      });
    });
    this.innerAudioContext.onEnded(() => {
      this.setData({
        recordPlay: false,
        recordDesc: '播放结束',
        currentRecordPlay: -1
      });
    });
    this.innerAudioContext.onError((res) => {
      this.setData({
        recordPlay: false,
        recordDesc: '录音错误',
        currentRecordPlay: -1
      });
    });
  },
  // 删除录音
  bindRemoveRecord() {
    this.data.recordPath = {};
    this.innerAudioContext.stop();
    this.setData({
      recordStatus: 0,
      recordPlay: false,
      recordDurationTime: 0,
      recordDesc: '点击开始录音',
    });
  },
  // 保存录音
  bindSaveRecord() {
    let recordPath = this.data.recordPath;
    
    recordPath.time = parseInt(recordPath.duration / 1000);   // 取秒数

    wx.showLoading({
      title: '语音上传中',
    });
    // 上传语音文件
    this.uploadFile('语音', recordPath.tempFilePath, recordPath.time);
    this.innerAudioContext.stop();
    this.data.recordPath = {};      // 清空临时文件

    this.setData({
      recordStatus: 0,
      recordPlay: false,
      recordDurationTime: 0,
      recordDesc: '点击开始录音',
    });
  },
  // 删除单个以保存的语音
  bindRemoveVoice(e) {
    let index = e.currentTarget.dataset.index;
    let recordData = this.data.recordData;

    recordData.splice(index, 1);
    this.recorderManager.stop();
    this.setData({
      recordData
    });
    this.isSendData();    // 判断是否可以发送
  },
  // 播放单条语音
  bindVoicePlay(e) {
    let index = e.currentTarget.dataset.index;
    
    this.innerAudioContext.stop();
    this.audioPlay(this.data.recordData[index].tempFilePath);
    this.setData({
      currentRecordPlay: index
    });
  }, 

  // 点击遮罩
  bindShade() {
    this.setData({
      IsShowRecord: false,
      IsShowShade: false
    })
  },
})