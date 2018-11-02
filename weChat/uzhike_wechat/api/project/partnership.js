import fetch from '../../utils/fetch';

/**
 * 分页获取项目所有合作公司
 * @params { Object } params 参数集
 * @params { String } likestr	关键字
 * @params { String } page	页数
 * @params { String } ProjectID	项目id
 * @params { String } FlagStatus	审核状态
 * @params { String } BeginDate	开始时间
 * @params { String } EndDate	结束时间
 * @params { String } page	页数
 * 
 * **/
export function GetProjectUnionCompanyToPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectUnionControl',
    type: 'GetProjectUnionCompanyToPage',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}


/**
 * 合作审核
 * @params { Object } params 参数集
 * @params { String } ProjectUnionID	 合作id
 * @parsms { String } FlagStatus   审核状态
 */
export function UpProjectUnion(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectUnionControl',
    type: 'UpProjectUnion',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 申请合作
 * @params { Object } params 参数集
 * @params { String } ProjectUnionID	 合作id
 * @parsms { String } FlagStatus   审核状态
 */
export function SubProjectUnion(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectUnionControl',
    type: 'SubProjectUnion',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}