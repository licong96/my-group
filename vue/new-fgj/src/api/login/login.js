import fetch from '@/utils/fetch'

// 权限赋予
export function upPurviewForEmpID(PositionID,EmpID) {
  const params = {
    todo: "Employee",
    type: "upPurviewForEmpID",
    PositionID: PositionID,
    EmpID: EmpID,
    needpurview: false,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 校验手机号
export function CheckIsMyMobile(Tel) {
  const params = {
    todo: "Login",
    type: "CheckIsMyMobile",
    needpurview: false,
    valiurl: document.URL,
    Tel: Tel
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 发送验证码
export function ModifyAccount(account) {
  const params = {
    todo: "Validate",
    type: "ModifyAccount",
    needpurview: false,
    valiurl: document.URL,
    account: account
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 注册
export function registered(formItem) {
  const params = formItem
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
export function GetDepartmentJson() {
  const params = {
    todo: 'Department',
    type: 'GetDepartmentJson',
    valiurl: document.URL,
    needpurview: false
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 验证
export function verifyLogin(routing) {
  const params = {
    todo: 'Employee',
    type: 'EmployeeIsNeedSupplement',
    valiurl: document.URL,
    needpurview: false,
    routing: routing
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}