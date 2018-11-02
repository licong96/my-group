import fetch from '@/utils/fetch'

// 根据id获取消息及回复内容
export function GetMessageByID(MessageID) {
  const params = {
    todo: 'Message',
    type: 'GetMessageByID',
    needpurview: true,
    valiurl: document.URL,
    MessageID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}