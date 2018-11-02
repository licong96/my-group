const { $Message } = require('../../../../components/base/index');
import { FileUpLoad } from '../../../../api/public';
import { InsertProjectData, UpProjectData, GetProjectDataByID, InsertProjectDataFile, DelProjectFile, DelAllProjectFile, GetProjectFileByDataID } from '../../../../api/project/new-data';
import GUID from '../../../../utils/guid';
import _fgj from '../../../../utils/util.js';
import { URL_PATH } from '../../../../utils/config';

Page({
  data:{
    depORemp:{},
    ApprovalList:[], //审批人
    SendList:[],     //抄送人
    department:{},   //部门
    imgCropperArray: [], //图片略缩图
    InsertProjectFile: { //上传文件参数

    },
    DelProjectFile: { //删除文件参数

    },
  },
  onLoad(){
    
  },
  onShow: function () {
    let { depORemp, ApprovalList, SendList, department } = this.data
    if (depORemp.EmpID == undefined) {   //depORemp为空时不操作
      return
    }
    let index = wx.getStorageSync('index')
    if (index == 0) {
      ApprovalList.push(depORemp)
    } else if (index == 1) {
      SendList.push(depORemp)
    }else{
      department.DeptName = depORemp.DeptName
      department.DeptID = depORemp.DeptID
    }
    wx.removeStorageSync('index')
    this.setData({
      ApprovalList,
      SendList,
      department,
      depORemp: {}
    })
  },
  // 选择人物
  getPeople(e) {
    let index = e.currentTarget.dataset.index
    wx.setStorageSync('index', index)
    wx.navigateTo({
      url: '/page/public/select-dep-emp/index'
    })
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
  // 调用上传接口
  uploadFile(path) {
    let _this = this;
    let { params, imgCropperArray } = this.data;
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
          // InsertProjectFile.Url = data.path.replace(/\|/, '');
          // InsertProjectFile.FileName = '.' + data.path.replace(/\|/, '').split(".")[1]
          imgCropperArray.push(
             URL_PATH + data.sm_path.replace(/\|/, '')
          ) // URL_PATH 拼接图片地址，用来显示
          // console.log(InsertProjectFile)
          _this.setData({
            params,
            imgCropperArray
          });
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
      content: '确定是否删除全部照片',
      success: function (res) {
        if (res.confirm) {

          DelAllProjectFile(ProjectDataID).then(res => {
            wx.hideLoading();
            this.setData({
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
      success: function (res) {
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
  //放大图片
  enlargeImage(e){
    let src = e.currentTarget.dataset.src
    console.log(src)
    let imgCropperArray = this.data.imgCropperArray
    console.log(imgCropperArray)
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgCropperArray // 需要预览的图片http链接列表
    })
  }
})