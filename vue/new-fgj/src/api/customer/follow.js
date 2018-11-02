import fetch from '@/utils/fetch'

// 跟进列表数据
export function GetFollow(InquiryID) {
  const params = {
    todo: 'InquiryFollow',
    type: 'GetFollow',
    InquiryID: InquiryID,
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 微信
export function initjsapi() {
  const params = {
    todo: 'initjsapi',
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Exec.aspx',
    method: 'get',
    params
  })
}

// 提交跟进
export function InsertFollow(InquiryID, serverId, content, voicetime, AlertInfo, AlertDate, AlertType) {
  const params = {
    todo: 'InquiryFollow',
    type: 'InsertFollow',
    valiurl: document.URL,
    InquiryID: InquiryID,
    Content: content,
    needpurview: true,
    voicetime: voicetime,
    serverId: serverId,
    AlertInfo: AlertInfo,
    AlertDate: AlertDate,
    AlertType: AlertType
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
