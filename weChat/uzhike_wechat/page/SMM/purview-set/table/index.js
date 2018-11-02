
const { $Message } = require('../../../../components/base/index');
import _fgj from '../../../../utils/util';
import { GetPurviewListByLayer } from '../../../../api/purview/purview';

Page({
  data: {
    ObjType: '',    // 对象类型   0：人员  1：用户组
    ObjID: '',      // 对象id
    groupName: '',     // 组名
    ParentNote: [],   // 父级层级，用来显示
    params: {
      pagetype: '1',   // 传递页面类型
      ParentID: '',   // 父级id
      LevelType: 1,   // 层级，当前层级是 1
    },
    tableData: [], // 当前表数据
    loading: false,    // 数据加载中
  },
  onLoad: function (options) {
    console.log('表', options);
    let { ObjType, ObjID, ParentID, groupName, ParentNote } = options;
    let params = this.data.params;

    params.ParentID = ParentID;
    this.setData({
      ObjType,
      ObjID,
      groupName,
      ParentNote: ParentNote.split(/,/),
      params
    });

    this.getTableData();    // 获取表数据
  },
  onReady: function () {
  },
  onShow: function () {
  },
  // 获取表数据
  getTableData() {
    wx.showLoading({ title: '加载中' });
    GetPurviewListByLayer(this.data.params).then(res => {
      let data = res.data;
      if (data.result === 'success') {
        this.setData({
          tableData: data.temptable
        })
      } else {
        // $Message({ content: data.msg, type: 'warning' });
      };
      wx.hideLoading();
      this.setData({ loading: true });
    })
  },
  // 打开项
  bindOpenItem(e) {
    console.log(e.currentTarget)
    let { purviewId, tableName, parentNote } = e.currentTarget.dataset;
    let data = this.data;

    let ParentNote = [].concat(data.ParentNote);
    ParentNote.push(parentNote);   // 拼接导航地址

    let params = {
      ObjType: data.ObjType,
      ObjID: data.ObjID,
      groupName: data.groupName,   // 组名
      ParentID: purviewId,
      tableName: tableName,      // 表名
      ParentNote: ParentNote.join(',')  // 父级名称
    };

    wx.navigateTo({
      url: '../item/index?' + _fgj.param(params)
    })
  },
  // 导航屑返回
  bindBack(e) {
    let { index } = e.currentTarget.dataset;
    let ParentNote = this.data.ParentNote;

    ++index;      // 默认是从 0 开始，所以要加 1

    // 最后一个是不能点的
    if (index === ParentNote.length) {
      return
    };

    wx.navigateBack({
      delta: Math.abs(index - ParentNote.length)
    });
  },
})