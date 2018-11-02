import fetch from '../../utils/fetch';

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
 * 修改关系
 */
export function UpdateCustLink(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerLinkControl',
    type: 'UpdateCustLink',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除关系
 */
export function DelCustLink(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerLinkControl',
    type: 'DelCustLink',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
