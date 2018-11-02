import fetch from '../../utils/fetch';

/**
 * 根据接待id获取接待记录
 * @params { Object } params 参数集
 * @params { String } ProjectReceptionID	接待id
 */
export function GetReceptionist(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'GetReceptionist',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 对接待历史记录添加随行人员
 * @params { Object } params 参数集
 * @params { String } ProjectReceptionID	接待id
 * @params { String } FollowPerson	随行人员内容
 */
export function InsertFollowPerson(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'InsertFollowPerson',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}