import fetch from '@/utils/fetch'

// 获取消息权限
export function GetMessagePurview() {
  const params = {
    todo: 'Message',
    type: 'GetMessagePurview',
    needpurview: true,
    valiurl: document.URL,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 新建消息
export function InsertMessage(params) {
  // const params = {
  //   todo: "Message",
  //   type: "InsertMessage",
  //   needpurview: true,
  //   valiurl: document.URL,
  // }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}