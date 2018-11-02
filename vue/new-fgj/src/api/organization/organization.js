import fetch from '@/utils/fetch'

// 获取组织架构数据
export function GetOrganization() {
  const params = {
    todo: "Department",
    type: "GetOrganization",
    needpurview: true,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取职务
export function Position() {
  const params = {
    todo: "Position",
    type: "SelectData",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取状态
export function EmpStatus() {
  const params = {
    todo: "Reference",
    type: "SelectData",
    RefName: "EmpStatus",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取工作楼盘
export function Estate() {
  const params = {
    todo: "Estate",
    type: "SelectData",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}// 获取可选序号
export function SelectForDeptNo(Layer,deptNo) {
  const params = {
    todo: "Department",
    type: "SelectForDeptNo",
    valiurl: document.URL,
    Layer: Layer,
    deptNo: deptNo,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取部门简称
export function SelectForHeader() {
  const params = {
    todo: "Department",
    type: "SelectForHeader",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取部门类型
export function DeptType() {
  const params = {
    todo: "Reference",
    type: "SelectData",
    RefName: "DeptType",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 获取可选择部门数据
export function SelectByDeptID(DeptID) {
  const params = {
    todo: "Department",
    type: "SelectByDeptID",
    DeptID: DeptID,
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
//选择管理人员
export function GetEmployeeJson(DeptID) {
  const params = {
    DeptID: DeptID,
    todo: "Employee",
    type: "GetEmployeeJson",
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 新增部门,新增人员,修改编辑人员
export function addChange(paramsItem) {
  const params = paramsItem
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
//修改编辑部门
export function upDepartment(formItem,Layer,ManageOpenID) {
  const params = {
    todo: "Department",
    type: "upDepartment",
    DeptName: formItem.name,
    DeptNo: formItem.selectId,
    DeptType: formItem.selectKide,
    Layer:Layer,
    Header: formItem.selectName,
    FlagSale: formItem.selectKide === "业务" ? 1 : 0,
    Tel: formItem.tel,
    DeptID: formItem.DeptID,
    Address: formItem.address,
    ManageID: formItem.personValue[0],
    ManageOpenID: ManageOpenID,
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 部门作废开启
export function upFlagDeleted(DeptID,DeptNo,FlagDeleted) {
  const params = {
    todo: "Department",
    type: "upFlagDeleted",
    DeptID: DeptID,
    DeptNo: DeptNo,
    valiurl: document.URL,
    FlagDeleted: FlagDeleted,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 职位更改权限变化
export function upPurviewForEmpID(EmpID,PositionID) {
  const params = {
    todo: "Employee",
    type: "upPurviewForEmpID",
    EmpID: EmpID,
    PositionID: PositionID
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
//人员状态改变离职驻场转正
export function upEmployee(EmpID,receiveOpenID,OPResident) {
  const params = {
    todo: "Employee",
    type: "upEmployee",
    EmpID: EmpID,
    status: status,
    isSendMsg: 2,
    receiveOpenID: receiveOpenID,
    valiurl: document.URL,
    OPResident: OPResident
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 人员删除
export function deleteEmployee(EmpID) {
  const params = {
    todo: "Employee",
    type: "deleteEmployee",
    valiurl: document.URL,
    EmpID: EmpID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 人员数据转移
export function SumCount(todo,eID) {
  const params = {
    todo: todo,
    type: "SumCount",
    valiurl: document.URL,
    eID: eID,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 新增编辑人员
export function Selectbyid(EmpID) {
  const params = {
    todo: "Employee",
    type: "Selectbyid",
    EmpID: EmpID,
    valiurl: document.URL,
    needpurview: true
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}
// 邀请
export function please() {
  const params = {
    todo: "initjsapi",
    type:'getsdk',
    needpurview: false,
    valiurl: document.URL
  }
  return fetch({
    url:'/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

