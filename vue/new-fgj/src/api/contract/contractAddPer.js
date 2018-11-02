import fetch from '@/utils/fetch'

// 添加分成
export function insertData(params) {
  
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取分成数据
export function SelectByContractID(ContractID) {
  const params = {
    todo: 'ContractComm',
    type: 'SelectByContractID',
    valiurl: document.URL,
    needpurview: true,
    ContractID,
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取分成数据
export function upFlagDeleted(CommID, FlagDeleted) {
  const params = {
    todo: 'ContractComm',
    type: 'upFlagDeleted',
    valiurl: document.URL,
    needpurview: true,
    CommID,
    FlagDeleted,      // 0：启用  1：作废
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 发送喜报，先获取公司
export function GetEmployeeForDeptList(DeptID) {
  const params = {
    todo: 'Employee',
    type: 'GetEmployeeForDeptList',
    valiurl: document.URL,
    needpurview: true,
    DeptID
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 发送喜报
export function SendContractMsg(obj) {
  const params = Object.assign({}, {
    todo: 'Message',
    type: 'SendContractMsg',
    valiurl: document.URL,
    needpurview: true,
  }, obj)

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}