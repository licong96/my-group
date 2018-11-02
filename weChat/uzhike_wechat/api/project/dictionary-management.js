import fetch from '../../utils/fetch';


/**
 * 分级获取字典列表
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘ID
 * @params { String } ParentID	上级id
 * @params { String } LevelType	数据级别  1：栋座  2：单元  3：楼层  4：房号
 * **/
export function GetEstateDictList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'GetEstateDictList',
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
