
const { $Message } = require('../../../../components/base/index');
import { InsertUserGroup, GetAllUserGroup, UpUserGroup, UpGroupStatus } from '../../../../api/userGroup/userGroup';

Page({
  data: {
    groupData: [],
    modalType: 'new',    // 记录弹窗当前的作用，是新建还是编辑
    UserGroupID: '',    // 记录要编辑的用户组ID
    loading: false,    // 加载中
    isClick: false,   // 只能点一次
  },
  onLoad: function (options) {
    this.modalInput = this.selectComponent('#modalInput');
    wx.showLoading({ title: '加载中' });
    this.getGroupData();    // 获取所有用户组数据
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 获取所有用户组数据
  getGroupData() {
    GetAllUserGroup().then(res => {
      console.log(res)
      wx.hideLoading();
      this.setData({loading: true});
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          groupData: data.temptable
        });
      } else {
        $Message({ content: data.msg, type: 'warning' })
      }
    })
  },
  // 新建用户组
  bindNew() {
    this.data.modalType = 'new';
    this.modalInput.onShowModal();
  },
  // 模态输入框返回事件
  bindModalInput(e) {
    console.log(e)
    let data = this.data;
    let GroupName = e.detail.inputValue;
    if (!this.data.isClick) {
      this.data.isClick = true;
      if (data.modalType === 'new') {
        this.newGroup(GroupName);    // 新建用户组
      }
      else if (data.modalType === 'edit') {
        this.editGroup(GroupName)   // 编辑用户组
      }
    }
  },
  // 新建用户组
  newGroup(GroupName) {
    wx.showLoading({ title: '加载中' });
    InsertUserGroup({
      GroupName
    })
      .then(res => {
        wx.hideLoading();
        this.data.isClick = false;
        this.modalInput.onHideModal();
        console.log(res)
        if (res.data.result === 'success') {
          $Message({ content: '新建成功', type: 'success' });
          this.getGroupData();    // 新建成功后再次获取所有用户组数据
        } else {
          $Message({ content: res.data.msg, type: 'error' });
        }
      })
  },
  // 用户组操作
  bindActionSheet(e) {
    let _this = this;
    let { userGroupId, groupName, flagStatus } = e.currentTarget.dataset;
    let itemList = [];
  
    // 判断当前状态，显示相应的操作
    if (flagStatus === '0') {
      itemList = ['启用']
    } else {
      itemList = ['禁用', '编辑', '设置权限']
    }

    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        _this.data.UserGroupID = userGroupId;

        // 禁用状态下只有一个操作
        if (flagStatus === '0' && res.tapIndex === 0) {
          _this.UpGroupStatus(userGroupId, '1');
          return;
        };

        // 启用状态下有三个操作
        if (flagStatus !== '1') {
          return;
        };
        
        switch(res.tapIndex) {
          case 0:
            _this.UpGroupStatus(userGroupId, '0');
          break;
          case 1:
            _this.actionEdit(groupName);
          break;
          case 2:
            wx.navigateTo({
              url: '../../purview-set/list/index?ObjType=1&ObjID=' + userGroupId
            });
          break;
          default:
            console.log('tapIndex异常')
        }
      },
      fail: function (res) {
        // console.log(res.errMsg)
      }
    })
  },
  // 编辑用户组弹窗
  actionEdit(GroupName) {
    this.data.modalType = 'edit';
    this.modalInput.onShowModal({
      inputValue: GroupName
    });
  },
  // 编辑用户组
  editGroup(GroupName) {
    wx.showLoading({ title: '加载中' });
    let UserGroupID = this.data.UserGroupID;
    UpUserGroup({
      UserGroupID,
      GroupName
    })
      .then(res => {
        wx.hideLoading();
        this.data.isClick = false;
        this.modalInput.onHideModal();
        console.log(res)
        if (res.data.result === 'success') {
          $Message({ content: '编辑成功', type: 'success' });
          this.getGroupData();    // 新建成功后再次获取所有用户组数据
        } else {
          $Message({ content: res.data.msg, type: 'error' });
        }
      })
  },
  // 修改用户组状态
  UpGroupStatus(UserGroupID, FlagStatus) {
    wx.showLoading({ title: '加载中' });
    UpGroupStatus({
      UserGroupID,
      FlagStatus
    })
    .then(res => {
      // console.log(res)
      wx.hideLoading();
      if (res.data.result === 'success') {
        $Message({ content: '修改成功', type: 'success' }); 
        this.getGroupData();    // 获取所有用户组数据
      } else {
        $Message({ content: res.data.msg, type: 'error' });
      }
    })
  }
})