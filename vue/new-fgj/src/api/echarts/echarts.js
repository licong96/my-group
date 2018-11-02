import fetch from '@/utils/fetch'

// 图表数据请求只有type和筛选值不一样，可以通过参数控制，这样就只需要写一个
export function getEcharts (type, dateType, obj = {}) {
  const params = {
    todo: 'Echarts',
    type: type,
    needpurview: true,
    valiurl: document.URL,
    dateType: dateType,
    dNo: obj.dNo,
    eID: obj.eID,
    intention: obj.intention,    // 意向分
    DatePeriod: obj.DatePeriod
    // dateType=week（本周）| month（本月）| year（今年），dNo = 部门编号，eID = 人员id
  }
  return fetch({
    url: '/Handler/Handler.ashx',
    method: 'get',
    params
  })
}

