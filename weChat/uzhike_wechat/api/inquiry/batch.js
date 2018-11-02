import fetch from '../../utils/fetch';

/**
 * 新增报备
 */
export function InsertDeclare(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDeclareControl',
    type: 'InsertDeclare',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 根据客户id集合获取客户数据
 */
export function GetCustomerByIDs(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'GetCustomerByIDs',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
