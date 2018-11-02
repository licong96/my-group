import fetch from '../../utils/fetch';

/**
 * 根据接待id获取当天报备记录
 * @params { Object } params 参数集
 * @params { String } ProjectReceptionID	接待id
 */
export function GetTodayReceptionUnion(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'GetTodayReceptionUnion',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 发送到访通知
 * @params { Object } params 参数集
 * @params { String } DProjectReceptionUnionID	接待关联id  带访  多个用，号分隔
 * @params { String } YProjectReceptionID	接待关联id   约访  多个用，号分隔
 */
export function SendReceptionMsg(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'SendReceptionMsg',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}