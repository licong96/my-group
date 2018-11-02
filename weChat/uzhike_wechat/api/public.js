import { URL_PATH } from '../utils/config';
import fetch from '../utils/fetch';

export const FileUpLoad = URL_PATH + '/FileUpload.ashx';      // 图片上传地址
export const DownloadFile = URL_PATH + '/DownloadFile.ashx';  // 语音上传地址

/**
 * 获取所有城市数据
 */
export function GetAllCityList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetAllCityList',
    needpurview: false
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 模糊搜索城市数据
 * @params { String } likestr 搜索关键字
 */
export function GetCityByStr(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetCityByStr',
    needpurview: false
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据城市名称匹配城市id
 * @params { String } CityName 城市名
 */
export function GetCityIDByName(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetCityIDByName',
    needpurview: false
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据城市id获取区域数据
 * @params { String } CityID 城市id
 */
export function GetDistrictByCityID(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetDistrictByCityID',
    needpurview: false
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据城市id获取区域数据
 * @params { String } CityID 城市id
 */
export function GetCookie(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetCookie',
    needpurview: false
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据条件搜索所有用户
 * @params { Object } params  参数集合
 * @params { String } likestr 模糊查询
 */
export function GetAllEmployee(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetAllEmployee'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 检查是否为登录状态
 */
export function CheckLogin() {
  const data = {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'CheckLogin',
    needpurview: false
  };

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据引用名获取字典数据
 * @params { Object } params  参数集合
 * @params { String } RefName 名称
 */
export function GetRefByName(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ReferenceControl',
    type: 'GetRefByName'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 分级获取销控数据
 * @params { Object } params      参数集合
 * @params { String } ProjectID   项目id
 * @params { String } ParentID    上级id
 * @params { String } LevelType   数据级别  1：栋座  2：单元  3：楼层  4：房号
 * @params { String } likestr     房号搜索
 */
export function GetLevelStock(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectStockControl',
    type: 'GetLevelStock'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
