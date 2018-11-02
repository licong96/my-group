import fetch from '@/utils/fetch'

// 获取流程模板列表
export function GetProcessByID(TypeID, ProcessType) {
  const params = {
    todo: 'Process',
    type: 'GetProcessByID',
    needpurview: true,
    valiurl: document.URL,
    TypeID,
    ProcessType,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
export function UpProcessStatus(obj = {}) {
  const params = {
    todo: 'Process',
    type: 'UpProcessStatus',
    needpurview: true,
    valiurl: document.URL,
    TypeID: obj.TypeID,
    ProcessType: obj.ProcessType,
    ProcessID: obj.ProcessID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}