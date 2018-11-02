import fetch from '../../utils/fetch';

/**
 * 新增接待
 * @params { Object } params 参数集
 * @params { String } ProjectID	项目id
 * @params { String } CustTel	报备号码
 * @params { String } FollowPerson	随性人员  先生13546521548|女士13645215482
 */
export function InsertReception(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'InsertReception',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}