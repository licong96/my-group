import fetch from '../../utils/fetch';

/**
 * 新增字典
 * @params { Object } params 参数集
 * RefName { String } 名称（英文）
 * RefNameCn { String } 显示名称（中文）
 * ItemNo { String } 编号（纯数字）
 * ItemValue { String } 值
 * ItemInfo { String } 备注信息
 */
export function InserRef(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ReferenceControl',
    type: 'InserRef',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据引用名获取字典数据
 * @params { Object } params 参数集
 * RefName { String } 名称（英文）
 */
export function GetRefByName(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ReferenceControl',
    type: 'GetRefByName',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 分页获取所有字典数据
 * @params { Object } params 参数集
 * page	{Number}	页数
 * pagerows	{Number} 每页显示的条数
 * likestr {String} 模糊查询关键字
 */
export function GetAllRef(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ReferenceControl',
    type: 'GetAllRef',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 启用、作废引用字典
 * @params { Object } params 参数集
 * RefID {String} 字典id
 * FlagDeleted {String}	 0：有效  1：作废
 */
export function UpRef(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ReferenceControl',
    type: 'UpRef',
  }, params)

  return fetch({
    method: 'GET',
    data
  })
}