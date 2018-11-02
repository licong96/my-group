import fetch from '../../utils/fetch';

/**
 * 新增职务
 * @params { Object } params 参数集
 * @param { String } PositionName 职务名称
 * @param { String } PositionLevel 职务等级
 * @param { String } BaseSalary 基本薪资
 * @param { String } FloatSalary 浮动薪资
 */
export function InsertPosition(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'PositionControl',
    type: 'InsertPosition',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 修改职务
 * @params { Object } params 参数集
 * @param { String } PositionName 职务名称
 * @param { String } PositionLevel 职务等级
 * @param { String } BaseSalary 基本薪资
 * @param { String } FloatSalary 浮动薪资
 * @param { String } PositionID 职务id
 */
export function UpPosition(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'PositionControl',
    type: 'UpPosition',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据id获取职务信息
 * @params { Object } params 参数集
 * @param { String } PositionID 职务id
 */
export function GetPositionByID(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'PositionControl',
    type: 'GetPositionByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据条件获取职务信息
 * @params { Object } params 参数集
 * @param { String } PositionID 职务id
 * @param { String } PositionLevel 职务等级
 * @param { String } likestr 模糊搜索内容
 */
export function GetAllPosition(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'PositionControl',
    type: 'GetAllPosition',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}