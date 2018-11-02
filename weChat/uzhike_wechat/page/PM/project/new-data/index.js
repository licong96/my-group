// pages/project/new-data/index.js

const { $Message } = require('../../../../components/base/index');
import {  FileUpLoad} from '../../../../api/public';
import { InsertProjectData, UpProjectData,GetProjectDataByID,InsertProjectDataFile,DelProjectFile,DelAllProjectFile,   GetProjectFileByDataID } from '../../../../api/project/new-data';
import GUID from '../../../../utils/guid';
import _fgj from '../../../../utils/util.js';
import { URL_PATH } from '../../../../utils/config';

// 随机ID
const guid = new GUID();
const guidstr = guid.newGUID().toUpperCase();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    params: {
      DataType: ''
    },
    InsertProjectFile: { //上传文件参数298

    },
    DelProjectFile: { //删除文件参数

    },
    DataTypeArray: [{
        label: '请选择',
        value: ''
      }, {
        label: '项目销讲',
        value: '项目销讲'
      },
      {
        label: '项目资料',
        value: '项目资料'
      },
      {
        label: '项目政策',
        value: '项目政策'
      },
      {
        label: '项目规则',
        value: '项目规则'
      }
    ],
    disabled: false,
    loading: false,
    iconLoading: false, // 图片加载中
    imgCropperArray: [], //图片略缩图
  },

  onLoad: function(options) {
    console.log(options)
    let ProjectID = options.ProjectID
    let ProjectDataID = options.projectDataID
    let {
      InsertProjectFile,
      params
    } = this.data

    InsertProjectFile.ProjectID = ProjectID
    params.ProjectID = ProjectID

    // 判断是新建还是编辑
    if (ProjectDataID) {
      params.ProjectDataID = ProjectDataID
      DelProjectFile.ProjectDataID = ProjectDataID
      InsertProjectFile.ProjectDataID = ProjectDataID
      wx.setNavigationBarTitle({
        title: '编辑资料'
      });
      this.GetProjectDataByID(ProjectDataID); // 获取需要编辑的数据
      this.GetProjectFileByDataID(ProjectDataID)
    } else {
      params.ProjectDataID = guidstr
      DelProjectFile.ProjectDataID = guidstr
      InsertProjectFile.ProjectDataID = guidstr
      wx.setNavigationBarTitle({
        title: '添加资料'
      });
    }
    this.setData({
      options,
      params,
      DelProjectFile,
      InsertProjectFile
    })
  },

  onShow: function() {

  },
  // 根据项目资料id获取数据
  GetProjectDataByID(ProjectDataID) {
    let {
      params,
      imgCropperArray
    } = this.data;
    wx.showLoading({
      title: '加载中'
    });
    GetProjectDataByID({
      ProjectDataID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];
        let data = res.data.temptable
        params.Title = temptable.Title
        params.ProjectDataContent = temptable.ProjectDataContent
        params.DataType = temptable.DataType

        this.setData({
          params
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({
          content: res.data.msg,
          type: 'error'
        });
      }
    })
  },
  // 根据项目资料id获取文件数据
  GetProjectFileByDataID(ProjectDataID) {
    let {
      imgCropperArray
    } = this.data;
    wx.showLoading({
      title: '加载中'
    });
    GetProjectFileByDataID({
      ProjectDataID
    }).then(res => {
      // console.log(res)
      if (res.data.result === 'success') {
        let temptable = res.data.temptable[0];

        let data = res.data.temptable
        data.forEach(item => {
          let imgData = {
            src: URL_PATH + item.Url,
            ProjectFileID: item.ProjectFileID
          }
          imgCropperArray.push(imgData)
        })

        this.setData({
          imgCropperArray,
        });
        wx.hideLoading();
      } else {
        wx.hideLoading();
        $Message({
          content: res.data.msg,
          type: 'error'
        });
      }
    })
  },
  //监听标题内容
  bindTitleChange(e) {
    let params = this.data.params
    params.Title = e.detail.value
    this.setData({
      params
    })
  },
  //监听内容
  bindContentChange(e) {
    let params = this.data.params
    params.ProjectDataContent = e.detail.value
    this.setData({
      params
    })
  },
  //监听选择资料类型
  bindDataTypeChange(e) {
    let {
      params,
      DataTypeArray
    } = this.data
    params.DataType = DataTypeArray[e.detail.value].value
    console.log(params)
    this.setData({
      params
    })
    console.log(e)
  },
  //添加图片
  bingAddImg(e) {
    let _this = this
    wx.chooseImage({
      count: 99999, // 添加多张
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success(res) {
        console.log(res)
        let tempFilePaths = res.tempFilePaths[0];
        _this.uploadFile(tempFilePaths)
      },
      fail(e) {
        console.log(e)
      }
    });
  },
  //添加附件
  bindAddFile(e) {
    let _this = this
    wx.chooseImage({
      success: function(res) {
        var tempFilePaths = res.tempFilePaths
        wx.saveFile({
          tempFilePath: tempFilePaths[0],
          success: function(res) {
            console.log(res)
            var savedFilePath = res.savedFilePath
          }
        })
      }
    })
  },
  // 调用上传接口
  uploadFile(path) {
    let _this = this;
    let {  params,  imgCropperArray,  InsertProjectFile  } = this.data;
    console.log(imgCropperArray)
    wx.showLoading({
      title: '上传中',
    });
    _this.setData({
      iconLoading: true
    })

    wx.uploadFile({
      url: FileUpLoad,
      filePath: path,
      name: 'file',
      success(res) {
        console.log(res)
        let data = JSON.parse(res.data);
        if (data.result === 'success') {
          InsertProjectFile.Url = data.path.replace(/\|/, '');
          InsertProjectFile.FileName = '.' + data.path.replace(/\|/, '').split(".")[1]
          imgCropperArray.push({
            src: URL_PATH + data.sm_path.replace(/\|/, '')
          }) // URL_PATH 拼接图片地址，用来显示
          console.log(InsertProjectFile)
          _this.setData({
            params,
            imgCropperArray
          });
          _this.InsertProjectDataFile(InsertProjectFile)
          // $Message({ content: '上传成功', type: 'success' });
        } else {
          $Message({
            content: '上传失败',
            type: 'error'
          });
        };
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        })
      },
      fail(error) {
        wx.hideLoading();
        _this.setData({
          iconLoading: false
        });
        $Message({
          content: '图片上传失败',
          type: 'error'
        });
      }
    })
  },
  //删除全部图片
  DelAllProjectFile(e) {
    let ProjectDataID = {
      ProjectDataID: this.data.params.ProjectDataID
    }
    let _this = this

    wx.showModal({
      title: '提示',
      content: '确定是否删除全部图片',
      success: function(res) {
        if (res.confirm) {

          DelAllProjectFile(ProjectDataID).then(res => {
            wx.hideLoading();
            _this.setData({
              disabled: false,
              loading: false
            });
            if (res.data.result === 'success') {
              $Message({
                content: '删除成功',
                type: 'success'
              });
              _this.setData({
                imgCropperArray: []
              })
            } else if (res.data.result === '权限不足') {
              $Message({
                content: '权限不足，请先登录',
                type: 'success'
              });
            } else {
              $Message({
                content: res.data.msg,
                type: 'error'
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  },
  //删除图片
  DelProjectFile(e) {
    let _this = this

    let index = e.currentTarget.dataset.index
    let imgCropperArray = this.data.imgCropperArray

    wx.showModal({
      title: '提示',
      content: '确定是否删除',
      success: function(res) {
        if (res.confirm) {

          imgCropperArray.splice(index, 1)

          DelProjectFile.ProjectFileID = e.currentTarget.dataset.projectId;
          DelProjectFile(DelProjectFile).then(res => {
            wx.hideLoading();
            _this.setData({
              disabled: false,
              loading: false
            });
            if (res.data.result === 'success') {
              $Message({
                content: '删除成功',
                type: 'success'
              });
              _this.setData({
                imgCropperArray
              })
            } else if (res.data.result === '权限不足') {
              $Message({
                content: '权限不足，请先登录',
                type: 'success'
              });
            } else {
              $Message({
                content: res.data.msg,
                type: 'error'
              });
            }
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  //新增项目资料文件
  InsertProjectDataFile(e) {
    let _this = this
    let {
      InsertProjectFile,
      imgCropperArray
    } = this.data;
    let length = imgCropperArray.length - 1
    wx.showLoading({
      title: '加载中'
    });

    InsertProjectDataFile(InsertProjectFile).then(res => {
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        console.log(res.data.ProjectFileID)
        imgCropperArray[length].ProjectFileID = res.data.ProjectFileID
        $Message({
          content: '上传成功',
          type: 'success'
        });
        _this.setData({
          imgCropperArray
        })
      } else if (res.data.result === '权限不足') {
        $Message({
          content: '权限不足，请先登录',
          type: 'success'
        });
      } else {
        $Message({
          content: res.data.msg,
          type: 'error'
        });
      }
    })
  },
  // 点击提交
  bindSubmit() {
    let {
      params,
      imgCropperArray
    } = this.data;
    let verify = this.verifyData(params); // 验证数据
    let FileCount = imgCropperArray.length
    params.FileCount = FileCount
    console.log(params)
    if (verify.status) {
      this.setData({
        disabled: true,
        loading: true
      });
      console.log(this.data.options.projectDataID)
      if (!this.data.options.projectDataID) {
        this.InsertProjectData(); // 添加资料
      } else {
        this.UpProjectData(); // 编辑资料
      }
    } else {
      $Message({
        content: verify.msg,
        type: 'error'
      });
    }
  },
  //添加资料
  InsertProjectData(e) {
    let params = this.data.params;
    wx.showLoading({
      title: '加载中'
    });

    InsertProjectData(params).then(res => {
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({
          content: '添加成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({
          content: res.data.msg,
          type: 'error'
        });
      }
    })
  },
  //修改数据
  UpProjectData(e) {
    let params = this.data.params;
    console.log(params)
    wx.showLoading({
      title: '加载中'
    });
    UpProjectData(params).then(res => {
      // console.log(res)
      wx.hideLoading();
      this.setData({
        disabled: false,
        loading: false
      });
      if (res.data.result === 'success') {
        $Message({
          content: '编辑成功',
          type: 'success'
        });
        setTimeout(() => {
          wx.navigateBack();
        }, 1500);
      } else {
        $Message({
          content: res.data.msg,
          type: 'error'
        });
      }
    })
  },
  // 验证数据
  verifyData(data) {
    let result = {
      status: false,
      msg: '错误提示'
    };
    if (!_fgj.verify(data.Title, 'require')) {
      result.msg = '请填写标题';
      return result;
    };
    if (!_fgj.verify(data.ProjectDataContent, 'require')) {
      result.msg = '请填写内容';
      return result;
    };
    if (!_fgj.verify(data.DataType, 'require')) {
      result.msg = '请选择资料类型';
      return result;
    };
    result.status = true;
    result.msg = '验证通过';

    return result;
  },
  //放大图片
  enlargeImage(e) {
    let src = e.currentTarget.dataset.src
    console.log(src)
    let imgCropperArray = this.data.imgCropperArray
    let imgArray = []
    imgCropperArray.forEach(item => {
      imgArray.push(item.src)
    });
    console.log(imgCropperArray)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgArray // 需要预览的图片http链接列表
    })
  }
})