import fetch from '../../utils/fetch';

/**
 * 添加客户跟进主体
 * CustFollowID { String } 跟进id
 * FollowType { String } 跟进类型
 * CustID { String } 客户id
 * FollowContent { String }跟进内容
 * AlertContent { String } 提醒内容
 * AlertDate { String }提醒时间
 * Position { String } 地理位置
 */
export function InserCustomerFollow(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerFollowControl',
    type: 'InserCustomerFollow',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 添加客户跟进文件
 * CustFollowID { String }	跟进id
 * FileType { String }	文件类型（图片、语音）
 * FileUrl { String }	文件地址
 * Remark { String }	描述  用于存储语音描述等
 */
export function InserCustomerFollowFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerFollowControl',
    type: 'InserCustomerFollowFile',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除客户跟进文件
 * CustFollowFileID { String }	跟进文件id
 */
export function DelCustomerFollowFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerFollowControl',
    type: 'DelCustomerFollowFile',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
