import fetch from '../../utils/fetch';

/**
 * 用户注册
 * @params { Object } params 参数集
 * CNO { String } 公司码
 * ValiNum { String }	验证码
 * OpenID	 { String }  微信openid
 * EmpName { String }	姓名
 * WXName	 { String }  微信昵称
 * Password { String }	密码
 * Tel { String }  手机号码
 * EmpImg	 { String }  头像
 */
export function RegEmployee(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'RegEmployee',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 获取个人注册验证码
 * @params { Object } params 参数集
 * Tel { String }  手机号码
 */
export function RegEmployeeValidate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'RegEmployeeValidate',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 公司注册
 * @params { Object } params 参数集
 * EmpName		{ String } 名称
 * Tel		    { String } 电话
 * PassWord		{ String } 密码
 * EmpImg		  { String } 用户头像（取微信接口）
 * OpenID		  { String } 微信openid（取微信接口）
 * ValiNum		{ String } 验证码
 * CityID		  { String } 城市id
 * CName		  { String } 公司全称
 * CShortName	{ String }	公司简称
 * CertType		{ String } 证件类型
 * CertNO		  { String } 证件号码
 * Address		{ String } 公司地址
 */
export function RegCompany(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'CompanyControl',
    type: 'RegCompany',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 获取企业注册验证码
 * @params { Object } params 参数集
 * Tel { String }  手机号码
 */
export function RegCompanyValidate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'RegCompanyValidate',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 修改信息验证码
 * @params { Object } params 参数集
 * Tel { String }  手机号码
 */
export function UpInfoValidate(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'UpInfoValidate',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据城市名称匹配城市id
 * @params { Object } params 参数集
 * CityName { String } 城市名
 */
export function GetCityIDByName(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'ToolsControl',
    type: 'GetCityIDByName',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 修改公司注册进度
 * @params { Object } params 参数集
 * CID { String } 公司id
 * Step { String } 进度
 */
export function UpCompanyStep(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'CompanyControl',
    type: 'UpCompanyStep',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 修改用户密码
 * @params { Object } params 参数集
 * ValiNum { String } 验证码
 * Tel { String } 手机号码
 * Password { String } 新密码
 */
export function UpPassWord(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'UpPassWord',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

