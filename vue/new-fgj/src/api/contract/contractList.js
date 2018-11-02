import fetch from '@/utils/fetch'

// 合同分页数据
export function getpagedata(params) {
  // const params = {
  //   todo: 'Contract',
  //   type: 'getpagedata',
  //   needpurview: true,
  //   valiurl: document.URL,
  //   page,
  //   CurrentProcess,
  //   Status,
  //   ContractKind,
  //   SearchDate,
  //   likestr,
  //   EstateID
  // }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 合同分页数据
export function GetDefaultProcessByType(ProcessType = 'Contract') {
  const params = {
    todo: 'Process',
    type: 'GetDefaultProcessByType',
    needpurview: true,
    valiurl: document.URL,
    ProcessType,      // 流程类型（表名）
  }
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
    needpurview: true,
    valiurl: document.URL,
    ContractID,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}