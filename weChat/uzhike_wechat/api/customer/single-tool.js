import fetch from '../../utils/fetch';

/**
 * 根据电话号码获取所有到访记录
 * @params { Object } params 参数集
 * @params { String } CustTel 电话号码
 */
export function GetAllReceptionByTel(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'GetAllReceptionByTel',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据电话号码获取所有报备记录
 * @params { Object } params 参数集
 * @params { String } CustTel 电话号码
 */
export function GetAllDeclareByTel(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDeclareControl',
    type: 'GetAllDeclareByTel',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}