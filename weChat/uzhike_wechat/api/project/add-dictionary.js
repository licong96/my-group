import fetch from '../../utils/fetch';


/**
 * 根据条件生成楼盘字典
 * @params { Object } params 参数集
 * @params { String } EstateID	楼盘ID
 * @params { String } BuildingPrefixName	楼栋前缀
 * @params { String } BuildingSuffixName	楼栋后缀
 * @params { String } UnitArr  单元组  如  1|2
 * @params { String } UnitFloorInterval	对应单元的楼层区间  如  1-20|1-22
 * @params { String } BuildingNoType	楼栋命名类型  0 ：数字   1：字母  2：天干  3：地支
 * @params { String } BuildingBeginNo	楼栋起始下标或数字
 * @params { String } BuildingEndNo	楼栋结束下标或数字
 * 
 * **/
export function GenerateEstateDict(params) {
  const data = Object.assign({}, {
    module: 'Configuration',
    todo: 'EstateDictControl',
    type: 'GenerateEstateDict',
  }, params);

  return fetch({
    method: 'POST',
    data
  })
}

