import fetch from '../../utils/fetch';

/**
 * 根据客户id获取客户数据
 */
export function GetCustByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'GetCustByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据客户CustID获取客户需求
 */
export function GetCustNeedByCustID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerNeedControl',
    type: 'GetCustNeedByCustID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据客户id获取客户关系数据
 */
export function GetCustomerLinkByCustID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerLinkControl',
    type: 'GetCustomerLinkByCustID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}