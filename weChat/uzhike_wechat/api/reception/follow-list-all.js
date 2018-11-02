import fetch from '../../utils/fetch';

/**
 * 获取所有接待跟进
 * likestr { String } 模糊搜索内容
 * order { String } 排序 FollowDate-desc：跟进时间倒序
 * page { String } 页数
 */
export function GetFollowToPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'GetFollowToPage',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 根据跟进id获取跟进
 * ProjectReceptionFollowID { String } 跟进id
 */
export function GetFollowByID(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionFollowControl',
    type: 'GetFollowByID',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
