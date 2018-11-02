import fetch from '../../utils/fetch';

/**
 * 根据字典id获取字典数据
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘ID
 * **/
export function GetEstateDictByDictID(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'GetEstateDictByDictID',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据条件筛选批量修改字典数据
 * @params { Object } params 参数集
 * @params { String } EstateDictID	楼盘字典ID
 * **/
export function UpEstateDictByDictID(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'UpEstateDictByDictID',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}


/**
 * 根据条件筛选批量修改字典数据
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘ID
 * **/
export function UpEstateDictByFilter(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'UpEstateDictByFilter',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据条件获取字典数据
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘ID
 * **/
export function GetEstateDictFilter(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'GetEstateDictFilter',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}