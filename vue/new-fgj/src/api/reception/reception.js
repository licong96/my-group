import fetch from '@/utils/fetch'

// 客户列表,筛选用户
export function SelectVisitByEstate(paramsItem) {
  const params = paramsItem
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 新增图片跟进
export function UpNegoTiatePic(obj) {
  const params = {
    todo: 'Filing',
    type: 'UpNegoTiatePic',
    valiurl: document.URL,
    pic: obj.pic,
    InquiryID: obj.InquiryID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'post',
    params
  })
}
// 文本跟进
export function InsertFollow(obj = {}) {
  const params = {
    todo: 'InquiryFollow',
    type: 'InsertFollow',
    valiurl: document.URL,
    needpurview: true,
    InquiryID: obj.InquiryID,
    Content: obj.Content,
    voicetime: obj.voicetime,
    serverId: obj.serverId
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 加载销控楼盘四级信息
export function SalesControl(EstateID) {
  const params = {
    todo: 'SalesControl',
    type: 'GetSalesJsonDate',
    valiurl: document.URL,
    needpurview: true,
    EstateID: EstateID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取可指派人员列表
export function SelectNegotiatePersonByEstate(EstateID) {
  const params = {
    todo: 'Employee',
    type: 'SelectNegotiatePersonByEstate',
    EstateID: EstateID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 接待
export function up_Negotiate(obj = {}) {
  const params = {
    todo: 'Filing',
    type: 'up_Negotiate',
    needpurview: true,
    valiurl: document.URL,
    EmpName: obj.EmpName,
    EmpID: obj.EmpID,
    Tel: obj.Tel,
    ReceptionType: obj.ReceptionType,
    DeclareID: obj.DeclareID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 销控
export function UpRoomStatus(InquiryID,RoomID,RoomNo) {
  const params = {
    valiurl: document.URL,
    todo: 'SalesControl',
    type: 'UpRoomStatus',
    needpurview: true,
    InquiryID: InquiryID,
    RoomID: RoomID,
    RoomNo:RoomNo
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 编辑
export function UpANegotiate(NickName,InquiryID) {
  const params = {
    todo:'Filing',
    type: 'UpANegotiateInquiryNames',
    NickName: NickName,
    needpurview: true,
    InquiryID: InquiryID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 补全号码
export function SupplementNumber(CustMobileAll, DeclareID) {
  const params = {
    todo:'Filing',
    type: 'SupplementNumber',
    CustMobileAll: CustMobileAll,
    DeclareID: DeclareID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 修改客户名称
export function upInquiry(InquiryID, NickName) {
  const params = {
    todo:'Inquiry',
    type: 'upInquiry',
    InquiryID,
    NickName,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 签约请求
export function InsertSubscriptionContract(params) {
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'post',
    params
  })
}