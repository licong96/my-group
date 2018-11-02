import fetch from '../../utils/fetch';

/**
 * 新增用户组
 * @params { Object } params 参数集
 * @param { String } ParentID 父级id
 * @param { String } GroupName 组名
 * @param { String } LevelType 层级
 */
export function InsertUserGroup(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'UserGroupControl',
    type: 'InsertUserGroup',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 修改用户组
 * @params { Object } params 参数集
 * @param { String } UserGroupID 用户组id
 * @param { String } GroupName 组名
 */
export function UpUserGroup(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'UserGroupControl',
    type: 'UpUserGroup',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 获取所有用户组
 */
export function GetAllUserGroup(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'UserGroupControl',
    type: 'GetAllUserGroup',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 获取用户组权限
 * @param { String } UserGroupID 用户组id
 */
export function GetUserGroupPurview(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'UserGroupControl',
    type: 'GetUserGroupPurview',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 修改用户组状态
 * @param { String } UserGroupID 用户组id
 * @param { String } FlagStatus 状态  0：作废  1:启用
 */
export function UpGroupStatus(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'UserGroupControl',
    type: 'UpGroupStatus',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}