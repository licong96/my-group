import fetch from '@/utils/fetch'

// 客户报备信息,搜索
export function GetDeclareByID(id) {
  const params = {
    todo: 'Filing',
    type: 'GetDeclareByID',
    needpurview: true,
    valiurl: document.URL,
    DeclareID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}