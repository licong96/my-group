import fetch from '../../utils/fetch';

/**
 * 分页获取楼盘数据
 * @params { Object } params    参数集
 * @params { String } EstateID  楼盘id
 * @params { String } PhotoType 图片类型
 */
export function GetEstatePhotoList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateControl',
    type: 'GetEstatePhotoList'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}