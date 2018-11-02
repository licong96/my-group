import fetch from '@/utils/fetch'

// 客户报备信息,搜索
export function customer(paramsItem) {
  const params = {
    todo: 'Inquiry',
    type: 'getpagedata',
    valiurl: document.URL,
    needpurview: true,
    page: paramsItem.page,
    likestr:paramsItem.likestr,
    SEmpID: paramsItem.SEmpID,
    SDeptNo: paramsItem.SDeptNo,
    CustGrade: paramsItem.CustGrade,
    Tag: paramsItem.Tag,
    order: paramsItem.order,
    rangSquare: paramsItem.rangSquare,
    rangPrice: paramsItem.rangPrice,
    status: paramsItem.status
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 检查是否可以报备
export function CheckCanDeclare(InquiryID,EstateID,tel) {
  const params = {
    todo: 'Filing',
    type: 'CheckCanDeclare',
    valiurl: document.URL,
    needpurview: true,
    EstateID: EstateID,
    InquiryID: InquiryID,
    tel: tel
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 报备操作
export function TranFiling(InquiryID,EstateID,estatename) {
  const params = {
    todo: 'Filing',
    type: 'TranFilingInquiryForEstate',
    needpurview: 'true',
    valiurl: document.URL,
    InquiryID: InquiryID,
    EstateID: EstateID,
    estatename: estatename
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

//请求操作状态
export function upInquiry(item,Status) {
  const params = {
    todo: 'Inquiry',
    type: 'upInquiry',
    needpurview: true,
    valiurl: document.URL,
    InquiryID: item.InquiryID,
    Status: Status
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
//检查是否报备决定勾选框显示
export function checkShow(EstateID,InquiryID) {
  const params = {
    todo: 'Inquiry',
    type: 'CheckInquiryIsDeclareByEstateID',
    needpurview: true,
    EstateID:EstateID,
    InquiryID:InquiryID,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
