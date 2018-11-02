import fetch from '../../utils/fetch';

/**
 * 获取合同列表
 * @params { Object } params 参数集
 */
export function GetContractPageLists(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'GetContractPageLists',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}