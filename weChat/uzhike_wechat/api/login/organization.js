import fetch from '../../utils/fetch';

/**
 * 新增默认部门
 * @params { Object } params   参数集
 * @params { String } DeptName 部门名称 多个用|号分隔
 */
export function InsertDefaultDepartment(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'DepartmentControl',
    type: 'InsertDefaultDepartment',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
