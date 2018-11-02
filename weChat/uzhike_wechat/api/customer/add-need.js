import fetch from '../../utils/fetch';

/**
 * 新增客户需求
 */
export function InsertCustNeed(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerNeedControl',
    type: 'InsertCustNeed',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 修改客户需求
 */
export function UpdateCustNeed(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerNeedControl',
    type: 'UpdateCustNeed',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除客户需求
 */
export function DelCustNeed(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerNeedControl',
    type: 'DelCustNeed',
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
 * 根据客户CustNeedID获取客户需求
 */
export function GetCustNeedByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerNeedControl',
    type: 'GetCustNeedByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 单独修改客户需求到客户主体
 */
export function UpCustomerNeed(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'UpCustomerNeed',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}