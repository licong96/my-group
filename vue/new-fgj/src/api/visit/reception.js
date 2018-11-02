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
export function UpNegoTiatePic(pic, InquiryID) {
  const params = {
    todo: 'Filing',
    type: 'UpNegoTiatePic',
    valiurl: document.URL,
    pic: pic,
    InquiryID: InquiryID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'post',
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
// 点击进度展现信息
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
export function up_Negotiate(EmpName,EmpID,Tel,DeclareID,ReceptionType) {
  const params = {
    todo: 'Filing',
    type: 'up_Negotiate',
    needpurview: true,
    EmpName: EmpName,
    EmpID: EmpID,
    Tel: Tel,
    ReceptionType: ReceptionType,
    valiurl: document.URL,
    DeclareID: DeclareID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 签约
export function InsertSub(EstateID, InquiryID,ContractNo,picSrc) {
  const params = {
    todo: 'Contract',
    type: 'InsertSubscriptionContract',
    EstateID: EstateID,
    InquiryID: InquiryID,
    ContractNo: ContractNo,
    needpurview: true,
    valiurl: document.URL,
    picSrc: picSrc
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'post',
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
export function SupplementNumber(CustMobileAll,DeclareID) {
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
