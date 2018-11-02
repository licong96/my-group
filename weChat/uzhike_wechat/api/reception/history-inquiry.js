import fetch from '../../utils/fetch';

/**
 * 根据接待id获取历史关联报备数据
 * @params { Object } params 参数集
 * @params { String } ProjectReceptionID	接待id
 */
export function GetAllReceptionUnion(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'GetAllReceptionUnion',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}