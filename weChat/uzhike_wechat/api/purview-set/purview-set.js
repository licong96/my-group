import fetch from '../../utils/fetch';

/**
 * 设置权限
 * @param { String } ObjType 对象类型   0：人员  1：用户组
 * @param { String } ObjID   对象id
 * @param { String } PurviewValue 权限值打包 例 组名:表名-项名-值,表名-项名-值|组名:表名-项名-值..（只传已修改的整组或已经读取的整组）
 */
export function SetPurview(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'SetPurview',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 根据人员id将人员权限赋予用户组
 * @param { String } EmpID 人员id
 * @param { String } SetGroup   0：只赋予用户组   1：同时赋予同用户组用户
 */
export function SetPurviewToUserGroup(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'SetPurviewToUserGroup',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据用户组id将用户组权限赋予该组所有人员
 * @param { String } UserGroupID 用户组id
 */
export function SetPurviewToEmployee(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'SetPurviewToEmployee',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}