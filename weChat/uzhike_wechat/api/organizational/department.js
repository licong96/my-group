import fetch from '../../utils/fetch';

/**
 * 获取所有部门并根据条件筛选
 * @params { Object } params 参数集
 * @param { String } DeptNo 部门编号
 * @param { String } Layer 级别
 * @param { String } DeptType 类别
 * @param { String } likestr 模糊查询（匹配部门名称、全拼、简拼、电话、地址）
 */
export function GetAllDepartment(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'GetAllDepartment',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据层级及部门编号获取部门数据
 * @params { Object } params 参数集
 * @params { String } DeptNo  部门编号
 * @params { String } Layer		级别
 */
export function GetDepartmentByDeptNo(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'GetDepartmentByDeptNo',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 新增部门
 * @params { Object } params 参数集
 * @params { String } DeptName 部门名称
 * @params { String } Tel 电话
 * @params { String } Address 地址
 * @params { String } DeptType 部门类型
 * @params { String } FlagStatus 状态
 * @params { String } ParentDeptNo 上级部门编号
 * @params { String } Layer 级别
 */
export function InsertDepartment(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'InsertDepartment',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 修改部门
 * @params { Object } params 参数集
 * @params { String } DeptName 部门名称
 * @params { String } DeptID 部门id
 * @params { String } DeptName 部门名称
 * @params { String } Tel 电话
 * @params { String } Address 地址
 * @params { String } DeptType 部门类型
 */
export function UpDepartment(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'UpDepartment',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据id获取部门数据
 * @params { Object } params 参数集
 * @params { String } DeptID		部门id
 */
export function GetDepartmentByID(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'GetDepartmentByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 变更部门状态
 * @params { Object } params 参数集
 * @params { String } FlagStatus 状态
 */
export function UpDepartmentStatus(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'UpDepartmentStatus',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 获取默认组织架构部门
 * @params { Object } params 参数集
 */
export function GetDefaultDepartment(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'GetDefaultDepartment',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}