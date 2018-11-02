import fetch from '@/utils/fetch'
import qs from "qs"
import axios from 'axios'

// 新建合同
export function insertData(params) {
  
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 修改合同
export function upContract(params) {
  return axios
    .post(
    "/Handler/Handler.ashx",
    qs.stringify(params)
    )
}

// 根据合同id获取合同
export function SelectByID(ContractID) {
  const params = {
    todo: 'Contract',
    type: 'SelectByID',
    valiurl: document.URL,
    needpurview: true,
    ContractID
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取楼盘数据
export function GetEstateByKey(key) {
  const params = {
    todo: 'Estate',
    type: 'GetEstateByKey',
    valiurl: document.URL,
    needpurview: true,
    key
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 根据楼盘ID获取销控选项
export function GetSalesDateToSelect(EstateID, ContractID) {
  const params = {
    todo: 'SalesControl',
    type: 'GetSalesDateToSelect',
    valiurl: document.URL,
    needpurview: true,
    EstateID,
    ContractID,        // 修改的时候上传
    FlagDeleted: 0,   // 默认传0
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 关键字获取部门人员数据
export function GetEmployeeInfoByPara(key) {
  const params = {
    todo: 'Employee',
    type: 'GetEmployeeInfoByPara',
    valiurl: document.URL,
    needpurview: true,
    key
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 检测合同是否存在
export function checkContractNoOnly(ContractNo, EstateID, FlagDeleted = 0) {
  const params = {
    todo: 'Contract',
    type: 'checkContractNoOnly',
    valiurl: document.URL,
    needpurview: true,
    ContractNo,
    EstateID,
    FlagDeleted: FlagDeleted
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}