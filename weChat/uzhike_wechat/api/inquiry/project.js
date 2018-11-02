import fetch from '../../utils/fetch';

/**
 * 获取所有可报备项目
 */
export function GetCanDeclareProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'GetCanDeclareProject',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 个人报备记录列表
 * @params { String } ProjectID 项目id
 * @params { String } likestr 模糊查询关键字
 * @params { String } IsExp 报备状态  过期：1  有效 ：0
 * @params { String } page 页数
 * @params { String } order "排序  最新报备   DeclareDate-desc 最新到访   VisitDate-desc"
 */
export function GetDeclareListToPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDeclareControl',
    type: 'GetDeclareListToPage',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
