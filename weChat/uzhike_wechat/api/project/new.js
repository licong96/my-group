import fetch from '../../utils/fetch';

/**
 * 新增项目
 * @params { Object } params 参数集
 * @params { String } ProjectID	项目id
 * @params { String } EstateID	楼盘id
 * @params { String } IsOpen	是否公开
 * @params { String } PropertyType	项目产品
 * @params { String } DeclareType	报备类型
 * @params { String } NeedBringCust	是否需要带访
 * @params { String } DeclareProtectDays	报备有效期
 * @params { String } VisitProtectDays	到访有效期
 * @params { String } ProjectName	项目名称
 * @params { String } OfferFlag	折扣优惠标签
 * @params { String } Commission	佣金描述
 * @params { String } CommissionMode	佣金模式
 * @params { String } SettlementDesc	结算模式描述
 * @params { String } ManagerContact	项目管理人及其联系方式
 * @params { String } Remark	项目说明备注
 * **/
export function InsertProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'InsertProject',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}
/**
 * 修改项目
 * @params { Object } params 参数集
 * @params { String } ProjectID	项目id
 * @params { String } EstateID	楼盘id
 * @params { String } IsOpen	是否公开
 * @params { String } PropertyType	项目产品
 * @params { String } DeclareType	报备类型
 * @params { String } NeedBringCust	是否需要带访
 * @params { String } DeclareProtectDays	报备有效期
 * @params { String } VisitProtectDays	到访有效期
 * @params { String } ProjectName	项目名称
 * @params { String } OfferFlag	折扣优惠标签
 * @params { String } Commission	佣金描述
 * @params { String } CommissionMode	佣金模式
 * @params { String } SettlementDesc	结算模式描述
 * @params { String } ManagerContact	项目管理人及其联系方式
 * @params { String } Remark	项目说明备注
 */
export function UpProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'UpProject',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
/**
 * 根据项目id获取项目数据
 * @params { Object } params 参数集
 * @params { String } ProjectID	楼盘id
 */
export function GetProject(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ProjectControl',
    type: 'GetProject',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}
