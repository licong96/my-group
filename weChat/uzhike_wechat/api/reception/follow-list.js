import fetch from '../../utils/fetch';

/**
 * 获取单个接待跟进
 * @params { String } ProjectReceptionID	接待id
 * @params { String } top	获取条数  若需获取所有，则此参数不传或传0
 */
export function GetFollowByProjectReceptionID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'GetFollowByProjectReceptionID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
