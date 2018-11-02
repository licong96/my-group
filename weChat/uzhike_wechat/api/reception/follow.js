import fetch from '../../utils/fetch';

/**
 * 添加接待跟进主体
 * @params { String } ProjectReceptionFollowID	跟进id
 * @params { String } ProjectReceptionID	接待id
 * @params { String } FollowContent	跟进内容
 */
export function InserCustomerFollow(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'InserCustomerFollow',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 添加接待跟进文件
 * @params { String } ProjectReceptionFollowID	跟进id
 * @params { String } FileType	文件类型（图片、语音）
 * @params { String } FileUrl	文件地址
 * @params { String } Remark	描述  用于存储语音描述等
 */
export function InserCustomerFollowFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'InserCustomerFollowFile',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 删除接待跟进文件
 * @params { String } ProjectReceptionFollowFileID	跟进文件id
 */
export function DelCustomerFollowFile(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'DelCustomerFollowFile',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
