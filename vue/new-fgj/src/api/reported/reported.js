import fetch from '@/utils/fetch'

// 获取分页数据
export function getFiling(page, obj = {}) {
  const params = {
    todo: "Filing",
    type: "SelectAllFilingToPage",
    needpurview: true,
    valiurl: document.URL,
    page: page,
    SDeptNo: obj.SDeptNo,
    EstateID: obj.EstateID,
    filing: obj.filing,
    order: obj.order
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取公司选项
export function getDepartment() {
  const params = {
    todo: "Department",
    type: "GetDepartmentJson",
    needpurview: true,
    valiurl: document.URL,
    External: 1
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取楼盘选项
export function getEstate() {
  const params = {
    todo: "Estate",
    type: "GetSelectEstate",
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
