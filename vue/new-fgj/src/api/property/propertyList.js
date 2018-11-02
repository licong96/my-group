import fetch from '@/utils/fetch'

// 获取数据列表
export function getpagedata(params) {      // 一股脑全部传进来了
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取部门分级
export function GetDepartmentJson(External) {
  const params = {
    todo: 'Department',
    type: 'GetDepartmentJson',
    needpurview: true,
    valiurl: document.URL,
    External: External        // 1：不显示房管家的详细组织架构   0：显示所有组织架构
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 根据部门id获取人员
export function GetEmployeeJson(id) {
  const params = {
    todo: 'Employee',
    type: 'GetEmployeeJson',
    needpurview: true,
    valiurl: document.URL,
    DeptID: id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
