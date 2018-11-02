import fetch from '@/utils/fetch'

// 新增财务数据
export function insertData(params) {
  
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取财务数据
export function SelectByContractID(todo, ContractID) {
  const params = {
    todo: todo,
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

// 财务数据启用作废
export function upFlagDeleted(todo, FeeID, FlagDeleted) {
  const params = {
    todo: todo,
    type: 'upFlagDeleted',
    valiurl: document.URL,
    needpurview: true,
    FeeID,
    FlagDeleted,
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}