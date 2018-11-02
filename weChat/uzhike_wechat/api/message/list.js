import fetch from '../../utils/fetch';

/**
 * 获取消息分类列表
 * @params { String } likestr	关键词搜索
 * @params { String } page	  页数
 */
export function GetNotifyPageList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'NotifyControl',
    type: 'GetNotifyPageList',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 获取消息来源详细列表
 * @params { String } Source	消息来源
 * @params { String } likestr	关键词搜索
 * @params { String } page	  页数
 */
export function GetNotifyDetailPageList(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'NotifyControl',
    type: 'GetNotifyDetailPageList',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}