import fetch from '../../utils/fetch';

/**
 * 检查用户登录状态
 * @params { Object } params 参数集
 */
export function CheckCookie(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'CheckCookie',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 微信openid登录验证
 * @params { Object } params 参数集
 * OpenID	{ String }  微信openid
 * needpurview { String }
 */
export function WeChatLoginVerification(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'WeChatLoginVerification',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 手机号码登录
 * @params { Object } params 参数集
 * Tel	{ String }  手机号码
 * password { String } 密码
 */
export function MobileLoginVerification(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'MobileLoginVerification',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 手机验证码登录
 * @params { Object } params 参数集
 * Tel	{ String }  手机号码
 * ValiNum { String } 验证码
 */
export function MobileValiVerification(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'MobileValiVerification',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 根据code获取openid
 * @params { Object } params 参数集
 * code	{ String }  临时登录code
 */
export function GetOpenID(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'GetOpenID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 检查登陆状态
 */
export function CheckLoginStatus(params) {
  const data = Object.assign({}, {
    module: 'Organization',
    todo: 'EmployeeControl',
    type: 'CheckLoginStatus',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}