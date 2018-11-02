import fetch from '../../utils/fetch';

/**
 * 新增楼盘
 * @params { Object } params 参数集
 * @params { String } CityID	城市id
 * @params { String } DistrictName	区域名
 * @params { String } EstateName	楼盘名
 * @params { String } Address	地址
 * @params { String } CoverImgUrl	封面图
 */
export function InsertEstate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'InsertEstate',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 修改楼盘
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘id
 * @params { String } CityID	城市id
 * @params { String } DistrictName	区域名
 * @params { String } EstateName	楼盘名
 * @params { String } Address	地址
 * @params { String } CoverImgUrl	封面图
 */
export function UpdateEstate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'UpdateEstate',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 根据楼盘id获取楼盘数据
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘id
 */
export function GetEstateByID(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'GetEstateByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
