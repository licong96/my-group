import fetch from '../../utils/fetch';

/**
 * 根据合同id获取合同信息
 * @params { Object } params      参数集
 * @params { String } ContractID  合同id
 */
export function GetContractByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'GetContractByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}