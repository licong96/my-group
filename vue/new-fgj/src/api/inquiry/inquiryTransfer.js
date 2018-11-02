import fetch from '@/utils/fetch'

// 抢客获取分页数据
export function GetGrabPageData (obj) {
  const params = {
    todo: 'Inquiry',
    type: 'GetGrabPageData',
    needpurview: true,
    valiurl: document.URL,
    page: obj.page,
    likestr: obj.likestr,
    order: obj.order,
    filing: obj.filing,
    rangSquare: obj.rangSquare,
    rangPrice: obj.rangPrice,
    Tag: obj.Tag,
    CustGrade: obj.CustGrade,
    status: obj.status
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 抢客请求
export function GrabInquiry (id) {
  const params = {
    todo: 'Inquiry',
    type: 'GrabInquiry',
    needpurview: true,
    valiurl: document.URL,
    InquiryID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 统计
export function GetGrabEasyStatistics () {
  const params = {
    todo: 'Inquiry',
    type: 'GetGrabEasyStatistics',
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据ID获取抢客数据
export function GetGrabByID (id) {
  const params = {
    todo: 'Inquiry',
    type: 'GetGrabByID',
    needpurview: true,
    valiurl: document.URL,
    InquiryID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}