import fetch from '@/utils/fetch'

// 通讯录列表
export function contactList() {
  const params = {
    todo: "Employee",
    type: "SelectForContact",
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
