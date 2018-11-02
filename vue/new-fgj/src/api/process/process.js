import fetch from '@/utils/fetch'

// 获取流程模板列表
export function GetProcessList() {
  const params = {
    todo: 'Process',
    type: 'GetProcessList',
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 新建和编辑流程模板
export function addANDuploader(type, ProcessType, ProcessName, ProcessItemName, ProcessModelNo = '') {
  const params = {
    todo: 'Process',
    type: type,
    needpurview: true,
    valiurl: document.URL,
    ProcessType,
    ProcessName,
    ProcessItemName,
    ProcessModelNo,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 删除流程
export function DelProcessModel(ProcessModelNo) {
  const params = {
    todo: 'Process',
    type: 'DelProcessModel',
    needpurview: true,
    valiurl: document.URL,
    ProcessModelNo,
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 设置取消默认流程
export function SetDefaultProcessTran(ProcessType, ProcessModelNo, IsDefault) {
  const params = {
    todo: 'Process',
    type: 'SetDefaultProcessTran',
    needpurview: true,
    valiurl: document.URL,
    ProcessType,
    ProcessModelNo,
    IsDefault,        // 0取消、1设置
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}