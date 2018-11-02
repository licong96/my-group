import fetch from '../../utils/fetch';

/**
 * 获取客户接待列表数据
 * @params { Object } params 参数集
 * @params { String } EmpID	人员id
 * @params { String } Begindate	开始时间
 * @params { String } Enddate	结束时间
 * @params { String } likestr	模糊搜索关键字
 * @params { String } ProjectID	项目id
 * @params { String } page	页数
 */
export function GetReceptionList(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectReceptionControl',
    type: 'GetReceptionList',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
