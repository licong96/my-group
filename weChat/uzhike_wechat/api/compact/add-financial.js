import fetch from '../../utils/fetch';

/**
 * 新增收支数据
 * @params { Object } params        参数集
 * @params { String } ContractID    合同id
 * @params { String } RPType        收付类型（应收、应付、实收、实付）
 * @params { String } ObjectType    收付对象（买方、卖方、银行、政府、合作方、内部、其他）
 * @params { String } FeeType       款类（佣金、定金、订金、房款、税费、按揭服务费、评估费、查档费、POS机费、其他）
 * @params { String } Fee           收付款金额，单位元
 * @params { String } FeeDate       收付款日期
 * @params { String } Remark        备注
 */
export function InsertContractRP(params) {
  const data = Object.assign({}, {
    module: 'BusinessManage',
    todo: 'ContractFinanceControl',
    type: 'InsertContractRP',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}