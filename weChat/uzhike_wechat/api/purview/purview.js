import fetch from '../../utils/fetch';

/**
 * 获取权限模板（type传递  1:设置页面 0:模板管理）
 * @params { Object } params 参数集
 * @param { String } pagetype 传递页面类型
 * @param { String } ParentID 父级id 也就是上一级的PurviewID
 * @param { String } LevelType 层级
 */
export function GetPurviewListByLayer(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'GetPurviewListByLayer',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 新增权限组\表\项
 * @params { Object } params 参数集
 */
export function InsertPurview(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'InsertPurview',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 修改权限组\表\项
 * @params { Object } params 参数集
 */
export function UpPurview(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'UpPurview',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 修改状态
 * @params { Object } params 参数集
 * @param { String } PurviewID 权限id
 * @param { String } FlagStatus 0：作废  1：启用
 */
export function UpPurviewStatus(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'UpPurviewStatus',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 获取单独一条权限数据
 * @params { Object } params 参数集
 * @param { String } PurviewID 权限ID
 */
export function GetPurviewByID(params) {
  const data = Object.assign({}, {
    module: 'Purview',
    todo: 'PurviewControl',
    type: 'GetPurviewByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}