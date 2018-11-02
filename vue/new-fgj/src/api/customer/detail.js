import fetch from '@/utils/fetch'

// 取电
export function GetMobile(InquiryID) {
  const params = {
    type:'GetMobile',
    todo:'Inquiry',
    InquiryID:InquiryID,
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 客户详情
export function GetInquiryById(InquiryID) {
  const params = {
    todo: 'Inquiry',
    type: 'GetInquiryById',
    needpurview: 'true',
    valiurl: document.URL,
    InquiryID: InquiryID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 客户历史
export function GetInquiryOpHistory(InquiryID) {
  const params = {
    todo: 'Inquiry',
    type: 'GetInquiryOpHistory',
    needpurview: 'true',
    valiurl: document.URL,
    InquiryID: InquiryID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
