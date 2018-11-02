import fetch from '../../utils/fetch';

/**
 * 获取我的项目列表
 * @params { Object } params 参数集
 * @params { String } likestr	关键字
 * @params { String } page	页数
 * **/
export function GetUnionProjectToPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'GetUnionProjectToPage',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}


/**
 * 获取项目列表（项目集市）
 * @params { Object } params 参数集
 * @params { String } likestr	关键字
 * @params { String } DeclareType	报备类型
 * @params { String } CityID	城市id
 * @params { String } NeedBringCust  是否需要带访
 * @params { String } CommissionMode	佣金模式
 * @params { String } SettlementDesc	结算模式描述
 * @params { String } order	排序
 * @params { String } page	页数
 * 
 * **/
export function GetProjectToPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'GetProjectToPage',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除项目
 * @params { Object } params 参数集
 * @params { String } ProjectID	 项目id
 */
export function DelProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'DelProject',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
