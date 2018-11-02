import fetch from '../../utils/fetch';

/**
 * 新增客户
 * @params { Object } params 参数集
 * CustID { String }	客户id,需前端生成guid
 * CustName { String }	客户名
 * CertType { String }	证件类型
 * CertNo	{ String } 证件号码
 * Age { String }	客户年龄
 * Marriage { String }	婚姻状况，已婚，未婚，离异
 * Children { String }	子女状况，有、无，多子女
 * Character { String }	性格
 * Income { String }	收入水平
 * Occupation	{ String } 工作职业，个体、企业主、公务员、职员
 * Birthday	{ String } 生日
 * Rest	{ String } 休息情况，周末修、其他
 * Assets	{ String } 资产情况，有房、有车、有企业、有股票
 * Investment	{ String } 投资情况，无，有过房产投资、有过其他投资
 * Decision	{ String } 决策人情况，独立决策，父母决策，夫（妻）决策，子女决策
 * LookHouse	{ String } 看房经历，有、无
 * City	{ String } 所在城市
 * CompanyName	{ String } 单位名称
 * Address { String }	家庭住址
 * Tel { String }	客户电话，格式化判断
 * Email { String }	邮箱地址
 * Grade { String }	客户等级，ABCDEF(优质、意向好、有意向、意向低、无意向、假客户)
 * Source	{ String } 客户来源
 * Trust	{ String } 委托情况，（独家，多家）
 * Tag { String }	客户标签,读取Reference自定义配置
 * FlagStatus	{ String } 标记状态，（有效、暂缓、无效）
 * Remark	{ String } 备注
 * FlagRecommand { String }	标记推荐
 * PhotoImg { String }	客户相片

 */
export function InsertCustomer(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'InsertCustomer',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

/**
 * 修改客户
 * @params { Object } params 参数集
 * CustID { String }	客户id,需前端生成guid
 * CustName { String }	客户名
 * CertType { String }	证件类型
 * CertNo	{ String } 证件号码
 * Age { String }	客户年龄
 * Marriage { String }	婚姻状况，已婚，未婚，离异
 * Children { String }	子女状况，有、无，多子女
 * Character { String }	性格
 * Income { String }	收入水平
 * Occupation	{ String } 工作职业，个体、企业主、公务员、职员
 * Birthday	{ String } 生日
 * Rest	{ String } 休息情况，周末修、其他
 * Assets	{ String } 资产情况，有房、有车、有企业、有股票
 * Investment	{ String } 投资情况，无，有过房产投资、有过其他投资
 * Decision	{ String } 决策人情况，独立决策，父母决策，夫（妻）决策，子女决策
 * LookHouse	{ String } 看房经历，有、无
 * City	{ String } 所在城市
 * CompanyName	{ String } 单位名称
 * Address { String }	家庭住址
 * Tel { String }	客户电话，格式化判断
 * Email { String }	邮箱地址
 * Grade { String }	客户等级，ABCDEF(优质、意向好、有意向、意向低、无意向、假客户)
 * Source	{ String } 客户来源
 * Trust	{ String } 委托情况，（独家，多家）
 * Tag { String }	客户标签,读取Reference自定义配置
 * FlagStatus	{ String } 标记状态，（有效、暂缓、无效）
 * Remark	{ String } 备注
 * FlagRecommand { String }	标记推荐
 * PhotoImg { String }	客户相片

 */
export function UpCustomer(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'UpCustomer',
  }, params);

  return fetch({
    method: 'GET',
    data
  })
}

/**
 * 获取客户分页数据
 * @params { Object } params 参数集
 * CustID { String } 客户id
 * Age { String }	客户年龄
 * Marriage { String }	婚姻状况，已婚，未婚，离异
 * Children { String }	子女状况，有、无，多子女
 * Character { String }	性格
 * Income	{ String } 收入水平
 * Occupation { String }	工作职业，个体、企业主、公务员、职员
 * Rest	{ String } 休息情况，周末修、其他
 * Assets	{ String } 资产情况，有房、有车、有企业、有股票
 * Investment	{ String } 投资情况，无，有过房产投资、有过其他投资
 * Decision	{ String } 决策人情况，独立决策，父母决策，夫（妻）决策，子女决策
 * LookHouse	{ String } 看房经历，有、无
 * Grade	{ String } 客户等级，ABCDEF(优质、意向好、有意向、意向低、无意向、假客户)
 * Source	{ String } 客户来源
 * Trust { String }	委托情况，（独家，多家）
 * Tag { String }	客户标签,读取Reference自定义配置
 * FlagStatus { String }	标记状态，（有效、暂缓、无效）
 * FlagRecommand { String }	标记推荐
 * likestr { String }	关键字
 * order { String }	排序
 * page { String } 页数
 */
export function GetCustPage(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'CustomerControl',
    type: 'GetCustPage',
  }, params);
  
  return fetch({
    method: 'GET',
    data
  })
}