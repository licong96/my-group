import fetch from '../../utils/fetch';

/**
 * 分页获取楼盘数据
 * @params { Object } params 参数集
 * @params { String } likestr 关键字
 * @params { String } Tag 标签
 * @params { String } CityID 城市id
 * @params { String } DistrictName 区域名
 * @params { String } Decoration 装修
 * @params { String } page 页数
 */
export function GetEstatePage(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'GetEstatePage'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据关键字获取楼盘
 * @params { Object } params 参数集
 * @params { String } likestr 关键字
 * @params { String } num 需要读取的数据条数
 */
export function GetEstateList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'GetEstateByStr'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}


/**
 * 删除楼盘
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘id
 */
export function DelEstate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'DelEstate'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
