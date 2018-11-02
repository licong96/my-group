const state = {
  screenData: {},   // 报备大厅筛选数据
  BMap: {},         // 百度地图经纬度
  estateEdit: {},   // 楼盘编辑
  echartScreen: {   // 图表筛选，当前选中的筛选值，通过判断name值，来分辨是在哪个页面进行筛选
    dateType: 'week',
    name: '用户注册'
  },
  echartScreenChurrent: {},  // 图表筛选，筛选完后，保存筛选值，传给筛选组件，用来显示当前对应页面选中的值
  IsShowScreen: {},          // 图表筛选，根据不同的页面需求，显示不同的筛选条件 
  loaderCenter: false,     // 是否显示等待提示
  mailReply: false,       //  邮件，是否添加了立即回复 
  mailLikestr: '',       //  邮件，列表搜索 
  MessageType: '',       //  邮件，类型
  contractOneData: {},  // 合同列表，修改详细修改之后，列表数据同步更新
}

export default state