import fetch from '@/utils/fetch'

// 根据合同编号获取内容
export function GetContractByNo(ContractNo, DeptID) {
  const params = {
    todo: 'Contract',
    type: 'GetContractByNo',
    needpurview: true,
    valiurl: document.URL,
    ContractNo,
    DeptID,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 新增对账单批量
export function InsertContractBillTran(content) {
  const params = {
    todo: 'Contract',
    type: 'InsertContractBillTran',
    needpurview: true,
    valiurl: document.URL,
    content
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据对账单号获取对账单信息
export function GetContractBillByNo(ContractBillNo) {
  const params = {
    todo: 'Contract',
    type: 'GetContractBillByNo',
    needpurview: true,
    valiurl: document.URL,
    ContractBillNo
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 修改对账单
export function UpContractBillTran(content, ContractBillNo) {
  const params = {
    todo: 'Contract',
    type: 'UpContractBillTran',
    needpurview: true,
    valiurl: document.URL,
    content,
    ContractBillNo
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据部门id获取业绩相关合同
export function GetContractByDeptID(ContractID, DeptID, Status) {
  const params = {
    todo: 'Contract',
    type: 'GetContractByDeptID',
    needpurview: true,
    valiurl: document.URL,
    ContractID,
    DeptID,
    Status,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}