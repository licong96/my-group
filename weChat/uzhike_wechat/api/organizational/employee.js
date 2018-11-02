import fetch from '../../utils/fetch';

/**
 * 根据部门id获取用户数据
 * @params { Object } params 参数集
 * @param { String } DeptID 部门id
 */
export function GetEmployeeByDeptID(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetEmployeeByDeptID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据用户id获取用户信息
 * @params { Object } params 参数集
 * @param { String } EmpID 用户id
 */
export function GetEmployeeByID(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetEmployeeByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 修改用户信息
 * @params { Object } params 参数集
 * @params { String } UserGroupID 用户组id
 * @params { String } EmpID 人员id
 * @params { String } DeptID 部门id
 * @params { String } PositionID 职务id
 * @params { String } EmpName 用户名称
 * @params { String } Sex 性别
 * @params { String } Birthday 生日
 * @params { String } Remark 备注
 * @params { String } JoinDate 加入时间
 * @params { String } Source 来源
 * @params { String } EmpImg 头像
 */
export function UpEmployee(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'UpEmployee',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 获取用户权限
 * @params { Object } params 参数集
 * @params { String } EmpID 用户id
 */
export function GetUserEmpPurview(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetUserGroupPurview',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 关键词搜索
 * @params { Object } params 参数集
 * @params { String } likestr 用户id
 */
export function GetAllEmployee(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetAllEmployee',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}