import fetch from '@/utils/fetch'

// 根据合同编号获取内容
export function GetContractBillData(DeptID, EstateID, Status, likestr) {
  const params = {
    todo: 'Contract',
    type: 'GetContractBillData',
    needpurview: true,
    valiurl: document.URL,
    DeptID,
    EstateID,
    Status,
    likestr
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 生成对账单
export function ProducedContractBillPic(ContractBillNo) {
  const params = {
    todo: 'Contract',
    type: 'ProducedContractBillPic',
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
// 发送对账单
export function SendContractBill(ContractBillNo) {
  const params = {
    todo: 'Contract',
    type: 'SendContractBill',
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
// 上传对账单
export function UpContractBillPic(ContractBillNo, VerifyPic) {
  const params = {
    todo: 'Contract',
    type: 'UpContractBillPic',
    needpurview: true,
    valiurl: document.URL,
    ContractBillNo,
    VerifyPic
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 审核对账单状态变更
export function UpContractBillStatus(ContractBillNo, Status) {
  const params = {
    todo: 'Contract',
    type: 'UpContractBillStatus',
    needpurview: true,
    valiurl: document.URL,
    ContractBillNo,
    Status
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
