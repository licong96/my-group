import fetch from '@/utils/fetch'

// 管理人员
export function GetManagerEmloyee(id='') {
  const params = {
    todo: "Employee",
    type: "GetManagerEmloyee",
    needpurview: false,
    valiurl: document.URL,
    DeptID: id
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
