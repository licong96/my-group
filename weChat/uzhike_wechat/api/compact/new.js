import fetch from '../../utils/fetch';

/**
 * 获取新建合同所需权限
 */
export function GetContractPurview() {
  const data = {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'GetContractPurview',
  };

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 新建合同
 * @params { Object } params 参数集
 */
export function InsertContract(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'InsertContract',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 修改合同
 * @params { Object } params 参数集
 */
export function UpContract(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'UpContract',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 根据合同id获取合同文件
 * @params { Object } params      参数集
 * @params { String } ContractID  合同ID
 */
export function GetContractFileByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'GetContractFileByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 批量删除合同文件
 * @params { Object } params      参数集
 * @params { String } FilesID     合同文件id
 */
export function DelContractFileByIDs(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractControl',
    type: 'DelContractFileByIDs',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
