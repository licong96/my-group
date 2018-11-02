import fetch from '@/utils/fetch'

export function GetWaitingCheckEmpByID(EmpID) {
  const params = {
    todo: 'Employee',
    type: 'GetWaitingCheckEmpByID',
    valiurl: document.URL,
    needpurview: true,
    EmpID,
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// todo = Employee   type = upEmployee  EmpID = 用户id   Status = '正式'  isSendMsg = 2   receiveOpenID = 发送消息对象的openid   
export function upEmployee(EmpID, receiveOpenID, Status = '正式', isSendMsg = 2) {
  const params = {
    todo: 'Employee',
    type: 'upEmployee',
    valiurl: document.URL,
    needpurview: true,
    EmpID,
    Status,
    isSendMsg,
    receiveOpenID,
  }

  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}