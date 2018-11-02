import fetch from '@/utils/fetch'

// 分类获取分页数据
export function GetMessagePageListByType(likestr, MessageType, page) {
  const params = {
    todo: 'Message',
    type: 'GetMessagePageListByType',
    needpurview: true,
    valiurl: document.URL,
    likestr,
    MessageType,
    page,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 消息设为已读
export function MessageSetReader(MessageID) {
  const params = {
    todo: 'Message',
    type: 'MessageSetReader',
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
// 获取未读消息条数
export function GetUnReadMessageCount() {
  const params = {
    todo: 'Message',
    type: 'GetUnReadMessageCount',
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}