import fetch from '../../utils/fetch';

/**
 * 获取单个客户跟进
 * CustFollowID { String } 跟进id
 * top { String } 获取条数  若需获取所有，则此参数不传或传0
 */
export function GetFollowByCustID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerFollowControl',
    type: 'GetFollowByCustID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
