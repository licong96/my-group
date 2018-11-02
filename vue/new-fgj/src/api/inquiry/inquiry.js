import fetch from '@/utils/fetch'
import { post } from '@/utils/index'

// 客户报备信息,搜索
export function customer(paramsItem) {
  const params = {
    todo: 'Inquiry',
    type: 'getpagedata',
    valiurl: document.URL,
    needpurview: true,
    page: paramsItem.page,
    likestr: paramsItem.likestr,
    SEmpID: paramsItem.SEmpID,
    SDeptNo: paramsItem.SDeptNo,
    CustGrade: paramsItem.CustGrade,
    Tag: paramsItem.Tag,
    order: paramsItem.order,
    rangSquare: paramsItem.rangSquare,
    rangPrice: paramsItem.rangPrice,
    status: paramsItem.status,
    source: paramsItem.source,
    privy: paramsItem.privy,
    SearchDate: paramsItem.SearchDate,    // 时间段
    DateType: paramsItem.DateType,    // 时间选项
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 获取部门分级
export function getDepartment(External) {
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
export function getEmployee(id) {
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

// 加载标签选项
export function InquiryTag() {
  const params = {
    todo: 'Reference',
    type: 'SelectByNameToJson',
    needpurview: true,
    valiurl: document.URL,
    RefName: 'InquiryTag'
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 修改状态
export function upInquiry(id, Status) {
  const params = {
    todo: 'Inquiry',
    type: 'upInquiry',
    needpurview: true,
    valiurl: document.URL,
    InquiryID: id,
    Status: Status
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 楼盘数据
export function getEstate() {
  const params = {
    todo: 'Estate',
    type: 'GetOnlineEstate',
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 检查是否报备决定勾选框显示
export function checkShow(EstateID, InquiryID) {
  return post({
    todo: "Inquiry",
    type: "CheckInquiryIsDeclareByEstateID",
    valiurl: document.URL,
    needpurview: true,
    EstateID: EstateID,
    InquiryID: InquiryID,
  })
}

// 检查是否可以报备
export function CheckCanDeclare(InquiryID, EstateID, tel) {
  const params = {
    todo: 'Filing',
    type: 'CheckCanDeclare',
    valiurl: document.URL,
    needpurview: true,
    EstateID: EstateID,
    InquiryID: InquiryID,
    tel: tel
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

// 报备操作
export function TranFiling(InquiryID, EstateID, estatename) {
  const params = {
    todo: 'Filing',
    type: 'TranFilingInquiryForEstate',
    needpurview: 'true',
    valiurl: document.URL,
    InquiryID: InquiryID,
    EstateID: EstateID,
    estatename: estatename
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}