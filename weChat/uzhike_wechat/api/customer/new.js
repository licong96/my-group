import fetch from '../../utils/fetch';

/**
 * 新增客户主体信息
 * @params { Object } params 参数集
 * CustID { String }	客户id,需前端生成guid
 */
export function InsertCustomer(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'InsertCustomer',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据客户id获取客户主体数据
 * @params { Object } params 参数集
 * CustID { CustID }	客户id
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
 * 根据客户id获取客户——需求数据
 * @params { Object } params 参数集
 * CustID { CustID }	客户id
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
 * 新增关系并新建关系人
 * @params { Object } params 参数集
 * CustID { String }	客户id,需前端生成guid
 */
export function InsertCustLink(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerLinkControl',
    type: 'InsertCustLink',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据客户id获取客户关系数据
 * @params { Object } params 参数集
 * CustID { CustID }	客户id
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

/**
 * 修改客户
 */
export function UpCustomer(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'UpCustomer',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}