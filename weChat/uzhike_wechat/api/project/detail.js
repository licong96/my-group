import fetch from '../../utils/fetch';



/**
 * 获取项目所有资料
 * @params { Object } params    参数集
 * @params { String } ProjectID  项目id
 */
export function GetProjectDataList(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'GetProjectDataList'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据项目资料id获取数据
 * @params { Object } params    参数集
 * @params { String } ProjectDataID  项目资料id
 */
export function GetProjectDataByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'GetProjectDataByID'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据项目获取合作状态
 * @params { Object } params    参数集
 * @params { String } ProjectDataID  项目资料id
 * @params { String } CID  发布公司id
 */
export function GetProjectUnionByProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectUnionControl',
    type: 'GetProjectUnionByProject'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 删除项目资料及文件 
 * @params { Object } params    参数集
 * @params { String } ProjectDataID  项目资料id
 */
export function DelProjectDataAndFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'DelProjectDataAndFile'
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

