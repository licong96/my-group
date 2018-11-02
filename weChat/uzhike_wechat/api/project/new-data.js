import fetch from '../../utils/fetch';

/**
 * 新增项目资料 
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 * @params { String } ProjectID	 项目ID
 * @params { String } DataType	资料类型
 * @params { String } Title	标题
 * @params { String } ProjectDataContent	内容
 * @params { String } FileCount	文件数
 */
export function InsertProjectData(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'InsertProjectData',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 修改项目资料信息
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 * @params { String } Title	标题
 * @params { String } ProjectDataContent	内容
 */
export function UpProjectData(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage ',
    todo: 'ProjectDataControl',
    type: 'UpProjectData',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 新增项目资料文件 
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 * @params { String } ProjectID	 项目ID
 * @params { String } FileName	文件名称
 */
export function InsertProjectDataFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'InsertProjectDataFile',
  }, params);

  return fetch({    
    method: 'POST',
    data
  })
}


/**
 * 删除项目资料文件 
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 * @params { String } ProjectID	 项目ID
 */
export function DelProjectFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'DelProjectFile',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除所有项目资料文件
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 */
export function DelAllProjectFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'DelAllProjectFile',
  }, params);
  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据项目资料id获取数据
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 */
export function GetProjectDataByID(params) {
  console.log(params)
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'GetProjectDataByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据项目资料id获取文件数据
 * @params { Object } params 参数集
 * @params { String } ProjectDataID	项目资料id
 */
export function GetProjectFileByDataID(params) {
  console.log(params)
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectDataControl',
    type: 'GetProjectFileByDataID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}